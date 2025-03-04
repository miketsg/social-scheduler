export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  startDate: string;
  postTime: string;
  platforms: string[];
}