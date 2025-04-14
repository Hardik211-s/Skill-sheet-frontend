export interface UserDetail {
  userId: number;
  username: string;
  qualification: string;
  workJapan: boolean;
  photo: string;
  birthdate: string;
  fullName: string;
  joiningDate: string;
  country: string;
  sex: string;
  phoneNo: number;
  description: string;
  age: number;
  email: string;
  lastname: string;

}

export interface DashboardData {
  allUserDetail: UserDetail[];
  userAllData: UserDetail[];
  experienceAVG: number;
  totalSkill: number;
  totalUser: number;
}

export interface UserAllData {
  userAllData: UserDetail[];
  experienceAVG: number;
  totalSkill: number;
  totalUser: number;
}

export interface UserCountData {
  programming: number;
  webdev: number;
  cloud: number;
  devops: number;
  datascience: number;
  soft: number;
  aiml: number;
}

export interface ChartData {
  data: number[];
  label: string;
  backgroundColor: string[];
}

export interface MyDashboardData {
  allUserDetail: UserDetail[];
  userAllData: MyUserAllData[];
  experienceAVG: number;
  totalSkill: number;
  totalUser: number;
}

export interface MyUserAllData {
  category: string;
  experience: number;
  iconName: string;
  proficiencyLevel: string;
  skill: string;
  subcategory: string;
  userSkillId: number;
  username: string;

}

export interface DashboardResponse {
  message: string;
  data: MyDashboardData;
}