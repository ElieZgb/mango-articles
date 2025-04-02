import { db } from "@app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const userEmail = url.searchParams.get("email");

		if (userEmail) {
			const existingUser = await db.user.findUnique({
				where: { email: userEmail },
			});
			if (!existingUser) {
				return NextResponse.json(
					{ error: "User does not exist." },
					{ status: 404 }
				);
			} else {
				return NextResponse.json(existingUser, { status: 200 });
			}
		}

		const users = await db.user.findMany({
			select: { name: true, id: true, username: true, image: true },
		});
		return NextResponse.json(users, { status: 200 });
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

// delete a user
export async function DELETE(request: NextRequest) {
	try {
		const url = new URL(request.url);
		const userEmail = url.searchParams.get("email");

		if (userEmail) {
			const user = await db.user.delete({
				where: { email: userEmail },
			});

			return NextResponse.json(user, { status: 200 });
		} else {
			return NextResponse.json(
				{ error: "An email is required" },
				{ status: 404 }
			);
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
