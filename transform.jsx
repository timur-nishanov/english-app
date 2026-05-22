// ─── TRANSFORM — rewrite the sentence using a given word ─────────
// Original sentence above, keyword pill in the middle, textarea below.
// Fuzzy match: lowercase + strip [.,!?;:] + collapse whitespace, compare
// against ex.answer / ex.accept. Fallback: if the user's text contains
// the keyword (case-insensitive) and shares ≥65 % of words with the
// canonical answer, count it as correct.

function transformNormalize(s) {
  return (s || '').toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function transformWordOverlap(a, b) {
  const wa = a.split(/\s+/).filter(Boolean);
  const wb = b.split(/\s+/).filter(Boolean);
  if (!wa.length || !wb.length) return 0;
  const setB = new Set(wb);
  let hits = 0;
  for (const w of wa) if (setB.has(w)) hits++;
  return hits / Math.max(wa.length, wb.length);
}

function transformIsCorrect(ex, raw) {
  const v = transformNormalize(raw);
  if (!v) return false;
  const canonical = [ex.answer, ...(ex.accept || [])].map(transformNormalize);
  if (canonical.includes(v)) return true;
  // fuzzy: contains keyword + ≥65 % word overlap with the main answer
  const kw = (ex.keyword || '').toLowerCase();
  if (kw && v.includes(kw.toLowerCase())) {
    const overlap = transformWordOverlap(v, transformNormalize(ex.answer));
    if (overlap >= 0.65) return true;
  }
  return false;
}

function TransformExercise({ ex, topic, answered, onAnswer }) {
  const [val, setVal] = React.useState('');
  const taRef = React.useRef(null);

  React.useEffect(() => {
    setVal('');
    setTimeout(() => taRef.current && taRef.current.focus(), 50);
  }, [ex]);

  const commit = () => {
    if (answered || !val.trim()) return;
    onAnswer(transformIsCorrect(ex, val));
  };

  const correct = answered && transformIsCorrect(ex, val);

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('transform')} />

      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontSize: 11, color: DS.ink3, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
        }}>Original</div>
        <div style={{
          background: DS.paperCard, color: DS.ink,
          padding: 16, borderRadius: 16, boxShadow: DS.shadowSm,
          fontFamily: DS.display, fontSize: 17, lineHeight: 1.4, letterSpacing: -0.2,
        }}>{ex.original}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 4v14M5 13l6 6 6-6" stroke={DS.ink3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontSize: 11, color: DS.ink3, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
        }}>Use this</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: DS.ink, color: DS.paperCard,
          padding: '10px 20px', borderRadius: 999,
          fontFamily: DS.sans, fontWeight: 700, fontSize: 15,
          letterSpacing: 0.8, textTransform: 'uppercase',
        }}>{ex.keyword}</div>
      </div>

      <textarea ref={taRef} value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); } }}
        disabled={!!answered}
        placeholder="Rewrite the sentence…"
        rows={3}
        className={answered && !correct ? 'anim-shake' : ''}
        style={{
          width: '100%', padding: '17px 18px', borderRadius: 16,
          border: `1.5px solid ${answered ? (correct ? DS.correct : DS.wrong) : 'transparent'}`,
          fontSize: 17, fontFamily: DS.sans, lineHeight: 1.4,
          background: DS.paperCard, color: DS.ink, outline: 'none', boxSizing: 'border-box',
          boxShadow: DS.shadowSm, resize: 'none',
        }} />

      {!answered && (
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={commit} color={val.trim() ? DS.ink : DS.ink5} disabled={!val.trim()}>
            Check answer
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

window.TransformExercise = TransformExercise;
