import {
  BarChart3,
  BriefcaseBusiness,
  Handshake,
  Landmark,
  Megaphone,
  PackageSearch,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const icons = {
  landmark: Landmark,
  users: UsersRound,
  handshake: Handshake,
  megaphone: Megaphone,
  chart: BarChart3,
  package: PackageSearch,
  shield: ShieldCheck,
  briefcase: BriefcaseBusiness,
} as const;

export function DepartmentIcon({ icon, size = 22 }: { icon: string; size?: number }) {
  const Icon = icons[icon as keyof typeof icons] ?? BriefcaseBusiness;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

