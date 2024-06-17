import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	ReactNode,
	Dispatch,
	useMemo,
} from "react";
import { reducer } from "./reducer";
import Cookies from "universal-cookie";

export interface CartItem {
	_key: string;
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
}
export interface ShippingInformation {
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface UserInfo {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	salt: string;
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

export interface State {
	cart: {
		cartItems: CartItem[];
		shippingInformation: ShippingInformation;
		shippingWeight: number | null;
		shippingCost: number | null;
		orderSuccess: boolean;
	};
	userInfo: UserInfo | null;
	isCartVisible: boolean;
	isTopBannerVisible: boolean;
}

export type Action =
	| { type: "CART_ADD_ITEM"; payload: CartItem }
	| { type: "CART_REMOVE_ITEM"; payload: CartItem }
	| { type: "CART_CLEAR_ITEMS" }
	| { type: "USER_LOGIN"; payload: UserInfo }
	| { type: "USER_LOGOUT" }
	| { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingInformation }
	| { type: "UPDATE_SHIPPING_WEIGHT"; payload: number }
	| { type: "UPDATE_SHIPPING_COST"; payload: number }
	| { type: "UPDATE_PAYMENT_SUCCESS"; payload: boolean }
	| { type: "CLEAR_PAYMENT_STATUS" }
	| { type: "SHOW_CART" }
	| { type: "HIDE_CART" }
	| { type: "SHOW_TOP_BANNER" }
	| { type: "HIDE_TOP_BANNER" }
	| {
			type: "INITIALIZE_STATE";
			payload: { cartItems: CartItem[]; userInfo: UserInfo | null };
	  };

const defaultInitialState: State = {
	cart: {
		cartItems: [],
		shippingInformation: {
			address: "",
			city: "",
			postalCode: "",
			country: "",
		},
		shippingWeight: null,
		shippingCost: null,
		orderSuccess: false,
	},
	userInfo: null,
	isCartVisible: false,
	isTopBannerVisible: true,
};

export const stateStorage = createContext<{
	state: State;
	dispatch: Dispatch<Action>;
} | null>(null);

export function useStateStorage() {
	const context = useContext(stateStorage);
	if (!context) {
		throw new Error("useStateStorage must be used within a StoreProvider");
	}
	return context;
}

interface StoreProviderProps {
	children: ReactNode;
	initialCookies: {
		cartItems?: string;
		userInfo?: string;
	};
}

export function StoreProvider({
	children,
	initialCookies,
}: StoreProviderProps) {
	const [state, dispatch] = useReducer(reducer, defaultInitialState);

	useEffect(() => {
		if (initialCookies) {
			const cartItems = initialCookies.cartItems
				? JSON.parse(initialCookies.cartItems)
				: [];
			const userInfo = initialCookies.userInfo
				? JSON.parse(initialCookies.userInfo)
				: null;
			dispatch({ type: "INITIALIZE_STATE", payload: { cartItems, userInfo } });
		}
	}, [initialCookies]);

	const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	return (
		<stateStorage.Provider value={value}>{children}</stateStorage.Provider>
	);
}
