import {
  Document,
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface User extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  accessToken?: string;
}

interface RegisterUserData {
  name: string;
  username: string;
  password: string;
  email: string;
}

interface UserMethods {
  generateAccessToken(): string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

export interface UserModel extends Model<User, {}, UserMethods> {
  registerUser(
    userData: RegisterUserData
  ): Promise<HydratedDocument<User, UserMethods>>;
}

const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.static("registerUser", async function (userData: RegisterUserData) {
  const user = new User(userData);
  const registeredUser = await user.save();
  return registeredUser;
});

userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Connot generate access token");
  }
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

userSchema.methods.isPasswordCorrect = async function (password: string) {
  const matched = await bcrypt.compare(password, this.password);
  return matched;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User =
  (models.User as UserModel) || model<User, UserModel>("User", userSchema);
