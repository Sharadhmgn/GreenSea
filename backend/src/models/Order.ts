import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IOrderItem extends Document {
  quantity: number;
  product: mongoose.Types.ObjectId | IProduct;
  _id: any;
}

export interface IOrder extends Document {
  orderItems: IOrderItem[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice: number;
  user: mongoose.Types.ObjectId;
  dateOrdered: Date;
  _id: any;
}

const orderItemSchema = new Schema<IOrderItem>({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const orderSchema = new Schema<IOrder>(
  {
    orderItems: [orderItemSchema],
    shippingAddress1: {
      type: String,
      required: true
    },
    shippingAddress2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'Pending'
    },
    totalPrice: {
      type: Number
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateOrdered: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Virtual for id
orderSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON
orderSchema.set('toJSON', {
  virtuals: true
});

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
export default mongoose.model<IOrder>('Order', orderSchema); 