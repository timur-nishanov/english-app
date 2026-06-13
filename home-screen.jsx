// ─── HOME SCREEN — blue hero with white text, plain unit list ────
// Vivid blue hero (status bar matches it). White greeting + star, quiet
// streak (flame + white text, no pill), ringed avatar, white CTA cards.
// The unit list sits on a white sheet that rises into the hero with a
// convex arc; rows are icon + label + chevron with dashed separators —
// no tile behind the icon.

const HOME_HERO = '#1B77E7';

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
      // White base canvas — overscrolling past the list at the bottom
      // only ever rubber-bands white, never the hero colour.
      background: DS.paper, color: DS.ink, fontFamily: DS.sans,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero — owns the blue background and covers the iOS safe-area so
          the status bar sits on blue. Extra bottom padding lets the blue
          run under the sheet's arc. */}
      <div style={{
        background: HOME_HERO, flexShrink: 0,
        padding: `max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) 20px 48px`,
      }}>
        <div className="anim-fade" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <img src="icons/majesticons_fire.svg" alt="" width="20" height="20" />
            <span className="tick" style={{
              fontSize: 14, color: '#FFFFFF', fontWeight: 600, letterSpacing: -0.1,
            }}>{streak} day{streak === 1 ? '' : 's'}</span>
          </div>
          <button onClick={onOpenProfile} className="tap" style={{
            border: 'none', background: 'rgba(255,255,255,0.2)',
            width: 34, height: 34, borderRadius: 999, padding: 0,
            color: '#FFFFFF', cursor: 'pointer', overflow: 'hidden',
            fontFamily: DS.display, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', boxShadow: '0 0 0 2px rgba(255,255,255,0.9)',
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
          textAlign: 'center', padding: '34px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <h1 style={{
              fontFamily: DS.display, fontSize: 32, fontWeight: 700,
              margin: 0, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -0.5,
            }}>Hey, Timur</h1>
            <img src="icons/majesticons_star.svg" alt="" width="28" height="28" />
          </div>
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.78)', margin: 0,
            fontWeight: 500, letterSpacing: -0.1, lineHeight: 1.45,
            maxWidth: 264,
          }}>Pick up where you left off — {overallPct}% of the way through</p>
        </div>

        <div className="anim-slide-u" style={{
          display: 'flex', gap: 10, padding: '28px 0 0',
        }}>
          <CtaButton onClick={onOpenQuickTest} icon="majesticons_compass-2.svg" label="Practice" />
          <CtaButton onClick={onOpenReview} icon="majesticons_lightbulb-shine.svg" label="Flashcards" />
          <CtaButton onClick={onOpenWeakSpots} icon="majesticons_info-circle.svg"
            label="Weak spots" badge={weakCount > 0 ? weakCount : null} />
        </div>
      </div>

      {/* White sheet — convex arc rising over the hero, then the unit
          list. flex 1 0 auto keeps the sheet at least full height; small
          bottom padding gives a gentle spring instead of a big band. */}
      <div className="anim-slide-u" style={{
        flex: '1 0 auto', marginTop: -34,
        background: DS.paper,
        borderTopLeftRadius: '50% 36px', borderTopRightRadius: '50% 36px',
        padding: `30px 20px calc(36px + env(safe-area-inset-bottom, 0px))`,
      }}>
        {TOPICS.map((topic, i) => {
          const meta = UNIT_META[topic.id] || { icon: 'majesticons_skull.svg', label: topic.title };
          return (
            <button key={topic.id} onClick={() => onPickLesson(topic)} className="row-press"
              style={{
                width: '100%', border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: DS.sans,
                display: 'block', padding: 0,
              }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '20px 4px',
              }}>
                <img src={`icons/${meta.icon}`} alt="" width="24" height="24" style={{ flexShrink: 0 }} />
                <span style={{
                  flex: 1, fontSize: 16, fontWeight: 500, color: DS.ink,
                  letterSpacing: -0.2, lineHeight: '20px',
                }}>{meta.label}</span>
                <ChevronRightIcon size={14} color={DS.ink4} />
              </div>
              {i < TOPICS.length - 1 && (
                <div style={{ margin: '0 4px', borderTop: `1.5px dashed ${DS.line}` }} />
              )}
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

// Per-unit colours. bg/fg are the soft pastel pair used by lesson chips,
// Quick-practice pills and the profile; solid is the vivid hero / button
// colour used by the unit preview.
const UNIT_COLORS = {
  'idioms-expressions':      { bg: '#FFE8DC', fg: '#B5683F', solid: '#1B77E7' },
  'work-money':             { bg: '#E2F4EA', fg: '#147542', solid: '#D9791E' },
  'people-feelings':        { bg: '#E2F0FF', fg: '#1F4FCC', solid: '#E0458A' },
  'everyday-life':          { bg: '#F1E5FF', fg: '#6B3FBF', solid: '#7B5BE0' },
  'conditionals-inversions':{ bg: '#E0F1F5', fg: '#0F6C84', solid: '#0E9488' },
  'tenses':                 { bg: '#FCE0EF', fg: '#A6336F', solid: '#D6406E' },
  'reported-speech':        { bg: '#FFE0E0', fg: '#A82B22', solid: '#E0563C' },
  'verb-patterns':          { bg: '#FFF1C2', fg: '#9B7400', solid: '#B5810D' },
  'phrasal-verbs':          { bg: '#FFEAD1', fg: '#9C5818', solid: '#CF6A1E' },
  'word-formation':         { bg: '#E6EEFF', fg: '#1F4FCC', solid: '#2F6BD6' },
  'words-phrases':          { bg: '#FFE6F0', fg: '#A6336F', solid: '#C13B82' },
};

window.HOME_HERO = HOME_HERO;
window.UNIT_META = UNIT_META;
window.HomeScreen = HomeScreen;
window.UNIT_COLORS = UNIT_COLORS;
