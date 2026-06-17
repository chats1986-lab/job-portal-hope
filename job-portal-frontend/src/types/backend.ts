// TypeScript interfaces matching Spring Boot backend DTOs and Domain models
// from the job-portal-system backend.

// ==================== ENUMS ====================

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWING = "REVIEWING",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
  WITHDRAWN = "WITHDRAWN",
}

export enum JobStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED",
  FILLED = "FILLED",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  REMOTE = "REMOTE",
}

export enum WorkMode {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ON_SITE = "ON_SITE",
}

export enum ExperienceLevel {
  ENTRY_LEVEL = "ENTRY_LEVEL",
  JUNIOR = "JUNIOR",
  MID_LEVEL = "MID_LEVEL",
  SENIOR_LEVEL = "SENIOR_LEVEL",
  LEAD = "LEAD",
  EXECUTIVE = "EXECUTIVE",
}

export enum UserRole {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_JOB_SEEKER = "ROLE_JOB_SEEKER",
  ROLE_EMPLOYER = "ROLE_EMPLOYER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum CompanySize {
  MICRO = "MICRO",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  ENTERPRISE = "ENTERPRISE",
}

export enum CompanyType {
  STARTUP = "STARTUP",
  PRIVATE = "PRIVATE",
  PUBLIC_LISTED = "PUBLIC_LISTED",
  GOVERNMENT = "GOVERNMENT",
  NON_PROFIT = "NON_PROFIT",
  EDUCATIONAL = "EDUCATIONAL",
  SELF_EMPLOYED = "SELF_EMPLOYED",
}

export enum IndustryType {
  TECHNOLOGY = "TECHNOLOGY",
  FINANCE_BANKING = "FINANCE_BANKING",
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  MANUFACTURING = "MANUFACTURING",
  RETAIL_ECOMMERCE = "RETAIL_ECOMMERCE",
  HOSPITALITY_TOURISM = "HOSPITALITY_TOURISM",
  REAL_ESTATE = "REAL_ESTATE",
  MEDIA_ENTERTAINMENT = "MEDIA_ENTERTAINMENT",
  TRANSPORTATION_LOGISTICS = "TRANSPORTATION_LOGISTICS",
  ENERGY_UTILITIES = "ENERGY_UTILITIES",
  AGRICULTURE = "AGRICULTURE",
  CONSULTING = "CONSULTING",
  LEGAL = "LEGAL",
  TELECOMMUNICATIONS = "TELECOMMUNICATIONS",
  AUTOMOTIVE = "AUTOMOTIVE",
  PHARMACEUTICAL = "PHARMACEUTICAL",
  CONSTRUCTION = "CONSTRUCTION",
  HUMAN_RESOURCE = "HUMAN_RESOURCE",
  MARKETING_ADVERTISING = "MARKETING_ADVERTISING",
  OTHER = "OTHER",
}

export enum CompanyStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export enum ProficiencyLevel {
  BEGINNER = "BEGINNER",
  ELEMENTARY = "ELEMENTARY",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export enum LanguageProficiency {
  BASIC = "BASIC",
  CONVERSATIONAL = "CONVERSATIONAL",
  PROFESSIONAL = "PROFESSIONAL",
  FLUENT = "FLUENT",
  NATIVE = "NATIVE",
}

export enum SkillCategory {
  PROGRAMMING_LANGUAGE = "PROGRAMMING_LANGUAGE",
  FRAMEWORK = "FRAMEWORK",
  DATABASE = "DATABASE",
  CLOUD_PLATFORM = "CLOUD_PLATFORM",
  DEVOPS = "DEVOPS",
  DESIGN = "DESIGN",
  SOFT_SKILLS = "SOFT_SKILLS",
  TOOL = "TOOL",
  LANGUAGE = "LANGUAGE",
  OTHER = "OTHER",
}

export enum SocialPlatform {
  LINKEDIN = "LINKEDIN",
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  INSTAGRAM = "INSTAGRAM",
  YOUTUBE = "YOUTUBE",
  WEBSITE = "WEBSITE",
}

export enum ResumeTemplate {
  CLASSIC = "CLASSIC",
  MODERN = "MODERN",
  CREATIVE = "CREATIVE",
  MINIMAL = "MINIMAL",
  PROFESSIONAL = "PROFESSIONAL",
}

export enum ResumeVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  LINK_ONLY = "LINK_ONLY",
}

// ==================== REQUEST DTOs ====================

export interface SocialLinkResponse {
  platform: SocialPlatform;
  url: string;
}

export interface CompanyRequest {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  foundedYear?: number;
  companySize: CompanySize;
  companyType: CompanyType;
  industryType: IndustryType;
  registrationNumber?: string;
  socialLinks?: SocialLinkResponse[];
}

