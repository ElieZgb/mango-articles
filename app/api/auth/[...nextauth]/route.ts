import GoogleProvider from "@node_modules/next-auth/providers/google";
import GithubProvider from "@node_modules/next-auth/providers/github";
import FacebookProvider from "@node_modules/next-auth/providers/facebook";
import CredentialsProvider from "@node_modules/next-auth/providers/credentials";
import NextAuth, { getServerSession } from "@node_modules/next-auth";
import type { AuthOptions } from "@node_modules/next-auth";
import { PrismaAdapter } from "@node_modules/@next-auth/prisma-adapter";
import { db } from "@lib/prisma";
import bcrypt from "bcrypt";
import { Adapter } from "@node_modules/next-auth/adapters";

export const authOptions: AuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBNOOK_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				name: {
					label: "Full Name",
					type: "text",
					placeholder: "Full Name",
				},
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials.password) {
						throw new Error("Please enter email and password.");
					}

					const user = await db.user.findUnique({
						where: {
							email: credentials.email,
						},
					});

					if (!user || !user.password) {
						throw new Error("User not found.");
					}

					const passwordMatch = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!passwordMatch) {
						throw new Error("The password is incorrect.");
					}

					return user;
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (e) {
					return null;
				}
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}

			const user = await db.user.findUnique({
				where: {
					id: token.id,
				},
			});

			if (user) {
				session.user.image = user.image;
				session.user.name = user.name?.toLowerCase();
			}

			return session;
		},
		async jwt({ token, user }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				token.id = user.id;
				return token;
			}

			console.log("dbUser:", dbUser);

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		async signIn({ account, user }) {
			console.log("Account:", account);
			console.log("User:", user);

			if (user.email && account) {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email },
				});

				console.log("existingUser", existingUser);

				if (existingUser) {
					// Link the account to the existing user
					await db.account.upsert({
						where: {
							provider_providerAccountId: {
								provider: "google",
								providerAccountId: account.providerAccountId,
							},
						},
						update: {},
						create: {
							userId: existingUser.id,
							provider: "google",
							providerAccountId: account.providerAccountId,
							access_token: account.access_token, // If needed
							refresh_token: account.refresh_token, // If needed
							expires_at: account.expires_at, // If needed
						},
					});

					return true;
				}

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const newUser = await db.user.create({
					data: {
						email: user.email, // Store the email from the social login
						name: user.name, // Optionally store the name
						image: user.image, // Optionally store the profile image
						accounts: {
							create: {
								provider: "google",
								providerAccountId: account.providerAccountId,
								access_token: account.access_token,
								refresh_token: account.refresh_token,
								expires_at: account.expires_at,
							},
						},
					},
				});

				return true;
			}

			return false; // user.email is missing
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
