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
	name: string;
	quantity: number;
	image?: string;
	price: number;
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
}

export interface ShippingInformation {
	firstNameShipping: string;
	lastNameShipping: string;
	company?: string;
	address: string;
	city: string;
	zipCode: string;
	usState: string;
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
	email: string;
	password: string;
	isAdmin: boolean;
	isWholesale: boolean;
	shippingContactEmail?: string;
	firstNameShipping?: string;
	lastNameShipping?: string;
	address?: string;
	city?: string;
	zipCode?: number;
	usState?: string;
}
