import mongoose, { Schema, models, model } from 'mongoose';

export interface ICustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    email: String,
    addresses: { type: [String], default: [] },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    notes: String
  },
  { timestamps: true }
);

export default (models.Customer as mongoose.Model<ICustomer>) || model<ICustomer>('Customer', CustomerSchema);
