"use client";
import React, { useEffect, useRef, useState } from "react";
import PlaceholderProfile from "@public/assets/images/profile-placeholder.png";
import Image from "@node_modules/next/image";
import { useParams } from "@node_modules/next/navigation";
import { PenBox, ListMinus, FileHeart, Loader2, Pencil } from "lucide-react";
import DigitsStatisticsCard from "@components/ui/statistics/DigitsStatisticsCard";
import { useSession } from "@node_modules/next-auth/react";
import type { Article, User } from "@node_modules/@prisma/client";
import { getTotalLikes } from "@app/lib/userStats";
import List from "@components/ui/lists/List";
import LoadingIcon from "@public/assets/icons/loading-icon.gif";
import { useUploadImage } from "@app/lib/uploadImage";
import { useFetchUserByUsername } from "@app/lib/fetchUsers";
import { useUpdateUser } from "@app/lib/updateUsers";

export default function Page() {
	const { username } = useParams();
	const { data: session, status: sessionStatus } = useSession();
	const [totalPosts, setTotalPosts] = useState<number>(0);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [user, setUser] = useState<(User & { articles: Article[] }) | null>(
		null
	);
	const [canEdit, setCanEdit] = useState<boolean>(false);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const [nameInput, setNameInput] = useState<string | null>("");
	const [nameEditable, setNameEditable] = useState<boolean>(false);
	const bioTextareaRef = useRef<HTMLTextAreaElement>(null);
	const [bioInput, setBioInput] = useState<string | null>("");
	const [bioEditable, setBioEditable] = useState<boolean>(false);
	const [saveChanges, setSaveChanges] = useState<boolean>(false);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [uploadingImage, setUploadingImage] = useState<boolean>(false);
	const { mutateAsync } = useUploadImage();
	const { data } = useFetchUserByUsername(username as string);
	const { mutateAsync: updateUserAsync } = useUpdateUser();

	useEffect(() => {
		if (nameEditable) {
			if (nameInputRef.current) {
				nameInputRef.current.focus();
				setSaveChanges(true);
			}
		}

		if (bioEditable) {
			if (bioTextareaRef.current) {
				bioTextareaRef.current.focus();
				setSaveChanges(true);
			}
		}
	}, [nameEditable, bioEditable]);

	useEffect(() => {
		if (data) {
			const userLoggedIn = isUserLoggedIn(data);
			setCanEdit(userLoggedIn);
			setUser(data);
			setNameInput(data.name);
			setBioInput(data.bio);
			setTotalPosts(data.articles.length);
			setTotalLikes(getTotalLikes(data.articles));
		}
	}, [username, session, data]);

	const isUserLoggedIn = (data: User) => {
		if (sessionStatus != "authenticated") return false;

		if (session.user.email === data.email) return true;

		return false;
	};

	const handleUserUpdate = async () => {
		setIsUpdating(true);
		let newImageURL;
		if (file) {
			newImageURL = await uploadImage();
		}
		newImageURL = newImageURL ? newImageURL : user?.image;

		try {
			const updatedUser = await updateUserAsync({
				username: username as string,
				bioInput,
				nameInput,
				newImageURL: newImageURL ?? null,
			});
			setUser(updatedUser);
			setIsUpdating(false);
			setSaveChanges(false);
			setBioEditable(false);
			setNameEditable(false);
		} catch (e) {
			console.log("Error updating user", e);
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSaveChanges(true);
		const selectedFile = event.target.files![0];

		if (!selectedFile) return;

		setFile(selectedFile); // Save the file for upload
		const reader = new FileReader();
		reader.onloadend = () => {
			setProfilePreview(reader.result as string); // Set the preview URL
		};
		reader.readAsDataURL(selectedFile);
	};

	const uploadImage = async (): Promise<string | undefined> => {
		if (!file) return;

		setUploadingImage(true);
		try {
			const imageUrl = await mutateAsync({ file, folder: "/profiles" });
			return imageUrl;
		} catch (e) {
			console.log("Error uploading image", e);
		} finally {
			setUploadingImage(false);
		}
	};

	const handleCancelEdit = () => {
		setIsUpdating(false);
		setSaveChanges(false);
		setBioEditable(false);
		setNameEditable(false);
		setProfilePreview(null);
		if (user) {
			setBioInput(user.bio);
			setNameInput(user.name);
		}
	};

	if (!user) {
		return (
			<div className="h-screen">
				<div className="w-12 mx-auto mt-[30vh] aspect-square relative">
					<Image
						src={LoadingIcon}
						fill={true}
						alt="Loading"
						className="object-contain"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center py-12">
			<div className="mx-16 max-[500px]:mx-7 max-w-[800px] w-full">
				{/* Profile picture section */}
				<div className="flex flex-col mb-10">
					<div className="flex items-center">
						<div className="relative max-sm:w-17 w-24 aspect-square max-sm:mr-5 mr-10">
							<div className="w-full h-full bg-mango rounded-full overflow-hidden relative">
								{uploadingImage && (
									<div className="absolute flex items-center justify-center w-full h-full top-0 left-0 bg-black/60 z-10">
										<Loader2
											size={30}
											className="animate-spin text-white"
										/>
									</div>
								)}
								{profilePreview ? (
									<Image
										src={profilePreview}
										alt="Profile Preview"
										fill={true}
										className="object-cover"
									/>
								) : (
									<Image
										src={user.image || PlaceholderProfile}
										alt="Profile picture"
										fill={true}
										className="object-cover"
									/>
								)}
							</div>
							{canEdit && (
								<label className="cursor-pointer absolute flex items-center justify-center w-10 aspect-square rounded-full bg-white border-4 border-background z-10 -bottom-2 -right-3">
									<Pencil size={16} />
									<input
										type="file"
										hidden
										onChange={handleFileChange}
										accept="image/*"
									/>
								</label>
							)}
						</div>
						<div className="flex flex-col mt-1 flex-1">
							<div className="flex items-end gap-2 mb-[-4px]">
								{nameEditable ? (
									<input
										ref={nameInputRef}
										className="max-sm:text-2xl text-4xl font-display-medium mr-1 outline-none border-[1.5px] rounded-sm border-black pt-1 pl-2 max-w-[300px]"
										type="text"
										value={nameInput || ""}
										onChange={(e) =>
											setNameInput(e.target.value)
										}
									/>
								) : (
									<h3 className="max-sm:text-2xl text-4xl font-display-medium mr-1">
										{nameInput}
									</h3>
								)}
								{canEdit && (
									<PenBox
										size={20}
										className="relative bottom-2.5 cursor-pointer"
										onClick={() => setNameEditable(true)}
									/>
								)}
							</div>
							<div className="text-[#666] text-base mb-1">
								{user.email} | {username}
							</div>
						</div>
						{saveChanges && (
							<div>
								<button
									onClick={handleUserUpdate}
									className={`mr-1 cursor-pointer relative px-5 py-2.5 rounded-lg font-display-medium bg-green-300 ${
										isUpdating
											? "text-transparent"
											: "text-green-800"
									}`}
								>
									Save Changes
									{isUpdating && (
										<Loader2
											size={20}
											className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-green-800 animate-spin"
										/>
									)}
								</button>
								<button
									onClick={handleCancelEdit}
									className={`cursor-pointer relative px-5 py-2.5 rounded-lg font-display-medium text-black border-black border`}
								>
									Cancel
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Bio section */}
				<div className="flex flex-col mb-10">
					<label className="mb-1 font-bold text-[#777] flex gap-3">
						About me
						{canEdit && (
							<PenBox
								size={20}
								className="cursor-pointer"
								onClick={() => setBioEditable(true)}
							/>
						)}
					</label>
					{bioEditable ? (
						<div className="w-full rounded-sm border-[1.5px] border-black">
							<textarea
								ref={bioTextareaRef}
								name="about-me"
								className="resize-none w-full outline-none p-2"
								rows={6}
								onChange={(e) => setBioInput(e.target.value)}
							>
								{bioInput || ""}
							</textarea>
						</div>
					) : (
						<div className="py-2">
							{bioInput || (
								<span className="text-[#777] italic">
									No bio!
								</span>
							)}
						</div>
					)}
				</div>

				{/* Statistics */}
				<div className="flex max-sm:gap-2 gap-5 mb-10">
					<DigitsStatisticsCard
						value={totalPosts}
						label={"Total Posts"}
						Icon={ListMinus}
					/>
					<DigitsStatisticsCard
						value={totalLikes}
						label={"Total Likes"}
						Icon={FileHeart}
					/>
				</div>

				{/* Top 3 Articles By Likes */}
				<List
					title="Top 3 Articles"
					list={user.articles
						.sort((a, b) => b.likes_count! - a.likes_count!)
						.slice(0, 3)}
				/>

				{/* All Articles */}
				<List
					title="All Articles"
					list={user.articles}
					paginated={true}
				/>
			</div>
		</div>
	);
}
