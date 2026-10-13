import * as React from "react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size || height}
      viewBox="0 0 40 40"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer visual frame */}
      <path
        d="M8 13.5C8 10.462 10.462 8 13.5 8H26.5C29.538 8 32 10.462 32 13.5V26.5C32 29.538 29.538 32 26.5 32H13.5C10.462 32 8 29.538 8 26.5V13.5Z"
        fill="currentColor"
      />

      {/* Inner visual structure */}
      <path
        d="M13 14H27"
        stroke="var(--logo-cutout, #fff)"
        strokeLinecap="round"
        strokeWidth="2.4"
      />

      <path
        d="M13 20H23"
        stroke="var(--logo-cutout, #fff)"
        strokeLinecap="round"
        strokeWidth="2.4"
      />

      <path
        d="M13 26H19"
        stroke="var(--logo-cutout, #fff)"
        strokeLinecap="round"
        strokeWidth="2.4"
      />

      {/* Focus / insight point */}
      <circle
        cx="27"
        cy="26"
        fill="currentColor"
        r="4.5"
        stroke="var(--logo-cutout, #fff)"
        strokeWidth="2.2"
      />
    </svg>
  );
};