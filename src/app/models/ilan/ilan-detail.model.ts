import { BolumModel } from "../bolum/bolum.model";
import { PositionModel } from "../position/position.model";
import { UserListModel } from "../user/user-list.model";

export interface IlanDetailModel {
    id: number;  // İlan ID'si
    olusturanId: number; // İlanı oluşturan kullanıcı ID'si
    olusturan : UserListModel; // İlanı oluşturan kullanıcı

    pozisyonId: number; // İlanın ait olduğu pozisyon
    pozisyon: PositionModel; // İlanın ait olduğu pozisyon

    bolumId: number;  // İlgili bölüm ID'si
    bolum: BolumModel; // İlgili bölüm

    baslik: string;  // İlan başlığı
    aciklama: string;  // HTML destekli ilan açıklaması
    baslangicTarihi: Date;  // Başlangıç tarihi opsiyonel olabilir
    bitisTarihi: Date;  // Bitiş tarihi
    status: boolean; // İlanın aktiflik durumu
  }