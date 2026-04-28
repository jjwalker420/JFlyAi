import type { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type CommonProps = {
  children: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-7 py-4 text-[1.125rem] font-bold whitespace-nowrap font-display bg-amber-flame text-deep-stone transition-all duration-200 hover:bg-horizon-gold disabled:opacity-60 disabled:cursor-not-allowed";

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function PrimaryButtonLink({
  href,
  children,
  trailingIcon = "→",
  className = "",
  fullWidth = false,
  target,
  rel,
}: LinkProps) {
  const widthClass = fullWidth ? "w-full sm:w-auto" : "";
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`${baseClasses} ${widthClass} ${className}`}
    >
      <span>{children}</span>
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </Link>
  );
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    pendingLabel?: string;
    pending?: boolean;
  };

export function PrimaryButton({
  children,
  trailingIcon = "→",
  className = "",
  fullWidth = false,
  pending = false,
  pendingLabel = "Sending…",
  ...rest
}: ButtonProps) {
  const widthClass = fullWidth ? "w-full" : "";
  return (
    <button
      {...rest}
      disabled={pending || rest.disabled}
      className={`${baseClasses} ${widthClass} ${className}`}
    >
      <span>{pending ? pendingLabel : children}</span>
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
}
