// ─── HOME SCREEN — white canvas, accent hero, settings-style units ──
// Layout after the Joi reference: one bright hero banner (Quick practice),
// two quiet grey cards under it, then the units as a settings list with
// grey monochrome icons and chevrons. Everything scrolls together.

function HomeScreen({ progress, streak, weakCount, onPickLesson, onOpenReview, onOpenQuickTest, onOpenWeakSpots, onOpenProfile }) {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons, 0);
  const doneLessons = TOPICS.reduce((s, t) => s + Math.floor((progress[t.id] || 0) * t.lessons), 0);
  const overallPct = Math.round((doneLessons / totalLessons) * 100);

  return (
    <div style={{
      height: '100%', overflow: 'auto',
      background: '#FFFFFF', color: DS.ink, fontFamily: DS.sans,
    }}>
      <div style={{ padding: `${DS.topSafe}px 20px 30px` }}>
        {/* Header — scrolls with the content */}
        <div className="anim-fade" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: DS.paper, padding: '7px 12px 7px 9px',
            borderRadius: 999, border: 'none',
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 99,
              background: DS.sageSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M5 .5c1.2 1.8 1 3 .3 3.7-.7.7-1.8 1.1-1.8 2.4 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.3-1.2-.7-1.6.9.5 2.2 1.7 2.2 3.7 0 1.9-1.6 3.3-4 3.3S1 10.6 1 8.5C1 5.3 4 3.5 5 .5z"
                  fill={DS.sageDark}/>
              </svg>
            </span>
            <span className="tick" style={{
              fontSize: 14, color: DS.ink, fontWeight: 600, letterSpacing: -0.1,
            }}>{streak} day streak</span>
          </div>
          <button onClick={onOpenProfile} className="tap" style={{
            border: 'none', background: DS.ink,
            width: 38, height: 38, borderRadius: 99,
            color: DS.paperCard, cursor: 'pointer',
            fontFamily: DS.display, fontWeight: 600, fontSize: 15,
            letterSpacing: -0.1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>T</button>
        </div>

        <div className="anim-fade">
          <h1 style={{
            fontFamily: DS.display, fontSize: 32, fontWeight: 700,
            margin: 0, letterSpacing: -0.6, color: DS.ink, lineHeight: 1.1,
          }}>Hey, Timur 👋</h1>
          <div style={{
            fontSize: 15, color: DS.ink3, marginTop: 6,
            fontWeight: 400, letterSpacing: 0, lineHeight: 1.4,
          }}>Pick up where you left off — {overallPct}% of the way through.</div>
        </div>

        {/* Hero — Quick practice, bright accent banner */}
        <button
          onClick={onOpenQuickTest}
          className="tap anim-slide-u"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: 'linear-gradient(135deg, #3D9BFF 0%, #2D6BFF 100%)',
            color: '#FFFFFF',
            borderRadius: 24, padding: '18px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: DS.sans, border: 'none',
            marginTop: 22, marginBottom: 12,
            boxShadow: '0 8px 24px rgba(45, 107, 255, 0.25)',
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 99,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ShuffleIcon size={22} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: DS.display, fontSize: 18,
              fontWeight: 700, letterSpacing: -0.3,
            }}>Quick practice</div>
            <div style={{ fontSize: 13, marginTop: 2, opacity: 0.85, letterSpacing: 0 }}>
              Every exercise · filter & shuffle
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.22)', color: '#FFFFFF',
            padding: '9px 14px', borderRadius: 999, flexShrink: 0,
            fontSize: 14, fontWeight: 700, letterSpacing: -0.1,
          }}>
            Start
            <svg width="11" height="11" viewBox="0 0 10 16">
              <path d="M1 1l7 7-7 7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
        </button>

        {/* Secondary cards — quiet grey */}
        <div className="anim-slide-u" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          marginBottom: 30,
        }}>
          <HomeAction
            onClick={onOpenReview}
            title="Flashcards"
            sub={`${VOCAB_CARDS.length} words`}
            icon={
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="5" width="14" height="13" rx="2.5" stroke={DS.ink2} strokeWidth="1.6"/>
                <rect x="6" y="2.5" width="14" height="13" rx="2.5" stroke={DS.ink2} strokeWidth="1.6" fill={DS.paper}/>
              </svg>
            }
          />
          <HomeAction
            onClick={onOpenWeakSpots}
            title="Weak spots"
            sub={weakCount > 0 ? `${weakCount} to fix` : 'All clear'}
            icon={
              <span style={{
                fontSize: 16, fontWeight: 700,
                color: weakCount > 0 ? DS.wrongDark : DS.correctDark,
              }}>{weakCount > 0 ? '!' : '✓'}</span>
            }
            accent={weakCount > 0 ? DS.wrongDark : null}
          />
        </div>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 4, padding: '0 2px',
        }}>
          <h2 style={{
            fontFamily: DS.display, fontSize: 22, fontWeight: 700,
            margin: 0, letterSpacing: -0.3, color: DS.ink,
          }}>Your units</h2>
          <span className="tick" style={{
            fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: 0,
          }}>{doneLessons}/{totalLessons} done</span>
        </div>

        {/* Units — settings-style list: grey icon, title, chevron */}
        <div className="stagger">
          {TOPICS.map((topic, i) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              progress={progress[topic.id] || 0}
              totalLessons={topic.lessons}
              isLast={i === TOPICS.length - 1}
              onClick={() => onPickLesson(topic)}
            />
          ))}
        </div>

        <div style={{
          marginTop: 28, padding: '0 8px',
          textAlign: 'center',
          fontSize: 13, color: DS.ink4, letterSpacing: 0,
        }}>
          A little every day.
        </div>
      </div>
    </div>
  );
}

