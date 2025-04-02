import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  isAdmin: boolean;
  street?: string;
  apartment?: string;
  zip?: string;
  city?: string;
  country?: string;
  _id: any;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    street: {
      type: String,
      default: ''
    },
    apartment: {
      type: String,
      default: ''
    },
    zip: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Virtual for id
userSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema); 