export interface Address {
	_id?: string;
	firstName: string;
	lastName: string;
	company?: string | null;
	street: string;
	streetTwo?: string | null;
	city: string;
	state: string;
	zipCode: string;
	phoneNumber?: string | null;
	isPrimary?: boolean;
}

export interface BioData {
	name: string;
	header: string;
	image: string | null;
	bio: string;
}

export interface CartItem {
	_key: string;
	productId: string;
	name: string;
	countInStock: number;
	slug: string;
	price: number;
	photo: {
		asset: {
			_ref: string;
		};
	}[];
	shippingWeight: number;
	quantity: number;
	category: {
		_ref: string;
		_type: string;
	};
}

export interface LeftSideButtonData {
	backgroundColor: { hex: string };
	textColor: { hex: string };
	link: string;
	text: string;
	enabled: boolean;
}

export interface OrderItem {
	productId: string;
	name: string;
	quantity: number;
	image?: string;
	price: number;
}

export interface OrderData {
	orderNumber: string;
	userId: string;
	customer: {
		name: string;
		email: string;
		company?: string;
		address: ShippingInformation["address"];
	};
	items: OrderItem[];
	fees: {
		subtotal: number;
		tax: number;
		shipping: number;
		total: number;
	};
	paymentStatus: string;
	shippingStatus: string;
	paymentType: string;
}

export interface Product {
	_id: string;
	productId: string;
	name: string;
	price: number;
	photo: {
		_type: string;
		asset: {
			_ref: string;
			_type: string;
		};
	}[];
	tagLine?: string;
	description?: string;
	slug: {
		_type: string;
		current: string;
	};
	category: {
		_ref: string;
		_type: string;
	};
	subCategory?: {
		_ref: string;
		_type: string;
	};
	measurements?: string;
	shippingWeight?: number;
	countInStock: number;
	featuredProduct?: boolean;
}

export interface SessionUser {
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role: string | null;
}

export interface ShippingInformation {
	firstNameShipping: string;
	lastNameShipping: string;
	company?: string;
	address: Address;
	shippingContactEmail: string;
}

export interface Stockist {
	name: string;
	description: string;
	addressLineOne: string;
	addressLineTwo: string;
	keywords: string[];
	latitude: number;
	longitude: number;
	url: string;
}

export interface TopBannerData {
	backgroundColor: { hex: string };
	textColor: { hex: string };
	link: string;
	text: string;
	enabled: boolean;
}

export interface UserInfo {
	id: string;
	role: string;
	emailVerified: Date | null;
	image?: string;
	name?: string;
	firstName: string;
	lastName: string;
	providerId: string;
	email: string;
	isAdmin: boolean;
	shippingContactEmail?: string;
	firstNameShipping?: string;
	lastNameShipping?: string;
	addresses: Address[];
}
