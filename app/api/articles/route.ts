import { NextResponse } from "@node_modules/next/server";
import { db } from "@app/lib/prisma";
import type { ArticleBlock } from "@node_modules/.prisma/client";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const authorId = url.searchParams.get("authorId");
		const authorEmail = url.searchParams.get("email");

		if (authorId) {
			// Fetch articles by specific author id
			const articles = await db.article.findMany({
				where: { authorId },
				orderBy: { updatedAt: "desc" },
				include: { blocks: true, author: true },
			});
			return NextResponse.json(articles, { status: 200 });
		}

		if (authorId) {
			// Fetch articles by specific author email
			const articles = await db.article.findMany({
				where: { author: { email: authorEmail } },
				orderBy: { updatedAt: "desc" },
				include: { blocks: true, author: true },
			});
			return NextResponse.json(articles, { status: 200 });
		}

		const total_articles = await db.article.findMany({
			include: { author: true, blocks: true },
			orderBy: { updatedAt: "desc" },
		});

		const popular_articles = total_articles
			.sort((articleA, articleB) => {
				return articleB.likes_count - articleA.likes_count;
			})
			.slice(0, 3);

		return NextResponse.json(
			{ total_articles, popular_articles },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(`Error: ${e}`, { status: 500 });
	}
}

// create a new article
export async function POST(request: Request) {
	const { authorId, blocks } = await request.json();

	try {
		const article = await db.article.create({
			data: {
				author: {
					connect: { id: authorId },
				},
				blocks: {
					create: blocks.map((block: Partial<ArticleBlock>) => {
						return {
							...block,
							type: block.type || "text",
							textValue: block.textValue || "",
							createdAt: new Date(),
							updatedAt: new Date(),
						};
					}),
				},
				likes_count: 0,
				published: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(article, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		console.log(e);
		return NextResponse.json(e, { status: 500 });
	}
}
