// ─── CATEGORY SCREEN — mode + shuffle, before the lesson ────────
// Grey canvas, white cards (Figma mockup). No tag picking — the whole
// unit is always in play; the only choices are the practice mode and
// whether to shuffle the order.

function CategoryScreen({ topic, lesson, prefs, onStart, onChangePrefs, onBack }) {
  const c = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || { bg: DS.paperDeep, fg: DS.ink };

  const exercises = lesson.exercises;

  const [shuffle, setShuffle] = React.useState(prefs ? !!prefs.shuffle : false);
  const [mode, setMode] = React.useState((prefs && prefs.mode) || 'mix');

  const matchesMode = (e) => {
    if (mode === 'mix') return true;
    const isProd = window.isProduction ? window.isProduction(e) : (e.type === 'gaptype' || e.type === 'type' || e.type === 'bank');
    return mode === 'production' ? isProd : !isProd;
  };
  const count = exercises.filter(matchesMode).length;

  const start = () => {
    onChangePrefs(topic.id, { shuffle, mode });
    onStart(topic.id, null, shuffle, mode);
  };

  const modeIcon = (m) => {
    if (m === 'mix') return <span style={{ fontSize: 13 }}>⚡</span>;
    if (m === 'production') return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4.5 7l1.7 1.7L9.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 1.5a5.5 5.5 0 010 11z" fill="currentColor"/>
      </svg>
    );
  };
  const modeLabels = { mix: 'Mix', production: 'Production only', recognition: 'Quick recognition' };
  const renderModePill = (m) => {
    const on = mode === m;
    return (
      <button key={m} onClick={() => setMode(m)} className="tap"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 13px', borderRadius: 999, cursor: 'pointer',
          fontFamily: DS.sans, fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
          background: on ? DS.ink : DS.paperCard,
          color: on ? '#FFFFFF' : DS.ink3,
          border: 'none',
        }}>
        {modeIcon(m)}
        {modeLabels[m]}
      </button>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, color: DS.ink, fontFamily: DS.sans }}>
      <div className="anim-fade" style={{ padding: `${DS.topSafe}px 20px 18px` }}>
        <BackButton onClick={onBack} label="Units" color={DS.ink} />
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, background: c.bg, color: c.fg, borderRadius: 20,
            fontFamily: DS.display, fontWeight: 700, fontSize: 34, letterSpacing: -1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{topic.mark}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: DS.ink3, fontWeight: 500, letterSpacing: 0 }}>Unit {topic.n}</div>
            <h1 style={{
              fontFamily: DS.display, fontSize: 25, fontWeight: 700,
              letterSpacing: -0.4, margin: '2px 0 4px', lineHeight: 1.1, color: DS.ink,
            }}>{topic.title}</h1>
            <div style={{ fontSize: 13, color: DS.ink3, lineHeight: 1.4, letterSpacing: 0 }}>{topic.subtitle}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: 0, margin: '8px 4px 10px' }}>
          Mode
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['mix','production','recognition'].map(renderModePill)}
        </div>

        <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: 0, margin: '22px 4px 10px' }}>
          Order
        </div>
        <button onClick={() => setShuffle(s => !s)} className="row-press"
          style={{
            width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: DS.paperCard, borderRadius: 16, padding: '14px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: DS.sans,
          }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: shuffle ? c.bg : DS.paper, color: shuffle ? c.fg : DS.ink3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `all 200ms ${DS.ease}`,
          }}>
            <ShuffleIcon size={19} color="currentColor" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DS.display, fontSize: 15, fontWeight: 600, color: DS.ink, letterSpacing: -0.2 }}>
              Shuffle the order
            </div>
            <div style={{ fontSize: 13, color: DS.ink3, marginTop: 2, letterSpacing: 0 }}>
              Don’t always start from the same exercise
            </div>
          </div>
          <div style={{
            width: 46, height: 28, borderRadius: 99, flexShrink: 0,
            background: shuffle ? c.fg : DS.ink5, position: 'relative',
            transition: `background 200ms ${DS.ease}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 99, background: '#FFFFFF',
              position: 'absolute', top: 3, left: shuffle ? 21 : 3,
              transition: `left 200ms ${DS.ease}`,
            }} />
          </div>
        </button>
      </div>

      <div style={{ padding: '8px 20px 24px' }}>
        <PrimaryButton onClick={start} color={count ? DS.ink : DS.ink5} disabled={!count}>
          {count ? `Start · ${count} exercise${count === 1 ? '' : 's'}` : 'Nothing to practise in this mode'}
        </PrimaryButton>
      </div>
    </div>
  );
}

window.CategoryScreen = CategoryScreen;
