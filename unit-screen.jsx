// ─── UNIT DETAIL — clean cards, big pastel mark ─────────────────

function UnitScreen({ topic, progress, onStartLesson, onBack }) {
  const lessons = Object.entries(LESSONS).filter(([id, l]) => l.topicId === topic.id);
  const doneCount = Math.floor((progress[topic.id] || 0) * topic.lessons);
  const totalExercises = lessons.reduce((s, [, l]) => s + l.exercises.length, 0);
  const c = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || { bg: DS.paperDeep, fg: DS.ink };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, color: DS.ink, fontFamily: DS.sans }}>
      <div className="anim-fade" style={{
        padding: `${DS.topSafe}px 20px 22px`, background: DS.paper,
      }}>
        <BackButton onClick={onBack} label="Units" color={DS.ink} />

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72,
            background: c.bg,
            color: c.fg,
            borderRadius: 20,
            fontFamily: DS.display, fontWeight: 700, fontSize: 36, letterSpacing: -1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{topic.mark}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1,
            }}>Unit {topic.n}</div>
            <h1 style={{
              fontFamily: DS.display, fontSize: 26, fontWeight: 700,
              letterSpacing: -0.7, margin: '2px 0 4px', lineHeight: 1.1, color: DS.ink,
            }}>{topic.title}</h1>
            <div style={{ fontSize: 13, color: DS.ink3, lineHeight: 1.4, letterSpacing: -0.1 }}>{topic.subtitle}</div>
          </div>
        </div>

        {/* Meta strip — clean rounded card */}
        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: DS.paperCard, borderRadius: 16,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
          boxShadow: DS.shadowSm,
        }}>
          <UnitMeta label="Lessons" value={`${doneCount}/${topic.lessons}`} />
          <UnitMeta label="Exercises" value={totalExercises} alignCenter />
          <UnitMeta label="Status" value={doneCount === topic.lessons ? 'Done' : doneCount ? 'Active' : 'New'} alignRight />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 30px' }}>
        <div style={{
          fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1,
          margin: '14px 4px 10px',
        }}>Lessons</div>
        <div className="stagger" style={{
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {lessons.map(([id, lesson], i) => (
            <LessonRow
              key={id} n={i + 1} lesson={lesson} topic={topic} unitColor={c}
              count={lesson.exercises.length}
              done={i < doneCount}
              current={i === doneCount}
              onClick={() => onStartLesson(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitMeta({ label, value, alignCenter, alignRight }) {
  const ta = alignRight ? 'right' : alignCenter ? 'center' : 'left';
  return (
    <div style={{ textAlign: ta }}>
      <div style={{
        fontSize: 11, color: DS.ink3, fontWeight: 500,
        letterSpacing: -0.1,
      }}>{label}</div>
      <div className="tick" style={{
        fontSize: 16, color: DS.ink, fontWeight: 600, marginTop: 2, letterSpacing: -0.3,
      }}>{value}</div>
    </div>
  );
}

function LessonRow({ n, lesson, topic, unitColor, count, done, current, onClick }) {
  const c = unitColor || { bg: DS.paperDeep, fg: DS.ink };
  return (
    <button onClick={onClick} className="row-press"
      style={{
        width: '100%', border: 'none',
        background: DS.paperCard,
        borderRadius: 16,
        padding: '14px 14px', cursor: 'pointer',
        fontFamily: DS.sans, textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: DS.shadowSm,
      }}>
      {/* status circle */}
      <div style={{
        width: 32, height: 32, borderRadius: 99,
        background: done ? DS.correct : current ? c.bg : DS.paperDeep,
        border: 'none',
        color: done ? DS.paperCard : current ? c.fg : DS.ink3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, flexShrink: 0,
        transition: `all 300ms ${DS.ease}`,
      }}>{done ? '✓' : n}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: DS.display,
          fontSize: 16, fontWeight: 600, color: DS.ink, letterSpacing: -0.3, lineHeight: 1.2,
        }}>{lesson.title}</div>
        <div style={{ fontSize: 13, color: DS.ink3, marginTop: 2, letterSpacing: -0.1 }}>{count} exercises</div>
      </div>
      {current && (
        <Chip bg={c.bg} color={c.fg} style={{ fontWeight: 600 }}>Continue</Chip>
      )}
      <svg width="11" height="13" viewBox="0 0 10 16" style={{ flexShrink: 0 }}>
        <path d="M1 1l7 7-7 7" stroke={DS.ink4} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

window.UnitScreen = UnitScreen;