export interface JobRequest {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  categoryId: number;
  skillIds?: number[];
  tagIds?: number[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  minSalary?: number;
  maxSalary?: number;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  openings?: number;
  applicationDeadline?: string;
  expiresAt?: string;
}

export interface ApplicationRequest {
  jobId: number;
  resumeId: number;
  coverLetter?: string;
  expectedSalary?: number;
  availableFrom?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface WithdrawApplicationRequest {
  reason?: string;
}

export interface SavedJobRequest {
  jobId: number;
}

export interface JobCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  parentId?: number;
}

export interface JobSkillRequest {
  skillName: string;
  slug?: string;
  skillCategory: SkillCategory;
}

export interface ResumeRequest {
  title: string;
  template: ResumeTemplate;
  visibility: ResumeVisibility;
  isDefault?: boolean;
}

// ==================== RESPONSE DTOs ====================

export interface ApiResponse {
  message: string;
  status: boolean;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  foundedYear?: string;
  companySize: CompanySize;
  companyType: CompanyType;
  industryType: IndustryType;
  companyStatus: CompanyStatus;
  active?: boolean;
  ownerId: number;
  socialLinks?: SocialLinkResponse[];
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
}

export interface CompanySummaryResponse {
  id?: number;
  name?: string;
  logoUrl?: string;
}

export interface JobCategoryResponse {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  active?: boolean;
  parentId?: number;
  parentName?: string;
  subCategories?: JobCategoryResponse[];
  createdAt: string;
}

export interface JobSkillResponse {
  id: number;
  skillName: string;
  slug?: string;
  skillCategory: SkillCategory;
  active?: boolean;
}

export interface JobTagResponse {
  id: number;
  name: string;
  slug?: string;
}

export interface JobResponse {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  company?: CompanyResponse;
  employerId: number;
  jobCategory?: JobCategoryResponse;
  jobSkills?: JobSkillResponse[];
  jobTags?: JobTagResponse[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  minSalary?: number;
  maxSalary?: number;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  jobStatus: JobStatus;
  openings?: number;
  applicationDeadline?: string;
  expiresAt?: string;
  active?: boolean;
  viewCount?: number;
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
}

export interface PersonalInfoResponse {
  firstName?: string;
  lastName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
}

export interface WorkExperienceResponse {
  id: number;
  companyName: string;
  companyLogoUrl?: string;
  jobTitle: string;
  employmentType: JobType;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description?: string;
  technologies: string[];
  displayOrder: number;
}

export interface EducationResponse {
  id: number;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  description?: string;
  displayOrder: number;
}

export interface ResumeSkillResponse {
  id: number;
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
  displayOrder: number;
}

export interface ProjectResponse {
  id: number;
  title: string;
  description?: string;
  technologies: string[];
  projectUrl?: string;
  sourceCodeUrl?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  displayOrder: number;
}

export interface LanguageResponse {
  id: number;
  languageName: string;
  languageProficiency: LanguageProficiency;
  displayOrder: number;
}

export interface ResumeResponse {
  id: number;
  candidateId: number;
  title: string;
  resumeTemplate: ResumeTemplate;
  resumeVisibility: ResumeVisibility;
  isDefault: boolean;
  personalInfo?: PersonalInfoResponse;
  summary?: string;
  completionScore?: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  workExperiences?: WorkExperienceResponse[];
  educations?: EducationResponse[];
  skills?: ResumeSkillResponse[];
  projects?: ProjectResponse[];
  languages?: LanguageResponse[];
}

export interface ApplicationNoteResponse {
  id?: number;
  note?: string;
  createdAt?: string;
}

export interface ApplicationResponse {
  id: number;
  candidate?: UserResponse;
  employerId: string;
  job?: JobResponse;
  company?: CompanySummaryResponse;
  status: ApplicationStatus;
  resumeId: number;
  coverLetter?: string;
  expectedSalary?: number;
  availableFrom?: string;
  isStarred?: boolean;
  notes?: ApplicationNoteResponse[];
  withdrawnAt?: string;
  withdrawnReason?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface SavedJobResponse {
  id: number;
  candidateId: number;
  jobId: number;
  savedAt: string;
}

// ==================== AUTH ====================

export interface AuthResponse {
  jwt?: string;
  token?: string; // Alias for jwt
  user?: UserResponse;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ==================== FILTER ====================

export interface JobSearchRequest {
  query?: string;
  location?: string;
  companyType?: CompanyType;
  industryType?: IndustryType;
  jobType?: JobType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  categoryId?: number;
  skillIds?: number[];
  tagIds?: number[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface CompanyApplicationFilterRequest {
  status?: ApplicationStatus;
  jobId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
