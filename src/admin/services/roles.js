import { Aperture, Camera, Plane, Users, Video } from "lucide-react";

export const ROLE_CONFIG = {
  candid_photographer: { label: "Candid Photographer", icon: Aperture, cls: "bg-cyan-50 text-cyan-700 ring-cyan-200" },
  drone: { label: "Drone Photographer", icon: Plane, cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  traditional_photographer: { label: "Traditional Photographer", icon: Camera, cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  cinematographer: { label: "Cinematographer", icon: Video, cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  traditional_videographer: { label: "Traditional Videographer", icon: Users, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export const ADD_NEW_ROLE_VALUE = "__add_new_role__";

export function normalizeRoleValue(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getRoleLabel(role) {
  return ROLE_CONFIG[role]?.label || role?.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Role";
}

export function getRoleConfig(role) {
  return ROLE_CONFIG[role] || {
    label: getRoleLabel(role),
    icon: Camera,
    cls: "bg-slate-50 text-slate-700 ring-slate-200",
  };
}

export function getRoleOptions({ photographers = [], services = [] } = {}) {
  const roles = new Set(Object.keys(ROLE_CONFIG));

  photographers.forEach((item) => item?.role && roles.add(item.role));
  services.forEach((item) => item?.role && roles.add(item.role));

  return [...roles]
    .filter(Boolean)
    .sort((a, b) => getRoleLabel(a).localeCompare(getRoleLabel(b)))
    .map((value) => ({ value, label: getRoleLabel(value) }));
}
