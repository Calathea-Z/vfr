import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { stateStorage } from "@/utils/stateStorage";

interface Category {
	title: string;
	subMenuImage: string;
	ordinal: number;
	imageUrl?: string;
}

const Header = ({}) => {
	const { state, dispatch } = useContext(stateStorage);
	const { cart, isCartVisible } = state;
	const router = useRouter();
};
