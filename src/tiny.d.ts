/**
 * Types for the Tiniest Cloud SDK — the global `tiny` that `<script src="/sdk.js"></script>`
 * defines. Drop this file into a TypeScript project (src/tiny.d.ts) and `tiny` is typed
 * everywhere, with nothing to import or install.
 *
 * Served at /sdk.d.ts. Always the types for the SDK this deployment serves; a test fails
 * when sdk.js gains a method this file does not declare.
 */

declare namespace Tiny {
  /** Errors the SDK throws. `status` is the HTTP status, or 0 when the platform was unreachable. */
  interface TinyError extends Error {
    name: "TinyError";
    status: number;
  }

  interface User {
    id: string;
    email: string;
  }

  interface Entry<T = unknown> {
    key: string;
    value: T;
    /** ISO timestamp of the last write. */
    updated_at: string;
    /** ISO timestamp of the first write. Kept by the platform; a page cannot set it. */
    created_at: string;
    /**
     * Who created it, as an id that is the same for one person across this app's entries — not
     * their account id, and different in every other app. Use it to group or filter entries by
     * person (`where: { $created_by: entry.created_by }`); use `mine` for "is it yours". Kept by
     * the platform. Null when no person did: a job, a webhook, an app key, a visitor with no
     * account.
     */
    created_by: string | null;
    /** Whether the signed-in person reading it created it. */
    mine: boolean;
  }

  /** A range bound: a number compares numbers, a Date or ISO date string compares times, other text compares text. */
  type Bound = number | string | Date;

  type Comparison = {
    eq?: unknown;
    ne?: unknown;
    gt?: Bound;
    gte?: Bound;
    lt?: Bound;
    lte?: Bound;
    /** Equal to any of these, compared as text. */
    in?: Array<string | number | boolean>;
    /** Contains this text, ignoring case. */
    contains?: string;
  };

  /**
   * A filter applied on the server, eight conditions at most. Keys are top-level fields of the
   * stored value, or the entry's own `$created_at`, `$updated_at` (ranges) and `$created_by`
   * ("me", or an entry's `created_by`). A bare value means equals (compared as text, so 5 matches "5"); an array
   * means one of them.
   */
  type Where = Record<string, string | number | boolean | null | Date | Array<string | number | boolean> | Comparison>;

  interface Filter {
    where?: Where;
  }

  interface Ordered {
    /**
     * A field of the value to sort by — numbers as numbers, text in byte order, entries without
     * it last — or `$created_at`, `$updated_at`, `$key`. A leading `-` is newest or largest first.
     * Ties break on the key. Default: key order.
     */
    order?: string;
  }

  interface Page<T = unknown> {
    prefix: string;
    count: number;
    entries: Entry<T>[];
    /** Pass back for the next page; null at the end. */
    cursor: string | null;
  }

  interface Group {
    value: string | null;
    count: number;
    /** Present when `sum` was asked for. */
    sum?: number;
    avg?: number;
    min?: number;
    max?: number;
    counted?: number;
  }

  interface WatchOptions extends Filter, Ordered {
    /** With `order`, only the first N — "the latest 50 messages". */
    limit?: number;
    /** Called when the live connection cannot be made or is refused. */
    onError?: (error: TinyError) => void;
  }

  interface DB {
    /** The stored value, or null when there is none. */
    get<T = unknown>(key: string): Promise<T | null>;
    /** Any JSON value up to 256 KB. Resolves to the value stored. */
    set<T>(key: string, value: T): Promise<T>;
    /** Save only if the key is new — atomic; a racing second caller rejects with status 409. */
    create<T>(key: string, value: T): Promise<T>;
    /** Whether something was deleted. */
    delete(key: string): Promise<boolean>;
    /**
     * Entries under a prefix. With `limit`, the first N (up to 1,000) in `order`; without it,
     * every match, and an error past 1,000 rather than part of them.
     */
    list<T = unknown>(prefix?: string, options?: Filter & Ordered & { limit?: number }): Promise<Entry<T>[]>;
    page<T = unknown>(prefix?: string, options?: Filter & Ordered & { cursor?: string | null; limit?: number }): Promise<Page<T>>;
    /** Every entry under a prefix, paging automatically. A forward pass, not a snapshot. */
    scan<T = unknown>(prefix?: string, options?: Filter & Ordered & { limit?: number }): AsyncIterable<Entry<T>>;
    /** Live: calls back with the current entries on connect and after every change. Returns stop. */
    watch<T = unknown>(prefix: string, onChange: (entries: Entry<T>[]) => void, options?: WatchOptions): () => void;
    count(prefix?: string, options?: Filter): Promise<number>;
    sum(prefix: string, field: string, options?: Filter): Promise<number>;
    sumDetail(prefix: string, field: string, options?: Filter): Promise<{ prefix: string; field: string; sum: number; counted: number }>;
    /** { value: count } per distinct value of `by`. Errors past 100 groups. */
    countBy(prefix: string, by: string, options?: Filter): Promise<Record<string, number>>;
    /** { value: total of field } per distinct value of `by`. */
    sumBy(prefix: string, field: string, by: string, options?: Filter): Promise<Record<string, number>>;
    /** `bucket` groups by the first N characters of `by` — 7 is per month for ISO dates. */
    groupBy(prefix: string, options: Filter & { by?: string; sum?: string; bucket?: number }): Promise<Group[]>;
  }

  interface RoomMessage {
    /** The sending connection — not a person; the same someone in two tabs is two senders. */
    from: string;
    data: string;
  }

