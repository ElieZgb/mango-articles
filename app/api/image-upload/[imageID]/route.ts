import ImageKit from "imagekit";

const imageKit = new ImageKit({
	publicKey: process.env.ImageKit_PUBLIC_KEY!,
	privateKey: process.env.ImageKit_PRIVATE_KEY!,
	urlEndpoint: process.env.ImageKit_URL_ENDPOINT!,
});

export async function GET(request: Request) {
	const url = new URL(request.url);
	const name = url.pathname.split("/").pop();

	try {
		// List all files and match by name (or part of it)
		const fileList = await imageKit.listFiles({
			name,
			limit: 1,
		});

		// Check if the file is found in the list
		if (fileList.length === 0) {
			return new Response(
				JSON.stringify({ success: false, error: "Image not found" }),
				{ status: 404 }
			);
		}

		const imageMetadata = fileList[0];

		return new Response(
			JSON.stringify({ success: true, data: imageMetadata }),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, error: error.message }),
			{ status: 500 }
		);
	}
}
