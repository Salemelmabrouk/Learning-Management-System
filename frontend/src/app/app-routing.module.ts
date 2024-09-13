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
import { AuthGuard } from './AuthGuard'; // Ensure the path is correct
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormationDetailsComponent } from './formation-details/formation-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },  // Optional: Protect this route if necessary
  { path: 'create-formation', component: CreatFormationComponent, canActivate: [AuthGuard] },
  { path: 'formation', component: FormationComponent, canActivate: [AuthGuard] },
  { path: 'edit-formation', component: EditFormationComponent, canActivate: [AuthGuard] },
  { path: 'user-formations', component: UserFormationsComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'formation/:id', component: FormationDetailsComponent, canActivate: [AuthGuard] }, // Add AuthGuard if formation details need protection
  { path: '**', redirectTo: 'sign-in' },  // Wildcard route should be the last entry
];

 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
