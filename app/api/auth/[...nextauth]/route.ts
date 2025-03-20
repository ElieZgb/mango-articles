import GoogleProvider from "@node_modules/next-auth/providers/google";
import GithubProvider from "@node_modules/next-auth/providers/github";
import NextAuth from "@node_modules/next-auth";
import type { AuthOptions } from "@node_modules/next-auth";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
