import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noencontrado',
  templateUrl: './noencontrado.component.html',
  styleUrls: ['./noencontrado.component.css']
})
export class NoencontradoComponent implements OnInit {

  public URL: string = '/';

  constructor(private router: ActivatedRoute) {
    for (let i = 0; i < this.router.snapshot.url.length; i++) {
      const element = this.router.snapshot.url[i];
      if(i+1 == this.router.snapshot.url.length){
        this.URL += element;
      }else{
        this.URL += element+'/';
      }
    }
  }

  ngOnInit(): void {
  }

}