  interface Room {
    /** This connection, as others see it. Null until connected. */
    readonly id: string | null;
    /** Strings go as-is; anything else is JSON-encoded. Up to 4 KB. */
    send(data: unknown): void;
    /** Returns a function that removes the handler. */
    on(handler: (message: RoomMessage) => void): () => void;
    leave(): void;
  }

  type Effort = "low" | "medium" | "high" | "xhigh" | "max";

  /** A File or Blob, what files.put returned (or its id or url), or a data: URL. */
  type ImageInput = Blob | StoredFile | string;

  interface GenerateOptions {
    system?: string;
    model?: string;
    effort?: Effort;
    /** Up to four. */
    images?: ImageInput[];
  }

  type Question =
    | { type: "noul"; instructions: string }
    | { type: "choice"; instructions: string; criteria: Record<string, string> }
    | { type: "score"; instructions: string; criteria: string[] };

  type Answer<Q extends Question> = Q extends { type: "noul" }
    ? { type: "noul"; noul: number }
    : Q extends { type: "choice"; criteria: Record<infer K extends string, string> }
      ? { type: "choice"; choice: K; confidence: number; probabilities: Record<K, number> }
      : { type: "score"; score: number; confidence: number; probabilities: Record<string, number> };

  interface Limits {
    models: string[];
    max_effort: Effort;
    default_effort: Effort;
    remaining: { user_hour: number; app_day: number };
    judge: { available: boolean; remaining: { user_hour: number; app_day: number } };
  }

  interface AI {
    generate(prompt: string, options?: GenerateOptions): Promise<string>;
    stream(prompt: string, options?: GenerateOptions): AsyncIterable<string>;
    /** Typed decisions about a text, answered as values to branch on. */
    judge<Q extends Record<string, Question>>(state: unknown, questions: Q): Promise<{ [K in keyof Q]: Answer<Q[K]> }>;
    limits(): Promise<Limits>;
  }

  interface StoredFile {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
  }

  interface Files {
    put(file: Blob, options?: { name?: string; onProgress?: (percent: number) => void }): Promise<StoredFile>;
    /** Where the bytes are, for an <img src>. */
    url(ref: StoredFile | string): string;
    delete(ref: StoredFile | string): Promise<boolean>;
  }

  interface FetchOptions {
    /** "/..." or "?..."; the host is the connection's. */
    path?: string;
    method?: string;
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean>;
    body?: string;
    /** Any value, sent as application/json. */
    json?: unknown;
  }

  interface FetchResult<T = any> {
    ok: boolean;
    status: number;
    headers: Record<string, string>;
    text: string;
    /** Parsed when the response is JSON, else null. */
    json: T | null;
  }

  interface Notify {
    supported(): Promise<boolean>;
    enabled(): Promise<boolean>;
    /** Must run from a tap. Resolves true when the person said yes. */
    ask(): Promise<boolean>;
    stop(): Promise<void>;
    test(): Promise<{ sent: number; pruned: number; skipped: number; failed: number }>;
    /** Moves a subscribed device onto the server's current key. The SDK runs it on load. */
    refresh(): Promise<void>;
  }

  /**
   * What a backend function receives as its second argument — the platform, from the server
   * side: `export default async (input, tiny: Tiny.Server) => value`. Reads and writes reach
   * the caller's data under the app's rules, with the `function` role added.
   */
  interface Server {
    /** Who called, or null for a visitor with no account. */
    caller: { id: string; email: string; roles: string[] } | null;
    db: ServerDB;
    fetch<T = any>(connection: string, options?: FetchOptions): Promise<FetchResult<T>>;
    ai: ServerAI;
  }

  interface ServerDB {
    get<T = unknown>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<T>;
    /** Save only if the key is new — atomic; a racing second call throws with status 409. */
    create<T>(key: string, value: T): Promise<T>;
    delete(key: string): Promise<boolean>;
    list<T = unknown>(prefix?: string, options?: Filter): Promise<Entry<T>[]>;
    page<T = unknown>(prefix?: string, options?: Filter & { cursor?: string | null; limit?: number }): Promise<Page<T>>;
    count(prefix?: string, options?: Filter): Promise<number>;
    sum(prefix: string, field: string, options?: Filter): Promise<number>;
    groupBy(prefix: string, options: Filter & { by?: string; sum?: string; bucket?: number }): Promise<Group[]>;
  }

  interface ServerAI {
    generate(prompt: string, options?: Omit<GenerateOptions, "images">): Promise<string>;
    judge<Q extends Record<string, Question>>(state: unknown, questions: Q): Promise<{ [K in keyof Q]: Answer<Q[K]> }>;
  }

  interface SDK {
    /** The signed-in visitor, or null. */
    me(): Promise<User | null>;
    /** Send the visitor to sign in, returning to this page afterwards. */
    login(): void;
    logout(): Promise<void>;
    db: DB;
    room(name: string): Room;
    ai: AI;
    files: Files;
    /** Run one of the app's backend functions (`_functions/<name>.js`) and get what it returned. */
    call<T = any>(name: string, input?: unknown): Promise<T>;
    /** Call an API through a connection the app's owner set up. */
    fetch<T = any>(connection: string, options?: FetchOptions): Promise<FetchResult<T>>;
    notify: Notify;
  }
}

/** Defined by <script src="/sdk.js"></script>; absent anywhere the app is not served by Tiniest Cloud. */
declare var tiny: Tiny.SDK;

interface Window {
  tiny: Tiny.SDK;
}
