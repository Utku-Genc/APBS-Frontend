export interface UserUpdateMailModel {
    email: string;
    currentPassword: string;

}

export interface UserUpdatePasswordModel {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}