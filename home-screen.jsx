// ─── HOME SCREEN — Family-style: clean rounded cards, bold sans ──

function HomeScreen({ progress, streak, onPickLesson, onOpenReview, onOpenProfile }) {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons, 0);
  const doneLessons = TOPICS.reduce((s, t) => s + Math.floor((progress[t.id] || 0) * t.lessons), 0);
  const overallPct = Math.round((doneLessons / totalLessons) * 100);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: DS.paper, color: DS.ink, fontFamily: DS.sans,
    }}>
      {/* Top header */}
      <div style={{
        padding: `${DS.topSafe}px 20px 12px`,
        background: DS.paper,
      }}>
        <div className="anim-fade" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: DS.paperCard, padding: '7px 12px 7px 9px',
            borderRadius: 999, border: `1px solid ${DS.line}`,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 99,
              background: DS.sageSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11,
            }}>🔥</span>
            <span className="tick" style={{
              fontSize: 14, color: DS.ink, fontWeight: 600, letterSpacing: -0.2,
            }}>{streak} day streak</span>
          </div>
          <button onClick={onOpenProfile} className="tap" style={{
            border: 'none', background: DS.ink,
            width: 38, height: 38, borderRadius: 99,
            color: DS.paperCard, cursor: 'pointer',
            fontFamily: DS.display, fontWeight: 600, fontSize: 15,
            letterSpacing: -0.2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>A</button>
        </div>

        <div className="anim-fade">
          <h1 style={{
            fontFamily: DS.display, fontSize: 34, fontWeight: 700,
            margin: 0, letterSpacing: -1.1, color: DS.ink, lineHeight: 1.05,
          }}>Hey, Aleksey 👋</h1>
          <div style={{
            fontSize: 15, color: DS.ink3, marginTop: 6,
            fontWeight: 400, letterSpacing: -0.1, lineHeight: 1.4,
          }}>Pick up where you left off — {overallPct}% of the way through.</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 30px' }}>

        {/* Featured — vocabulary review */}
        <button
          onClick={onOpenReview}
          className="tap anim-slide-u"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: DS.ink, color: DS.paperCard,
            borderRadius: 22, padding: '20px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: DS.sans, border: 'none',
            marginBottom: 26, boxShadow: DS.shadowMd,
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 99,
            background: 'rgba(255,255,255,0.12)', color: DS.paperCard,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="5" width="14" height="13" rx="2.5" stroke="white" strokeWidth="1.6"/>
              <rect x="6" y="2.5" width="14" height="13" rx="2.5" stroke="white" strokeWidth="1.6" fill="#0E1013"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
              opacity: 0.65, marginBottom: 2,
            }}>Today's review</div>
            <div style={{
              fontFamily: DS.display, fontSize: 19,
              fontWeight: 600, letterSpacing: -0.4,
            }}>Flashcard deck</div>
            <div style={{ fontSize: 13, marginTop: 3, opacity: 0.7, letterSpacing: -0.1 }}>
              {VOCAB_CARDS.length} words · tap to flip
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 10 16">
            <path d="M1 1l7 7-7 7" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 10, padding: '0 2px',
        }}>
          <h2 style={{
            fontFamily: DS.display, fontSize: 22, fontWeight: 700,
            margin: 0, letterSpacing: -0.6, color: DS.ink,
          }}>Your units</h2>
          <span className="tick" style={{
            fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1,
          }}>{doneLessons}/{totalLessons} done</span>
        </div>

        {/* Topic list — clean cards */}
        <div className="stagger" style={{
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {TOPICS.map((topic, i) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              progress={progress[topic.id] || 0}
              totalLessons={topic.lessons}
              onClick={() => onPickLesson(topic)}
            />
          ))}
        </div>

        <div style={{
          marginTop: 28, padding: '0 8px',
          textAlign: 'center',
          fontSize: 13, color: DS.ink4, letterSpacing: -0.1,
        }}>
          A little every day.
        </div>
      </div>
    </div>
  );
}

