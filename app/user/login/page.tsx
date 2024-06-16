import { fullLogo } from "@/public/assets";
//---Framework---//
import { redirect } from "next/navigation";
//---Packages---//
import { signIn, providerMap } from "@/nextAuth";
import { AuthError } from "next-auth";

export default async function LoginPage() {
	return (
		<div className="flex justify-center min-h-screen bg-gray-100">
			<div className="flex flex-col md:flex-row items-center justify-center w-9/12 p-6 bg-white shadow-md rounded-lg h-[76vh] mt-4">
				<div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
					<img src={fullLogo.src} alt="New Logo" className="mb-6" />
				</div>
				<div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
					<h2 className="text-base md:text-xl font-bold mb-3">
						Log In to Your Account
					</h2>
					{Object.values(providerMap).map((provider) => (
						<form
							key={provider.id}
							action={async () => {
								"use server";
								try {
									await signIn(provider.id, { redirectTo: "/" });
								} catch (error) {
									if (error instanceof AuthError) {
										return redirect("/info/auth-error-page");
									}
									throw error;
								}
							}}
							className="w-full mb-3"
						>
							<button
								type="submit"
								className="w-full flex items-center justify-center py-1.5 px-1.5 mb-1.5 border rounded-lg bg-blue-400 hover:bg-blue-500 text-white"
							>
								<img
									src={`/assets/loginProviders/${provider.name}.svg`}
									alt={`${provider.name} icon`}
									className="w-5 h-5 mr-1.5"
								/>
								<span>Continue with {provider.name}</span>
							</button>
						</form>
					))}
				</div>
			</div>
		</div>
	);
}
