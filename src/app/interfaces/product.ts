export interface Product {
  id: number;
  parentId: number;
  name: string;
  description?: string;
  price?: number;
  imgUrl?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}