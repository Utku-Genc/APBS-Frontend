export interface Ilan {
    id?: number;  
    olusturanId: number;
    pozisyonId: number | null;  
    bolumId: number | null;  
    baslik: string;  
    aciklama: string; 
    baslangicTarihi?: Date;
    bitisTarihi?: Date; 
    status: boolean;  
    olusturulmaTarihi?: Date;  
    guncellenmeTarihi?: Date;
    silinmeTarihi?: Date | null;
  }
  