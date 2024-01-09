export interface IUser {
  id?: string;
  address?: string;
  avatar?: string;
  email?: string;
  username?: string;
  email_verified_at?: string;
  identity_verified?: boolean | null;
  information?: string;
  name?: string;
  social_id?: string;
  social_type?: string;
  telephone?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
  updated_by?: any;
  role_codes?: string[];
  // addition
  isFollowed?: boolean;
  posts_count?: number;
}
