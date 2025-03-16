import { UserOperationClaimModel } from "../user-operation-claim/user-operation-claim.model";

export interface UserListModel {
    id: number;
    firstName: string;
    lastName: string;
    nationalityId: string;
    email: string;
    status: boolean;
    dateOfBirth: Date;
    roles?: UserOperationClaimModel[]; // Kullanıcının rollerini saklamak için
    showFullTc?: boolean;
  }
  