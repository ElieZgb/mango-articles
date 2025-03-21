import type { User } from "@node_modules/next-auth";

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username?: string | null;
	}
}

declare module "next-auth" {
	interface Session {
		user: User & {
			id: string;
			username: string | null;
		};
	}
}
