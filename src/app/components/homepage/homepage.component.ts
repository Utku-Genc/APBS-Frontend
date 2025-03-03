import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'utk-homepage',
  imports: [RouterLink, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  cards = [
    { title: 'Makine Mühendisliği', department: 'Makine ve İmalat', role: 'Doç. Dr.', deadline: '15 Mart 2025', detailsLink: '/detay/1' },
    { title: 'Bilgisayar Mühendisliği', department: 'Yazılım ve Donanım', role: 'Prof. Dr.', deadline: '20 Mart 2025', detailsLink: '/detay/2' },
    { title: 'Elektrik Elektronik', department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detay/3' },
    { title: 'Elektrik Elektronik', department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detay/3' },
    { title: 'Elektrik Elektronik', department: 'Elektrik ve Haberleşme', role: 'Dr. Öğr. Üyesi', deadline: '10 Nisan 2025', detailsLink: '/detay/3' },
    { title: 'Makine Mühendisliği', department: 'Makine ve İmalat', role: 'Doç. Dr.', deadline: '15 Mart 2025', detailsLink: '/detay/1' },
    { title: 'Bilgisayar Mühendisliği', department: 'Yazılım ve Donanım', role: 'Prof. Dr.', deadline: '20 Mart 2025', detailsLink: '/detay/2' }
  ];
  
}
