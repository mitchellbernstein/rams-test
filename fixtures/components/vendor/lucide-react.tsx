import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg"> & { size?: number };

function createIcon(d: string) {
  return function LucideIcon({ size = 24, ...props }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d={d} />
      </svg>
    );
  };
}

export const Search = createIcon("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3");
export const Trash2 = createIcon("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6");
export const Bell = createIcon("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0");
export const Plus = createIcon("M12 5v14M5 12h14");
export const X = createIcon("M18 6 6 18M6 6l12 12");