// Soft pastel color per unit — derived from the mark letter
const UNIT_COLORS = {
  'idioms':       { bg: '#FFE8DC', fg: '#B5683F' },
  'language':     { bg: '#E6EEFF', fg: '#1F4FCC' },
  'emphasising':  { bg: '#FFF1C2', fg: '#9B7400' },
  'opposites':    { bg: '#E6F4EA', fg: '#147542' },
  'freetime':     { bg: '#F1E5FF', fg: '#6B3FBF' },
  'colours':      { bg: '#FCE0EF', fg: '#A6336F' },
  'conditionals': { bg: '#E0F1F5', fg: '#0F6C84' },
  'inversions':   { bg: '#FFEFC8', fg: '#8A6400' },
  'wishes':       { bg: '#FFE0E0', fg: '#A82B22' },
  'reported':     { bg: '#E6EEFF', fg: '#1F4FCC' },
  'gerund':       { bg: '#E6F4EA', fg: '#147542' },
  'causative':    { bg: '#F5E6D9', fg: '#8E5429' },
  'phrasal-get':  { bg: '#E0F1F5', fg: '#0F6C84' },
  'tenses':       { bg: '#F1E5FF', fg: '#6B3FBF' },
  'vocab-people': { bg: '#FFE8DC', fg: '#B5683F' },
  'vocab-time':   { bg: '#FCE0EF', fg: '#A6336F' },
  'dining':       { bg: '#FFEAD1', fg: '#9C5818' },
  'feelings':     { bg: '#E2F0FF', fg: '#1F4FCC' },
  'intro-verbs':  { bg: '#E0F1F5', fg: '#0F6C84' },
  'work-career':  { bg: '#E6EEFF', fg: '#1F4FCC' },
  'business':     { bg: '#E6F4EA', fg: '#147542' },
  'work-colleagues': { bg: '#FFF1C2', fg: '#9B7400' },
  'working-life': { bg: '#F1E5FF', fg: '#6B3FBF' },
  'money':        { bg: '#E2F4EA', fg: '#147542' },
  'binomials':    { bg: '#FFE8DC', fg: '#B5683F' },
  'mind':         { bg: '#F1E5FF', fg: '#6B3FBF' },
  'socialising':  { bg: '#FCE0EF', fg: '#A6336F' },
};

function TopicRow({ topic, progress, totalLessons, onClick }) {
  const done = Math.floor(progress * totalLessons);
  const pct = Math.round(progress * 100);
  const isComplete = done >= totalLessons;
  const isStarted = done > 0;
  const c = UNIT_COLORS[topic.id] || { bg: DS.paperDeep, fg: DS.ink };

  return (
    <button
      onClick={onClick}
      className="row-press"
      style={{
        width: '100%', border: 'none', padding: '14px 14px',
        cursor: 'pointer',
        background: DS.paperCard,
        borderRadius: 18,
        fontFamily: DS.sans,
        textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: DS.shadowSm,
      }}>
      {/* Big square pastel mark */}
      <div style={{
        width: 48, height: 48, flexShrink: 0,
        background: c.bg,
        color: c.fg,
        borderRadius: 14,
        fontFamily: DS.display, fontWeight: 700, fontSize: 22, letterSpacing: -0.5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {topic.mark}
        {isComplete && (
          <div style={{
            position: 'absolute', bottom: -3, right: -3,
            width: 18, height: 18, borderRadius: 99,
            background: DS.correct, color: DS.paperCard,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${DS.paperCard}`,
          }}>✓</div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: DS.display,
          fontSize: 16, fontWeight: 600, color: DS.ink,
          letterSpacing: -0.3, lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{topic.title}</div>
        <div style={{
          fontSize: 13, color: DS.ink3, marginTop: 3, fontWeight: 400, letterSpacing: -0.1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{topic.subtitle}</div>
      </div>

      {/* Right: progress dots + count */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <span className="tick" style={{
          fontSize: 12, color: isStarted ? DS.ink : DS.ink4, fontWeight: 600, letterSpacing: -0.1,
        }}>{done}/{totalLessons}</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: totalLessons }).map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: 99,
              background: i < done ? c.fg : DS.ink5,
              transition: `background 300ms ${DS.ease}`,
            }}/>
          ))}
        </div>
      </div>
    </button>
  );
}

window.HomeScreen = HomeScreen;
window.UNIT_COLORS = UNIT_COLORS;
