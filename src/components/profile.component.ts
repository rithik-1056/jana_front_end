import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>Customer Profile</h2>
        <p>Your account information and details</p>
      </div>
      
      <div *ngIf="user" class="profile-content">
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar-circle">
              {{ getInitials(user.name) }}
            </div>
          </div>
          
          <div class="profile-info">
            <div class="info-row">
              <label>Customer ID</label>
              <span>{{ user.customerId }}</span>
            </div>
            
            <div class="info-row">
              <label>Full Name</label>
              <span>{{ user.name }}</span>
            </div>
            
            <div class="info-row">
              <label>Email Address</label>
              <span>{{ user.email }}</span>
            </div>
            
            <div class="info-row">
              <label>Company</label>
              <span>{{ user.company }}</span>
            </div>
            
            <div class="info-row">
              <label>Phone Number</label>
              <span>{{ user.phone }}</span>
            </div>
            
            <div class="info-row">
              <label>Address</label>
              <span>{{ user.address }}</span>
            </div>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <h3>Account Status</h3>
            <span class="badge badge-success">Active</span>
          </div>
          
          <div class="stat-card">
            <h3>Member Since</h3>
            <span>January 2020</span>
          </div>
          
          <div class="stat-card">
            <h3>Last Login</h3>
            <span>{{ getCurrentDate() }}</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="!user" class="loading-container">
        <div class="spinner"></div>
        <p>Loading profile information...</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .profile-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .profile-header p {
      color: #666;
      font-size: 16px;
    }
    
    .profile-content {
      display: grid;
      gap: 24px;
    }
    
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 32px;
      align-items: start;
    }
    
    .profile-avatar {
      display: flex;
      justify-content: center;
    }
    
    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 36px;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }
    
    .profile-info {
      display: grid;
      gap: 20px;
    }
    
    .info-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 16px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-row label {
      font-weight: 600;
      color: #555;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-row span {
      color: #333;
      font-size: 16px;
    }
    
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-card h3 {
      color: #555;
      margin-bottom: 12px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .stat-card span {
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }
    
    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }
    
    .loading-container p {
      color: #666;
      margin-top: 16px;
    }
    
    @media (max-width: 768px) {
      .profile-card {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 24px;
      }
      
      .info-row {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 8px;
      }
      
      .avatar-circle {
        width: 100px;
        height: 100px;
        font-size: 28px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}