export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  published: string;
  subtitle?: string;
  rating?: number;
  cover: string;
  description?: string;
}
