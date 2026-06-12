// ─── HOME SCREEN — warm hero on top, white sheet with the unit list ──
// Soft cream hero: streak pill + avatar, centered greeting with the
// star, three white CTA cards. The unit list sits on a white sheet that
// rises into the hero with a convex arc (same move as the unit preview).
// Rows keep the rounded icon tiles — no separators, spacing only.

const HOME_HERO = '#DEEAFF';

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
      background: HOME_HERO, color: DS.ink, fontFamily: DS.sans,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero — header row, centered greeting, CTA cards.
          Covers the iOS safe-area with its own background so the status
          bar always sits on the hero colour, even when Safari throttles
          dynamic theme-color updates. */}
      <div style={{
        padding: `max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) 20px 0`,
        flexShrink: 0,
      }}>
        <div className="anim-fade" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFFFFF', borderRadius: 999, padding: '7px 12px 7px 9px',
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

        <div className="anim-fade" style={{
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
          textAlign: 'center', padding: '30px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <h1 style={{
              fontFamily: DS.display, fontSize: 32, fontWeight: 700,
              margin: 0, color: DS.ink, lineHeight: 1.1, letterSpacing: -0.5,
            }}>Hey, Timur</h1>
            <img src="icons/majesticons_star.svg" alt="" width="26" height="26" />
          </div>
          <p style={{
            fontSize: 15, color: DS.ink3, margin: 0,
            fontWeight: 500, letterSpacing: -0.1, lineHeight: 1.45,
            maxWidth: 260,
          }}>Pick up where you left off — {overallPct}% of the way through</p>
        </div>

        <div className="anim-slide-u" style={{
          display: 'flex', gap: 10, padding: '26px 0 0',
        }}>
          <CtaButton onClick={onOpenQuickTest} icon="majesticons_compass-2.svg" label="Practice" />
          <CtaButton onClick={onOpenReview} icon="majesticons_lightbulb-shine.svg" label="Flashcards" />
          <CtaButton onClick={onOpenWeakSpots} icon="majesticons_info-circle.svg"
            label="Weak spots" badge={weakCount > 0 ? weakCount : null} />
        </div>
      </div>

      {/* White sheet — convex arc, unit list. flex-basis must stay auto
          so the sheet's box grows with the list instead of clipping its
          background at viewport height. */}
      <div className="anim-slide-u" style={{
        flex: '1 0 auto', marginTop: 30,
        background: DS.paper,
        borderTopLeftRadius: '50% 36px', borderTopRightRadius: '50% 36px',
        padding: `30px 20px calc(240px + env(safe-area-inset-bottom, 0px))`,
        minHeight: 480,
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

// White CTA card on the hero: icon on top, label under it
function CtaButton({ onClick, icon, label, badge }) {
  return (
    <button onClick={onClick} className="tap"
      style={{
        flex: 1, minWidth: 0, cursor: 'pointer',
        background: '#FFFFFF', color: DS.ink,
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

// Soft pastel color per unit — used by CategoryScreen hero, lesson chips
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

window.HOME_HERO = HOME_HERO;
window.UNIT_META = UNIT_META;
window.HomeScreen = HomeScreen;
window.UNIT_COLORS = UNIT_COLORS;
