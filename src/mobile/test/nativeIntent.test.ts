import { describe, expect, test } from 'vitest';

/**
 * Tests `app/+native-intent`, the hook that keeps expo-router from routing the
 * Google login redirect.
 *
 * Regression: `sehati://masuk?code=...` left only `/` for the router (the host
 * is consumed as the authority), which is `index.tsx` — the screen already
 * showing. The navigation matched nothing and the release build rendered
 * "Unmatched Route" over the login that had just succeeded.
 */

// Imported by path: the file is a route module, not part of the `@/api` barrel.
import { redirectSystemPath } from '@/app/+native-intent';

const jalur = (path: string) => redirectSystemPath({ path, initial: false });

describe('redirectSystemPath', () => {
  test('mengabaikan tautan kembali login sehati://masuk', () => {
    expect(jalur('sehati://masuk?code=4%2Fkode')).toBeNull();
    expect(jalur('sehati://masuk')).toBeNull();
  });

  test('mengabaikan tautan kembali login pada skema lain', () => {
    // The same link can arrive as `exp:`/`exps:` under Metro, but only when it
    // carries our host; the dev-server link is a different URL and is passed on.
    expect(jalur('exps://masuk?code=4%2Fkode')).toBeNull();
    expect(jalur('exp://10.0.2.2:8081/--/?code=4%2Fkode')).toBe('exp://10.0.2.2:8081/--/?code=4%2Fkode');
    expect(jalur('sehati://MASUK?code=x')).toBeNull();
  });

  test('meneruskan tautan yang bukan login apa adanya', () => {
    expect(jalur('sehati:///beranda')).toBe('sehati:///beranda');
    expect(jalur('/admin/status')).toBe('/admin/status');
    // A host that only starts with the login host is not the login link.
    expect(jalur('sehati://masukan?code=x')).toBe('sehati://masukan?code=x');
    // The login link never carries a path, but matching on the host alone is the
    // safer side: swallowing it beats another Unmatched Route screen.
    expect(jalur('sehati://masuk/beranda')).toBeNull();
  });

  test('tidak melempar saat path tidak bisa diurai', () => {
    // Throwing here crashes the app on launch, so the hook must always answer,
    // and an unreadable link must be passed on rather than swallowed.
    expect(() => jalur('')).not.toThrow();
    expect(jalur('')).toBe('');
    expect(jalur(null as unknown as string)).toBeNull();
  });
});
