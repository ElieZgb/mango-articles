import { db } from "@lib/prisma";
import type { User } from "@node_modules/@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const userID = url.pathname.split("/").pop();

	if (!userID) {
		return NextResponse.json(
			{ error: "User ID is required" },
			{ status: 400 }
		);
	}

	try {
		const user = await db.user.findUnique({ where: { id: userID } });

		if (user) {
			const result: Partial<User> = {
				name: user?.name,
				email: user?.email,
				image: user?.image,
			};

			return NextResponse.json(result, {
				status: 200,
			});
		} else {
			return NextResponse.json("User not found", {
				status: 404,
			});
		}
	} catch (e) {
		return NextResponse.json(e);
	}
}
