//NOT CURRENTLY IN USE BUT MAY USE LATER!//

// interface Field {
// 	name: string;
// 	title: string;
// 	type: string;
// 	options?: {
// 		hotspot?: boolean;
// 		maxLength?: number;
// 		source?: string;
// 	};
// 	of?: Field[];
// }

// interface WholeSaleProductSchema {
// 	name: string;
// 	title: string;
// 	type: string;
// 	fields: Field[];
// }

// const wholeSaleProduct: WholeSaleProductSchema = {
// 	name: "wholeSaleProduct",
// 	title: "Wholesale",
// 	type: "document",
// 	fields: [
// 		{
// 			name: "name",
// 			title: "Name",
// 			type: "string",
// 		},
// 		{
// 			name: "price",
// 			title: "Price",
// 			type: "number",
// 		},
// 		{
// 			name: "photo",
// 			title: "Images",
// 			type: "array",
// 			of: [
// 				{
// 					name: "additionalImage",
// 					type: "image",
// 					title: "Additional Image",
// 					options: {
// 						hotspot: true,
// 					},
// 				},
// 			],
// 		},
// 		{
// 			name: "description",
// 			title: "Description",
// 			type: "string",
// 		},
// 		{
// 			name: "slug",
// 			title: "Slug",
// 			type: "slug",
// 			options: {
// 				source: "name",
// 				maxLength: 96,
// 			},
// 		},
// 		{
// 			name: "color",
// 			title: "Available Colors",
// 			type: "array",
// 			of: [
// 				{
// 					name: "color",
// 					type: "string",
// 					title: "Color",
// 				},
// 			],
// 		},
// 		{
// 			name: "bulkQuantity",
// 			title: "Bulk Quantity",
// 			type: "number",
// 		},
// 		{
// 			name: "measurements",
// 			title: "Measurements",
// 			type: "string",
// 		},
// 		{
// 			name: "shippingWeight",
// 			title: "Weight (ounces)",
// 			type: "number",
// 		},
// 	],
// };

// export default wholeSaleProduct;
