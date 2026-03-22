const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export function resolveAssetUrl(path = "") {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return apiOrigin ? `${apiOrigin}${path.startsWith("/") ? path : `/${path}`}` : path;
}
