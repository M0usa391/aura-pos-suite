
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
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1A3365; margin-bottom: 5px;">فاتورة مبيعات</h1>
        <p style="color: #666; margin: 0;">${businessInfo.name}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <p><strong>العنوان:</strong> ${businessInfo.address}</p>
          <p><strong>الهاتف:</strong> ${businessInfo.phone}</p>
          <p><strong>البريد الإلكتروني:</strong> ${businessInfo.email}</p>
        </div>
        <div>
          <p><strong>رقم الفاتورة:</strong> ${sale.invoiceNumber}</p>
          <p><strong>التاريخ:</strong> ${formatDate(sale.date)}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #1A3365; color: white;">
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">#</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">المنتج</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">الكمية</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">السعر</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr style="background-color: #f9f9f9;">
            <td colspan="4" style="padding: 10px; text-align: left; border: 1px solid #ddd;"><strong>المجموع</strong></td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>${formatCurrency(sale.total)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div style="text-align: center; margin-top: 40px; color: #666;">
        <p>شكراً لتعاملكم معنا!</p>
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
