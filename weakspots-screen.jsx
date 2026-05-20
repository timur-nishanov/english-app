// ─── WEAK SPOTS — focused review of items answered wrong + not yet mastered ──
// No category filter, no shuffle — just work through the mistakes.

function WeakSpotsScreen({ onExit }) {
  const [pool, setPool] = React.useState(() => {
    const state = SRS.getSrsState();
    const weakIds = new Set(SRS.getWeakSpots(state));
    if (!weakIds.size) return [];
    const all = window.allExercises ? allExercises() : [];
    return all.filter(ex => ex._id && weakIds.has(ex._id));
  });

  const [idx, setIdx] = React.useState(0);
  const [answered, setAnswered] = React.useState(null);
  const [cleared, setCleared] = React.useState(0);

  const ex = pool[idx] || null;
  const done = pool.length > 0 && idx >= pool.length;

  const topicForEx = (ex) => {
    if (!ex) return { id: 'weak', title: 'Weak spots' };
    if (ex._topicId) {
      const t = TOPICS.find(t => t.id === ex._topicId);
      return t || { id: ex._topicId, title: ex._topicId };
    }
    return { id: '__vocab__', title: 'Vocabulary' };
  };

  const handleAnswer = (correct) => {
    if (ex && ex._id) SRS.recordResult(ex._id, correct);
    if (correct) { setAnswered('correct'); setCleared(c => c + 1); }
    else setAnswered('wrong');
  };

  const handleContinue = () => {
    setAnswered(null);
    setIdx(i => i + 1);
  };

  const doShuffle = () => {
    setPool(p => [...p.slice(0, idx), ...shuffleArray(p.slice(idx))]);
  };

  if (pool.length === 0) {
    return (
      <div style={{
        height: '100%', background: DS.paper,
        display: 'flex', flexDirection: 'column',
        padding: `${DS.topSafe}px 24px 24px`, fontFamily: DS.sans,
        color: DS.ink, textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <BackButton onClick={onExit} label="Home" color={DS.ink} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="anim-pop" style={{
            width: 80, height: 80, borderRadius: 99,
            background: DS.correctSoft, color: DS.correct,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 20,
          }}>✓</div>
          <h1 className="anim-slide-u" style={{
            fontFamily: DS.display, fontSize: 26, fontWeight: 700,
            letterSpacing: -0.7, margin: '0 0 8px',
          }}>All clear</h1>
          <p style={{ color: DS.ink3, fontSize: 15, letterSpacing: -0.1, lineHeight: 1.5, maxWidth: 240 }}>
            No weak spots right now. Keep practising to stay sharp.
          </p>
        </div>
        <PrimaryButton onClick={onExit} color={DS.ink}>Back to home</PrimaryButton>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        height: '100%', background: DS.paper,
        display: 'flex', flexDirection: 'column',
        padding: `${DS.topSafe}px 24px 24px`, fontFamily: DS.sans,
        color: DS.ink, textAlign: 'center',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="anim-pop" style={{
            width: 130, height: 130, borderRadius: 99,
            background: DS.ink, color: DS.paperCard,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: DS.display, fontWeight: 700,
            fontSize: 38, letterSpacing: -1.2, marginBottom: 20,
          }}>{cleared}<span style={{ fontSize: 20, opacity: 0.5 }}>/{pool.length}</span></div>
          <h1 className="anim-slide-u" style={{
            fontFamily: DS.display, fontSize: 28, fontWeight: 700,
            letterSpacing: -0.7, margin: '4px 0 6px',
          }}>Weak spots done</h1>
          <p style={{ color: DS.ink3, fontSize: 15, marginBottom: 28, letterSpacing: -0.1 }}>
            {cleared} spot{cleared === 1 ? '' : 's'} cleared · {pool.length - cleared} still need work.
          </p>
        </div>
        <PrimaryButton onClick={onExit} color={DS.ink}>Back to home</PrimaryButton>
      </div>
    );
  }

  const pct = pool.length ? (idx / pool.length) * 100 : 0;
  const topic = topicForEx(ex);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${idx + 1}/${pool.length}`} />
      {ex && (
        <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
          <ExerciseView ex={ex} topic={topic} answered={answered} onAnswer={handleAnswer} />
        </div>
      )}
      <FeedbackBar answered={answered} ex={ex} onContinue={handleContinue} />
      {!answered && ex && idx + 1 < pool.length && (
        <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
          <ShuffleButton onClick={doShuffle} />
        </div>
      )}
    </div>
  );
}

window.WeakSpotsScreen = WeakSpotsScreen;
