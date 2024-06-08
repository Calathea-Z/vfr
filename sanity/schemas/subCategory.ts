interface Field {
	name: string;
	title: string;
	type: string;
	description?: string;
	to?: { type: string }[];
}

interface SubCategorySchema {
	name: string;
	title: string;
	type: string;
	fields: Field[];
}

const subCategory: SubCategorySchema = {
	name: "subCategory",
	title: "Sub Category",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "parentCategory",
			title: "Parent Category",
			type: "reference",
			to: [{ type: "category" }],
		},
		{
			name: "hidden",
			title: "Hidden",
			type: "boolean",
			description: "Enable to hide this subcategory from the site",
		},
	],
};

export default subCategory;
