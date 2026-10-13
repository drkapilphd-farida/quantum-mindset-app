// After a new deploy, a page opened on the previous version can ask for a
// piece of the old app that no longer exists ("Loading chunk 6761 failed").
// "Try again" can't fix that — only a full reload loads the new version.

const STALE_BUILD = /Loading (CSS )?chunk [\w-]+ failed|ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed/i

export function isStaleBuildError(error: { name?: string; message?: string } | null | undefined): boolean {
  if (!error) return false
  return STALE_BUILD.test(error.name ?? '') || STALE_BUILD.test(error.message ?? '')
}

const KEY = 'mum-stale-build-reload'
const WINDOW_MS = 60_000

/** Reloads once per page per minute; returns false (no reload) when it already tried, so it can never loop. */
export function reloadOnceForNewVersion(storage: Pick<Storage, 'getItem' | 'setItem'> | null, path: string, now: number, reload: () => void): boolean {
  try {
    const last = JSON.parse(storage?.getItem(KEY) ?? 'null') as { path: string; at: number } | null
    if (last !== null && last.path === path && now - last.at < WINDOW_MS) return false
    storage?.setItem(KEY, JSON.stringify({ path, at: now }))
  } catch {
    // Storage blocked: still reload once (the browser then loads the new version).
  }
  reload()
  return true
}
