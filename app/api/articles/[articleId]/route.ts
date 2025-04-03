import { db } from "@app/lib/prisma";
import { ArticleBlock } from "@node_modules/.prisma/client";
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
				blocks: true,
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
}

// update an article
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ articleId: string }> }
) {
	const { articleId } = await params;

	const url = new URL(request.url);
	const bodyParam = url.searchParams.get("body");

	if (bodyParam) {
		const { blocks } = await request.json();
		await db.article.update({
			where: {
				id: articleId,
			},
			data: {
				blocks: {
					deleteMany: {},
				},
			},
		});

		const article = await db.article.update({
			where: {
				id: articleId,
			},
			data: {
				blocks: {
					create: blocks.map((block: ArticleBlock) => {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { articleId, id, ...res } = block;

						return {
							...res,
							createdAt: new Date(),
							updatedAt: new Date(),
						};
					}),
				},
			},
		});

		return NextResponse.json(article, { status: 200 });
	}

	const dataObject = await request.json();

	try {
		const article = await db.article.update({
			where: {
				id: articleId,
			},
			data: {
				...dataObject,
			},
		});

		return NextResponse.json(article, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		console.log(e);
		return NextResponse.json("An error occured", { status: 500 });
	}
}
