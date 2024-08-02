import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

interface OrderItem {
	productId: ObjectId;
	name: string;
	quantity: number;
	price: number;
}

interface Fees {
	subtotal: number;
	tax: number;
	shipping: number;
	total: number;
}

interface Address {
	street: string;
	city: string;
	state: string;
	zipCode: string;
}

interface Customer {
	name: string;
	email: string;
	address: Address;
}

interface OrderDocument extends Document {
	orderNumber: string;
	userId: ObjectId | string; // Allow string for guest users
	customer: Customer;
	items: OrderItem[];
	fees: Fees;
	paymentStatus: string; // e.g., "Pending", "Completed", "Failed"
	shippingStatus: string; // e.g., "Not Shipped", "Shipped"
	createdAt: Date;
	updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
	productId: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
	quantity: { type: Number, required: true },
	price: { type: Number, required: true },
});

const feesSchema = new Schema<Fees>({
	subtotal: { type: Number, required: true },
	tax: { type: Number, required: true },
	shipping: { type: Number, required: true },
	total: { type: Number, required: true },
});

const addressSchema = new Schema<Address>({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
});

const customerSchema = new Schema<Customer>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	address: { type: addressSchema, required: true },
});

const orderSchema = new Schema<OrderDocument>(
	{
		orderNumber: { type: String, required: true },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}, // Reference to the User
		customer: { type: customerSchema, required: true },
		items: { type: [orderItemSchema], required: true },
		fees: { type: feesSchema, required: true },
		paymentStatus: { type: String, required: true },
		shippingStatus: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Order: Model<OrderDocument> =
	mongoose.models.Order || mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;
