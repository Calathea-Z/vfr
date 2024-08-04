"use server";
import { Client } from "square";
import { randomUUID } from "crypto";

// Ensure BigInt can be serialized to JSON
BigInt.prototype.toJSON = function () {
	return this.toString();
};

// Initialize Square client
const { paymentsApi } = new Client({
	accessToken: process.env.SQUARE_ACCESS_TOKEN,
	environment: "sandbox",
});

// Function to submit payment
export async function submitPayment(sourceId, amount) {
	try {
		// Ensure the amount is an integer before converting to BigInt
		const amountInteger = Math.round(amount);

		// Create payment
		const { result } = await paymentsApi.createPayment({
			idempotencyKey: randomUUID(),
			sourceId,
			amountMoney: {
				currency: "USD",
				amount: BigInt(amountInteger),
			},
		});
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
