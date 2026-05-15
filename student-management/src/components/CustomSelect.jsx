import { useState, useEffect, useRef } from "react";

const CustomSelect = ({ value, onChange, options, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-left flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-blue-300 transition bg-white
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}`}
      >
        {/* Show placeholder in gray if nothing selected, else show selected label */}
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected.label : placeholder || "Select..."}
        </span>
        <span className="text-gray-400 text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && !disabled && (
        <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {/* Only render real options — placeholder never appears in the list */}
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition
                ${opt.value === value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;