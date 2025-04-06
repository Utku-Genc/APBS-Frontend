import { ApplyFileDto } from "./apply-file-dto.model";

export interface ApplyDto {
    ilanId: number;
    basvuruTarihi: Date;
    aciklama?: string;
    files: ApplyFileDto[];
  }
