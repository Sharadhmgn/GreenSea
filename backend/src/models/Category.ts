import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon?: string;
  color?: string;
  image?: string;
  _id: any;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String
    },
    color: {
      type: String
    },
    image: {
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
categorySchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON
categorySchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model<ICategory>('Category', categorySchema); 