export async function createSqlite() {
  // @ts-expect-error
  const { SQLite, IndexedDbFS } = await import("@alshdavid/sqlite-web");
  return SQLite.initialize({
    fs: IndexedDbFS,
  });
}
