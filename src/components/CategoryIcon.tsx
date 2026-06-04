import { Boxes, Cable, LampWallUp, Lightbulb, ShieldHalf } from 'lucide-react';

const iconMap = {
  Boxes,
  Cable,
  LampWallUp,
  Lightbulb,
  ShieldHalf,
};

export default function CategoryIcon({
  name,
  className,
}: {
  name: keyof typeof iconMap | string;
  className?: string;
}) {
  const Icon = iconMap[name as keyof typeof iconMap] || Lightbulb;
  return <Icon className={className} />;
}
