import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AdminService } from '../services/admin.service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  constructor(private adminService: AdminService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('/api/admin')) {
      const token = this.adminService.getToken();
      
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authReq);
      }
    }
    
    return next.handle(req);
  }
}