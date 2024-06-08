import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Category {
	title: string;
	subMenuImage: string;
	ordinal: number;
	imageUrl?: string;
}

const Header = ({}) => {
	const { state, dispatch } = useContext(Store);
	const { cart, isCartVisible } = state;
	const router = useRouter();
};
