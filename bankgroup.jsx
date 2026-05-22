// ─── BANKGROUP — shared bank, many sentences ─────────────────────
// One sticky bank header up top, N items below. Tap a bank word →
// it lands in the active item and that item is checked off. Tap a
// filled blank → the word returns to the bank. "Check all" grades
// every item; the whole group counts as one item for SRS.

function BankgroupSentence({ sentence, value, color }) {
  const parts = (sentence || '').split('___');
  return (
    <span style={{ fontFamily: DS.display, fontSize: 16, lineHeight: 1.6, color: DS.ink }}>
      {parts[0]}
      <span style={{
        display: 'inline-block', minWidth: 70, padding: '2px 10px',
        borderRadius: 6, background: value ? DS.paperDeep : 'transparent',
        borderBottom: value ? 'none' : `2px solid ${color}`,
        color, fontWeight: 600, letterSpacing: -0.1,
        verticalAlign: 'baseline',
      }}>{value || '   '}</span>
      {parts[1]}
    </span>
  );
}

function BankgroupExercise({ ex, topic, answered, onAnswer }) {
  const items = ex.items || [];
  const bank = ex.bank || [];

  // assignments: { itemIdx: bankWord }
  const [assigned, setAssigned] = React.useState({});
  const [active, setActive] = React.useState(0);
  const [results, setResults] = React.useState(null);

  React.useEffect(() => {
    setAssigned({}); setActive(0); setResults(null);
  }, [ex]);

  const usedWords = new Set(Object.values(assigned));
  const filledCount = Object.keys(assigned).length;

  const assignToActive = (word) => {
    if (results) return;
    if (usedWords.has(word) && assigned[active] !== word) return; // already used elsewhere
    setAssigned(a => ({ ...a, [active]: word }));
    // advance to next still-empty item
    for (let step = 1; step <= items.length; step++) {
      const next = (active + step) % items.length;
      if (!assigned[next] && next !== active) { setActive(next); return; }
    }
  };

  const clearItem = (idx) => {
    if (results) return;
    setAssigned(a => { const n = { ...a }; delete n[idx]; return n; });
    setActive(idx);
  };

  const checkAll = () => {
    if (answered) return;
    const res = items.map((it, i) => (assigned[i] || '').toLowerCase() === (it.answer || '').toLowerCase());
    setResults(res);
    onAnswer(res.every(Boolean));
  };

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('bankgroup')} />

      {/* Sticky bank */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: DS.paper, padding: '4px 0 12px', marginBottom: 6,
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {bank.map((w, i) => {
          const used = usedWords.has(w);
          return (
            <button key={i} className="tap"
              onClick={() => !used && assignToActive(w)}
              disabled={used || !!results}
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: DS.paperCard, border: 'none',
                color: used ? DS.ink4 : DS.ink,
                opacity: used ? 0.35 : 1,
                fontSize: 14, fontWeight: 500, letterSpacing: -0.1,
                fontFamily: DS.sans, cursor: (used || results) ? 'default' : 'pointer',
                boxShadow: used ? 'none' : DS.shadowSm,
              }}>{w}</button>
          );
        })}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {items.map((it, idx) => {
          const isActive = active === idx && !results;
          const status = results ? (results[idx] ? 'right' : 'wrong') : null;
          let border = 'transparent', bg = DS.paperCard;
          if (status === 'right') { border = DS.correct; bg = DS.correctSoft; }
          else if (status === 'wrong') { border = DS.wrong; bg = DS.wrongSoft; }
          else if (isActive) { border = DS.accent; }
          return (
            <button key={idx} className="tap" onClick={() => !results && setActive(idx)}
              style={{
                width: '100%', textAlign: 'left',
                background: bg, padding: '12px 14px',
                borderRadius: 14, border: `1.5px solid ${border}`,
                boxShadow: DS.shadowSm, cursor: results ? 'default' : 'pointer',
                fontFamily: DS.sans,
              }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: DS.ink3, flexShrink: 0 }}>{idx + 1}.</span>
                <div style={{ flex: 1 }}>
                  <BankgroupSentence sentence={it.sentence}
                    value={assigned[idx] ? (
                      <span onClick={(e) => { e.stopPropagation(); clearItem(idx); }} style={{ cursor: 'pointer' }}>
                        {assigned[idx]}
                      </span>
                    ) : null}
                    color={isActive ? DS.accent : DS.ink3} />
                  {status === 'wrong' && (
                    <div style={{ fontSize: 12, color: DS.wrongDark, marginTop: 4, letterSpacing: -0.1 }}>
                      answer: <b>{it.answer}</b>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!results && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 14px' }}>
          <span className="tick" style={{
            fontSize: 13, fontWeight: 600, color: DS.ink3, flexShrink: 0,
          }}>{filledCount} / {items.length} filled</span>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={checkAll}
              color={filledCount === items.length ? DS.ink : DS.ink5}
              disabled={filledCount !== items.length}>
              Check all
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

window.BankgroupExercise = BankgroupExercise;
