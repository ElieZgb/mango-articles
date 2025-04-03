/* eslint-disable jsx-a11y/alt-text */
"use client";
import React from "react";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
	Link,
} from "@react-pdf/renderer";
import { formatDate } from "@app/lib/dateFormat";
import type { ArticleType } from "@app/article/[slug]/page";

const PlaceholderProfile =
	"https://ik.imagekit.io/gdlddng3g/previews/profile-placeholder.png?updatedAt=1743637798587";

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		paddingHorizontal: 20,
		paddingVertical: 25,
		fontFamily: "Helvetica",
		color: "#1f1f1f",
	},
	title: {
		fontSize: 40,
		fontFamily: "Helvetica-Bold",
	},
	header: {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#1f1f1f",
		marginBottom: 20,
	},
	authorSection: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 7,
	},
	authorImage: {
		width: 35,
		aspectRatio: 1,
		borderRadius: 10000,
	},
	authorInfo: {
		display: "flex",
		flexDirection: "column",
		flex: 1,
	},
	block: {
		marginBottom: 10,
	},
	textBlock: {
		fontSize: 14,
	},
	separator: {
		height: 50,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 15,
	},
	separatorDot: {
		width: 10,
		aspectRatio: 1,
		backgroundColor: "#fbccac",
		borderRadius: 1000,
	},
	codeBlock: {
		backgroundColor: "#eee",
		borderRadius: 5,
		paddingHorizontal: 13,
		paddingVertical: 10,
		paddingBottom: 12,
		fontFamily: "Courier",
		borderWidth: 1,
		borderColor: "#aaa",
	},
});

export default function ArticlePDF({
	article,
	title,
}: {
	article: ArticleType;
	title: string;
}) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.title}>{title}</Text>
					<View style={styles.authorSection}>
						<Image
							src={article.author.image || PlaceholderProfile}
							style={styles.authorImage}
						/>
						<View style={styles.authorInfo}>
							<Text style={{ fontSize: 13 }}>
								{article.author.name}
							</Text>
							<Text style={{ fontSize: 11, fontWeight: 200 }}>
								{article.author.email}
							</Text>
						</View>
						<View
							style={{
								display: "flex",
								fontSize: 11,
								alignItems: "flex-end",
							}}
						>
							<Text>Updated {formatDate(article.updatedAt)}</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<Text>{article.likes_count}</Text>
								<Image
									src={
										"https://ik.imagekit.io/gdlddng3g/heart-icon.png"
									}
									style={{ width: 13, aspectRatio: 1 }}
								/>
							</View>
						</View>
					</View>
				</View>
				{article.blocks
					.filter(
						(b) =>
							b.id !=
							article.blocks.find((b) => b.type == "title")?.id
					)
					.map((block, index) => {
						if (block.type == "title") {
							return (
								<Text
									key={index}
									style={[{ fontSize: 20 }, styles.block]}
								>
									{block.textValue}
								</Text>
							);
						}

						if (block.type == "text") {
							return (
								<Text
									key={index}
									style={[styles.textBlock, styles.block]}
								>
									{block.textValue}
								</Text>
							);
						}

						if (block.type == "image" && block.imagePreview) {
							return (
								<View key={index} style={{ width: "100%" }}>
									<View
										style={[
											{
												aspectRatio: 16 / 9,
												width: "100%",
											},
											styles.block,
										]}
									>
										<Image src={block.imagePreview} />
									</View>
								</View>
							);
						}

						if (block.type == "separator") {
							return (
								<View
									key={index}
									style={[styles.separator, styles.block]}
								>
									<View style={styles.separatorDot} />
									<View style={styles.separatorDot} />
									<View style={styles.separatorDot} />
								</View>
							);
						}

						if (block.type == "videolink" && block.textValue) {
							return (
								<View
									key={index}
									style={[styles.textBlock, styles.block]}
								>
									<Text>
										Video:{" "}
										<Link src={block.textValue}>
											{block.textValue}
										</Link>
									</Text>
								</View>
							);
						}

						if (block.type == "codeblock" && block.textValue) {
							return (
								<View
									key={index}
									style={[
										styles.codeBlock,
										styles.block,
										styles.textBlock,
									]}
								>
									<Text style={{ lineHeight: 0.9 }}>
										{block.textValue}
									</Text>
								</View>
							);
						}
					})}
			</Page>
		</Document>
	);
}
