// ─── CATEGORY SCREEN — Headspace-style hero, settings on a white sheet ──
// Bright pastel hero in the unit's colour: centered mark, unit label and
// title. The white sheet below rises into the hero with a convex arc
// (elliptical top corners). Settings stay minimal: mode pills + shuffle
// toggle, Start pinned at the bottom.

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

  const modeLabels = { mix: 'Mix', production: 'Production only', recognition: 'Quick recognition' };
  const renderModePill = (m) => {
    const on = mode === m;
    return (
      <button key={m} onClick={() => setMode(m)} className="tap"
        style={{
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
          fontFamily: DS.sans, fontSize: 13, fontWeight: 600, letterSpacing: -0.1,
          background: on ? DS.ink : DS.paperCard,
          color: on ? '#FFFFFF' : DS.ink3,
          border: 'none', whiteSpace: 'nowrap',
        }}>
        {modeLabels[m]}
      </button>
    );
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: c.bg, color: DS.ink, fontFamily: DS.sans,
    }}>
      {/* Hero — unit colour, centered title. Covers the iOS safe-area
          with its own background (same trick as LessonTopBar) so the
          status bar sits on the unit colour even when Safari throttles
          dynamic theme-color updates. */}
      <div className="anim-fade" style={{
        padding: `max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) 20px 0`,
        flexShrink: 0, position: 'relative',
      }}>
        <button onClick={onBack} className="tap" aria-label="Back to units"
          style={{
            position: 'absolute', left: 16,
            top: `max(${DS.topSafe - 4}px, calc(env(safe-area-inset-top, ${DS.topSafe}px) - 4px))`,
            width: 38, height: 38, borderRadius: 999, border: 'none',
            background: '#FFFFFF', color: c.fg, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>
          <svg width="18" height="18" viewBox="0 0 16 16">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', padding: '10px 28px 0',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999, background: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src={`icons/${((window.UNIT_META && window.UNIT_META[topic.id]) || {}).icon || 'majesticons_skull.svg'}`}
              alt="" width="30" height="30" />
          </div>
          <div style={{
            fontSize: 13, color: c.fg, fontWeight: 600, letterSpacing: -0.1,
            marginTop: 16, opacity: 0.8,
          }}>Unit {topic.n}</div>
          <h1 style={{
            fontFamily: DS.display, fontSize: 28, fontWeight: 700,
            letterSpacing: -0.6, margin: '4px 0 0', lineHeight: 1.15, color: DS.ink,
          }}>{topic.title}</h1>
          <div style={{
            fontSize: 14, color: DS.ink2, lineHeight: 1.45, letterSpacing: -0.1,
            marginTop: 8, opacity: 0.75, maxWidth: 280,
          }}>{topic.subtitle}</div>
        </div>
      </div>

      {/* White sheet — convex arc top edge, settings + Start */}
      <div className="anim-slide-u" style={{
        flex: 1, minHeight: 0, marginTop: 28,
        background: DS.paper,
        borderTopLeftRadius: '50% 36px', borderTopRightRadius: '50% 36px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '34px 20px 12px' }}>
          <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 600, letterSpacing: -0.1, margin: '0 4px 10px' }}>
            Mode
          </div>
          {/* One row, horizontal scroll, full-bleed to the screen edges */}
          <div className="scroll" style={{
            display: 'flex', gap: 8, overflowX: 'auto',
            margin: '0 -20px', padding: '0 20px',
          }}>
            {['mix','production','recognition'].map(renderModePill)}
          </div>

          <div style={{ fontSize: 13, color: DS.ink3, fontWeight: 600, letterSpacing: -0.1, margin: '24px 4px 10px' }}>
            Order
          </div>
          <button onClick={() => setShuffle(s => !s)} className="row-press"
            style={{
              width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: DS.paperCard, borderRadius: 16, padding: '14px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: DS.sans,
            }}>
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
    </div>
  );
}

window.CategoryScreen = CategoryScreen;
