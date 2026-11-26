/**
 * Resolves a file from `public/` against the Vite deploy base.
 *
 * Vite's default base is "/", so this returns the same `/images/...` path the
 * project always used. If the site is ever deployed under a sub-path (a GitHub
 * Pages project site, a preview URL with a prefix), setting `base` in
 * `vite.config.ts` now moves every image and the resume with it instead of
 * leaving them pointing at the domain root, where they 404 — which is what
 * silently killed the cat cursor image in production.
 */
export function assetPath(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
