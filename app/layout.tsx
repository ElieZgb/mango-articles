import type { Metadata } from "next";
import "@styles/globals.css";
import "@styles/animations.css";
import Header from "@components/ui/Header";
import Footer from "@components/ui/Footer";
import AuthenticationModal from "@components/ui/modals/AuthenticationModal";

export const metadata: Metadata = {
	title: "Mango Articles",
	description: "Medium-inspired platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AuthenticationModal />
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
