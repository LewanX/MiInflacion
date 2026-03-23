import {
  BarChart3,
  ShoppingCart,
  Wine,
  Shirt,
  Home,
  Armchair,
  Heart,
  Bus,
  Smartphone,
  Ticket,
  GraduationCap,
  UtensilsCrossed,
  Tag,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  ShoppingCart,
  Wine,
  Shirt,
  Home,
  Armchair,
  Heart,
  Bus,
  Smartphone,
  Ticket,
  GraduationCap,
  UtensilsCrossed,
  Tag,
  Wallet,
};

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function CategoryIcon({ icon, className }: CategoryIconProps) {
  const Icon = iconMap[icon];
  if (!Icon) return <BarChart3 className={cn("size-4", className)} />;
  return <Icon className={cn("size-4", className)} />;
}
