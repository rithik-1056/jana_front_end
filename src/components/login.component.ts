import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Customer Portal</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label class="form-label">Customer ID</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="customerId" 
              name="customerId"
              placeholder="Enter your Customer ID"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Enter your password"
              required
            >
          </div>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100"
            [disabled]="isLoading"
          >
            <span *ngIf="isLoading" class="spinner-small"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p>Demo Credentials: CUST001 / password</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.6s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .login-header h1 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .login-header p {
      color: #666;
      font-size: 16px;
    }
    
    .login-form {
      margin-bottom: 24px;
    }
    
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 14px;
    }
    
    .login-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .login-footer p {
      color: #666;
      font-size: 14px;
      margin: 0;
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
    
    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
        margin: 10px;
      }
    }
  `]
})
export class LoginComponent {
  customerId = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.customerId || !this.password) {
      this.errorMessage = 'Please enter both Customer ID and Password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.customerId, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}