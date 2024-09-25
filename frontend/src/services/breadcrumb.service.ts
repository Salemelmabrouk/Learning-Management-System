import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiserviceService } from '../app/apiservice.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  constructor(private router: Router, private apiService: ApiserviceService) {}

  buildBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Array<any> = []): Observable<any[]> {
    const breadcrumb = route.data['breadcrumb'];
    const path = route.url.map(segment => segment.path).join('/');
    const nextUrl = `${url}/${path}`;

    if (!breadcrumb) {
      if (route.firstChild) {
        return this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs);
      }
      return of(breadcrumbs);
    }

    if (route.paramMap.has('id')) {
      const id = route.paramMap.get('id');
      if (id) {
        return this.apiService.get_formation_by_ID(id).pipe(
          switchMap((training: any) => {
            breadcrumbs.push({ label: training.name, url: nextUrl });
            return route.firstChild
              ? this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs)
              : of(breadcrumbs);
          })
        );
      }
    } else {
      breadcrumbs.push({ label: breadcrumb, url: nextUrl });
    }

    return route.firstChild
      ? this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs)
      : of(breadcrumbs);
  }

  getBreadcrumbs(): Observable<any[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => {
        let route = this.router.routerState.snapshot.root;
        return this.buildBreadcrumbs(route);
      })
    );
  }
}
