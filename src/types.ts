export interface AllProducts {
  unique_image_url_prefixes: any[];
  products_and_categories: ProductsAndCategories;
  release_date: string;
  release_week: string;
}

export interface ProductsAndCategories {
  Skate: Product[];
  Accessories: Product[];
  Bags: Product[];
  Pants: Product[];
  Jackets: Product[];
  Sweatshirts: Product[];
  'Tops/Sweaters': Product[];
  Hats: Product[];
  Shoes: Product[];
  Shirts: Product[];
}

export interface Product {
  name: string;
  id: number;
  image_url: string;
  image_url_hi: string;
  price: number;
  sale_price: number;
  new_item: boolean;
  position: number;
  category_name: string;
  price_euro: number;
  sale_price_euro: number;
}

export interface DetailedProduct extends Product {
  styles: Style[];
  description: string;
  can_add_styles: boolean;
  can_buy_multiple: boolean;
  ino: string;
  cod_blocked: boolean;
  canada_blocked: boolean;
  purchasable_qty: number;
  special_purchasable_qty: string[];
  new_item: boolean;
  apparel: boolean;
  handling: number;
  no_free_shipping: boolean;
  can_buy_multiple_with_limit: number;
  tag: string;
  non_eu_blocked: boolean;
  russia_blocked: boolean;
}

export interface Style {
  id: number;
  name: string;
  tag: any;
  currency: string;
  description: any;
  image_url: string;
  image_url_hi: string;
  swatch_url: string;
  swatch_url_hi: string;
  mobile_zoomed_url: string;
  mobile_zoomed_url_hi: string;
  bigger_zoomed_url: string;
  sizes: Size[];
  additional: DetailedProductAdditional[];
}

export interface DetailedProductAdditional {
  swatch_url: string;
  swatch_url_hi: string;
  image_url: string;
  image_url_hi: string;
  zoomed_url: string;
  zoomed_url_hi: string;
  bigger_zoomed_url: string;
}

export interface Size {
  name: string;
  id: number;
  stock_level: number;
}
