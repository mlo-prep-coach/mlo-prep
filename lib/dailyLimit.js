// Deterministic "shuffle" seeded by today's date plus a salt (e.g. category
// id), so a free-tier visitor sees the same daily subset all day but a
// different one tomorrow — with no account or server-side tracking needed.
// Selections are independent day to day, so a question or card seen on day 1
// can reappear on day 4; nothing is excluded once "used."

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function todayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

export function pickDailySubset(items, count, salt) {
  if (items.length <= count) return items;
  const rng = mulberry32(hashSeed(`${todayKey()}:${salt}`));
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
