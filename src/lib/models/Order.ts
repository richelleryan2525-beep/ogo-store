import mongoose, { Schema, models, model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  image?: string;
  unitPrice: number;
  qty: number;
  size?: string;
  engravingText?: string;
}

export interface IStatusEvent {
  status: string;
  note?: string;
  at: Date;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  trackingToken: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: IOrderItem[];
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
  statusHistory: IStatusEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: String,
    unitPrice: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: String,
    engravingText: String
  },
  { _id: false }
);

const StatusEventSchema = new Schema<IStatusEvent>(
  {
    status: { type: String, required: true },
    note: String,
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    trackingToken: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountCode: String,
    deliveryMethod: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    deliveryState: String,
    deliveryCity: String,
    deliveryAddress: String,
    deliveryFee: { type: Number, default: 0 },
    deliveryEta: String,
    notes: String,
    total: { type: Number, required: true },
    status: { type: String, default: 'pending', index: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    carrier: String,
    waybillNumber: String,
    statusHistory: {
      type: [StatusEventSchema],
      default: () => [{ status: 'pending', note: 'Order received, awaiting confirmation.', at: new Date() }]
    }
  },
  { timestamps: true }
);

export default (models.Order as mongoose.Model<IOrder>) || model<IOrder>('Order', OrderSchema);
