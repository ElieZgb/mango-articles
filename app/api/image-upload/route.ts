import { NextRequest, NextResponse } from "@node_modules/next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
	publicKey: process.env.ImageKit_PUBLIC_KEY!,
	privateKey: process.env.ImageKit_PRIVATE_KEY!,
	urlEndpoint: process.env.ImageKit_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
	try {
		const data = await req.formData();
		const file = data.get("file") as File;
		const fileName = data.get("fileName") as string;
		const folder = data.get("folder") as string;

		if (!file || !fileName) {
			return NextResponse.json(
				{ error: "File and fileName are required" },
				{ status: 400 }
			);
		}

		// Read the file as a buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResponse = await imagekit.upload({
			file: buffer,
			fileName,
			folder,
		});

		return NextResponse.json(uploadResponse, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
