import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ProfileComponent } from './profile.component';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { FinancialSheetComponent } from './financial-sheet.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProfileComponent, CustomerDashboardComponent, FinancialSheetComponent],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-left">
          <button class="btn btn-secondary back-btn" (click)="goBack()">
            ← Back
          </button>
          <h1>Customer Portal Dashboard</h1>
        </div>
        <div class="header-right">
          <span class="welcome-text">Welcome, {{ currentUser?.name }}</span>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="tab-container">
          <div class="tab-nav">
            <button 
              class="tab-button"
              [class.active]="activeTab === 'profile'"
              (click)="setActiveTab('profile')"
            >
              Profile
            </button>
            <button 
              class="tab-button"
              [class.active]="activeTab === 'dashboard'"
              (click)="setActiveTab('dashboard')"
            >
              Customer Dashboard
            </button>
            <button 
              class="tab-button"
              [class.active]="activeTab === 'financial'"
              (click)="setActiveTab('financial')"
            >
              Financial Sheet
            </button>
          </div>
          
          <div class="tab-content">
            <div *ngIf="activeTab === 'profile'" class="tab-pane">
              <app-profile></app-profile>
            </div>
            <div *ngIf="activeTab === 'dashboard'" class="tab-pane">
              <app-customer-dashboard></app-customer-dashboard>
            </div>
            <div *ngIf="activeTab === 'financial'" class="tab-pane">
              <app-financial-sheet></app-financial-sheet>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-footer">
        <button class="btn btn-danger logout-btn" (click)="logout()">
          Logout
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .header-left h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 700;
    }
    
    .back-btn {
      padding: 8px 16px;
      font-size: 14px;
    }
    
    .welcome-text {
      color: #666;
      font-weight: 600;
    }
    
    .dashboard-content {
      flex: 1;
      margin-bottom: 24px;
    }
    
    .tab-pane {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .dashboard-footer {
      display: flex;
      justify-content: flex-start;
    }
    
    .logout-btn {
      padding: 12px 24px;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 10px;
      }
      
      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
      
      .header-left {
        flex-direction: column;
        gap: 12px;
      }
      
      .header-left h1 {
        font-size: 20px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeTab = 'profile';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    // In a real app, this might navigate to a previous page
    // For now, we'll just refresh the current tab
    window.location.reload();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}