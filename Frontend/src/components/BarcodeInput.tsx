interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function BarcodeInput({
  value,
  onChange,
}: Props) {
  return (
    <div>

      <label className="block mb-2 font-medium">
        Scan Barcode
      </label>

      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Scan barcode..."
        className="
          w-full
          rounded-xl
          border
          p-3
          text-lg
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
      />

    </div>
  );
}