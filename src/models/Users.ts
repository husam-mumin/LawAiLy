/**
 * # User 
 * 1. email
 * 2. password
 * 3. gender
 * 4. firstName
 * 5. lastName 
 * 6. isAdmin
 * 7. AvatarURL 
 * 8. ID 
 * 9.CreateAt
 * 10. isBaned 
 * 
 */
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string,
  password: string, 
  gender: string,
  firstName?: string,
  lastName?: string,
  isAdmin?: boolean,
  AvatarURL?: string,
  DocumentID?: string,
  isBaned?: boolean
}

export type userType = {
  email: string,
  password: string, 
  gender: string,
  firstName?: string,
  lastName?: string,
  isAdmin?: boolean,
  AvatarURL?: string,
  DocumentID?: string,
  isBaned?: boolean
}

const UserSchema: Schema = new mongoose.Schema<IUser>({
  email: {type: 'string', required: true, unique: true},
  password: {type: 'string', required: true},
  gender: {type: 'string', required: true},
  firstName: {type: 'string'},
  lastName: {type: 'string'},
  isAdmin: {type: "Boolean", required: true, default: false},
  AvatarURL: {type: "string" },
  DocumentID: { type: Schema.Types.ObjectId, ref: "Document" },
  isBaned: { type: 'boolean', default: false }
})

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User;