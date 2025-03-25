import { db } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		const existingUser = await db.user.findUnique({ where: { email } });

		if (!existingUser) {
			return NextResponse.json(
				{ error: "User does not exist." },
				{ status: 404 }
			);
		}

		return NextResponse.json(existingUser, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const { email, data } = await req.json(); // Extract email and updated data

		if (!email || !data) {
			return NextResponse.json(
				{ error: "Email and update data are required" },
				{ status: 400 }
			);
		}

		const existingUser = await db.user.findUnique({ where: { email } });

		if (!existingUser) {
			return NextResponse.json(
				{ error: "User does not exist." },
				{ status: 404 }
			);
		}

		const updatedUser = await db.user.update({
			where: { email },
			data, // Data contains the fields to update
		});

		return NextResponse.json(updatedUser, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
