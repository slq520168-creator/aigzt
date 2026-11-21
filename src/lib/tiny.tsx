/** React helpers over the global `tiny` (types in src/tiny.d.ts); call the rest directly. */
import { useEffect, useState } from "react"

/** The signed-in person: undefined while loading, null when signed out. */
export function useMe(): Tiny.User | null | undefined {
  const [me, setMe] = useState<Tiny.User | null | undefined>(undefined)
  useEffect(() => {
    let live = true
    tiny.me().then(
      (user) => live && setMe(user),
      () => live && setMe(null)
    )
    return () => {
      live = false
    }
  }, [])
  return me
}

/**
 * Every entry under a prefix, kept live: re-renders within a second of any change, from any
 * device. `entries` is undefined until the first load.
 *
 *   const { entries } = useEntries<Customer>("customer:", { where: { status: "active" } })
 *   const { entries: latest } = useEntries<Order>("order:", { order: "-$created_at", limit: 20 })
 */
export function useEntries<T>(prefix: string, options?: Tiny.Filter & Tiny.Ordered & { limit?: number }) {
  const [entries, setEntries] = useState<Tiny.Entry<T>[] | undefined>(undefined)
  const [error, setError] = useState<Tiny.TinyError | null>(null)
  const where = JSON.stringify(options?.where ?? null)
  const order = options?.order
  const limit = options?.limit
  useEffect(() => {
    setError(null)
    return tiny.db.watch<T>(prefix, setEntries, {
      where: JSON.parse(where) ?? undefined,
      order,
      limit,
      onError: setError,
    })
  }, [prefix, where, order, limit])
  return { entries, error }
}

/** Shown when the page is opened anywhere but Tiniest Cloud, e.g. by `npm run dev`. */
export function NotOnTiniestCloud() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-2 p-6 text-sm">
      <h1 className="text-base font-medium">This app runs on Tiniest Cloud</h1>
      <p className="text-muted-foreground">
        Sign-in, data and AI come from the platform, so they only work once the app is
        deployed. Build it, deploy the dist folder, and open the app&apos;s link.
      </p>
    </main>
  )
}
