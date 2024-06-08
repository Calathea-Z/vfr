import mongoose, { Schema, model, Model } from "mongoose";

interface UserDocument extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	salt: string;
	isAdmin: boolean;
	isWholesale: boolean;
	shippingContactEmail?: string;
	firstNameShipping?: string;
	lastNameShipping?: string;
	address?: string;
	city?: string;
	zipCode?: number;
	usState?: string;
}

mongoose.deleteModel("User");

const UserSchema = new Schema<UserDocument>(
	{
		firstName: {
			type: String,
			required: [true, "Please provide a first name."],
		},
		lastName: {
			type: String,
			required: [true, "Please provide a last name"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
		},
		salt: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		isWholesale: {
			type: Boolean,
			required: true,
			default: false,
		},
		shippingContactEmail: {
			type: String,
		},
		firstNameShipping: {
			type: String,
		},
		lastNameShipping: {
			type: String,
		},
		address: {
			type: String,
		},
		city: {
			type: String,
		},
		zipCode: {
			type: Number,
		},
		usState: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<UserDocument> =
	mongoose.models.User || model<UserDocument>("User", UserSchema);

export default User;
