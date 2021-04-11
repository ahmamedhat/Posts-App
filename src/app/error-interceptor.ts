import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { errorComponent } from "./error/error.component";

@Injectable()

export class errorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any> , next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An Unknown Error has Occured';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(errorComponent , {data: {message: errorMessage}});
        return throwError(error);
      })
    )
  }
}
