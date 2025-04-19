import { UserOperationClaimModel } from "../user-operation-claim/user-operation-claim.model";

export interface UserListModel {
    id: number;
    firstName: string;
    lastName: string;
    nationalityId: string;
    email: string;
    imageUrl?: string; // Kullanıcının profil resmi URL'si
    status: boolean;
    operationClaims?: UserOperationClaimModel[];
    dateOfBirth: Date;
    roles?: UserOperationClaimModel[]; // Kullanıcının rollerini saklamak için
    showFullTc?: boolean;

  }
  