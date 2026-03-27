import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

type BrandVariant = "full" | "icon";

type BrandProps = {
  variant?: BrandVariant;
  className?: string;
  alt?: string;
  to?: string;
  invertOnDark?: boolean;
  fetchPriority?: "high" | "low" | "auto";
};

const BRAND_ASSETS: Record<BrandVariant, { src: string; defaultAlt: string }> = {
  full: { src: "/logoreservify.png", defaultAlt: "Reservify" },
  icon: { src: "/icon_reservify.svg", defaultAlt: "Reservify" },
};

export function Brand({
  variant = "full",
  className,
  alt,
  to,
  invertOnDark = true,
  fetchPriority = "low",
}: BrandProps) {
  const asset = BRAND_ASSETS[variant];
  const img = (
    <img
      src={asset.src}
      alt={alt ?? asset.defaultAlt}
      className={cn(className, invertOnDark && "dark:invert")}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  );

  if (to) {
    return (
      <Link to={to} aria-label="Ir al inicio de Reservify">
        {img}
      </Link>
    );
  }

  return img;
}
