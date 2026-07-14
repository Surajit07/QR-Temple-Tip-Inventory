import Select from "react-select";

interface Option {
  label: string;
  value: string;
  colour?: string;
}

interface Props {
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  placeholder: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Select
      options={options}
      value={value}
      onChange={(option) => onChange(option)}
      placeholder={placeholder}
      isSearchable
    />
  );
}
