import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, InquiryData, SaleOrderData, DeliveryData } from '../services/data.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customer-dashboard">
      <div class="dashboard-header">
        <h2>Customer Dashboard</h2>
        <p>View your inquiries, orders, and deliveries</p>
      </div>
      
      <div class="sub-tab-container">
        <div class="sub-tab-nav">
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'inquiry'"
            (click)="setActiveSubTab('inquiry')"
          >
            Inquiry Data
          </button>
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'orders'"
            (click)="setActiveSubTab('orders')"
          >
            Sale Orders
          </button>
          <button 
            class="tab-button"
            [class.active]="activeSubTab === 'delivery'"
            (click)="setActiveSubTab('delivery')"
          >
            Deliveries
          </button>
        </div>
        
        <div class="sub-tab-content">
          <!-- Inquiry Data Tab -->
          <div *ngIf="activeSubTab === 'inquiry'" class="tab-pane">
            <div class="data-controls">
              <input 
                type="text" 
                class="form-control search-input" 
                placeholder="Search inquiries..."
                [(ngModel)]="inquirySearchTerm"
                (input)="filterInquiryData()"
              >
              <select class="form-control" [(ngModel)]="inquiryPageSize" (change)="updateInquiryPagination()">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            
            <div *ngIf="inquiryLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading inquiry data...</p>
            </div>
            
            <div *ngIf="!inquiryLoading && filteredInquiryData.length > 0" class="data-table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th (click)="sortInquiryData('id')">ID ↕</th>
                    <th (click)="sortInquiryData('date')">Date ↕</th>
                    <th (click)="sortInquiryData('product')">Product ↕</th>
                    <th (click)="sortInquiryData('quantity')">Quantity ↕</th>
                    <th (click)="sortInquiryData('value')">Value ↕</th>
                    <th (click)="sortInquiryData('status')">Status ↕</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of paginatedInquiryData" class="table-row">
                    <td>{{ item.id }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.product }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>\${{ item.value | number:'1.2-2' }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="pagination">
                <button 
                  (click)="previousInquiryPage()" 
                  [disabled]="inquiryCurrentPage === 1"
                  class="btn btn-secondary"
                >
                  Previous
                </button>
                <span class="page-info">
                  Page {{ inquiryCurrentPage }} of {{ inquiryTotalPages }}
                </span>
                <button 
                  (click)="nextInquiryPage()" 
                  [disabled]="inquiryCurrentPage === inquiryTotalPages"
                  class="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Sale Orders Tab -->
          <div *ngIf="activeSubTab === 'orders'" class="tab-pane">
            <div class="data-controls">
              <input 
                type="text" 
                class="form-control search-input" 
                placeholder="Search orders..."
                [(ngModel)]="orderSearchTerm"
                (input)="filterOrderData()"
              >
              <select class="form-control" [(ngModel)]="orderPageSize" (change)="updateOrderPagination()">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            
            <div *ngIf="orderLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading order data...</p>
            </div>
            
            <div *ngIf="!orderLoading && filteredOrderData.length > 0" class="data-table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th (click)="sortOrderData('id')">Order ID ↕</th>
                    <th (click)="sortOrderData('date')">Date ↕</th>
                    <th (click)="sortOrderData('product')">Product ↕</th>
                    <th (click)="sortOrderData('quantity')">Quantity ↕</th>
                    <th (click)="sortOrderData('amount')">Amount ↕</th>
                    <th (click)="sortOrderData('status')">Status ↕</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of paginatedOrderData" class="table-row">
                    <td>{{ item.id }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.product }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>\${{ item.amount | number:'1.2-2' }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="pagination">
                <button 
                  (click)="previousOrderPage()" 
                  [disabled]="orderCurrentPage === 1"
                  class="btn btn-secondary"
                >
                  Previous
                </button>
                <span class="page-info">
                  Page {{ orderCurrentPage }} of {{ orderTotalPages }}
                </span>
                <button 
                  (click)="nextOrderPage()" 
                  [disabled]="orderCurrentPage === orderTotalPages"
                  class="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Delivery Tab -->
          <div *ngIf="activeSubTab === 'delivery'" class="tab-pane">
            <div class="data-controls">
              <input 
                type="text" 
                class="form-control search-input" 
                placeholder="Search deliveries..."
                [(ngModel)]="deliverySearchTerm"
                (input)="filterDeliveryData()"
              >
              <select class="form-control" [(ngModel)]="deliveryPageSize" (change)="updateDeliveryPagination()">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            
            <div *ngIf="deliveryLoading" class="loading-container">
              <div class="spinner"></div>
              <p>Loading delivery data...</p>
            </div>
            
            <div *ngIf="!deliveryLoading && filteredDeliveryData.length > 0" class="data-table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th (click)="sortDeliveryData('id')">Delivery ID ↕</th>
                    <th (click)="sortDeliveryData('orderNumber')">Order # ↕</th>
                    <th (click)="sortDeliveryData('date')">Date ↕</th>
                    <th (click)="sortDeliveryData('product')">Product ↕</th>
                    <th (click)="sortDeliveryData('quantity')">Quantity ↕</th>
                    <th (click)="sortDeliveryData('trackingNumber')">Tracking ↕</th>
                    <th (click)="sortDeliveryData('status')">Status ↕</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of paginatedDeliveryData" class="table-row">
                    <td>{{ item.id }}</td>
                    <td>{{ item.orderNumber }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.product }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.trackingNumber }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="pagination">
                <button 
                  (click)="previousDeliveryPage()" 
                  [disabled]="deliveryCurrentPage === 1"
                  class="btn btn-secondary"
                >
                  Previous
                </button>
                <span class="page-info">
                  Page {{ deliveryCurrentPage }} of {{ deliveryTotalPages }}
                </span>
                <button 
                  (click)="nextDeliveryPage()" 
                  [disabled]="deliveryCurrentPage === deliveryTotalPages"
                  class="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .dashboard-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .dashboard-header p {
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
    
    .data-table-container {
      overflow-x: auto;
    }
    
    .table-row {
      transition: background-color 0.2s ease;
    }
    
    .table-row:hover {
      background-color: #f8f9fa;
    }
    
    .table th {
      cursor: pointer;
      user-select: none;
      position: relative;
    }
    
    .table th:hover {
      background-color: #e9ecef;
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
      
      .table {
        font-size: 14px;
      }
      
      .pagination {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  activeSubTab = 'inquiry';
  
  // Inquiry Data
  inquiryData: InquiryData[] = [];
  filteredInquiryData: InquiryData[] = [];
  paginatedInquiryData: InquiryData[] = [];
  inquirySearchTerm = '';
  inquiryCurrentPage = 1;
  inquiryPageSize = 10;
  inquiryTotalPages = 1;
  inquiryLoading = false;
  inquirySortField = '';
  inquirySortDirection: 'asc' | 'desc' = 'asc';
  
  // Order Data
  orderData: SaleOrderData[] = [];
  filteredOrderData: SaleOrderData[] = [];
  paginatedOrderData: SaleOrderData[] = [];
  orderSearchTerm = '';
  orderCurrentPage = 1;
  orderPageSize = 10;
  orderTotalPages = 1;
  orderLoading = false;
  orderSortField = '';
  orderSortDirection: 'asc' | 'desc' = 'asc';
  
  // Delivery Data
  deliveryData: DeliveryData[] = [];
  filteredDeliveryData: DeliveryData[] = [];
  paginatedDeliveryData: DeliveryData[] = [];
  deliverySearchTerm = '';
  deliveryCurrentPage = 1;
  deliveryPageSize = 10;
  deliveryTotalPages = 1;
  deliveryLoading = false;
  deliverySortField = '';
  deliverySortDirection: 'asc' | 'desc' = 'asc';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadInquiryData();
  }

  setActiveSubTab(tab: string): void {
    this.activeSubTab = tab;
    
    switch (tab) {
      case 'inquiry':
        if (this.inquiryData.length === 0) {
          this.loadInquiryData();
        }
        break;
      case 'orders':
        if (this.orderData.length === 0) {
          this.loadOrderData();
        }
        break;
      case 'delivery':
        if (this.deliveryData.length === 0) {
          this.loadDeliveryData();
        }
        break;
    }
  }

  // Inquiry Data Methods
  loadInquiryData(): void {
    this.inquiryLoading = true;
    this.dataService.getInquiryData().subscribe({
      next: (data) => {
        this.inquiryData = data;
        this.filterInquiryData();
        this.inquiryLoading = false;
      },
      error: () => {
        this.inquiryLoading = false;
      }
    });
  }

  filterInquiryData(): void {
    this.filteredInquiryData = this.inquiryData.filter(item =>
      item.id.toLowerCase().includes(this.inquirySearchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(this.inquirySearchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(this.inquirySearchTerm.toLowerCase())
    );
    this.updateInquiryPagination();
  }

  updateInquiryPagination(): void {
    this.inquiryTotalPages = Math.ceil(this.filteredInquiryData.length / this.inquiryPageSize);
    this.inquiryCurrentPage = 1;
    this.updateInquiryPaginatedData();
  }

  updateInquiryPaginatedData(): void {
    const startIndex = (this.inquiryCurrentPage - 1) * this.inquiryPageSize;
    const endIndex = startIndex + this.inquiryPageSize;
    this.paginatedInquiryData = this.filteredInquiryData.slice(startIndex, endIndex);
  }

  previousInquiryPage(): void {
    if (this.inquiryCurrentPage > 1) {
      this.inquiryCurrentPage--;
      this.updateInquiryPaginatedData();
    }
  }

  nextInquiryPage(): void {
    if (this.inquiryCurrentPage < this.inquiryTotalPages) {
      this.inquiryCurrentPage++;
      this.updateInquiryPaginatedData();
    }
  }

  sortInquiryData(field: keyof InquiryData): void {
    if (this.inquirySortField === field) {
      this.inquirySortDirection = this.inquirySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.inquirySortField = field;
      this.inquirySortDirection = 'asc';
    }

    this.filteredInquiryData.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return this.inquirySortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.inquirySortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updateInquiryPaginatedData();
  }

  // Order Data Methods
  loadOrderData(): void {
    this.orderLoading = true;
    this.dataService.getSaleOrderData().subscribe({
      next: (data) => {
        this.orderData = data;
        this.filterOrderData();
        this.orderLoading = false;
      },
      error: () => {
        this.orderLoading = false;
      }
    });
  }

  filterOrderData(): void {
    this.filteredOrderData = this.orderData.filter(item =>
      item.id.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(this.orderSearchTerm.toLowerCase())
    );
    this.updateOrderPagination();
  }

  updateOrderPagination(): void {
    this.orderTotalPages = Math.ceil(this.filteredOrderData.length / this.orderPageSize);
    this.orderCurrentPage = 1;
    this.updateOrderPaginatedData();
  }

  updateOrderPaginatedData(): void {
    const startIndex = (this.orderCurrentPage - 1) * this.orderPageSize;
    const endIndex = startIndex + this.orderPageSize;
    this.paginatedOrderData = this.filteredOrderData.slice(startIndex, endIndex);
  }

  previousOrderPage(): void {
    if (this.orderCurrentPage > 1) {
      this.orderCurrentPage--;
      this.updateOrderPaginatedData();
    }
  }

  nextOrderPage(): void {
    if (this.orderCurrentPage < this.orderTotalPages) {
      this.orderCurrentPage++;
      this.updateOrderPaginatedData();
    }
  }

  sortOrderData(field: keyof SaleOrderData): void {
    if (this.orderSortField === field) {
      this.orderSortDirection = this.orderSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderSortField = field;
      this.orderSortDirection = 'asc';
    }

    this.filteredOrderData.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return this.orderSortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.orderSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updateOrderPaginatedData();
  }

  // Delivery Data Methods
  loadDeliveryData(): void {
    this.deliveryLoading = true;
    this.dataService.getDeliveryData().subscribe({
      next: (data) => {
        this.deliveryData = data;
        this.filterDeliveryData();
        this.deliveryLoading = false;
      },
      error: () => {
        this.deliveryLoading = false;
      }
    });
  }

  filterDeliveryData(): void {
    this.filteredDeliveryData = this.deliveryData.filter(item =>
      item.id.toLowerCase().includes(this.deliverySearchTerm.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(this.deliverySearchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(this.deliverySearchTerm.toLowerCase()) ||
      item.trackingNumber.toLowerCase().includes(this.deliverySearchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(this.deliverySearchTerm.toLowerCase())
    );
    this.updateDeliveryPagination();
  }

  updateDeliveryPagination(): void {
    this.deliveryTotalPages = Math.ceil(this.filteredDeliveryData.length / this.deliveryPageSize);
    this.deliveryCurrentPage = 1;
    this.updateDeliveryPaginatedData();
  }

  updateDeliveryPaginatedData(): void {
    const startIndex = (this.deliveryCurrentPage - 1) * this.deliveryPageSize;
    const endIndex = startIndex + this.deliveryPageSize;
    this.paginatedDeliveryData = this.filteredDeliveryData.slice(startIndex, endIndex);
  }

  previousDeliveryPage(): void {
    if (this.deliveryCurrentPage > 1) {
      this.deliveryCurrentPage--;
      this.updateDeliveryPaginatedData();
    }
  }

  nextDeliveryPage(): void {
    if (this.deliveryCurrentPage < this.deliveryTotalPages) {
      this.deliveryCurrentPage++;
      this.updateDeliveryPaginatedData();
    }
  }

  sortDeliveryData(field: keyof DeliveryData): void {
    if (this.deliverySortField === field) {
      this.deliverySortDirection = this.deliverySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.deliverySortField = field;
      this.deliverySortDirection = 'asc';
    }

    this.filteredDeliveryData.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return this.deliverySortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.deliverySortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updateDeliveryPaginatedData();
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