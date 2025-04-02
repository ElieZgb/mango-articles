import { useMutation } from "@node_modules/@tanstack/react-query";

export const useUploadImage = () => {
	return useMutation({
		mutationFn: async ({
			file,
			folder,
		}: {
			file: File;
			folder: string;
		}) => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", file.name);
			formData.append("folder", folder);

			const response = await fetch("/api/image-upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error("Image upload failed");

			const data = await response.json();
			return data.url;
		},
	});
};
