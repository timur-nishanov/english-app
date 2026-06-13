// ─── LAST THEMES — practise the most recently uploaded material ─────
// Pulls the exercises whose `tag` matches the 3 newest entries in
// RECENT_THEMES (data.jsx), so the theme AND the tasks track what was
// actually added last. Falls back to the last three units by position.

function LastThemesScreen({ onExit }) {
  const [pool, setPool] = React.useState(() => {
    const out = [];
    const recent = (window.RECENT_THEMES || []).slice(0, 3);
    recent.forEach(({ tag, topicId }) => {
      const lesson = LESSONS[topicId];
      if (!lesson) return;
      lesson.exercises.forEach((ex, i) => {
        if (ex.tag === tag) out.push({ ...ex, _topicId: topicId, _id: ex._id || `lt#${topicId}#${i}` });
      });
    });
    if (!out.length) {
      TOPICS.slice(-3).forEach(t => {
        const lesson = LESSONS[t.id];
        if (!lesson) return;
        lesson.exercises.forEach((ex, i) => out.push({ ...ex, _topicId: t.id, _id: ex._id || `lt#${t.id}#${i}` }));
      });
    }
    return shuffleArray(out).slice(0, 20);
  });

  const [idx, setIdx] = React.useState(0);
  const [answered, setAnswered] = React.useState(null);
  const [correct, setCorrect] = React.useState(0);

  const ex = pool[idx] || null;
  const total = pool.length;
  const done = total > 0 && idx >= total;

  const topicForEx = (ex) => {
    if (!ex) return { id: 'last', title: 'Last themes' };
    const t = TOPICS.find(t => t.id === ex._topicId);
    return t || { id: ex._topicId || 'last', title: 'Last themes' };
  };

  const handleAnswer = (ok) => {
    if (ex && ex._id && window.SRS) SRS.recordResult(ex._id, ok);
    if (ok) { setAnswered('correct'); setCorrect(c => c + 1); }
    else setAnswered('wrong');
  };
  const handleContinue = () => { setAnswered(null); setIdx(i => i + 1); };
  const doShuffle = () => setPool(p => [...p.slice(0, idx), ...shuffleArray(p.slice(idx))]);

  if (done || total === 0) {
    return (
      <SuccessScreen value={correct} total={total}
        subtitle="Last themes done — keep it up" onDone={onExit} />
    );
  }

  const pct = (idx / total) * 100;
  const topic = topicForEx(ex);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${idx + 1}/${total}`} />
      {ex && (
        <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
          <ExerciseView ex={ex} topic={topic} answered={answered} onAnswer={handleAnswer} />
        </div>
      )}
      <FeedbackBar answered={answered} ex={ex} onContinue={handleContinue} />
      {!answered && ex && idx + 1 < total && (
        <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
          <ShuffleButton onClick={doShuffle} />
        </div>
      )}
    </div>
  );
}

window.LastThemesScreen = LastThemesScreen;
// Back-compat: any persisted 'weakspots' route falls back to this screen.
window.WeakSpotsScreen = LastThemesScreen;
