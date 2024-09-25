import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CreatFormationComponent } from './creat-formation/creat-formation.component';
import { FormationComponent } from './formation/formation.component';
import { EditFormationComponent } from './edit-formation/edit-formation.component';
import { UserFormationsComponent } from './user-formations/user-formations.component';
import { AuthGuard } from './AuthGuard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'accueil', component: AccueilComponent, data: { breadcrumb: 'accueil' } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { breadcrumb: 'home' } },
  { path: 'sign-up', component: SignUpComponent, data: { breadcrumb: 'sign-up' } },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'create-formation', component: CreatFormationComponent, canActivate: [AuthGuard], data: { breadcrumb: 'create-training' } },
  { path: 'all-trainings', component: FormationComponent, canActivate: [AuthGuard] },
  { path: 'edit-formation', component: EditFormationComponent, canActivate: [AuthGuard], data: { breadcrumb: 'edit-training' } },
  { path: 'user-trainings', component: UserFormationsComponent, canActivate: [AuthGuard], data: { breadcrumb: 'user-trainings' } },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { breadcrumb: 'admin-dashboard' } },
  { path: 'all-trainings/:id', component: FormationDetailsComponent, canActivate: [AuthGuard], data: { breadcrumb: 'formation-details' } },
  { path: '**', redirectTo: 'sign-in' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
