import { Component, OnInit } from '@angular/core';
import { fade, slideIn } from '../../animations';

@Component({
  selector: 'app-quickstart',
  templateUrl: './quickstart.component.html',
  styleUrl: './quickstart.component.css',
  animations: [fade, slideIn]
})
export class QuickstartComponent implements OnInit {


  ngOnInit(): void {
   this.onAnimate();
  }
  slideIn = 'out';


  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);

  }

}
