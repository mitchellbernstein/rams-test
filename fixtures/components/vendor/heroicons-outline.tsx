import type { ComponentProps } from "react";

export function TrashIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.7 9-.3 9m-4.8 0L9.3 9m9.9-3.2 1 .2M4.8 5.8l1-.2m13.4.2L18.2 19a2.2 2.2 0 0 1-2.2 2H8a2.2 2.2 0 0 1-2.2-2L4.8 5.8m14.4 0a48 48 0 0 0-3.5-.4m-12 .6a48 48 0 0 1 3.5-.4m7 0V4.9c0-1.2-.9-2.1-2.1-2.2a52 52 0 0 0-3.4 0C8.9 2.8 8 3.7 8 4.9v.5m7 0a48 48 0 0 0-7 0" />
    </svg>
  );
}
