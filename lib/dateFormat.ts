export function formatTimeAgo(date: string | Date): string {
	const now = new Date();
	const parsedDate = typeof date === "string" ? new Date(date) : date; // Convert if string

	const diffMs = now.getTime() - parsedDate.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMinutes < 1) return "Just now";
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 0) return "Today";
	if (diffDays < 7) return `${diffDays}d ago`;

	const diffWeeks = Math.floor(diffDays / 7);
	return `${diffWeeks}w ago`;
}
