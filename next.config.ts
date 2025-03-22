import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "picsum.photos", protocol: "https" },
			{ hostname: "i.pravatar.cc", protocol: "https" },
			{ hostname: "lh3.googleusercontent.com", protocol: "https" },
			{ hostname: "ik.imagekit.io", protocol: "https" },
		],
	},
	/* config options here */
};

export default nextConfig;
