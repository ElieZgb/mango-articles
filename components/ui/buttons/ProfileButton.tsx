"use client";
import React, { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@node_modules/next-auth/react";
import Image from "@node_modules/next/image";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";
import ProfileButtonTile from "../tiles/ProfileButtonTile";
import { User, Pencil, Settings } from "lucide-react";
import Divider from "../tiles/Divider";
import clsx from "@node_modules/clsx";
import type { Session } from "next-auth";

export default function ProfileButton({
	username,
}: {
	username: string | null;
}) {
	const { data: session } = useSession();
	const [active, setActive] = useState<boolean>(false);

	const toggleBurgerMenu = () => {
		setActive((prev) => !prev);
	};

	return (
		<div className="relative h-full aspect-square bg-mango rounded-full">
			<Image
				src={session?.user.image || ProfilePlaceholder}
				alt="Profile image"
				fill={true}
				className="object-cover rounded-full p-1 cursor-pointer"
				onClick={toggleBurgerMenu}
				id="profile-image"
			/>
			{active && (
				<BurgerMenu
					active={active}
					setActive={setActive}
					session={session}
					username={username}
				/>
			)}
		</div>
	);
}

const BurgerMenu = ({
	active,
	setActive,
	session,
	username,
}: {
	active: boolean;
	session: Session | null;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	username: string | null;
}) => {
	const menuRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				target.id !== "profile-image"
			) {
				setActive(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [setActive]);

	const closeMenu = () => setActive(false);

	return (
		<div
			ref={menuRef}
			className={clsx([
				"absolute top-[120%] z-50 right-0 py-3 w-max bg-[#f1f1f1] rounded-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-[3000ms]",
				active && "opacity-100 visible",
				!active && "opacity-0 invisible",
			])}
		>
			<ProfileButtonTile
				closeMenu={closeMenu}
				icon={User}
				label="Profile"
				url={`/${username}`}
			/>
			<ProfileButtonTile
				closeMenu={closeMenu}
				icon={Pencil}
				label="Write"
				url="/write"
			/>
			{/* <ProfileButtonTile
				closeMenu={closeMenu}
				icon={BookText}
				label="Stories"
			/> */}
			<ProfileButtonTile
				closeMenu={closeMenu}
				icon={Settings}
				label="Settings"
				url="/settings"
			/>
			<Divider marginVertical={13} color="#ccc" />
			<ProfileButtonTile
				label={`Sign out<br/>${session?.user.email}`}
				rawHTML={true}
				onclick={() => signOut({ callbackUrl: "/" })}
			/>
		</div>
	);
};
