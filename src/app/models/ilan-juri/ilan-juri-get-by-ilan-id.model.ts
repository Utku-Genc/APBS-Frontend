export interface IlanJuriGetByIlanIdModel {
    id: number;
    kullaniciId: number;
    ilanId: number;
    juri: {
        firstName: string;
        lastName: string;
    };
}