
export interface UserDetail {
    userId: number;
    username: string;
    sex: string;
    birthdate: string;
    joiningDate: string;
    workJapan: boolean;
    country: string;
    fullName: string;
    description: string;
    qualification: string;
    photo: string;
    phoneNo: number;
    lastname?: string;
}

export interface UserDetailResponse {
    message: string;
    userDetail: UserDetail;
}