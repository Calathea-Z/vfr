import { OrderItem, ShippingInformation, Address } from "@/types/types";
//---Packages---//
import mongoose, { Schema, model, Document, Model } from "mongoose";

interface UserOrderDocument extends Document {
	user: Schema.Types.ObjectId;
	orderItems: OrderItem[];
	shippingInformation: ShippingInformation;
	itemsPrice: number;
	parsedShippingCost: number;
	taxPrice: number;
	totalPrice: number;
	emailVerified?: Date; // Added for Auth.js
	image?: string; // Added for Auth.js
}

// Delete the model if it already exists to prevent OverwriteModelError
if (mongoose.models.UserOrder) {
	delete mongoose.models.UserOrder;
}

const AddressSchema = new Schema<Address>({
	company: { type: String, default: null },
	street: { type: String, required: true },
	streetTwo: { type: String, default: null },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	phoneNumber: { type: String, default: null },
});

const ShippingInformationSchema = new Schema<ShippingInformation>({
	firstNameShipping: { type: String, required: true },
	lastNameShipping: { type: String, required: true },
	company: { type: String },
	address: { type: AddressSchema, required: true },
	shippingContactEmail: { type: String, required: true },
});

const UserOrderSchema = new Schema<UserOrderDocument>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [
			{
				name: { type: String, required: true },
				quantity: { type: Number, required: true },
				image: { type: String },
				price: { type: Number, required: true },
			},
		],
		shippingInformation: { type: ShippingInformationSchema, required: true },
		itemsPrice: { type: Number, default: 0 },
		parsedShippingCost: { type: Number, default: 0 },
		taxPrice: { type: Number, default: 0 },
		totalPrice: { type: Number, default: 0 },
		emailVerified: { type: Date }, // Added for Auth.js
		image: { type: String }, // Added for Auth.js
	},
	{
		timestamps: true,
	}
);

const UserOrder: Model<UserOrderDocument> = model<UserOrderDocument>(
	"UserOrder",
	UserOrderSchema
);

export default UserOrder;
