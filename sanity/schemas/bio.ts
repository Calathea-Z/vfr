interface Field {
	name: string;
	title: string;
	type: string;
	description?: string;
	options?: {
		hotspot: boolean;
	};
}

interface BioSchema {
	name: string;
	title: string;
	type: string;
	fields: Field[];
}

const bio: BioSchema = {
	name: "bio",
	title: "Bio",
	type: "document",
	fields: [
		{
			name: "header",
			title: "Header",
			type: "string",
			description: "A short header text for the bio section",
		},
		{
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "bio",
			title: "Bio",
			type: "text",
		},
	],
};
export default bio;
