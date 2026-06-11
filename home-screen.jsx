// ─── HOME SCREEN — Anything / Apple Store direction ──────────────
// White canvas everywhere. Left-aligned large title, quiet streak pill,
// three soft-grey CTA cards, then the unit list as rows with rounded
// icon tiles — no separators, hierarchy comes from spacing alone.

// icon file + display label per unit
const UNIT_META = {
  'idioms-expressions':      { icon: 'majesticons_skull.svg',           label: 'Idioms & Expressions' },
  'work-money':              { icon: 'majesticons_cash.svg',            label: 'Work & Money' },
  'people-feelings':         { icon: 'majesticons_cookie.svg',          label: 'People & Feelings' },
  'everyday-life':           { icon: 'majesticons_clock.svg',           label: 'Time, leisure, dining, colours' },
  'conditionals-inversions': { icon: 'majesticons_arrow-up-circle.svg', label: 'Conditionals & Inversions' },
  'tenses':                  { icon: 'majesticons_timer.svg',           label: 'Tenses' },
  'reported-speech':         { icon: 'majesticons_comment-2-text.svg',  label: 'Reported speech' },
  'verb-patterns':           { icon: 'majesticons_skull-1.svg',         label: 'Gerund, infinitive, causative' },
  'phrasal-verbs':           { icon: 'majesticons_hand.svg',            label: 'Phrasal Verbs (Get, take, put, go and more)' },
  'word-formation':          { icon: 'majesticons_bug-2.svg',           label: 'Prefixes, opposites, suffixes' },
  'words-phrases':           { icon: 'majesticons_chat-2.svg',          label: 'Words: see, memory, intentions and more' },
};

