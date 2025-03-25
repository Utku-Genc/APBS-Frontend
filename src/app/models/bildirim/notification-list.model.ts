export interface NotificationListModel {
    id: number;
    kullaniciId: number;
    kullanici: any;
    baslik: string;
    aciklama: string;
    icon: string;
    renk:string;
    status: boolean;
    olusturmaTarihi: Date;
}
