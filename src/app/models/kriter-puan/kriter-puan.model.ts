import { AlanModel } from "../alan/alan.model";
import { KriterModel } from "../kriter/kriter.model";
import { PositionModel } from "../position/position.model";

export interface KriterPuanModel {
    id: number; 
    kriterId: number;  // Kriter ID'si
    kriter: KriterModel;  // Kriter bilgisi
    alanId: number;  // Alan ID'si
    alan:  AlanModel;  // Alan adı
    pozisyonId: number;  // Pozisyon ID'si
    pozisyon: PositionModel;  // Pozisyon adı
    minPuan: number;  // Minimum adet
    maxPuan: number;  // Minimum adet
}
