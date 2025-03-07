import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewlinePipe } from "../../pipes/newline.pipe";

@Component({
  selector: 'utk-cards-detail',
  imports: [CommonModule, NewlinePipe],
  templateUrl: './cards.detail.component.html',
  styleUrl: './cards.detail.component.css',
})
export class CardsDetailComponent {

  private route = inject(ActivatedRoute);

  card: any;
  cards = [
    {
      id: 1,
      title: 'Makine Mühendisliği',
      image: 'random_shapes.jpg',
      department: 'Makine ve İmalat Mühendisliği',
      role: 'Doç. Dr.',
      deadline: '15 Mart 2025',
      description: 'Makine mühendisliği alanında akademik çalışmalar yürütecek, lisans ve yüksek lisans öğrencilerine ders verecek, aynı zamanda TÜBİTAK ve sanayi projelerinde yer alacak akademisyen aranmaktadır.',
      phone: '0262 123 45 67',
      email: 'makine@kocaeli.edu.tr',
      conditions: 'Makine Mühendisliği veya ilgili bir alanda doktora yapmış olmak. Akademik çalışmaları ve yayınları güçlü olmak. En az 3 yıl öğretim deneyimi şartı aranmaktadır.',
      address: 'Kocaeli Üniversitesi, Mühendislik Fakültesi, Umuttepe Kampüsü, Kocaeli',
      educationType: 'Tam Zamanlı'
    },
    {
      id: 2,
      title: 'Bilgisayar Mühendisliği',
      image: 'random_shapes_4.jpg',
      department: 'Yazılım ve Donanım Mühendisliği',
      role: 'Prof. Dr.',
      deadline: '20 Mart 2025',
      description: 'Yapay zeka, büyük veri ve güvenli yazılım geliştirme alanlarında uzmanlaşmış, akademik ve endüstriyel projelerde yer alabilecek, öğrencilere mentorluk yapabilecek profesör aranmaktadır.',
      phone: '0262 987 65 43',
      email: 'bilgisayar@kocaeli.edu.tr',
      conditions: 'Bilgisayar Mühendisliği veya ilgili bir alanda doktora derecesine sahip olmak. En az 5 yıl akademik deneyim ve uluslararası hakemli dergilerde yayın yapmış olmak.',
      address: 'Kocaeli Üniversitesi, Bilgisayar Mühendisliği Bölümü, Umuttepe Kampüsü, Kocaeli',
      educationType: 'Tam Zamanlı'
    },
    {
      id: 3,
      title: 'Elektrik Elektronik Mühendisliği',
      image: 'random_shapes_2.jpg',
      department: 'Elektrik ve Haberleşme Teknolojileri',
      role: 'Dr. Öğr. Üyesi',
      deadline: '10 Nisan 2025',
      description: 'Elektrik Elektronik Mühendisliği alanında lisans ve lisansüstü eğitimde görev alacak, özellikle gömülü sistemler ve haberleşme teknolojileri üzerine çalışmaları olan akademisyen aranmaktadır.',
      phone: '0262 456 78 90',
      email: 'elektrik@kocaeli.edu.tr',
      conditions: 'Elektrik Elektronik Mühendisliği veya ilgili bir alanda doktora derecesine sahip olmak. En az 2 yıl araştırma projelerinde deneyim sahibi olmak.',
      address: 'Kocaeli Üniversitesi, Elektrik Elektronik Fakültesi, Umuttepe Kampüsü, Kocaeli',
      educationType: 'Tam Zamanlı'
    },
    {
      id: 4,
      title: 'Endüstri Mühendisliği',
      image: 'random_shapes_3.jpg',
      department: 'Üretim ve Sistem Yönetimi',
      role: 'Doç. Dr.',
      deadline: '25 Nisan 2025',
      description: 'Endüstri mühendisliği alanında üretim planlama, optimizasyon ve lojistik yönetimi konularında uzmanlaşmış, sanayi iş birliklerinde aktif rol alabilecek akademisyen aranmaktadır.',
      phone: '0262 321 54 76',
      email: 'endustri@kocaeli.edu.tr',
      conditions: 'Endüstri Mühendisliği veya ilgili bir alanda doktora yapmış olmak. Üretim süreçleri ve optimizasyon üzerine yayınları bulunmak.',
      address: 'Kocaeli Üniversitesi, Endüstri Mühendisliği Bölümü, Umuttepe Kampüsü, Kocaeli',
      educationType: 'Tam Zamanlı'
    },
    {
      id: 5,
      title: 'İnşaat Mühendisliği',
      image: 'random_shapes_3.jpg',
      department: 'Yapı ve Geoteknik',
      role: 'Prof. Dr.',
      deadline: '30 Nisan 2025',
      description: 'Deprem mühendisliği, yapı malzemeleri ve  geoteknik alanlarında araştırmalar yapacak, akademik yayınları güçlü olan profesör aranmaktadır.',
      phone: '0262 654 32 10',
      email: 'insaat@kocaeli.edu.tr',
      conditions: 'İnşaat Mühendisliği alanında doktora yapmış olmak. Uluslararası projelerde ve yayınlarda aktif rol almış olmak.',
      address: 'Kocaeli Üniversitesi, İnşaat Mühendisliği Bölümü, Umuttepe Kampüsü, Kocaeli',
      educationType: 'Tam Zamanlı'
    }
  ];
  
  isLoggedIn = false; // Kullanıcı giriş yapmış mı?

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.card = this.cards.find((c) => c.id === id);

    this.isLoggedIn = !!localStorage.getItem('token'); // Eğer userToken varsa giriş yapmıştır.
  }

  goBack() {
    window.history.back();
  }
}
