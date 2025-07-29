import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, InvoiceData, PaymentData, CreditDebitMemo, SalesAnalytics } from '../services/data.service';

@Component({
  selector: 'app-financial-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="financial-sheet">
      <div class="sheet-header">
        <h2>Customer Financial Sheet</h2>
        <p>View your invoices, payments, and financial analytics</p>
      </div>
      
      <div class="sub-tab-container">
        <div class="sub-tab-nav">
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'invoices'"
            (click)="setActiveSubTab('invoices')"
          >
            Invoice Details
          </button>
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'payments'"
            (click)="setActiveSubTab('payments')"
          >
            Payments & Aging
          </button>
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'memos'"
            (click)="setActiveSubTab('memos')"
          >
            Credit/Debit Memo
          </button>
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'analytics'"
            (click)="setActiveSubTab('analytics')"
          >
            Sales Analytics
          </button>
        </div>
        
        <div class="sub-tab-content">
          <!-- Invoice Details Tab -->
          <div *ngIf="activeSubTab === 'invoices'" class="tab-pane">
            <div *ngIf="invoiceLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading invoice data...</p>
            </div>
            
            <div *ngIf="!invoiceLoading" class="invoice-grid">
              <div 
                *ngFor="let invoice of paginatedInvoiceData" 
                class="invoice-card"
                (click)="openInvoiceModal(invoice)"
              >
                <div class="invoice-header">
                  <h3>{{ invoice.number }}</h3>
                  <span class="badge" [ngClass]="getStatusClass(invoice.status)">
                    {{ invoice.status }}
                  </span>
                </div>
                <div class="invoice-details">
                  <p><strong>Date:</strong> {{ invoice.date }}</p>
                  <p><strong>Due Date:</strong> {{ invoice.dueDate }}</p>
                  <p><strong>Amount:</strong> \${{ invoice.amount | number:'1.2-2' }}</p>
                </div>
              </div>
            </div>
            
            <div *ngIf="!invoiceLoading && invoiceData.length > 0" class="pagination">
              <button 
                (click)="previousInvoicePage()" 
                [disabled]="invoiceCurrentPage === 1"
                class="btn btn-secondary"
              >
                Previous
              </button>
              <span class="page-info">
                Page {{ invoiceCurrentPage }} of {{ invoiceTotalPages }}
              </span>
              <button 
                (click)="nextInvoicePage()" 
                [disabled]="invoiceCurrentPage === invoiceTotalPages"
                class="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
          
          <!-- Payments & Aging Tab -->
          <div *ngIf="activeSubTab === 'payments'" class="tab-pane">
            <div class="data-controls">
              <input 
                type="text" 
                class="form-control search-input" 
                placeholder="Search payments..."
                [(ngModel)]="paymentSearchTerm"
                (input)="filterPaymentData()"
              >
              <select class="form-control" [(ngModel)]="paymentFilter" (change)="filterPaymentData()">
                <option value="">All Payments</option>
                <option value="on-time">On Time</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div *ngIf="paymentLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading payment data...</p>
            </div>
            
            <div *ngIf="!paymentLoading && filteredPaymentData.length > 0" class="data-table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let payment of paginatedPaymentData" class="table-row">
                    <td>{{ payment.invoiceNumber }}</td>
                    <td>\${{ payment.amount | number:'1.2-2' }}</td>
                    <td>{{ payment.dueDate }}</td>
                    <td>
                      <span [ngClass]="getAgingClass(payment.daysOverdue)">
                        {{ payment.daysOverdue }} days
                      </span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(payment.status)">
                        {{ payment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="pagination">
                <button 
                  (click)="previousPaymentPage()" 
                  [disabled]="paymentCurrentPage === 1"
                  class="btn btn-secondary"
                >
                  Previous
                </button>
                <span class="page-info">
                  Page {{ paymentCurrentPage }} of {{ paymentTotalPages }}
                </span>
                <button 
                  (click)="nextPaymentPage()" 
                  [disabled]="paymentCurrentPage === paymentTotalPages"
                  class="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Credit/Debit Memo Tab -->
          <div *ngIf="activeSubTab === 'memos'" class="tab-pane">
            <div class="data-controls">
              <input 
                type="text" 
                class="form-control search-input" 
                placeholder="Search memos..."
                [(ngModel)]="memoSearchTerm"
                (input)="filterMemoData()"
              >
              <select class="form-control" [(ngModel)]="memoFilter" (change)="filterMemoData()">
                <option value="">All Memos</option>
                <option value="Credit">Credit Only</option>
                <option value="Debit">Debit Only</option>
              </select>
            </div>
            
            <div *ngIf="memoLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading memo data...</p>
            </div>
            
            <div *ngIf="!memoLoading && filteredMemoData.length > 0" class="data-table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let memo of paginatedMemoData" class="table-row">
                    <td>
                      <span class="badge" [ngClass]="memo.type === 'Credit' ? 'badge-success' : 'badge-danger'">
                        {{ memo.type }}
                      </span>
                    </td>
                    <td>{{ memo.number }}</td>
                    <td>{{ memo.date }}</td>
                    <td>\${{ memo.amount | number:'1.2-2' }}</td>
                    <td>{{ memo.reason }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(memo.status)">
                        {{ memo.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="pagination">
                <button 
                  (click)="previousMemoPage()" 
                  [disabled]="memoCurrentPage === 1"
                  class="btn btn-secondary"
                >
                  Previous
                </button>
                <span class="page-info">
                  Page {{ memoCurrentPage }} of {{ memoTotalPages }}
                </span>
                <button 
                  (click)="nextMemoPage()" 
                  [disabled]="memoCurrentPage === memoTotalPages"
                  class="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Sales Analytics Tab -->
          <div *ngIf="activeSubTab === 'analytics'" class="tab-pane">
            <div *ngIf="analyticsLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading analytics data...</p>
            </div>
            
            <div *ngIf="!analyticsLoading && salesAnalytics" class="analytics-container">
              <div class="revenue-summary">
                <h3>Total Revenue</h3>
                <div class="revenue-amount">
                  \${{ salesAnalytics.totalRevenue | number:'1.2-2' }}
                </div>
              </div>
              
              <div class="charts-grid">
                <div class="chart-card">
                  <h4>Monthly Sales</h4>
                  <div class="chart-placeholder">
                    <div class="bar-chart">
                      <div 
                        *ngFor="let data of salesAnalytics.monthlyData" 
                        class="bar"
                        [style.height.%]="(data.sales / getMaxMonthlySales()) * 100"
                      >
                        <div class="bar-label">{{ data.month }}</div>
                        <div class="bar-value">\${{ data.sales | number:'1.0-0' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="chart-card">
                  <h4>Sales by Product</h4>
                  <div class="chart-placeholder">
                    <div class="pie-chart">
                      <div 
                        *ngFor="let data of salesAnalytics.productData; let i = index" 
                        class="pie-item"
                        [style.background-color]="getPieColor(i)"
                      >
                        <span>{{ data.product }}: \${{ data.sales | number:'1.0-0' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="chart-card full-width">
                  <h4>Revenue Over Time</h4>
                  <div class="chart-placeholder">
                    <div class="line-chart">
                      <div 
                        *ngFor="let data of salesAnalytics.revenueOverTime; let i = index" 
                        class="line-point"
                        [style.left.%]="(i / (salesAnalytics.revenueOverTime.length - 1)) * 100"
                        [style.bottom.%]="(data.revenue / getMaxRevenue()) * 80"
                        [title]="data.date + ': $' + (data.revenue | number:'1.2-2')"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Invoice Modal -->
    <div *ngIf="selectedInvoice" class="modal-overlay" (click)="closeInvoiceModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Invoice {{ selectedInvoice.number }}</h3>
          <button class="close-btn" (click)="closeInvoiceModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="invoice-info">
            <p><strong>Date:</strong> {{ selectedInvoice.date }}</p>
            <p><strong>Due Date:</strong> {{ selectedInvoice.dueDate }}</p>
            <p><strong>Status:</strong> 
              <span class="badge" [ngClass]="getStatusClass(selectedInvoice.status)">
                {{ selectedInvoice.status }}
              </span>
            </p>
          </div>
          
          <div class="invoice-items">
            <h4>Items</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedInvoice.items">
                  <td>{{ item.description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>\${{ item.unitPrice | number:'1.2-2' }}</td>
                  <td>\${{ item.total | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="invoice-total">
            <h4>Total: \${{ selectedInvoice.amount | number:'1.2-2' }}</h4>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="previewInvoice()">Preview</button>
          <button class="btn btn-primary" (click)="downloadInvoice()">
            <span *ngIf="downloadLoading" class="spinner-small"></span>
            {{ downloadLoading ? 'Downloading...' : 'Download PDF' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .financial-sheet {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .sheet-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .sheet-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .sheet-header p {
      color: #666;
      font-size: 16px;
    }
    
    .sub-tab-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .sub-tab-nav {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    .sub-tab-content {
      padding: 24px;
      min-height: 500px;
    }
    
    .data-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }
    
    .search-input {
      flex: 1;
      max-width: 300px;
    }
    
    .invoice-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .invoice-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .invoice-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .invoice-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }
    
    .invoice-details p {
      margin: 8px 0;
      color: #666;
    }
    
    .data-table-container {
      overflow-x: auto;
    }
    
    .table-row {
      transition: background-color 0.2s ease;
    }
    
    .table-row:hover {
      background-color: #f8f9fa;
    }
    
    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }
    
    .loading-container p {
      color: #666;
      margin-top: 16px;
    }
    
    .page-info {
      margin: 0 16px;
      font-weight: 600;
      color: #555;
    }
    
    .analytics-container {
      display: grid;
      gap: 24px;
    }
    
    .revenue-summary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
    }
    
    .revenue-summary h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      opacity: 0.9;
    }
    
    .revenue-amount {
      font-size: 48px;
      font-weight: 700;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .chart-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 24px;
    }
    
    .chart-card.full-width {
      grid-column: 1 / -1;
    }
    
    .chart-card h4 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
    }
    
    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
      position: relative;
    }
    
    .bar-chart {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 100%;
      width: 100%;
      padding: 20px;
    }
    
    .bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 30px;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: center;
    }
    
    .bar-label {
      position: absolute;
      bottom: -25px;
      font-size: 12px;
      color: #666;
    }
    
    .bar-value {
      position: absolute;
      top: -25px;
      font-size: 10px;
      color: #333;
      white-space: nowrap;
    }
    
    .pie-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    
    .pie-item {
      padding: 12px;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      text-align: center;
    }
    
    .line-chart {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .line-point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      cursor: pointer;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #dee2e6;
    }
    
    .modal-header h3 {
      margin: 0;
      color: #333;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .invoice-info {
      margin-bottom: 24px;
    }
    
    .invoice-info p {
      margin: 8px 0;
    }
    
    .invoice-items {
      margin-bottom: 24px;
    }
    
    .invoice-items h4 {
      margin-bottom: 16px;
      color: #333;
    }
    
    .invoice-total {
      text-align: right;
      padding-top: 16px;
      border-top: 2px solid #dee2e6;
    }
    
    .invoice-total h4 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #dee2e6;
    }
    
    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }
    
    @media (max-width: 768px) {
      .sub-tab-nav {
        flex-direction: column;
      }
      
      .data-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-input {
        max-width: none;
      }
      
      .invoice-grid {
        grid-template-columns: 1fr;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
      }
      
      .chart-card.full-width {
        grid-column: 1;
      }
      
      .modal-content {
        width: 95%;
        margin: 20px;
      }
      
      .revenue-amount {
        font-size: 36px;
      }
    }
  `]
})
export class FinancialSheetComponent implements OnInit {
  activeSubTab = 'invoices';
  
  // Invoice Data
  invoiceData: InvoiceData[] = [];
  paginatedInvoiceData: InvoiceData[] = [];
  invoiceCurrentPage = 1;
  invoicePageSize = 6;
  invoiceTotalPages = 1;
  invoiceLoading = false;
  selectedInvoice: InvoiceData | null = null;
  downloadLoading = false;
  
  // Payment Data
  paymentData: PaymentData[] = [];
  filteredPaymentData: PaymentData[] = [];
  paginatedPaymentData: PaymentData[] = [];
  paymentSearchTerm = '';
  paymentFilter = '';
  paymentCurrentPage = 1;
  paymentPageSize = 10;
  paymentTotalPages = 1;
  paymentLoading = false;
  
  // Memo Data
  memoData: CreditDebitMemo[] = [];
  filteredMemoData: CreditDebitMemo[] = [];
  paginatedMemoData: CreditDebitMemo[] = [];
  memoSearchTerm = '';
  memoFilter = '';
  memoCurrentPage = 1;
  memoPageSize = 10;
  memoTotalPages = 1;
  memoLoading = false;
  
  // Analytics Data
  salesAnalytics: SalesAnalytics | null = null;
  analyticsLoading = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadInvoiceData();
  }

  setActiveSubTab(tab: string): void {
    this.activeSubTab = tab;
    
    switch (tab) {
      case 'invoices':
        if (this.invoiceData.length === 0) {
          this.loadInvoiceData();
        }
        break;
      case 'payments':
        if (this.paymentData.length === 0) {
          this.loadPaymentData();
        }
        break;
      case 'memos':
        if (this.memoData.length === 0) {
          this.loadMemoData();
        }
        break;
      case 'analytics':
        if (!this.salesAnalytics) {
          this.loadAnalyticsData();
        }
        break;
    }
  }

  // Invoice Methods
  loadInvoiceData(): void {
    this.invoiceLoading = true;
    this.dataService.getInvoiceData().subscribe({
      next: (data) => {
        this.invoiceData = data;
        this.updateInvoicePagination();
        this.invoiceLoading = false;
      },
      error: () => {
        this.invoiceLoading = false;
      }
    });
  }

  updateInvoicePagination(): void {
    this.invoiceTotalPages = Math.ceil(this.invoiceData.length / this.invoicePageSize);
    this.invoiceCurrentPage = 1;
    this.updateInvoicePaginatedData();
  }

  updateInvoicePaginatedData(): void {
    const startIndex = (this.invoiceCurrentPage - 1) * this.invoicePageSize;
    const endIndex = startIndex + this.invoicePageSize;
    this.paginatedInvoiceData = this.invoiceData.slice(startIndex, endIndex);
  }

  previousInvoicePage(): void {
    if (this.invoiceCurrentPage > 1) {
      this.invoiceCurrentPage--;
      this.updateInvoicePaginatedData();
    }
  }

  nextInvoicePage(): void {
    if (this.invoiceCurrentPage < this.invoiceTotalPages) {
      this.invoiceCurrentPage++;
      this.updateInvoicePaginatedData();
    }
  }

  openInvoiceModal(invoice: InvoiceData): void {
    this.selectedInvoice = invoice;
  }

  closeInvoiceModal(): void {
    this.selectedInvoice = null;
  }

  previewInvoice(): void {
    if (this.selectedInvoice) {
      // In a real app, this would open a preview window
      alert(`Preview for invoice ${this.selectedInvoice.number} would open here.`);
    }
  }

  downloadInvoice(): void {
    if (this.selectedInvoice) {
      this.downloadLoading = true;
      this.dataService.downloadInvoicePDF(this.selectedInvoice.id).subscribe({
        next: (blob) => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${this.selectedInvoice!.number}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.downloadLoading = false;
        },
        error: () => {
          this.downloadLoading = false;
          alert('Download failed. Please try again.');
        }
      });
    }
  }

  // Payment Methods
  loadPaymentData(): void {
    this.paymentLoading = true;
    this.dataService.getPaymentData().subscribe({
      next: (data) => {
        this.paymentData = data;
        this.filterPaymentData();
        this.paymentLoading = false;
      },
      error: () => {
        this.paymentLoading = false;
      }
    });
  }

  filterPaymentData(): void {
    this.filteredPaymentData = this.paymentData.filter(payment => {
      const matchesSearch = payment.invoiceNumber.toLowerCase().includes(this.paymentSearchTerm.toLowerCase());
      const matchesFilter = !this.paymentFilter || 
        (this.paymentFilter === 'on-time' && payment.daysOverdue === 0) ||
        (this.paymentFilter === 'overdue' && payment.daysOverdue > 0);
      
      return matchesSearch && matchesFilter;
    });
    this.updatePaymentPagination();
  }

  updatePaymentPagination(): void {
    this.paymentTotalPages = Math.ceil(this.filteredPaymentData.length / this.paymentPageSize);
    this.paymentCurrentPage = 1;
    this.updatePaymentPaginatedData();
  }

  updatePaymentPaginatedData(): void {
    const startIndex = (this.paymentCurrentPage - 1) * this.paymentPageSize;
    const endIndex = startIndex + this.paymentPageSize;
    this.paginatedPaymentData = this.filteredPaymentData.slice(startIndex, endIndex);
  }

  previousPaymentPage(): void {
    if (this.paymentCurrentPage > 1) {
      this.paymentCurrentPage--;
      this.updatePaymentPaginatedData();
    }
  }

  nextPaymentPage(): void {
    if (this.paymentCurrentPage < this.paymentTotalPages) {
      this.paymentCurrentPage++;
      this.updatePaymentPaginatedData();
    }
  }

  getAgingClass(daysOverdue: number): string {
    if (daysOverdue === 0) return '';
    if (daysOverdue <= 2) return 'status-yellow';
    if (daysOverdue <= 10) return 'status-orange';
    return 'status-red';
  }

  // Memo Methods
  loadMemoData(): void {
    this.memoLoading = true;
    this.dataService.getCreditDebitMemo().subscribe({
      next: (data) => {
        this.memoData = data;
        this.filterMemoData();
        this.memoLoading = false;
      },
      error: () => {
        this.memoLoading = false;
      }
    });
  }

  filterMemoData(): void {
    this.filteredMemoData = this.memoData.filter(memo => {
      const matchesSearch = memo.number.toLowerCase().includes(this.memoSearchTerm.toLowerCase()) ||
        memo.reason.toLowerCase().includes(this.memoSearchTerm.toLowerCase());
      const matchesFilter = !this.memoFilter || memo.type === this.memoFilter;
      
      return matchesSearch && matchesFilter;
    });
    this.updateMemoPagination();
  }

  updateMemoPagination(): void {
    this.memoTotalPages = Math.ceil(this.filteredMemoData.length / this.memoPageSize);
    this.memoCurrentPage = 1;
    this.updateMemoPaginatedData();
  }

  updateMemoPaginatedData(): void {
    const startIndex = (this.memoCurrentPage - 1) * this.memoPageSize;
    const endIndex = startIndex + this.memoPageSize;
    this.paginatedMemoData = this.filteredMemoData.slice(startIndex, endIndex);
  }

  previousMemoPage(): void {
    if (this.memoCurrentPage > 1) {
      this.memoCurrentPage--;
      this.updateMemoPaginatedData();
    }
  }

  nextMemoPage(): void {
    if (this.memoCurrentPage < this.memoTotalPages) {
      this.memoCurrentPage++;
      this.updateMemoPaginatedData();
    }
  }

  // Analytics Methods
  loadAnalyticsData(): void {
    this.analyticsLoading = true;
    this.dataService.getSalesAnalytics().subscribe({
      next: (data) => {
        this.salesAnalytics = data;
        this.analyticsLoading = false;
      },
      error: () => {
        this.analyticsLoading = false;
      }
    });
  }

  getMaxMonthlySales(): number {
    if (!this.salesAnalytics) return 0;
    return Math.max(...this.salesAnalytics.monthlyData.map(d => d.sales));
  }

  getMaxRevenue(): number {
    if (!this.salesAnalytics) return 0;
    return Math.max(...this.salesAnalytics.revenueOverTime.map(d => d.revenue));
  }

  getPieColor(index: number): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    return colors[index % colors.length];
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'confirmed':
      case 'delivered':
      case 'paid':
        return 'badge-success';
      case 'pending':
      case 'processing':
      case 'in transit':
        return 'badge-warning';
      case 'rejected':
      case 'cancelled':
      case 'overdue':
      case 'delayed':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}