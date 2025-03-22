import { NextResponse } from "@node_modules/next/server";
import { db } from "@lib/prisma";

export async function GET() {
	try {
		const total_articles = await db.article.findMany({
			include: { author: true },
			orderBy: { updatedAt: "desc" },
		});

		const popular_articles = await db.article.findMany({
			include: { author: true },
			orderBy: { likes_count: "desc" },
			take: 3,
		});

		return NextResponse.json(
			{ total_articles, popular_articles },
			{ status: 200 }
		);
	} catch (e) {
		return NextResponse.json(`Error: ${e}`, { status: 500 });
	}
}
