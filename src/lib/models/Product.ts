import mongoose, { Schema, models, model } from 'mongoose';

export interface IEngraving {
  enabled: boolean;
  label?: string;
  maxLength?: number;
  extraPrice?: number;
  required?: boolean;
}

export interface IProduct {
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
  engraving?: IEngraving;
  createdAt: Date;
  updatedAt: Date;
}

const EngravingSchema = new Schema<IEngraving>(
  {
    enabled: { type: Boolean, default: false },
    label: String,
    maxLength: { type: Number, default: 12 },
    extraPrice: { type: Number, default: 0 },
    required: { type: Boolean, default: false }
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    metal: { type: String, required: true },
    stone: { type: String, default: 'None' },
    occasions: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    details: { type: [String], default: [] },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    badge: String,
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sizeOptionLabel: String,
    sizeOptions: { type: [String], default: [] },
    sizePriceAdjust: { type: Schema.Types.Mixed, default: {} },
    engraving: { type: EngravingSchema, default: () => ({ enabled: false }) }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text' });

export default (models.Product as mongoose.Model<IProduct>) || model<IProduct>('Product', ProductSchema);
