export interface User {
  userid: number;
  username: string;
  email: string;
  role: string;
}

export interface AllUsersResponse {
  message: string;
  allUsers: User[];
}
export interface RegisterUserResponse {
  message: string;
  user: User;
}

export interface LoggedUser {
  UserId: number;
  Name: string;
  Email: string;
  Role: string;
}