import { ShippingInformation, OrderItem, Address } from "@/types/types";
//---Packages---//
import mongoose, { Schema, Model } from "mongoose";

interface GuestOrderDocument extends mongoose.Document {
	orderItems: OrderItem[];
	shippingInformation: ShippingInformation;
	itemsPrice: number;
	parsedShippingCost: number;
	taxPrice: number;
	totalPrice: number;
}

mongoose.deleteModel("GuestOrder");

const orderItemSchema = new Schema<OrderItem>({
	name: { type: String, required: true },
	quantity: { type: Number, required: true },
	image: { type: String },
	price: { type: Number, required: true },
});

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

const GuestOrderSchema = new Schema<GuestOrderDocument>(
	{
		orderItems: [orderItemSchema],
		shippingInformation: { type: ShippingInformationSchema, required: true },
		itemsPrice: { type: Number, default: 0 },
		parsedShippingCost: { type: Number, default: 0 },
		taxPrice: { type: Number, default: 0 },
		totalPrice: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

const GuestOrder: Model<GuestOrderDocument> =
	mongoose.model<GuestOrderDocument>("GuestOrder", GuestOrderSchema);

export default GuestOrder;
