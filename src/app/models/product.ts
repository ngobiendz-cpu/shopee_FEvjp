export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  sizes: (string | number)[];
  colors: string[];
  description?: string;
  isPromoted?: boolean;
}