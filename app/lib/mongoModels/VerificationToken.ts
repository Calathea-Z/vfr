import mongoose, { Schema, model, Model } from "mongoose";

interface VerificationTokenDocument extends mongoose.Document {
	identifier: string;
	token: string;
	expires: Date;
}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>(
	{
		identifier: { type: String, required: true },
		token: { type: String, required: true },
		expires: { type: Date, required: true },
	},
	{ timestamps: true }
);

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

const VerificationToken: Model<VerificationTokenDocument> =
	mongoose.models.VerificationToken ||
	model<VerificationTokenDocument>(
		"VerificationToken",
		VerificationTokenSchema
	);

export default VerificationToken;
