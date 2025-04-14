export interface SkillCategory {
  skillCategoryId: number;
  skillCategoryName: string;
  iconName: string;
}

export interface SkillSubCategory {
  skillSubcategoryId: number;
  iconName: string;
  skillSubcategoryName: string;
}

export interface Skill {
  skillId: number;
  iconName: string;
  skillName: string;
}

export interface AddSkillRequest {
  userId: number;
  myId: number | null;
  proficiencyLevel: string | null;
  experience: string | null;
}

export interface CategoryResponse {
  category: SkillCategory[];
}

export interface SubCategoryResponse {
  subCategory: SkillSubCategory[];
}

export interface SkillResponse {
  skills: Skill[];
}

export interface UserSkillData {
  userSkillId: number;
  skill: string;
  proficiencyLevel: string;
  subcategory: string;
  category: string;
  experience: number;
  iconName: string;
  username: string;
}
