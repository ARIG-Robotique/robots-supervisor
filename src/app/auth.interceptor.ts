import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let urlReq = req.clone({ url: req.url, withCredentials: true,  headers: req.headers.append('Content-type', 'application/json')});
    return next.handle(urlReq);
  }
}
