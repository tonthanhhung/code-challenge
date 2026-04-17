interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold tracking-wider uppercase text-[#8b8fa8]"
    >
      {children}
    </label>
  );
}
