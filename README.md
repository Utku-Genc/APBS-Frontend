# Akademik Personel Başvuru Sistemi (APBS) - Frontend

Akademik Personel Başvuru Sistemi, üniversitelerdeki akademik kadro başvuru süreçlerini dijitalleştirmek amacıyla geliştirilmiş modern bir web uygulamasıdır. Bu repo, sistemin **Angular tabanlı frontend** kısmını içermektedir.

## 🎥 Tanıtım Videosu

Aşağıdaki bağlantıdan sistemin nasıl çalıştığını gösteren kısa tanıtım videosunu izleyebilirsiniz:

📺 [Tanıtım Videosunu İzle](https://www.youtube.com/watch?v=8ySWleKSafs)  

---

## 🚀 Proje Özellikleri

- ✅ Kullanıcı kaydı ve giriş sistemi
- 📄 Başvuru formu doldurma ve belge yükleme
- 🧾 Başvuru geçmişini görüntüleme
- 🧑‍💼 Admin ve Yönetici paneli ile başvuru onay/red işlemleri
- 📥 Dosya yönetimi ve belge kontrolü
- 🎨 Karanlık/aydınlık tema desteği
- 🔐 JWT tabanlı kimlik doğrulama

---

## 🧩 Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|----------|----------|
| **Angular 19** | Frontend framework |
| **Bootstrap 5** | Responsive tasarım için |
| **SweetAlert2** | Kullanıcı bildirimleri |
| **SignalR** | Anlık kullanıcı bildirimleri |
| **RxJS** | Reactive veri yönetimi |
| **TypeScript** | JavaScript'in güçlü tipi |
| **CSS** | Stil yönetimi |

---

## 🗃️ Proje Yapısı (Özet)

```bash
src/
│
├── app/
│   ├── auth/            # Giriş / kayıt işlemleri
│   ├── admin/           # Yönetici paneli
│   ├── user/            # Kullanıcı işlemleri
│   └── app-routing.module.ts
│
├── assets/              # Logo ve statik dosyalar
└── environments/        # API URL yapılandırmaları
```

---

## 🔗 Backend Bağlantısı

Frontend'in bağlı olduğu backend projesine aşağıdan ulaşabilirsiniz:  
➡️ [APBS Backend (ASP.NET Core Web API)](https://github.com/umutgulfidan/Akademik-Personel-Basvuru-Sistemi-APBS)

---

## 🔧 Kurulum ve Çalıştırma

### 1. Projeyi klonlayın

```bash
git clone https://github.com/Utku-Genc/APBS-Frontend.git
cd APBS-Frontend
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Geliştirme sunucusunu başlatın

```bash
ng serve
```

> Uygulama, varsayılan olarak `http://localhost:4200` adresinde çalışır.

---

## 🧪 Giriş ve Kayıt Bilgisi

> Sistemin kullanılabilmesi için backend tarafının aktif olması gerekmektedir.

🆔 Kullanıcılar sisteme **TC Kimlik Numarası** ile kayıt olmalıdır. Veritabanında önceden tanımlı kullanıcılar bulunmamaktadır.

🔐 Kayıt işlemi sonrası giriş yapılabilir. Her kullanıcı kendi başvurusunu oluşturur ve takip eder.

📌 Yönetici hesabı için sistem yöneticisinden yetkilendirme alınmalıdır.

---

## 📬 İletişim

📧 [Ahmet Efe Tosun](https://github.com/AhmetEfeTosun)   - ahefto@gmail.com  
📬 [Umut Gulfidan](https://github.com/umutgulfidan) - umutgulfidan41@gmail.com  
🖥️ [Utku Genç](https://github.com/Utku-Genc) - utkugenc2003@gmail.com

---

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasını inceleyebilirsiniz.

---
