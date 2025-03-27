import type { Article } from "@node_modules/.prisma/client";

export const articles: Article[] = [
	{
		id: "0ffc762f-40c0-4ac1-b3f7-ee16c92ec9c7",
		title: "The 5 paid subscriptions I actually use in 2025 as a Staff Software Engineer",
		content:
			"Cursor feels like a bargain for the level-up it provides me. I'm an average programmer with a strong preference for back-end projects, but Cursor lets me work across the full stack with the clarity and quality of a much better engineer.",
		likes_count: 138,
		published: true,
		authorId: "cf040a29-893d-4cbd-bbf7-cf220de970c3",
		createdAt: new Date(),
		updatedAt: new Date("2024-12-08"),
		header_image: "https://picsum.photos/800/650",
	},
	{
		id: "4edf889f-6470-440e-a8e5-04f359688ebe",
		title: "UI Design Trends In 2025",
		content:
			"Designing for 2025 isn't just about hopping on the latest trends — it's about creating experiences that truly matters the most. As the digital world is changing faster than ever, UI design is shifting to meet new challenges and opportunities. What's your take — will simplicity, bold visuals, immersive experiences or designs that truly connect with users define the best designs of this year?",
		likes_count: 1024,
		published: true,
		authorId: "9a1df41c-f276-4914-8348-0c32f961feb7",
		createdAt: new Date(),
		updatedAt: new Date(),
		header_image: "https://picsum.photos/800/600",
	},
	{
		id: "0ffc762f-40c0-4ac1-b3f7-ee16c92ec9c7",
		title: "UI Design Trends In 2025",
		content:
			"Designing for 2025 isn't just about hopping on the latest trends — it's about creating experiences that truly matters the most. As the digital world is changing faster than ever, UI design is shifting to meet new challenges and opportunities. What's your take — will simplicity, bold visuals, immersive experiences or designs that truly connect with users define the best designs of this year?",
		likes_count: 1024,
		published: true,
		authorId: "95f8cfd8-ff9e-4efc-9ad2-11f97f9b3adc",
		createdAt: new Date(),
		updatedAt: new Date(),
		header_image: "https://picsum.photos/800/800",
	},
];
