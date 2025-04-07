import { BasvuruDurumlarıModel } from '../basvuru-durumlari/basvuru-durumlari.model';

export interface IlanBasvuruListModel {
  id: number;
  ilanId: number;
  basvuranId: number;
  basvuruDurumuId: number;
  basvuruDurumu: BasvuruDurumlarıModel;
  aciklama: string;
  basvuruTarihi: Date;
  updatedDate: Date | null;
}
