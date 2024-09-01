import mongoose, { Schema, model, Model } from "mongoose";

const AddressSchema = new Schema({
	company: { type: String, default: null },
	street: { type: String, required: true },
	streetTwo: { type: String, default: null },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	phoneNumber: { type: String, default: null },
	isPrimary: { type: Boolean, default: false },
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	firstName: { type: String, default: null },
	lastName: { type: String, default: null },
	dateCreated: { type: Date, default: Date.now },
	dateUpdated: { type: Date, default: Date.now },
});

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
	addresses: (typeof AddressSchema)[];
	emailVerified?: Date; // Added for Auth.js
	image?: string; // Added for Auth.js
	role: string;
	lastLogin?: Date | null;
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
		addresses: [AddressSchema],
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
		lastLogin: {
			type: Date,
			default: null, // Set default value to null
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<UserDocument> =
	mongoose.models.User || model<UserDocument>("User", UserSchema);

export default User;
