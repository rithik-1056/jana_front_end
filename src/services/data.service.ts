import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface InquiryData {
  id: string;
  date: string;
  product: string;
  quantity: number;
  status: string;
  value: number;
}

export interface SaleOrderData {
  id: string;
  date: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
}

export interface DeliveryData {
  id: string;
  orderNumber: string;
  date: string;
  product: string;
  quantity: number;
  status: string;
  trackingNumber: string;
}

export interface InvoiceData {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentData {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: string;
}

export interface CreditDebitMemo {
  id: string;
  type: 'Credit' | 'Debit';
  number: string;
  date: string;
  amount: number;
  reason: string;
  status: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  monthlyData: { month: string; sales: number }[];
  productData: { product: string; sales: number }[];
  revenueOverTime: { date: string; revenue: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Mock data generators
  private generateInquiryData(): InquiryData[] {
    const products = ['Product A', 'Product B', 'Product C', 'Product D'];
    const statuses = ['Pending', 'Approved', 'Rejected', 'In Review'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `INQ${String(i + 1).padStart(3, '0')}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      product: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 100) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: Math.floor(Math.random() * 10000) + 1000
    }));
  }

  private generateSaleOrderData(): SaleOrderData[] {
    const products = ['Product A', 'Product B', 'Product C', 'Product D'];
    const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    
    return Array.from({ length: 40 }, (_, i) => ({
      id: `SO${String(i + 1).padStart(3, '0')}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      product: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 50) + 1,
      amount: Math.floor(Math.random() * 15000) + 2000,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  private generateDeliveryData(): DeliveryData[] {
    const products = ['Product A', 'Product B', 'Product C', 'Product D'];
    const statuses = ['In Transit', 'Delivered', 'Pending', 'Delayed'];
    
    return Array.from({ length: 35 }, (_, i) => ({
      id: `DEL${String(i + 1).padStart(3, '0')}`,
      orderNumber: `SO${String(Math.floor(Math.random() * 40) + 1).padStart(3, '0')}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      product: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 50) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }));
  }

  private generateInvoiceData(): InvoiceData[] {
    const statuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
    
    return Array.from({ length: 30 }, (_, i) => {
      const items: InvoiceItem[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => {
        const quantity = Math.floor(Math.random() * 10) + 1;
        const unitPrice = Math.floor(Math.random() * 500) + 50;
        return {
          description: `Item ${j + 1}`,
          quantity,
          unitPrice,
          total: quantity * unitPrice
        };
      });
      
      return {
        id: `INV${String(i + 1).padStart(3, '0')}`,
        number: `2024-${String(i + 1).padStart(4, '0')}`,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        amount: items.reduce((sum, item) => sum + item.total, 0),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        items
      };
    });
  }

  private generatePaymentData(): PaymentData[] {
    const statuses = ['On Time', 'Overdue', 'Paid'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const daysOverdue = Math.floor(Math.random() * 60);
      return {
        id: `PAY${String(i + 1).padStart(3, '0')}`,
        invoiceNumber: `2024-${String(Math.floor(Math.random() * 30) + 1).padStart(4, '0')}`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        daysOverdue,
        status: daysOverdue === 0 ? 'On Time' : statuses[Math.floor(Math.random() * statuses.length)]
      };
    });
  }

  private generateCreditDebitMemo(): CreditDebitMemo[] {
    const types: ('Credit' | 'Debit')[] = ['Credit', 'Debit'];
    const reasons = ['Return', 'Discount', 'Adjustment', 'Refund', 'Penalty'];
    const statuses = ['Approved', 'Pending', 'Rejected'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `CDM${String(i + 1).padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      number: `CDM-2024-${String(i + 1).padStart(3, '0')}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 5000) + 100,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  private generateSalesAnalytics(): SalesAnalytics {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const products = ['Product A', 'Product B', 'Product C', 'Product D'];
    
    const monthlyData = months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 50000) + 10000
    }));
    
    const productData = products.map(product => ({
      product,
      sales: Math.floor(Math.random() * 100000) + 20000
    }));
    
    const revenueOverTime = Array.from({ length: 12 }, (_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}`,
      revenue: Math.floor(Math.random() * 80000) + 20000
    }));
    
    return {
      totalRevenue: monthlyData.reduce((sum, data) => sum + data.sales, 0),
      monthlyData,
      productData,
      revenueOverTime
    };
  }

  // API methods
  getInquiryData(): Observable<InquiryData[]> {
    return of(this.generateInquiryData()).pipe(delay(500));
  }

  getSaleOrderData(): Observable<SaleOrderData[]> {
    return of(this.generateSaleOrderData()).pipe(delay(500));
  }

  getDeliveryData(): Observable<DeliveryData[]> {
    return of(this.generateDeliveryData()).pipe(delay(500));
  }

  getInvoiceData(): Observable<InvoiceData[]> {
    return of(this.generateInvoiceData()).pipe(delay(500));
  }

  getPaymentData(): Observable<PaymentData[]> {
    return of(this.generatePaymentData()).pipe(delay(500));
  }

  getCreditDebitMemo(): Observable<CreditDebitMemo[]> {
    return of(this.generateCreditDebitMemo()).pipe(delay(500));
  }

  getSalesAnalytics(): Observable<SalesAnalytics> {
    return of(this.generateSalesAnalytics()).pipe(delay(500));
  }

  downloadInvoicePDF(invoiceId: string): Observable<Blob> {
    // Mock PDF download - in real implementation, this would call SAP API
    const mockPdfContent = `Mock PDF content for invoice ${invoiceId}`;
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    return of(blob).pipe(delay(1000));
  }
}