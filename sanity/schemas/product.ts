import { Rule } from "@sanity/types";

interface Field {
	name: string;
	title: string;
	type: string;
	description?: string;
	options?: {
		hotspot?: boolean;
		maxLength?: number;
		source?: string;
		dateFormat?: string;
		timeFormat?: string;
		calendarTodayLabel?: string;
	};
	rows?: number;
	validation?: (rule: Rule) => any;
	to?: { type: string }[];
	of?: any[];
	initialValue?: () => string;
	readOnly?: boolean;
}

interface ProductSchema {
	name: string;
	title: string;
	type: string;
	fields: Field[];
}

const product: ProductSchema = {
	name: "product",
	title: "Product",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
		},
		{
			name: "price",
			title: "Price",
			type: "number",
		},
		{
			name: "photo",
			title: "Images",
			type: "array",
			of: [
				{
					type: "image",
					title: "Image",
					options: {
						hotspot: true,
					},
				},
			],
		},
		{
			name: "tagLine",
			title: "Tag Line",
			type: "string",
		},
		{
			name: "description",
			title: "Description",
			type: "text",
			rows: 5,
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
		},
		{
			name: "category",
			title: "Category",
			description: "Select the primary category for the product",
			type: "reference",
			to: [{ type: "category" }],
			validation: (Rule) => Rule.required(),
		},
		{
			name: "subCategory",
			title: "Sub Category",
			description: "Select a subcategory or leave blank if not applicable.",
			type: "reference",
			to: [{ type: "subCategory" }],
		},
		{
			name: "measurements",
			title: "Measurements",
			type: "string",
		},
		{
			name: "shippingWeight",
			title: "Weight (ounces)",
			type: "number",
		},
		{
			name: "countInStock",
			title: "Count In Stock",
			type: "number",
		},
		{
			name: "featuredProduct",
			title: "Featured Product",
			type: "boolean",
			description:
				"Toggle on if this is a featured product (**There must be 5 featured products total for the carousel to work!**)",
		},
		{
			name: "dateCreated",
			title: "Date Created",
			type: "datetime",
			options: {
				dateFormat: "YYYY-MM-DD",
				timeFormat: "HH:mm",
				calendarTodayLabel: "Today",
			},
			initialValue: () => new Date().toISOString(),
			readOnly: true,
		},
		{
			name: "amountSold",
			title: "Amount Sold",
			type: "number",
		},
	],
};

export default product;
