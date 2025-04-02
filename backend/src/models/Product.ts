import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  richDescription?: string;
  image: string;
  images?: string[];
  price: number;
  category: mongoose.Types.ObjectId;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured: boolean;
  dateCreated: Date;
  _id: any;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    richDescription: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    images: [{
      type: String
    }],
    price: {
      type: Number,
      required: true,
      default: 0
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Virtual for simplified product details
productSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON
productSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model<IProduct>('Product', productSchema); 