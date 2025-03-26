import { NextResponse } from "@node_modules/next/server";
import { db } from "@lib/prisma";

export async function GET() {
	try {
		const total_articles = await db.article.findMany({
			include: { author: true },
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
		return NextResponse.json(`Error: ${e}`, { status: 500 });
	}
}

// fetchArticlesByAuthorId
export async function POST(req: Request) {
	try {
		const { authorId } = await req.json();

		const articles = await db.article.findMany({
			where: { authorId },
			orderBy: { updatedAt: "desc" },
		});

		return NextResponse.json(articles, { status: 200 });
	} catch (e) {
		return NextResponse.json(`Error: ${e}`, { status: 500 });
	}
}
