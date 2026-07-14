import { Package2 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package2 size={30} />
          <div>
            <h1 className="text-xl font-bold">
              Temple Tip Inventory
            </h1>

            <p className="text-xs text-blue-100">
              QR Tracking System
            </p>
          </div>
        </div>

        <div className="text-sm">
          Lenskart Manufacturing
        </div>
      </div>
    </header>
  );
}