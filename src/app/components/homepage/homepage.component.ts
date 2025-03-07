import { Component } from '@angular/core';
import { CardsComponent } from "../cards/cards.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'utk-homepage',
  imports: [CommonModule, CardsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
