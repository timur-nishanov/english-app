// ─── UNIT PREVIEW — Headspace-style hero, two toggles, Start ──────
// Colour hero (the unit's vivid colour) with a back button and the unit
// glyph — white, on a vivid circle with a white ring — straddling a
// smooth convex arc. On the white sheet: centred title + subtitle, a
// stats row, and two iOS toggles (Production tasks / Quick recognition),
// then a Start button in the unit colour. Only these elements.

function IOSToggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className="tap" role="switch" aria-checked={on}
      style={{
        width: 58, height: 32, borderRadius: 999, flexShrink: 0,
        background: on ? DS.toggleOn : DS.ink5, border: 'none',
        position: 'relative', cursor: 'pointer', padding: 0,
        transition: `background 240ms ${DS.ease}`,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 28 : 2,
        width: 28, height: 28, borderRadius: 999, background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.28), 0 0 1px rgba(0,0,0,0.1)',
        transition: `left 240ms ${DS.ease}`,
      }} />
    </button>
  );
}

function ToggleRow({ icon, label, on, onToggle, last }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '18px 4px',
      }}>
        <img src={`icons/${icon}`} alt="" width="24" height="24" style={{ flexShrink: 0 }} />
        <span style={{
          flex: 1, fontSize: 16, fontWeight: 500, color: DS.ink, letterSpacing: -0.2,
        }}>{label}</span>
        <IOSToggle on={on} onToggle={onToggle} />
      </div>
      {!last && <div style={{ margin: '0 4px', borderTop: `1.5px dashed ${DS.line}` }} />}
    </div>
  );
}

function CategoryScreen({ topic, lesson, prefs, onStart, onChangePrefs, onBack }) {
  const colors = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || {};
  const vivid = colors.solid || DS.accent;
  const meta = (window.UNIT_META && window.UNIT_META[topic.id]) || { icon: 'majesticons_skull.svg' };

  const [production, setProduction] = React.useState(prefs ? prefs.production !== false : true);
  const [recognition, setRecognition] = React.useState(prefs ? prefs.recognition !== false : true);

  const isProd = (e) => (window.isProduction ? window.isProduction(e)
    : (e.type === 'gaptype' || e.type === 'type' || e.type === 'bank'));
  const matchesMode = (e) => {
    if (production && recognition) return true;
    if (production) return isProd(e);
    if (recognition) return !isProd(e);
    return false;
  };
  const count = lesson.exercises.filter(matchesMode).length;
  const mins = Math.max(1, Math.round(count * 0.8));
  const mode = production && recognition ? 'mix' : production ? 'production' : 'recognition';
  const canStart = count > 0 && (production || recognition);

  const start = () => {
    if (!canStart) return;
    onChangePrefs(topic.id, { production, recognition });
    onStart(topic.id, null, false, mode);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: vivid, color: DS.ink, fontFamily: DS.sans,
    }}>
      {/* Colour hero — covers the safe-area, holds the back button */}
      <div style={{
        background: vivid, flexShrink: 0, position: 'relative',
        height: `calc(max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) + 136px)`,
      }}>
        <button onClick={onBack} className="tap" aria-label="Back to units"
          style={{
            position: 'absolute', left: 16,
            top: `max(${DS.topSafe - 4}px, calc(env(safe-area-inset-top, ${DS.topSafe}px) - 4px))`,
            width: 38, height: 38, borderRadius: 999, border: 'none',
            background: '#FFFFFF', color: vivid, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          }}>
          <svg width="18" height="18" viewBox="0 0 16 16">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* White sheet — convex arc, content, Start pinned at the bottom */}
      <div className="anim-slide-u" style={{
        flex: 1, minHeight: 0, marginTop: -56,
        background: DS.paper, position: 'relative',
        borderTopLeftRadius: '50% 56px', borderTopRightRadius: '50% 56px',
        display: 'flex', flexDirection: 'column',
        padding: `64px 20px calc(24px + env(safe-area-inset-bottom, 0px))`,
      }}>
        {/* Unit glyph — white, on a vivid circle with a white ring, on the arc */}
        <div style={{
          position: 'absolute', top: -48, left: '50%', transform: 'translateX(-50%)',
          width: 96, height: 96, borderRadius: 999, boxSizing: 'border-box',
          background: vivid, border: '12px solid #FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MaskIcon src={`icons/${meta.icon}`} size={38} color="#FFFFFF" />
        </div>

        <h1 style={{
          fontFamily: DS.display, fontSize: 26, fontWeight: 700,
          letterSpacing: -0.5, margin: 0, lineHeight: 1.2, color: DS.ink,
          textAlign: 'center',
        }}>{topic.title}</h1>
        <div style={{
          fontSize: 15, color: DS.ink3, lineHeight: 1.4, letterSpacing: -0.1,
          marginTop: 6, textAlign: 'center', fontWeight: 500,
        }}>{topic.subtitle}</div>

        {/* Stats */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
          marginTop: 16,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <img src="icons/majesticons_list-box.svg" alt="" width="20" height="20" />
            <span className="tick" style={{ fontSize: 14, fontWeight: 600, color: DS.ink2, letterSpacing: -0.1 }}>
              {count} exercise{count === 1 ? '' : 's'}
            </span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <img src="icons/majesticons_timer.svg" alt="" width="20" height="20" />
            <span className="tick" style={{ fontSize: 14, fontWeight: 600, color: DS.ink2, letterSpacing: -0.1 }}>
              {mins} min{mins === 1 ? '' : 's'}
            </span>
          </span>
        </div>

        {/* Toggles */}
        <div style={{ marginTop: 26 }}>
          <ToggleRow icon="majesticons_edit-pen-2.svg" label="Production tasks"
            on={production} onToggle={() => setProduction(v => !v)} />
          <ToggleRow icon="majesticons_eye.svg" label="Quick recognition"
            on={recognition} onToggle={() => setRecognition(v => !v)} last />
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={start} disabled={!canStart} className="tap"
          style={{
            width: '100%', border: 'none', borderRadius: 999,
            padding: '17px 20px', cursor: canStart ? 'pointer' : 'default',
            background: canStart ? vivid : DS.ink5, color: '#FFFFFF',
            fontFamily: DS.sans, fontSize: 16, fontWeight: 700, letterSpacing: -0.2,
          }}>
          {canStart ? 'Start' : 'Turn on a task type to start'}
        </button>
      </div>
    </div>
  );
}

window.CategoryScreen = CategoryScreen;
