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
	emailVerified?: Date; // Added for Auth.js
	image?: string; // Added for Auth.js
	role: string;
}

// Check if the model is already registered before deleting it
if (mongoose.models.User) {
	mongoose.deleteModel("User");
}

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
			unique: true, // Ensure email is unique
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
		},
		salt: {
			type: String,
			required: true,
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
		emailVerified: {
			type: Date,
		},
		image: {
			type: String,
		},
		role: {
			type: String,
			required: true,
			default: "user", // Default role
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<UserDocument> =
	mongoose.models.User || model<UserDocument>("User", UserSchema);

export default User;
