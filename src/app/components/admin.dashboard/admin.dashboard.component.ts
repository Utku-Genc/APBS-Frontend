import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { SummaryPipe } from "../../pipes/summary.pipe";
import { IlanService } from '../../services/ilan.service';
import { PositionService } from '../../services/position.service';
import { BolumService } from '../../services/bolum.service';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { QuillModule } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'utk-admin.dashboard',
  imports: [CommonModule, FormsModule, QuillModule,RouterModule,SummaryPipe],
  templateUrl: './admin.dashboard.component.html',
  styleUrls: ['./admin.dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private ilanService = inject(IlanService);
  private positionService = inject(PositionService);
  private bolumService = inject(BolumService);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private cdRef = inject(ChangeDetectorRef);

  @ViewChild('editModal') editModal!: ElementRef;
  ilansModelObj: IlanDetailModel[] = [];
  formData: any = {}; 
  positions: any[] = [];
  bolums: any[] = [];

  editorConfig = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  ngOnInit(): void {
    this.getAllIlans();
    this.getPositions();
    this.getDepartments();
  }
  ngAfterViewInit(): void {
    // Modal öğesi görüntüye yüklendikten sonra bir işlem yapmak
    this.cdRef.detectChanges();
  }
  getAllIlans() {
    this.ilanService.getAll().subscribe((response) => {
      this.ilansModelObj = response.data;
    });
  }

  getPositions() {
    this.positionService.getAll().subscribe((response) => {
      this.positions = response.data;
    });
  }

  getDepartments() {
    this.bolumService.getAll().subscribe((response) => {
      this.bolums = response.data;
    });
  }

  stripHtml(html: string): string {
    if (!html) return '';
    let plainText = html.replace(/<[^>]*>/g, '');
    plainText = plainText.replace(/&nbsp;/g, ' ').replace(/\uFEFF/g, '').trim();
    return plainText;
  }

  deactivate(ilanId: number) {
    Swal.fire({
      title: 'Gizliye Al',
      text: `${ilanId} ID'li ilan gizliye alınacaktır. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, gizliye al',
      cancelButtonText: 'İptal',
      customClass: {
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.deactivate(ilanId).subscribe(() => {
          this.getAllIlans();
          this.toastService.success('İlan başarıyla gizlendi.');
        });
      }
    });
  }

  activate(ilanId: number) {
    Swal.fire({
      title: 'Aktif Et',
      text: `${ilanId} ID'li ilan aktif hale getirilecektir. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, aktif et',
      cancelButtonText: 'İptal',
      customClass: {
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.activate(ilanId).subscribe(() => {
          this.getAllIlans();
          this.toastService.success('İlan başarıyla aktifleştirildi.');
        });
      }
    });
  }

  openModal(itemId: number) {
    this.formData = this.ilansModelObj.find((item) => item.id === itemId);

    // Modal'ı açmak için Bootstrap modal'ını kullan
    const modal = new bootstrap.Modal(this.editModal.nativeElement);
    modal.show();


  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.editModal.nativeElement);
    if (modal) {
      modal.hide();
    }
  }

  submitForm() {
    this.ilanService.update(this.formData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getAllIlans();
          this.closeModal();
        } else {
          this.toastService.error(response.message);
        }
      },
    });
  }

  edit(itemId: number) {
    this.openModal(itemId);
  }

  onDelete(itemId: number) {
    Swal.fire({
      title: 'Sil',
      text: `${itemId} ID'li ilan silinecek. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.delete(itemId).subscribe(() => {
          this.getAllIlans();
          this.toastService.success('İlan başarıyla silindi.');
        });
      }
    });
  }
}
