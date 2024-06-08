import { Rule } from "@sanity/types";

interface Field {
	name: string;
	title: string;
	type: string;
	of?: { type: string }[];
	fields?: Field[];
	validation?: (rule: Rule) => any;
}

interface StockistSchema {
	name: string;
	title: string;
	type: string;
	fields: Field[];
}

const stockist: StockistSchema = {
	name: "stockist",
	title: "Stockists",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
		},
		{
			name: "keywords",
			title: "Keywords",
			type: "array",
			of: [{ type: "string" }],
		},
		{
			name: "description",
			title: "Description",
			type: "string",
		},
		{
			name: "address",
			title: "Address",
			type: "object",
			fields: [
				{ name: "street", type: "string", title: "Street" },
				{ name: "city", type: "string", title: "City" },
				{ name: "state", type: "string", title: "State" },
				{ name: "zipCode", type: "string", title: "Zip Code" },
			],
		},
		{
			name: "latitude",
			title: "Latitude",
			type: "number",
			validation: (Rule) => Rule.required().min(-90).max(90),
		},
		{
			name: "longitude",
			title: "Longitude",
			type: "number",
			validation: (Rule) => Rule.required().min(-180).max(180),
		},
		{
			name: "url",
			title: "Website URL",
			type: "url",
			validation: (Rule) =>
				Rule.uri({
					scheme: ["http", "https"],
				}),
		},
	],
};

export default stockist;
