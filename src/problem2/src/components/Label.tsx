interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold tracking-wider uppercase text-text-muted"
    >
      {children}
    </label>
  );
}
