import type { Metadata } from "next";
import "@styles/globals.css";
import "@styles/animations.css";
import Header from "@components/ui/Header";
import Footer from "@components/ui/Footer";
import { getServerSession } from "@node_modules/next-auth";
import AuthenticationModal from "@components/ui/modals/AuthenticationModal";
import SessionProvider from "@providers/SessionProvider";
import TanstackProvider from "@providers/TanstackProvider";
import PopupModal from "@components/ui/modals/PopupModal";

export const metadata: Metadata = {
	title: "Mango Articles",
	description: "Medium-inspired platform",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang="en">
			<body>
				<TanstackProvider>
					<SessionProvider session={session}>
						<AuthenticationModal />
						<PopupModal />
						<Header />
						{children}
						<Footer />
					</SessionProvider>
				</TanstackProvider>
			</body>
		</html>
	);
}
