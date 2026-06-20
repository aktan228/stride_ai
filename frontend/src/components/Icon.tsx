import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
  size?: number;
}

/** Material Symbols Outlined glyph (font loaded in index.html). */
export function Icon({ name, className = "", fill = false, size }: IconProps) {
  const style: CSSProperties = {};
  if (fill) style.fontVariationSettings = "'FILL' 1";
  if (size) style.fontSize = `${size}px`;
  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
