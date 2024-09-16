import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  message: string = '';
  readData: any[] = [];
  formations: any[] = [];
  constructor(private service: ApiserviceService) { }

  ngOnInit(): void {
    this.service.get_all_formation().subscribe((res: any) => {
      this.readData = res;
    });
  }
}