function HomeScreen({ progress, streak, weakCount, onPickLesson, onOpenReview, onOpenQuickTest, onOpenWeakSpots, onOpenProfile }) {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons, 0);
  const doneLessons = TOPICS.reduce((s, t) => s + Math.floor((progress[t.id] || 0) * t.lessons), 0);
  const overallPct = Math.round((doneLessons / totalLessons) * 100);

  return (
    <div style={{
      height: '100%', overflow: 'auto',
      overscrollBehavior: 'contain',
      background: DS.paper, color: DS.ink, fontFamily: DS.sans,
    }}>
      {/* Header — streak pill left, avatar right */}
      <div className="anim-fade" style={{
        padding: `${DS.topSafe}px 20px 0`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: DS.paperCard, borderRadius: 999, padding: '7px 12px 7px 9px',
        }}>
          <img src="icons/majesticons_fire.svg" alt="" width="16" height="16" />
          <span className="tick" style={{
            fontSize: 13, color: DS.ink2, fontWeight: 600, letterSpacing: -0.1,
          }}>{streak} day{streak === 1 ? '' : 's'}</span>
        </div>
        <button onClick={onOpenProfile} className="tap" style={{
          border: 'none', background: DS.ink,
          width: 34, height: 34, borderRadius: 999, padding: 0,
          color: '#FFFFFF', cursor: 'pointer', overflow: 'hidden',
          fontFamily: DS.display, fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          T
          <img src="icons/ava.png" alt=""
            onError={e => { e.target.style.display = 'none'; }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', borderRadius: 999,
            }} />
        </button>
      </div>

      {/* Large title — left-aligned, App Store style */}
      <div className="anim-fade" style={{ padding: '28px 20px 0' }}>
        <h1 style={{
          fontFamily: DS.display, fontSize: 34, fontWeight: 700,
          margin: 0, color: DS.ink, lineHeight: 1.1, letterSpacing: -0.6,
        }}>Hey, Timur</h1>
        <p style={{
          fontSize: 16, color: DS.ink3, margin: '8px 0 0',
          fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.45,
        }}>Pick up where you left off — {overallPct}% of the way through</p>
      </div>

      {/* CTA row — three soft-grey cards */}
      <div className="anim-slide-u" style={{
        display: 'flex', gap: 10, padding: '24px 20px 0',
      }}>
        <CtaButton onClick={onOpenQuickTest} icon="majesticons_compass-2.svg" label="Practice" />
        <CtaButton onClick={onOpenReview} icon="majesticons_lightbulb-shine.svg" label="Flashcards" />
        <CtaButton onClick={onOpenWeakSpots} icon="majesticons_info-circle.svg"
          label="Weak spots" badge={weakCount > 0 ? weakCount : null} />
      </div>

      {/* Unit list — rounded icon tiles, no separators */}
      <div className="anim-slide-u" style={{
        padding: `28px 20px calc(40px + env(safe-area-inset-bottom, 0px))`,
      }}>
        <div style={{
          fontSize: 13, color: DS.ink3, fontWeight: 600, letterSpacing: -0.1,
          margin: '0 4px 6px',
        }}>Units</div>
        {TOPICS.map((topic) => {
          const meta = UNIT_META[topic.id] || { icon: 'majesticons_skull.svg', label: topic.title };
          return (
            <button key={topic.id} onClick={() => onPickLesson(topic)} className="row-press"
              style={{
                width: '100%', border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: DS.sans,
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '9px 4px',
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                background: DS.paperCard,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={`icons/${meta.icon}`} alt="" width="22" height="22" />
              </div>
              <span style={{
                flex: 1, fontSize: 16, fontWeight: 500, color: DS.ink,
                letterSpacing: -0.2, lineHeight: 1.3,
              }}>{meta.label}</span>
              <ChevronRightIcon size={14} color={DS.ink4} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Soft-grey CTA card: icon on top, label under it
function CtaButton({ onClick, icon, label, badge }) {
  return (
    <button onClick={onClick} className="tap"
      style={{
        flex: 1, minWidth: 0, cursor: 'pointer',
        background: DS.paperCard, color: DS.ink,
        border: 'none', borderRadius: 18,
        padding: '16px 8px 14px',
        display: 'flex', flexDirection: 'column', gap: 7,
        alignItems: 'center', justifyContent: 'center',
        fontFamily: DS.sans, position: 'relative',
      }}>
      <img src={`icons/${icon}`} alt="" width="20" height="20" />
      <span style={{
        fontSize: 13, fontWeight: 600, letterSpacing: -0.1, lineHeight: 1.3,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
      }}>{label}</span>
      {badge != null && (
        <span className="tick" style={{
          position: 'absolute', top: 8, right: 8,
          minWidth: 18, height: 18, borderRadius: 999, padding: '0 5px',
          background: DS.ink, color: '#FFFFFF',
          fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </button>
  );
}

// Soft pastel color per unit — still used by CategoryScreen, lesson chips
// and Quick practice pills.
const UNIT_COLORS = {
  'idioms-expressions':      { bg: '#FFE8DC', fg: '#B5683F' },
  'work-money':             { bg: '#E2F4EA', fg: '#147542' },
  'people-feelings':        { bg: '#E2F0FF', fg: '#1F4FCC' },
  'everyday-life':          { bg: '#F1E5FF', fg: '#6B3FBF' },
  'conditionals-inversions':{ bg: '#E0F1F5', fg: '#0F6C84' },
  'tenses':                 { bg: '#FCE0EF', fg: '#A6336F' },
  'reported-speech':        { bg: '#FFE0E0', fg: '#A82B22' },
  'verb-patterns':          { bg: '#FFF1C2', fg: '#9B7400' },
  'phrasal-verbs':          { bg: '#FFEAD1', fg: '#9C5818' },
  'word-formation':         { bg: '#E6EEFF', fg: '#1F4FCC' },
  'words-phrases':          { bg: '#FFE6F0', fg: '#A6336F' },
};

window.HomeScreen = HomeScreen;
window.UNIT_COLORS = UNIT_COLORS;
