// ─── HOME SCREEN — from the Figma mockup ─────────────────────────
// Grey canvas (#E9E9E9). Centered greeting, three white CTA buttons,
// then a white sheet with rounded top corners holding the unit list
// (24px majesticons icon + label, dashed separators). Everything
// scrolls together — nothing is pinned.

// icon file + display label per unit (matches the mockup)
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
      background: DS.paper, color: DS.ink, fontFamily: DS.sans,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top — header, greeting, CTA row */}
      <div style={{
        padding: `${DS.topSafe}px 20px 40px`,
        display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center',
        flexShrink: 0,
      }}>
        <div className="anim-fade" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <img src="icons/majesticons_fire.svg" alt="" width="20" height="20" />
            <span className="tick" style={{
              fontSize: 14, color: DS.ink3, fontWeight: 500, letterSpacing: 0.28,
            }}>{streak} day</span>
          </div>
          <button onClick={onOpenProfile} className="tap" style={{
            border: 'none', background: DS.ink,
            width: 32, height: 32, borderRadius: 999, padding: 0,
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
          display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <h1 style={{
              fontFamily: DS.display, fontSize: 32, fontWeight: 700,
              margin: 0, color: DS.ink, lineHeight: 1.1, letterSpacing: 0,
            }}>Hey, Timur</h1>
            <img src="icons/majesticons_shooting-star.svg" alt="" width="28" height="28" />
          </div>
          <p style={{
            fontSize: 16, color: DS.ink3, margin: 0,
            fontWeight: 500, letterSpacing: 0.32, lineHeight: '24px',
            textAlign: 'center', maxWidth: 252,
          }}>Pick up where you left off — {overallPct}% of the way through</p>
        </div>

        {/* CTA row — three white buttons */}
        <div className="anim-slide-u" style={{
          display: 'flex', gap: 8, width: '100%',
        }}>
          <CtaButton onClick={onOpenQuickTest} icon="majesticons_compass-2.svg" label="Practice" />
          <CtaButton onClick={onOpenReview} icon="majesticons_lightbulb-shine.svg" label="Flashcards" />
          <CtaButton onClick={onOpenWeakSpots} icon="majesticons_info-circle.svg"
            label={weakCount > 0 ? `Weak spots · ${weakCount}` : 'Weak spots'} />
        </div>
      </div>

      {/* White sheet with the unit list */}
      <div className="anim-slide-u" style={{
        background: DS.paperCard,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingTop: 8, width: '100%', flex: 1,
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
                display: 'flex', alignItems: 'center', gap: 8, padding: 20,
              }}>
                <img src={`icons/${meta.icon}`} alt="" width="24" height="24" style={{ flexShrink: 0 }} />
                <span style={{
                  flex: 1, fontSize: 16, fontWeight: 500, color: DS.ink,
                  letterSpacing: 0.32, lineHeight: '20px',
                }}>{meta.label}</span>
              </div>
              {i < TOPICS.length - 1 && (
                <div style={{
                  margin: '0 20px',
                  borderTop: `1.5px dashed ${DS.line}`,
                }} />
              )}
            </button>
          );
        })}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// White CTA button: icon on top, label under it
function CtaButton({ onClick, icon, label }) {
  return (
    <button onClick={onClick} className="tap"
      style={{
        flex: 1, minWidth: 0, cursor: 'pointer',
        background: DS.paperCard, color: DS.ink,
        border: 'none', borderRadius: 20,
        padding: '14px 8px 12px',
        display: 'flex', flexDirection: 'column', gap: 4,
        alignItems: 'center', justifyContent: 'center',
        fontFamily: DS.sans,
      }}>
      <img src={`icons/${icon}`} alt="" width="20" height="20" />
      <span style={{
        fontSize: 14, fontWeight: 500, letterSpacing: 0.28, lineHeight: 1.4,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
      }}>{label}</span>
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
