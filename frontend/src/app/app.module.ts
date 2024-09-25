import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CreatFormationComponent } from './creat-formation/creat-formation.component';
import { FormationComponent } from './formation/formation.component';
import { EditFormationComponent } from './edit-formation/edit-formation.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserFormationsComponent } from './user-formations/user-formations.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { AuthService } from './auth.service';
import { ApiserviceService } from './apiservice.service';
import { AuthInterceptor } from './auth.interceptor';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from './formation/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    SignInComponent,
    SignUpComponent,
    FeedbackComponent,
    CreatFormationComponent,
    FormationComponent,
    EditFormationComponent,
    NavbarComponent,
    UserFormationsComponent,
    AdminDashboardComponent,
    FormationDetailsComponent,
    FooterComponent,
    HomeComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot({   positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000}), 
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]), // Make sure to provide actual routes if any
    NgxStarRatingModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#be29f5",
      "innerStrokeColor": "#a009d7",
      "innerStrokeWidth": 5,
      "showBackground": false,
      "startFromZero": false
    })
  ],
  providers: [
    ApiserviceService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // This should be outside of declarations
})
export class AppModule { }
