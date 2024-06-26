import { fullLogo } from "@/public/assets";
//---Framework---//
import { redirect } from "next/navigation";
import { FC } from "react";
//---Packages---//
import { signIn, providerMap } from "@/nextAuth";
import { AuthError } from "next-auth";

const LoginPage: FC = () => {
	console.log(
		"Provider Names:",
		Object.values(providerMap).map((provider) => provider.name)
	);

	return (
		<div className="flex justify-center min-h-screen bg-gray-100">
			<div className="flex flex-col md:flex-row items-center justify-center w-full md:w-9/12 p-6 bg-white shadow-md rounded-lg h-svh md:h-[76vh] md:mt-4">
				<div className="flex flex-col items-center justify-center w-full md:w-1/2 md:p-6">
					<img src={fullLogo.src} alt="New Logo" className="mb-6" />
				</div>
				<div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
					<h2 className="text-base md:text-xl font-bold mb-3">
						Log In to Your Account
					</h2>
					{Object.values(providerMap).map((provider) => (
						<div key={provider.id} className="w-full mb-3">
							{provider.name === "Resend" ? (
								<>
									<div className="flex items-center my-3">
										<hr className="flex-grow border-t border-gray-300" />
										<span className="mx-2 text-gray-500">OR</span>
										<hr className="flex-grow border-t border-gray-300" />
									</div>
									<form
										action={async (formData) => {
											"use server";
											const email = formData.get("email");
											try {
												await signIn("resend", { email, redirectTo: "/" });
											} catch (error) {
												if (error instanceof AuthError) {
													return redirect("/info/auth-error-page");
												}
												throw error;
											}
										}}
										className="w-full mb-3 flex items-center"
									>
										<input
											type="email"
											name="email"
											placeholder="Enter your email"
											className="flex-grow p-2 border border-r-0 rounded-l-lg placeholder-sky-700 text-sky-900"
											required
										/>
										<button
											type="submit"
											className="flex items-center justify-center p-[.67rem] border-l-0 border rounded-r-lg bg-blue-400 hover:bg-blue-500 text-white"
										>
											<img
												src={`/assets/loginProviders/${provider.name}.svg`}
												alt={`${provider.name} icon`}
												className="w-5 h-5"
											/>
										</button>
									</form>
								</>
							) : (
								<form
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
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