// Quiet grey tile for secondary actions (Joi settings style)
function HomeAction({ onClick, title, sub, icon, accent }) {
  return (
    <button onClick={onClick} className="tap"
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: DS.paper, color: DS.ink,
        borderRadius: 20, padding: '16px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        fontFamily: DS.sans, border: 'none',
      }}>
      <span style={{
        width: 36, height: 36, borderRadius: 99,
        background: '#FFFFFF',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
      <span>
        <span style={{
          display: 'block', fontFamily: DS.display, fontSize: 15,
          fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.2,
        }}>{title}</span>
        <span style={{
          display: 'block', fontSize: 12, marginTop: 3,
          color: accent || DS.ink3, letterSpacing: 0,
        }}>{sub}</span>
      </span>
    </button>
  );
}

// Soft pastel color per unit — still used by CategoryScreen, lesson chips
// and Quick practice category pills (not by the home list anymore).
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

// Settings-style row: grey rounded-square icon, title + subtitle, chevron
function TopicRow({ topic, progress, totalLessons, isLast, onClick }) {
  const done = Math.floor(progress * totalLessons);
  const isComplete = done >= totalLessons;

  return (
    <button
      onClick={onClick}
      className="row-press"
      style={{
        width: '100%', border: 'none', padding: '13px 2px',
        cursor: 'pointer',
        background: 'transparent',
        fontFamily: DS.sans,
        textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: isLast ? 'none' : `1px solid ${DS.lineSoft}`,
        borderRadius: 0,
      }}>
      {/* Grey monochrome mark */}
      <div style={{
        width: 38, height: 38, flexShrink: 0,
        background: DS.paper,
        color: DS.ink3,
        borderRadius: 11,
        fontFamily: DS.display, fontWeight: 700, fontSize: 16, letterSpacing: -0.3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {topic.mark}
        {isComplete && (
          <div style={{
            position: 'absolute', bottom: -3, right: -3,
            width: 16, height: 16, borderRadius: 99,
            background: DS.correct, color: '#FFFFFF',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #FFFFFF',
          }}>✓</div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: DS.display,
          fontSize: 16, fontWeight: 600, color: DS.ink,
          letterSpacing: -0.2, lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{topic.title}</div>
        <div style={{
          fontSize: 13, color: DS.ink3, marginTop: 2, fontWeight: 400, letterSpacing: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{topic.subtitle}</div>
      </div>

      <svg width="9" height="14" viewBox="0 0 10 16" style={{ flexShrink: 0 }}>
        <path d="M1 1l7 7-7 7" stroke={DS.ink4} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

window.HomeScreen = HomeScreen;
window.UNIT_COLORS = UNIT_COLORS;
