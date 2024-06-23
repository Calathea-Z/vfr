import mongoose, { Schema, model, Model } from "mongoose";

interface AccountDocument extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	type: string;
	provider: string;
	providerAccountId: string;
	refresh_token?: string;
	access_token?: string;
	expires_at?: number;
	token_type?: string;
	scope?: string;
	id_token?: string;
	session_state?: string;
}

const AccountSchema = new Schema<AccountDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		type: { type: String, required: true },
		provider: { type: String, required: true },
		providerAccountId: { type: String, required: true },
		refresh_token: { type: String },
		access_token: { type: String },
		expires_at: { type: Number },
		token_type: { type: String },
		scope: { type: String },
		id_token: { type: String },
		session_state: { type: String },
	},
	{ timestamps: true }
);

const Account: Model<AccountDocument> =
	mongoose.models.Account || model<AccountDocument>("Account", AccountSchema);

export default Account;
