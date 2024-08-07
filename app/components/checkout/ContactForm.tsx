"use client";
import { handleSignOut } from "../../actions/signOutAction";
//Framework
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
//Packages
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import { SessionUser } from "@/types/types";
import { useStateStorage } from "../../../utils/stateStorage";

interface ContactFormProps {
	setIsContactFormFilled: Dispatch<SetStateAction<boolean>>;
}

const ContactForm = ({ setIsContactFormFilled }: ContactFormProps) => {
	const { data: session } = useSession();
	const { enqueueSnackbar } = useSnackbar();
	const {
		control,
		formState: { errors },
		watch,
	} = useForm();
	const [isSubscribed, setIsSubscribed] = useState(false);
	const router = useRouter();
	const { dispatch, state } = useStateStorage();

	const handleLogout = async () => {
		try {
			await handleSignOut(); ///
			enqueueSnackbar("Successfully logged out", { variant: "success" });
			window.location.reload();
		} catch (error) {
			enqueueSnackbar("Failed to log out", { variant: "error" });
		}
	};

	const email = watch("email");

	useEffect(() => {
		if (session || email) {
			setIsContactFormFilled(true);
			dispatch({
				type: "SET_SHIPPING_INFO",
				payload: {
					...state.cart.shippingInformation,
					shippingContactEmail: session
						? (session.user as SessionUser).email
						: email,
				},
			});
		} else {
			setIsContactFormFilled(false);
		}
	}, [session, email, setIsContactFormFilled, dispatch]);

	return (
		<div className="flex flex-col items-start">
			<div className="flex justify-between w-full mb-2">
				<h2 className="text-2xl font-semibold">Contact</h2>
				{session ? (
					<Button
						onClick={handleLogout}
						className="text-xs text-red-600 hover:underline"
					>
						Log out
					</Button>
				) : (
					<Button
						onClick={() => router.push("/user/login")}
						className="text-xs text-blue-600 hover:underline"
					>
						Log in
					</Button>
				)}
			</div>
			{session ? (
				<span className="text-sm text-gray-600">
					{(session?.user as SessionUser)?.email}
				</span>
			) : (
				<form className="w-full">
					<Controller
						name="email"
						control={control}
						defaultValue=""
						rules={{
							required: "Email is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
								message: "Invalid email address",
							},
						}}
						render={({ field }) => (
							<TextField
								{...field}
								label="Email"
								fullWidth
								margin="dense"
								error={!!errors.email}
								helperText={errors.email ? String(errors.email.message) : ""}
							/>
						)}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={isSubscribed}
								onChange={(e) => setIsSubscribed(e.target.checked)}
							/>
						}
						label="Email me with news and offers"
					/>
				</form>
			)}
		</div>
	);
};

export default ContactForm;
