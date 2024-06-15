"use client";
import { Container, Box, Link, List, Card, styled } from "@mui/material";

const FullWidthCard = styled(Card)({
	height: "85vh",
	overflowY: "auto",
	borderRadius: 16,
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
	padding: 20,
});

const TermsOfService = () => {
	return (
		<Container maxWidth="xl" className="p-5">
			<FullWidthCard>
				<Box p={3}>
					<h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
					<p className="text-lg mb-4">Last updated: June 15, 2024</p>
					<Box my={2}>
						<p className="text-base mb-4">
							By accessing or using our service, you agree to be bound by these
							Terms of Service.
						</p>
					</Box>
					<h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
					<p className="text-base mb-4">
						We reserve the right to update these terms at any time. We will
						notify you of any changes by posting the new terms on our website.
					</p>
					<h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
					<List>
						<li className="text-base mb-4">
							You must not use the service for any illegal or unauthorized
							purpose.
						</li>
						<li className="text-base mb-4">
							You must not attempt to hack or disrupt the service.
						</li>
					</List>
					<h2 className="text-2xl font-semibold mb-2">Account Terms</h2>
					<List>
						<li className="text-base mb-4">
							You must provide accurate information when creating an account.
						</li>
						<li className="text-base mb-4">
							You are responsible for maintaining the security of your account.
						</li>
					</List>
					<h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
					<p className="text-base mb-4">
						Please refer to our{" "}
						<Link href="/info/privacy-policy">Privacy Policy</Link> for
						information on how we collect, use, and protect your data.
					</p>
					<h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
					<p className="text-base mb-4">
						All content provided on the service is owned by us or our licensors
						and is protected by intellectual property laws.
					</p>
					<h2 className="text-2xl font-semibold mb-2">
						Disclaimers and Limitation of Liability
					</h2>
					<List>
						<li className="text-base mb-4">
							The service is provided "as is" without warranties of any kind.
						</li>
						<li className="text-base mb-4">
							We are not liable for any damages arising from the use of the
							service.
						</li>
					</List>
					<h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
					<p className="text-base mb-4">
						These terms are governed by the laws of North Carolina, USA.
					</p>
					<h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
					<p className="text-base mb-4">
						If you have any questions about these terms, please contact us at
						vineandfrond@gmail.com.
					</p>
				</Box>
			</FullWidthCard>
		</Container>
	);
};

export default TermsOfService;
