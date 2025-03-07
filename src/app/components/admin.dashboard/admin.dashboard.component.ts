import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { SummaryPipe } from "../../pipes/summary.pipe";

@Component({
  selector: 'utk-admin.dashboard',
  imports: [CommonModule, SummaryPipe],
  templateUrl: './admin.dashboard.component.html',
  styleUrls: ['./admin.dashboard.component.css'],
})
export class AdminDashboardComponent {
  private toastService = inject(ToastService);

  // Mock data for the table
  items = [
    {
      id: 1,
      title: 'Makine Mühendisliği',
      description: 'Makine mühendisliği alanında akademik çalışmalar yürütecek, lisans ve yüksek lisans öğrencilerine ders verecek, aynı zamanda TÜBİTAK ve sanayi projelerinde yer alacak akademisyen aranmaktadır.',
      uploader: 'Doç. Dr. Ahmet Yılmaz',
      isActive: true,
    },
    {
      id: 2,
      title: 'Bilgisayar Mühendisliği',
      description: 'Yapay zeka, büyük veri ve güvenli yazılım geliştirme alanlarında uzmanlaşmış, akademik ve endüstriyel projelerde yer alabilecek profesör aranmaktadır.',
      uploader: 'Prof. Dr. Selin Kaya',
      isActive: false,
    },
    {
      id: 3,
      title: 'Elektrik Elektronik Mühendisliği',
      description: 'Elektrik Elektronik Mühendisliği alanında lisans ve lisansüstü eğitimde görev alacak, özellikle gömülü sistemler ve haberleşme teknolojileri üzerine çalışmaları olan akademisyen aranmaktadır.',
      uploader: 'Dr. Öğr. Üyesi Melis Karataş',
      isActive: true,
    },
    {
      id: 4,
      title: 'Endüstri Mühendisliği',
      description: 'Endüstri mühendisliği alanında üretim planlama, optimizasyon ve lojistik yönetimi konularında uzmanlaşmış akademisyen aranmaktadır.',
      uploader: 'Doç. Dr. Barış Kılıç',
      isActive: false,
    },
    {
      id: 5,
      title: 'İnşaat Mühendisliği',
      description: 'Deprem mühendisliği, yapı malzemeleri ve geoteknik alanlarında araştırmalar yapacak profesör aranmaktadır.',
      uploader: 'Prof. Dr. Duygu Erdoğan',
      isActive: true,
    },
  ];
  
  // Sample action: delete item
  onDelete(itemId: number) {
    this.toastService
      .confirmation(
        'Silmek Üzeresiniz',
        `Bu öğeyi (ID: ${itemId}) silmek istediğinizden emin misiniz?`
      )
      .then((result) => {
        if (result.isConfirmed) {
          // Proceed with delete action here
          // Show success toast
          this.toastService.success(`Öğe (ID: ${itemId}) başarıyla silindi!`);
        }
      });
  }

  // Sample action: toggle isActive/inactive status
  onToggleActive(itemId: number, currentStatus: boolean) {
    const newStatus = !currentStatus;

    this.toastService
      .confirmation(
        'Durum Değiştirmek Üzeresiniz',
        `Bu öğenin (ID: ${itemId}) durumunu değiştirmek istediğinizden emin misiniz?`
      )
      .then((result) => {
        if (result.isConfirmed) {
          // Proceed with toggling the status
          // Show success toast
          this.toastService.success(
            newStatus
              ? `Öğe (ID: ${itemId}) aktif hale getirildi!`
              : `Öğe (ID: ${itemId}) pasif hale getirildi!`
          );
        }
      });
  }
}
