import { AlanModel } from "../alan/alan.model";

export interface BolumModel {
    id: number;
    alanId: number;
    alan: AlanModel;
    ad: string;
    aciklama: string;
    telefon: string;
    email: string;
    adres: string;
  }