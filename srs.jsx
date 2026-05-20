// ─── SPACED REPETITION — Leitner 5-box ───────────────────────────
// State shape: { items: { [id]: { box, lastSeen, due, seenCount, wrongCount } } }
// Boxes 1–5, intervals: 0d, 1d, 3d, 7d, 14d

const SRS_INTERVALS = [0, 1, 3, 7, 14]; // days per box level (index = box-1)

function getSrsState() {
  try {
    const s = JSON.parse(localStorage.getItem('engapp-srs'));
    if (s && s.items) return s;
  } catch (e) {}
  return { items: {} };
}

function saveSrsState(state) {
  try { localStorage.setItem('engapp-srs', JSON.stringify(state)); } catch (e) {}
}

function recordResult(itemId, correct) {
  const state = getSrsState();
  const now = Date.now();
  const prev = state.items[itemId] || { box: 1, lastSeen: 0, due: 0, seenCount: 0, wrongCount: 0 };
  const newBox = correct ? Math.min(5, prev.box + 1) : Math.max(1, prev.box - 1);
  const intervalMs = SRS_INTERVALS[newBox - 1] * 86400000;
  state.items[itemId] = {
    box: newBox,
    lastSeen: now,
    due: now + intervalMs,
    seenCount: (prev.seenCount || 0) + 1,
    wrongCount: (prev.wrongCount || 0) + (correct ? 0 : 1),
  };
  saveSrsState(state);
}

function isDue(item, now) {
  return item.due <= (now !== undefined ? now : Date.now());
}

// Returns ids sorted: errors-due first, then due, then fresh (never seen)
function getDueItems(allIds, state) {
  const now = Date.now();
  const errors = [], due = [], fresh = [];
  for (const id of allIds) {
    const item = state.items[id];
    if (!item) { fresh.push(id); continue; }
    if (isDue(item, now)) {
      if (item.wrongCount > 0) errors.push(id);
      else due.push(id);
    }
  }
  return [...errors, ...due, ...fresh];
}

// Items the user has gotten wrong at least once and not yet mastered (box ≤ 2)
function getWeakSpots(state) {
  return Object.entries(state.items)
    .filter(([_, item]) => item.wrongCount >= 1 && item.box <= 2)
    .map(([id]) => id);
}

window.SRS = { getSrsState, saveSrsState, recordResult, isDue, getDueItems, getWeakSpots };
