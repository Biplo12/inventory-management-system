interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Database {
  orders: Order[];
  products: Product[];
}

export { Order, Product, Database };
