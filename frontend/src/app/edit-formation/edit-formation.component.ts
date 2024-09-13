import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-formation',
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.css']
})
export class EditFormationComponent implements OnInit {

  id_formation: string | null = null; // Define type more specifically
  readData: any; // Ideally, replace `any` with a specific type

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: ApiserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id_formation = params['id'];
      console.log(this.id_formation);

      if (this.id_formation) {
        this.service.get_formation_by_ID(this.id_formation).subscribe((data: any) => { // Replace `any` with a specific type if possible
          console.log(this.id_formation);
          this.readData = data;
          console.log(data, "data=>");
        });
      }
    });
  }
}
