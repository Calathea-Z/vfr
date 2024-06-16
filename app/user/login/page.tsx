import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/nextAuth";
import { AuthError } from "next-auth";

export default async function LoginPage() {
	return (
		<div className="flex flex-col gap-2">
			{Object.values(providerMap).map((provider) => (
				<form
					action={async () => {
						"use server";
						try {
							await signIn(provider.id);
						} catch (error) {
							// Signin can fail for a number of reasons, such as the user
							// not existing, or the user not having the correct role.
							// In some cases, you may want to redirect to a custom error
							if (error instanceof AuthError) {
								return redirect("/info/auth-error-page");
							}

							// Otherwise if a redirects happens NextJS can handle it
							// so you can just re-thrown the error and let NextJS handle it.
							// Docs:
							// https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
							throw error;
						}
					}}
				>
					<button type="submit">
						<span>Sign in with {provider.name}</span>
					</button>
				</form>
			))}
		</div>
	);
}
