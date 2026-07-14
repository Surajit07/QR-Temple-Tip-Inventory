import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  );
}