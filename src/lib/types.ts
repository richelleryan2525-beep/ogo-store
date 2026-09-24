export interface ProductDTO {
  _id: string;
  name: string;
  slug: string;
  category: string;
  metal: string;
  stone: string;
  occasions: string[];
  price: number;
  description: string;
  details: string[];
  images: string[];
  stock: number;
  badge?: string;
  featured: boolean;
  active: boolean;
  sizeOptionLabel?: string;
  sizeOptions: string[];
  sizePriceAdjust: Record<string, number>;
  engraving?: {
    enabled: boolean;
    label?: string;
    maxLength?: number;
    extraPrice?: number;
    required?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  productId: string;
  name: string;
  image?: string;
  unitPrice: number;
  qty: number;
  size?: string;
  engravingText?: string;
}

export interface OrderDTO {
  _id: string;
  orderNumber: string;
  trackingToken: string;
  customer: { name: string; phone: string; email?: string };
  items: OrderItemDTO[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryState?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  deliveryFee: number;
  deliveryEta?: string;
  notes?: string;
  total: number;
  status: string;
  paymentStatus: 'unpaid' | 'paid';
  carrier?: string;
  waybillNumber?: string;
  statusHistory: { status: string; note?: string; at: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDTO {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
