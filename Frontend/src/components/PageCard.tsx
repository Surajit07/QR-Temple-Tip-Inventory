import { ReactNode } from "react";

interface PageCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
}

export default function PageCard({
  title,
  subtitle,
  icon,
  onClick,
}: PageCardProps) {
  return (
    <div
      onClick={onClick}
      className="
      cursor-pointer
      bg-white
      rounded-2xl
      shadow-md
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
      p-8
      border
      border-slate-200"
    >
      <div className="flex flex-col items-center gap-4">

        <div className="text-blue-700">
          {icon}
        </div>

        <div className="text-center">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <p className="text-slate-500 mt-2">
            {subtitle}
          </p>

        </div>

      </div>
    </div>
  );
}