import mongoose, { Schema, models, model } from 'mongoose';

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'owner' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['owner', 'staff'], default: 'owner' }
  },
  { timestamps: true }
);

export default (models.Admin as mongoose.Model<IAdmin>) || model<IAdmin>('Admin', AdminSchema);
