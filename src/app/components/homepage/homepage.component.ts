import { Component } from '@angular/core';
import { CardsComponent } from "../cards/cards.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'utk-homepage',
  imports: [CommonModule, CardsComponent, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  status: string = 'active';

}
