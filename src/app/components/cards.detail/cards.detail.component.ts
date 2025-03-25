import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewlinePipe } from '../../pipes/newline.pipe';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { IlanService } from '../../services/ilan.service';

@Component({
  selector: 'utk-cards-detail',
  imports: [CommonModule, NewlinePipe],
  templateUrl: './cards.detail.component.html',
  styleUrl: './cards.detail.component.css',
})
export class CardsDetailComponent {
  private route = inject(ActivatedRoute);
  private ilanService = inject(IlanService);

  ilanDetailObj!: IlanDetailModel;
  currentDate: Date = new Date();


  isLoggedIn = false; // Kullanıcı giriş yapmış mı?

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoggedIn = !!localStorage.getItem('token'); // Eğer userToken varsa giriş yapmıştır.
    this.getIlanDetail(id);
    console.log(this.currentDate);
  }

  getIlanDetail(id: number) {
    this.ilanService.getById(id).subscribe((res) => {
      this.ilanDetailObj = res.data;
    });
  }

  goBack() {
    window.history.back();
  }
}
