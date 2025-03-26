import { db } from "@lib/prisma";
import { NextRequest, NextResponse } from "@node_modules/next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ articleId: string }> }
) {
	const { articleId } = await params;

	try {
		const article = await db.article.findUnique({
			where: {
				id: articleId,
			},
			include: {
				author: true,
			},
		});

		if (!article) {
			return NextResponse.json("No article found", { status: 404 });
		}

		return NextResponse.json(article, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return NextResponse.json("An error occured", { status: 500 });
	}

	return NextResponse.json(articleId, { status: 200 });
}

// update an article
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ articleId: string }> }
) {
	const { articleId } = await params;
	const { likes_count } = await request.json();

	try {
		const article = await db.article.update({
			where: {
				id: articleId,
			},
			data: {
				likes_count,
			},
		});

		return NextResponse.json(article, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return NextResponse.json("An error occured", { status: 500 });
	}
}
