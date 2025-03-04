export interface Post {
  id: string;
  title: string;
  description: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  startDate: string;
  platforms: string[];
  postTime: string;
}