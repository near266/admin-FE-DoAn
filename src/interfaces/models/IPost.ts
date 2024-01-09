import { IUser } from './IUser';

export interface IPost {
  id?: string;
  name?: string;
  description?: string;
  content?: string;
  avatar?: string;
  slug?: string;
  view_number?: number;
  tags?: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;

  // addition
  liked?: any;
  likes_count?: number;
  comments_count?: number;
  bookmarked?: any;
  creator?: IUser;
}
