export interface IlanAddModel {
    pozisyonId: number;  // İlanın ait olduğu pozisyon
    bolumId: number;  // İlgili bölüm ID'si
    baslik: string;  // İlan başlığı
    aciklama: string;  // HTML destekli ilan açıklaması
    baslangicTarihi: Date;  // Başlangıç tarihi opsiyonel olabilir
    bitisTarihi: Date;  // Bitiş tarihi
  }