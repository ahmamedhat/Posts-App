import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { authService } from "./auth.service";

@Injectable()

export class authInterceptor implements HttpInterceptor {
  constructor(private authService: authService) {

  }
  intercept(req: HttpRequest<any> , next: HttpHandler) {
    const authToken = this.authService.getToken();
    const clonedReq = req.clone({
      headers: req.headers.set("Authorization" ,"Bearer "+ authToken)
    });
    return next.handle(clonedReq);
  }
}
