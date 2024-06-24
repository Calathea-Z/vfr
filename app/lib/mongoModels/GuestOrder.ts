import { ShippingInformation, OrderItem } from "@/types/types";
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

const shippingInformationSchema = new Schema<ShippingInformation>({
	firstNameShipping: { type: String, required: true },
	lastNameShipping: { type: String, required: true },
	company: { type: String },
	address: { type: String, required: true },
	city: { type: String, required: true },
	zipCode: { type: String, required: true },
	usState: { type: String, required: true },
	shippingContactEmail: { type: String, required: true },
});

const GuestOrderSchema = new Schema<GuestOrderDocument>(
	{
		orderItems: [orderItemSchema],
		shippingInformation: shippingInformationSchema,
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
