/**
 * Keeps the router out of the Google login redirect (UC-11).
 *
 * `masukDenganGoogle` sends Google a return link of `sehati://masuk`, which the
 * backend relays back with `?code=...`. The app only needs to be foregrounded:
 * `tungguRedirect` reads the code from the `url` event itself.
 *
 * The router listens to the same event and tried to navigate to it. For
 * `sehati://masuk?code=...` the host is consumed as the authority, so the only
 * path left is `/`, which is `index.tsx` — the screen already showing. The
 * navigation therefore matched nothing and the release build rendered
 * "Unmatched Route" over the login that had just succeeded.
 *
 * Returning `null` here means "don't navigate", so the router stays on the
 * current screen and the login flow finishes normally. The listener in
 * `src/api/auth.ts` is unaffected: it is a separate subscriber and still sees
 * the raw URL.
 */

/** Host used by the login deep link (`src/api/auth.ts`, `HOST_KEMBALI`). */
const HOST_LOGIN = 'masuk';

/** True for our login redirect, on any scheme (`sehati:`, `exp:`, `exps:`). */
function tautanLogin(path: string): boolean {
  if (typeof path !== 'string') return false;
  const tanpaSkema = path.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const host = tanpaSkema.split(/[/?#]/)[0]?.toLowerCase();
  return host === HOST_LOGIN;
}

/**
 * Called by expo-router for every incoming link, before it is matched to a
 * route. `path` is a raw URL, not necessarily parseable — hence the string
 * handling and the `try`/`catch` (throwing here crashes the app on launch).
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string | null {
  try {
    return tautanLogin(path) ? null : path;
  } catch {
    // Leave the link untouched; a bad matcher must not blackhole other links.
    return path;
  }
}
