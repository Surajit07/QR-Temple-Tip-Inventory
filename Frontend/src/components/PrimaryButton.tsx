interface PrimaryButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onClick,
  type = "button",
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        bg-blue-700
        hover:bg-blue-800
        text-white
        font-semibold
        py-3
        rounded-xl
        transition
        disabled:bg-gray-400
        disabled:cursor-not-allowed
      "
    >
      {title}
    </button>
  );
}