import { CartItem, ShippingInformation, UserInfo } from "@/types/types";
import { reducer } from "./reducer";
import { setCartItems, getCartItems } from "../app/actions/cartActions";
import {
	createContext,
	useContext,
	useReducer,
	ReactNode,
	Dispatch,
	useMemo,
	useEffect,
} from "react";

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
	| { type: "SET_SHIPPING_INFO"; payload: ShippingInformation }
	| { type: "UPDATE_SHIPPING_WEIGHT"; payload: number }
	| { type: "UPDATE_SHIPPING_COST"; payload: number }
	| { type: "UPDATE_PAYMENT_SUCCESS"; payload: boolean }
	| { type: "CLEAR_PAYMENT_STATUS" }
	| { type: "SHOW_CART" }
	| { type: "HIDE_CART" }
	| { type: "SHOW_TOP_BANNER" }
	| { type: "HIDE_TOP_BANNER" }
	| { type: "SET_CART_ITEMS"; payload: CartItem[] }
	| {
			type: "INITIALIZE_STATE";
			payload: { cartItems: CartItem[]; userInfo: UserInfo | null };
	  };

const defaultInitialState: State = {
	cart: {
		cartItems: [],
		shippingInformation: {
			firstNameShipping: "",
			lastNameShipping: "",
			address: {
				street: "",
				city: "",
				state: "",
				zipCode: "",
			},
			shippingContactEmail: "",
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

export function StoreProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, defaultInitialState);

	useEffect(() => {
		async function fetchCartItems() {
			const storedCartItems = await getCartItems();
			dispatch({
				type: "INITIALIZE_STATE",
				payload: { cartItems: storedCartItems, userInfo: null },
			});
		}
		fetchCartItems();
	}, []);

	useEffect(() => {
		setCartItems(state.cart.cartItems);
	}, [state.cart.cartItems]);

	const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	return (
		<stateStorage.Provider value={value}>{children}</stateStorage.Provider>
	);
}
