import { X } from "lucide-react";

interface CloseButtonProps {
	closeModal: () => void;
	className: string;
}

export default function CloseButton({
	closeModal,
	className = "",
}: CloseButtonProps) {
	return (
		<button className={className} onClick={closeModal}>
			<X size={23} strokeWidth={1.1} />
		</button>
	);
}
