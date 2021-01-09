import { Document, Model, model, Schema } from "mongoose";
import { IAccount } from "./Account";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 * @param role: string
 * @param account: string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  role: string;
  account: IAccount["_id"];
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
}, { timestamps: true });

const User: Model<IUser> = model("User", userSchema);

export default User;
