"use client";
import { formatDate } from "@lib/dateFormat";
import { Share, PenTool } from "lucide-react";
import PDFIcon from "@public/assets/icons/pdf-icon.svg";
import Image from "@node_modules/next/image";
import Link from "@node_modules/next/link";
import React, { useEffect, useRef, useState } from "react";
import type { User } from "@node_modules/.prisma/client";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";
import { useSession } from "@node_modules/next-auth/react";
import LikeAnimation from "@public/assets/lottie/like-animation.json";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

interface ArticleHeaderProps {
	title: string;
	author: User;
	updatedAt: Date;
	likes: number;
	articleID: string;
}

export default function ArticleHeader({
	title,
	author,
	updatedAt,
	likes,
	articleID,
}: ArticleHeaderProps) {
	const { data: session, status: sessionStatus } = useSession();
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [liked, setLiked] = useState<boolean>(false);
	const [likesCount, setLikesCount] = useState<number>(likes);
	const [likeTimeout, setLikeTimeout] = useState<NodeJS.Timeout | null>(null);
	const [clicked, setclicked] = useState<boolean>(false);

	useEffect(() => {
		if (lottieRef.current) {
			lottieRef.current.stop();
		}
	}, []);

	useEffect(() => {
		if (!clicked) return;

		if (likeTimeout) {
			clearTimeout(likeTimeout);
		}

		const timer = setTimeout(async () => {
			await fetch(`/api/articles/${articleID}`, {
				method: "PUT",
				body: JSON.stringify({
					likes_count: likesCount,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		}, 2000);

		setLikeTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [likesCount]);

	return (
		<div className="border-b-[1px] border-black pb-5 mb-5">
			<h1 className="text-4xl font-display-black mb-5">{title}</h1>
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="w-11 h-11 bg-mango rounded-full relative">
						<Image
							src={
								author.image ? author.image : ProfilePlaceholder
							}
							alt="Profile picture"
							fill={true}
							className="object-contain rounded-full"
						/>
					</div>
					<div className="flex flex-col">
						<div className="-mb-1">
							<Link href={``}>{author.name}</Link>
						</div>
						{updatedAt && (
							<div className="text-sm text-gray-700">
								Updated {formatDate(updatedAt)}
							</div>
						)}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-[2px] relative right-[-5px]">
						<div className="relative top-[2px]">{likesCount}</div>
						<div className="w-8 h-8 relative overflow-hidden rounded-full cursor-pointer">
							<Lottie
								lottieRef={lottieRef}
								animationData={LikeAnimation}
								className="w-21 h-21 absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
								loop={false}
								onClick={() => {
									if (liked) {
										lottieRef.current?.stop();
										setLiked(false);
										setLikesCount((prev) => prev - 1);
									} else {
										lottieRef.current?.play();
										setLiked(true);
										setLikesCount((prev) => prev + 1);
									}

									setclicked(true);
								}}
							/>
						</div>
					</div>
					<Share size={20} className="cursor-pointer relative z-10" />
					<Image
						src={PDFIcon}
						width={20}
						height={20}
						alt="PDF"
						className="cursor-pointer"
					/>
					{sessionStatus === "authenticated" &&
						session.user.email === author.email && (
							<PenTool size={20} className="cursor-pointer" />
						)}
				</div>
			</div>
		</div>
	);
}
