export default function Divider({
	color,
	marginVertical,
}: {
	color?: string;
	marginVertical?: number;
}) {
	return (
		<div
			style={{
				borderColor: color || "#191919",
				marginBlock: marginVertical || 0,
			}}
			className="w-full border-t-[1px]"
		/>
	);
}
