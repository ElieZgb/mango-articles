import { db } from "@lib/prisma";
import { NextResponse } from "@node_modules/next/server";
import { signUpSchema } from "@schema/signUpSchema";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
	const body: unknown = await request.json();
	const result = signUpSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json(
			{ message: "Invalid input", errors: result.error.format() },
			{ status: 400 }
		);
	}

	const { email, password, name, username } = result.data;

	try {
		const existedEmail = await db.user.findUnique({ where: { email } });
		if (existedEmail)
			return NextResponse.json("Email already taken.", { status: 202 });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await db.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				image: `${process.env.ImageKit_URL_ENDPOINT}/profile-placeholder`,
				username,
			},
		});

		return NextResponse.json(newUser, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return NextResponse.json(e, { status: 204 });
	}
}
