// ─── HOME SCREEN — Family-style: clean rounded cards, bold sans ──

function HomeScreen({ progress, streak, daily, onPickLesson, onOpenReview, onOpenVocabTest, onOpenQuickTest, onOpenProfile, onOpenDaily }) {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons, 0);
  const doneLessons = TOPICS.reduce((s, t) => s + Math.floor((progress[t.id] || 0) * t.lessons), 0);
  const overallPct = Math.round((doneLessons / totalLessons) * 100);

  const dailyTotal = (daily && daily.exercises ? daily.exercises.length : 5);
  const dailyDone = daily ? (daily.doneIndex || 0) : 0;
  const dailyCompleted = !!(daily && daily.completed);
  const dailyTitle = dailyCompleted ? 'Done today ✓' : `${dailyTotal} quick exercises`;
  const dailySub = dailyCompleted
    ? 'Come back tomorrow for a new set'
    : (dailyDone > 0 ? `${dailyDone}/${dailyTotal} done · keep going` : 'Mix of everything you’ve learned');

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

        {/* Daily mix — 5 random exercises, generated once a day */}
        <button
          onClick={onOpenDaily}
          className="tap anim-slide-u"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: DS.accent, color: DS.paperCard,
            borderRadius: 22, padding: '20px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: DS.sans, border: 'none',
            marginBottom: 12, boxShadow: DS.shadowMd,
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 99,
            background: 'rgba(255,255,255,0.16)', color: DS.paperCard,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 5h3.2c1.6 0 2.7 .9 3.6 2.2l2.4 3.6c.9 1.3 2 2.2 3.6 2.2H19" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17h3.2c1.6 0 2.7-.9 3.6-2.2l2.4-3.6c.9-1.3 2-2.2 3.6-2.2H19" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 2.5L19.5 5l-3 2.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 12L19.5 14.5l-3 2.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
              opacity: 0.7, marginBottom: 2,
            }}>Daily mix</div>
            <div style={{
              fontFamily: DS.display, fontSize: 19,
              fontWeight: 600, letterSpacing: -0.4,
            }}>{dailyTitle}</div>
            <div style={{ fontSize: 13, marginTop: 3, opacity: 0.8, letterSpacing: -0.1 }}>
              {dailySub}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 10 16">
            <path d="M1 1l7 7-7 7" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

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
            marginBottom: 10, boxShadow: DS.shadowMd,
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

        {/* Vocabulary test */}
        <button
          onClick={onOpenVocabTest}
          className="tap anim-slide-u"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: DS.paperCard, color: DS.ink,
            borderRadius: 22, padding: '20px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: DS.sans, border: 'none',
            marginBottom: 10, boxShadow: DS.shadowSm,
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 99,
            background: DS.accentSoft, color: DS.accentDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 4.5h14M4 11h14M4 17.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M14.5 16.5l2 2 3.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
              color: DS.ink3, marginBottom: 2,
            }}>Check yourself</div>
            <div style={{
              fontFamily: DS.display, fontSize: 19,
              fontWeight: 600, letterSpacing: -0.4,
            }}>Vocabulary test</div>
            <div style={{ fontSize: 13, marginTop: 3, color: DS.ink3, letterSpacing: -0.1 }}>
              10 questions · match the word
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 10 16">
            <path d="M1 1l7 7-7 7" stroke={DS.ink3} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Quick practice — all exercises, live category & shuffle controls */}
        <button
          onClick={onOpenQuickTest}
          className="tap anim-slide-u"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            background: DS.paperCard, color: DS.ink,
            borderRadius: 22, padding: '20px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: DS.sans, border: 'none',
            marginBottom: 26, boxShadow: DS.shadowSm,
          }}>
          <div style={{
            width: 46, height: 46, borderRadius: 99,
            background: DS.sageSoft, color: DS.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 5h3.2c1.6 0 2.7 .9 3.6 2.2l2.4 3.6c.9 1.3 2 2.2 3.6 2.2H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17h3.2c1.6 0 2.7-.9 3.6-2.2l2.4-3.6c.9-1.3 2-2.2 3.6-2.2H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 2.5L19.5 5l-3 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 12L19.5 14.5l-3 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
              color: DS.ink3, marginBottom: 2,
            }}>Practice mix</div>
            <div style={{
              fontFamily: DS.display, fontSize: 19,
              fontWeight: 600, letterSpacing: -0.4,
            }}>Quick practice</div>
            <div style={{ fontSize: 13, marginTop: 3, color: DS.ink3, letterSpacing: -0.1 }}>
              Every exercise · filter & shuffle on the fly
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 10 16">
            <path d="M1 1l7 7-7 7" stroke={DS.ink3} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
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
