import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  customerId: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(customerId: string, password: string): Observable<boolean> {
    // Mock authentication - replace with actual SAP API call
    return of({ customerId, password }).pipe(
      delay(1000), // Simulate API delay
      map(() => {
        if (customerId === 'CUST001' && password === 'password') {
          const user: User = {
            customerId: 'CUST001',
            name: 'John Smith',
            email: 'john.smith@company.com',
            company: 'ABC Corporation',
            phone: '+1-555-0123',
            address: '123 Business Ave, Suite 100, New York, NY 10001'
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}