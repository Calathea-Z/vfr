"use client";
import { useEffect } from "react";
import { useStateStorage } from "@/utils/stateStorage";

const useNoScroll = (isMobile: boolean) => {
    const { state } = useStateStorage();
    const isCartVisible = state.isCartVisible;

    useEffect(() => {
        // Apply no-scroll only if the cart is visible and it's a mobile device
        if (isCartVisible && isMobile) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        // Cleanup function to ensure no-scroll is removed when not needed
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isCartVisible, isMobile]); // React to changes in isCartVisible and isMobile
};

export default useNoScroll;
