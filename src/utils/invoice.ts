
import { Sale, CartItem } from '../data/store';
import { formatCurrency, formatDate } from './statistics';

export const generateInvoiceHTML = (sale: Sale, businessInfo: any): string => {
  const itemsHTML = sale.items.map((item: CartItem, index: number) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.product.name}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.product.price)}</td>
      <td>${formatCurrency(item.product.price * item.quantity)}</td>
    </tr>
  `).join('');

  return `
    <div id="invoice" style="width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Tajawal', Arial, sans-serif; direction: rtl;">
      <div style="text-align: center; margin-bottom: 20px; background-color: #064420; color: white; padding: 15px; border-radius: 8px; background-image: linear-gradient(45deg, rgba(229, 160, 28, 0.2) 25%, transparent 25%, transparent 50%, rgba(229, 160, 28, 0.2) 50%, rgba(229, 160, 28, 0.2) 75%, transparent 75%); background-size: 10px 10px;">
        <h1 style="color: white; margin-bottom: 5px;">فاتورة مبيعات</h1>
        <p style="color: #f8f8f8; margin: 0;">${businessInfo.name}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #f8f7f2; padding: 15px; border-radius: 8px; border: 1px solid #e5a01c;">
        <div>
          <p><strong>العنوان:</strong> ${businessInfo.address}</p>
          <p><strong>الهاتف:</strong> ${businessInfo.phone}</p>
          <p><strong>البريد الإلكتروني:</strong> ${businessInfo.email}</p>
        </div>
        <div>
          <p><strong>رقم الفاتورة:</strong> ${sale.invoiceNumber}</p>
          <p><strong>التاريخ:</strong> ${formatDate(sale.date)}</p>
          ${businessInfo.taxId && businessInfo.showTaxId ? `<p><strong>الرقم الضريبي:</strong> ${businessInfo.taxId}</p>` : ''}
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 8px; overflow: hidden; border: 1px solid #e5a01c;">
        <thead>
          <tr style="background-color: #064420; color: white;">
            <th style="padding: 10px; text-align: right; border: 1px solid #e5a01c;">#</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #e5a01c;">المنتج</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #e5a01c;">الكمية</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #e5a01c;">السعر</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #e5a01c;">المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr style="background-color: #f8f7f2;">
            <td colspan="4" style="padding: 10px; text-align: left; border: 1px solid #e5a01c;"><strong>المجموع</strong></td>
            <td style="padding: 10px; text-align: right; border: 1px solid #e5a01c;"><strong>${formatCurrency(sale.total)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div style="text-align: center; margin-top: 40px; color: #064420; padding: 15px; border-top: 2px dashed #e5a01c;">
        <p>${businessInfo.invoiceNotes || 'شكراً لتعاملكم معنا!'}</p>
        <p>نظام Aura POS</p>
      </div>
    </div>
  `;
};

export const printInvoice = (sale: Sale, businessInfo: any) => {
  const invoiceHTML = generateInvoiceHTML(sale, businessInfo);
  
  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>فاتورة ${sale.invoiceNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @media print {
              body { font-family: 'Tajawal', Arial, sans-serif; }
            }
          </style>
        </head>
        <body>${invoiceHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

export const downloadInvoiceAsPDF = (sale: Sale, businessInfo: any) => {
  const invoiceHTML = generateInvoiceHTML(sale, businessInfo);
  const element = document.createElement('div');
  element.innerHTML = invoiceHTML;
  document.body.appendChild(element);
  
  const options = {
    margin: 1,
    filename: `فاتورة-${sale.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
  };
  
  // @ts-ignore - html2pdf is loaded via CDN
  html2pdf().from(element).set(options).save().then(() => {
    document.body.removeChild(element);
  });
};
