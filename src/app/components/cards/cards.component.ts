import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'utk-cards',
  imports: [RouterLink, CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  cards = [
    { title: 'Makine Mühendisliği', image:"random_shapes.jpg" , department: 'Makine ve İmalat', role: 'Doç. Dr.', deadline: '15 Mart 2025', detailsLink: '/detail/1' },
    { title: 'Bilgisayar Mühendisliği',image:"random_shapes_4.jpg" , department: 'Yazılım ve Donanım', role: 'Prof. Dr.', deadline: '20 Mart 2025', detailsLink: '/detail/2' },
    { title: 'Elektrik Elektronik',image:"random_shapes_2.jpg" , department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detail/3' },
    { title: 'Elektrik Elektronik',image:"random_shapes_3.jpg" , department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detail/4' },
    { title: 'Elektrik Elektronik',image:"random_shapes.jpg" , department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detail/5' },
    { title: 'Makine Mühendisliği',image:"random_shapes_4.jpg" , department: 'Makine ve İmalat', role: 'Doç. Dr.', deadline: '15 Mart 2025', detailsLink: '/detail/6' },
    { title: 'Bilgisayar Mühendisliği',image:"random_shapes_2.jpg" , department: 'Yazılım ve Donanım', role: 'Prof. Dr.', deadline: '20 Mart 2025', detailsLink: '/detail/7' }
  ];
  

}
