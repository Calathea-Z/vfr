import mongoose, { Schema, model, Model } from "mongoose";

interface SessionDocument extends mongoose.Document {
	sessionToken: string;
	userId: mongoose.Schema.Types.ObjectId;
	expires: Date;
}

const SessionSchema = new Schema<SessionDocument>(
	{
		sessionToken: {
			type: String,
			required: true,
			unique: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Session: Model<SessionDocument> =
	mongoose.models.Session || model<SessionDocument>("Session", SessionSchema);

export default Session;
