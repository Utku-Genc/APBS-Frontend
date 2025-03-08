export interface Ilan {
    id?: number;  // ID opsiyonel çünkü yeni oluşturulurken henüz bilinmez
    olusturanId: number; // Kullanıcı ID'si (admin veya yetkili kişi)
    pozisyonId: number | null;  // İlanın ait olduğu pozisyon
    bolumId: number | null;  // İlgili bölüm ID'si
    baslik: string;  // İlan başlığı
    aciklama: string;  // HTML destekli ilan açıklaması
    baslangicTarihi?: Date;  // Başlangıç tarihi opsiyonel olabilir
    bitisTarihi?: Date;  // Bitiş tarihi
    status: boolean;  // Aktif/Pasif durumu
    olusturulmaTarihi?: Date;  // Default olarak otomatik atanır
    guncellenmeTarihi?: Date;
    silinmeTarihi?: Date | null;  // Silinmişse tarih atanır, yoksa `null`
  }
  