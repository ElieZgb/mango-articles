const MONTHS = [
	{ short: "Jan", full: "January" },
	{ short: "Feb", full: "February" },
	{ short: "Mar", full: "March" },
	{ short: "Apr", full: "April" },
	{ short: "May", full: "May" },
	{ short: "Jun", full: "June" },
	{ short: "Jul", full: "July" },
	{ short: "Aug", full: "August" },
	{ short: "Sep", full: "September" },
	{ short: "Oct", full: "October" },
	{ short: "Nov", full: "November" },
	{ short: "Dec", full: "December" },
];

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

export function formatDate(date: string | Date): string {
	const parsedDate = typeof date === "string" ? new Date(date) : date;

	const day = parsedDate.getDate();
	const month = MONTHS[parsedDate.getMonth()].short;
	const year = parsedDate.getFullYear();

	return `${month} ${day}, ${year}`;
}
