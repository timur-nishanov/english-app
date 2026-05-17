// ─── CATEGORY SCREEN — tag filter + shuffle, before the lesson ───
// Same visual language as the rest of the app (DS tokens, rounded
// cards, pastel mark, Chip-style pills). No new design concept.

function CategoryScreen({ topic, lesson, prefs, onStart, onChangePrefs, onBack }) {
  const c = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || { bg: DS.paperDeep, fg: DS.ink };

  const exercises = lesson.exercises;
  const allTags = [];
  const tagCounts = {};
  exercises.forEach(e => {
    const t = e.tag || 'Other';
    if (!(t in tagCounts)) allTags.push(t);
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });

  // selection: prefs.tags, or all tags when none stored
  const initialSel = (prefs && prefs.tags && prefs.tags.length)
    ? prefs.tags.filter(t => allTags.includes(t))
    : allTags.slice();
  const [selected, setSelected] = React.useState(initialSel.length ? initialSel : allTags.slice());
  const [shuffle, setShuffle] = React.useState(prefs ? !!prefs.shuffle : false);

  const toggleTag = (t) => {
    setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  };

  const count = exercises.filter(e => selected.includes(e.tag || 'Other')).length;

  const start = () => {
    onChangePrefs(topic.id, { tags: selected, shuffle });
    onStart(topic.id, selected, shuffle);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, color: DS.ink, fontFamily: DS.sans }}>
      <div className="anim-fade" style={{ padding: `${DS.topSafe}px 20px 18px`, background: DS.paper }}>
        <BackButton onClick={onBack} label="Units" color={DS.ink} />
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, background: c.bg, color: c.fg, borderRadius: 20,
            fontFamily: DS.display, fontWeight: 700, fontSize: 34, letterSpacing: -1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{topic.mark}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1 }}>Unit {topic.n}</div>
            <h1 style={{
              fontFamily: DS.display, fontSize: 25, fontWeight: 700,
              letterSpacing: -0.7, margin: '2px 0 4px', lineHeight: 1.1, color: DS.ink,
            }}>{topic.title}</h1>
            <div style={{ fontSize: 13, color: DS.ink3, lineHeight: 1.4, letterSpacing: -0.1 }}>{topic.subtitle}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1, margin: '8px 4px 10px' }}>
          Topics — tap to include
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allTags.map(t => {
            const on = selected.includes(t);
            return (
              <button key={t} onClick={() => toggleTag(t)} className="tap"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 13px', borderRadius: 999, cursor: 'pointer',
                  fontFamily: DS.sans, fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
                  background: on ? c.bg : DS.paperCard,
                  color: on ? c.fg : DS.ink3,
                  border: `1.5px solid ${on ? c.fg : 'transparent'}`,
                  boxShadow: on ? 'none' : DS.shadowSm,
                }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 99, flexShrink: 0,
                  background: on ? c.fg : 'transparent',
                  border: `1.5px solid ${on ? c.fg : DS.ink5}`,
                  color: c.bg, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{on ? '✓' : ''}</span>
                {t}
                <span style={{ opacity: 0.6, fontWeight: 500 }}>{tagCounts[t]}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1, margin: '22px 4px 10px' }}>
          Order
        </div>
        <button onClick={() => setShuffle(s => !s)} className="row-press"
          style={{
            width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: DS.paperCard, borderRadius: 16, padding: '14px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: DS.shadowSm, fontFamily: DS.sans,
          }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: shuffle ? c.bg : DS.paperDeep, color: shuffle ? c.fg : DS.ink3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `all 200ms ${DS.ease}`,
          }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <path d="M3 5h3.2c1.6 0 2.7 .9 3.6 2.2l2.4 3.6c.9 1.3 2 2.2 3.6 2.2H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17h3.2c1.6 0 2.7-.9 3.6-2.2l2.4-3.6c.9-1.3 2-2.2 3.6-2.2H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 2.5L19.5 5l-3 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 12L19.5 14.5l-3 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DS.display, fontSize: 15, fontWeight: 600, color: DS.ink, letterSpacing: -0.3 }}>
              Shuffle the order
            </div>
            <div style={{ fontSize: 13, color: DS.ink3, marginTop: 2, letterSpacing: -0.1 }}>
              Don’t always start from the same exercise
            </div>
          </div>
          <div style={{
            width: 46, height: 28, borderRadius: 99, flexShrink: 0,
            background: shuffle ? c.fg : DS.ink5, position: 'relative',
            transition: `background 200ms ${DS.ease}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 99, background: DS.paperCard,
              position: 'absolute', top: 3, left: shuffle ? 21 : 3,
              transition: `left 200ms ${DS.ease}`, boxShadow: DS.shadowSm,
            }} />
          </div>
        </button>
      </div>

      <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
        <PrimaryButton onClick={start} color={count ? DS.ink : DS.ink5} disabled={!count}>
          {count ? `Start · ${count} exercise${count === 1 ? '' : 's'}` : 'Select at least one topic'}
        </PrimaryButton>
      </div>
    </div>
  );
}

window.CategoryScreen = CategoryScreen;
