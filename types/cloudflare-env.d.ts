declare namespace Cloudflare {
  interface Env {
    // D1 is not enabled in the hosting manifest. getDb() guards its absence.
    DB?: D1Database;
  }
}
