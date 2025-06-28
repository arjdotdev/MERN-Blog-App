// Create a User Schema
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);

// Mongoose"Schema" vs "Document"

// export interface IUser extends Document {
// username: string;
// email: string;
// password: string;
// createdAt: Date;
// updatedAt: Date;
// }

// Extending "Document" adds Mongoose's document methods like .save(), .populate() and the built-in "\_id" property. A "Document" is an individual record in MongoDB collection.

// const UserSchema = new Schema<IUser>(
// {
// username: { type: String, required: true, unique: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// },
// { timestamps: true }
// );

// new Schema<IUser>(...) tells TypeScript that documents from this schema conform to our IUser interface. Inside the first object, you define each field i.e. "type:String" JS constructor that maps to MongoDB BSON type, "required:true" validation rule-must be present, "unique:true" creates a database index to enforce uniqueness.

// {timestamps:true} is a schema option that automatically adds and maintains "createdAt" and "updatedAt" Date fields on each document.

// export default mongoose.model<IUser>('User', UserSchema);
// mongoose.model<T>(name, schema) compiles the schema into a Model class. The generic <IUser> ensures that whenever you call, User.findById(), YS knows you will get an object matching IUser.
// The User is a model name under the hood Mongoose will look for a MongoDB collection called users(lowercased, plurralized)

// You Export this model so elsewhere in your code you can do things like:
// import User from './models/User';

// // Creating a new user document
// const u = new User({ username: 'alice', email: '…', password: '…' });
// await u.save();

// // Querying
// const found = await User.findOne({ email: 'alice@example.com' });

// Schema: the structure, types, and rules for your data.

// Document: actual records/objects that live in MongoDB and follow that schema.

// Model: the compiled class you use in your code to create, query, update, and delete those documents, with full TypeScript support via your IUser interface.

// <!-- Lets continue even though the Mongoose is confusing. Lets move on and see it might make sense at last -->
