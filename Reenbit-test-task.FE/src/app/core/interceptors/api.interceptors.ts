import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = environment.apiBaseUrl;
  const reqUrl = req.url.startsWith('/') ? req.url.slice(1) : req.url;
  const apiReq = req.clone({ url: `${apiBaseUrl}/${reqUrl}` });

  return next(apiReq);
};
