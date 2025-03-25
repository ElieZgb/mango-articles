import { db } from "@lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const username = url.pathname.split("/").pop();

	if (!username) {
		return NextResponse.json(
			{ error: "Username is required" },
			{ status: 400 }
		);
	}

	try {
		const user = await db.user.findUnique({ where: { username } });

		if (user) {
			return NextResponse.json(user, {
				status: 200,
			});
		} else {
			return NextResponse.json("User not found", {
				status: 404,
			});
		}
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}
