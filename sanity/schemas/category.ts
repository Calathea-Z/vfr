interface Field {
	name: string;
	title: string;
	type: string;
	description?: string;
	options?: {
		hotspot: boolean;
	};
}

interface CategorySchema {
	name: string;
	title: string;
	type: string;
	fields: Field[];
}

const category: CategorySchema = {
	name: "category",
	title: "Category",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "description",
			title: "Description",
			type: "text",
		},
		{
			name: "hidden",
			title: "Hidden",
			type: "boolean",
			description: "Enable to hide this category from the site",
		},
		{
			name: "subMenuImage",
			title: "Sub-Menu Image",
			type: "image",
			options: {
				hotspot: true,
			},
			description: "Image used for the sub-menu display",
		},
		{
			name: "ordinal",
			title: "Ordinal",
			type: "number",
			description: "Set the display order of the category list in the subMenu",
		},
	],
};
export default category;
