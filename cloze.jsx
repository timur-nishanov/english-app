// ─── CLOZE — connected text with many blanks ────────────────────
// One ex.text contains {1} {2} …{N} placeholders; ex.blanks provides the
// hint, answer, and accepted variants for each. Tap a blank → bottom sheet
// to type the answer. "Check all" grades every blank at once; the whole
// cloze counts as one item for SRS (correct if ≥75 % of blanks are right).

function normalizeClozeAnswer(s) {
  return (s || '').trim().toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');
}

function clozeBlankCorrect(blank, value) {
  const v = normalizeClozeAnswer(value);
  if (!v) return false;
  const variants = [blank.answer, ...(blank.accept || [])].map(normalizeClozeAnswer);
  return variants.includes(v);
}

function ClozeBlank({ n, value, status, active, onClick }) {
  const filled = !!value;
  let bg = DS.accentSoft, fg = DS.accentDark, border = 'transparent';
  if (status === 'right') { bg = DS.correctSoft; fg = DS.correctDark; }
  else if (status === 'wrong') { bg = DS.wrongSoft; fg = DS.wrongDark; }
  else if (filled) { bg = DS.ink; fg = DS.paperCard; }
  if (active) { border = DS.accent; }
  return (
    <button onClick={onClick} className="tap" disabled={status !== undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        minWidth: 80, maxWidth: 220, padding: '2px 10px',
        height: 28, borderRadius: 8,
        border: `2px solid ${border}`,
        background: bg, color: fg,
        fontFamily: DS.sans, fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
        verticalAlign: 'middle', cursor: status !== undefined ? 'default' : 'pointer',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
      {filled ? value : `{${n}}`}
      {status === 'right' && <span style={{ opacity: 0.85, display: 'inline-flex' }}><CheckIcon size={11} /></span>}
      {status === 'wrong' && <span style={{ opacity: 0.85, display: 'inline-flex' }}><CrossIcon size={11} /></span>}
    </button>
  );
}

function ClozeExercise({ ex, topic, answered, onAnswer }) {
  const blanks = ex.blanks || [];
  const blanksById = React.useMemo(() => {
    const m = {}; blanks.forEach(b => { m[b.id] = b; }); return m;
  }, [ex]);

  const [filled, setFilled] = React.useState({});      // { id: string }
  const [active, setActive] = React.useState(null);    // blank id while sheet is open
  const [results, setResults] = React.useState(null);  // { id: 'right'|'wrong' } after check
  const [panelValue, setPanelValue] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    setFilled({}); setActive(null); setResults(null); setPanelValue('');
  }, [ex]);

  React.useEffect(() => {
    if (active !== null) setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [active]);

  const filledCount = Object.keys(filled).filter(k => filled[k] && filled[k].trim()).length;
  const totalBlanks = blanks.length;

  const openBlank = (id) => {
    if (results) return;
    setActive(id);
    setPanelValue(filled[id] || '');
  };
  const closePanel = () => { setActive(null); setPanelValue(''); };
  const saveBlank = () => {
    if (active === null) return;
    setFilled(f => ({ ...f, [active]: panelValue.trim() }));
    // jump to next still-empty blank
    const idx = blanks.findIndex(b => b.id === active);
    let nextId = null;
    for (let step = 1; step <= blanks.length; step++) {
      const cand = blanks[(idx + step) % blanks.length];
      if (!filled[cand.id] || !filled[cand.id].trim()) {
        if (cand.id !== active) { nextId = cand.id; break; }
      }
    }
    setActive(nextId);
    setPanelValue(nextId !== null ? (filled[nextId] || '') : '');
  };

  const checkAll = () => {
    if (answered) return;
    const res = {};
    let rightCount = 0;
    blanks.forEach(b => {
      const ok = clozeBlankCorrect(b, filled[b.id] || '');
      res[b.id] = ok ? 'right' : 'wrong';
      if (ok) rightCount++;
    });
    setResults(res);
    setActive(null);
    onAnswer(rightCount / totalBlanks >= 0.75);
  };

  // Render text with {N} placeholders.
  const paragraphs = (ex.text || '').split('\n');
  const renderParagraph = (line, pIdx) => {
    const parts = line.split(/(\{\d+\})/g);
    return (
      <p key={pIdx} style={{ margin: '0 0 12px', lineHeight: 1.85 }}>
        {parts.map((p, i) => {
          const m = /^\{(\d+)\}$/.exec(p);
          if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
          const n = Number(m[1]);
          return (
            <ClozeBlank key={i}
              n={n}
              value={filled[n]}
              status={results ? results[n] : undefined}
              active={active === n}
              onClick={() => openBlank(n)}
            />
          );
        })}
      </p>
    );
  };

  const wrongs = results
    ? blanks.filter(b => results[b.id] === 'wrong').map(b => ({
        n: b.id, you: filled[b.id] || '(empty)', want: b.answer,
      }))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('cloze')} />
      {ex.intro && (
        <div style={{
          fontSize: 14, color: DS.ink3, lineHeight: 1.5, marginBottom: 16, letterSpacing: -0.1,
        }}>{ex.intro}</div>
      )}
      <div style={{
        background: DS.paperCard, borderRadius: 18, padding: 18,
        boxShadow: DS.shadowSm, marginBottom: 14,
        fontFamily: DS.display, fontSize: 16, color: DS.ink2,
      }}>
        {paragraphs.map(renderParagraph)}
      </div>

      {results && (
        <div className="anim-slide-u" style={{
          background: DS.paperCard, borderRadius: 18, padding: 16,
          boxShadow: DS.shadowSm, marginBottom: 14,
        }}>
          <div style={{
            fontFamily: DS.display, fontSize: 18, fontWeight: 700,
            letterSpacing: -0.4, color: DS.ink, marginBottom: wrongs.length ? 10 : 0,
          }}>
            {totalBlanks - wrongs.length} / {totalBlanks} correct
          </div>
          {wrongs.length > 0 && (
            <div style={{ fontSize: 13, color: DS.ink2, lineHeight: 1.6 }}>
              {wrongs.map(w => (
                <div key={w.n} style={{ marginBottom: 4 }}>
                  <b style={{ color: DS.ink }}>{w.n}.</b> you wrote: “{w.you}” → answer: <b style={{ color: DS.ink }}>{w.want}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sticky bottom: progress + check, OR blank-input panel */}
      {!results && (
        active !== null ? (
          <div className="anim-slide-u" style={{
            background: DS.paperCard, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: '18px 20px 22px', boxShadow: '0 -2px 12px rgba(14,16,19,0.06)',
            position: 'sticky', bottom: 0, marginTop: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: DS.ink3,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>Blank #{active}</span>
              <button onClick={closePanel} className="tap" style={{
                background: 'transparent', border: 'none', padding: 4, cursor: 'pointer', color: DS.ink3,
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{
              display: 'inline-flex', background: DS.paperDeep, color: DS.ink2,
              padding: '8px 12px', borderRadius: 10, marginBottom: 12,
              fontFamily: DS.mono, fontSize: 16, fontWeight: 600,
            }}>{blanksById[active] && blanksById[active].hint}</div>
            <input ref={inputRef} value={panelValue}
              onChange={e => setPanelValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveBlank()}
              placeholder="Type your answer…"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                border: '1.5px solid transparent', fontSize: 17, fontFamily: DS.sans,
                background: DS.paperCard, color: DS.ink, outline: 'none', boxSizing: 'border-box',
                boxShadow: DS.shadowSm, marginBottom: 14,
              }}/>
            <PrimaryButton onClick={saveBlank} color={DS.ink}>Save</PrimaryButton>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '8px 0 20px', marginTop: 'auto',
          }}>
            <span className="tick" style={{
              fontSize: 13, fontWeight: 600, color: DS.ink3, flexShrink: 0,
            }}>{filledCount} / {totalBlanks} filled</span>
            <div style={{ flex: 1 }}>
              <PrimaryButton onClick={checkAll}
                color={filledCount === totalBlanks ? DS.ink : DS.ink5}
                disabled={filledCount !== totalBlanks}>
                Check all
              </PrimaryButton>
            </div>
          </div>
        )
      )}
    </div>
  );
}

window.ClozeExercise = ClozeExercise;
