import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Supplier Schema for TypeScript.
 * @param companyName: string
 * @param contactName: string
 * @param contactNumber: number
 * @param address: string
 * @param products: Array<string>
 * @param brand: string
 * @param bankName: string
 * @param bankBranch: string
 * @param bankAccountNumber: number
 * @param staffName: string
 * @param remarks: string
 * @param documents: Array<Doc>
 * @param createdBy:ref => User._id;
 */

export interface Doc {
  _id: string;
  docType: string;
  docUrl: string;
}

export interface ISupplier extends Document {
  companyName: string;
  contactName: string;
  contactNumber: number;
  address: string;
  products: Array<string>;
  brand: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: number;
  staffName: string;
  remarks: string;
  documents: Array<Doc>;
  createdBy: IUser["_id"];
}

const supplierSchema: Schema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  products: {
    type: [String],
  },
  brand: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankBranch: {
    type: String,
  },
  bankAccountNumber: {
    type: Number,
  },
  staffName: {
    type: String,
  },
  remarks: {
    type: String,
  },
  documents: {
    type: [{
      docType: String,
      docUrl: String,
    }]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},{ timestamps: true });

const Supplier: Model<ISupplier> = model("Supplier", supplierSchema);

export default Supplier;
