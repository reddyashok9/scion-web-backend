import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param user:ref => User._id
 * @param firstName:string
 * @param lastName:string
 */
export interface IProfile extends Document {
  user: IUser["_id"];
  firstName: string;
  lastName: string;
}

const profileSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
},{ timestamps: true });

const Profile: Model<IProfile> = model("Profile", profileSchema);

export default Profile;
