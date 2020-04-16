import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: ActivatedRoute, private http: HttpClient, private route: Router) {
    console.log(this.router.snapshot.url[0].path);
  }

  ngOnInit(): void {
  }

}
