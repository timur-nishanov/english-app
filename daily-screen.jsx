// ─── DAILY MIX SCREEN — reuses the existing lesson exercise UI ───
// No new design: ExerciseView, FeedbackBar, LessonTopBar and ResultsScreen
// are the same components used by LessonScreen.

function DailyScreen({ daily, onAdvance, onComplete, onExit }) {
  const [exercises, setExercises] = React.useState(daily.exercises || []);
  const total = exercises.length;

  const [idx, setIdx] = React.useState(Math.min(daily.doneIndex || 0, Math.max(0, total - 1)));
  const [mistakes, setMistakes] = React.useState(daily.mistakes || 0);
  const [correctCount, setCorrectCount] = React.useState(daily.correct || 0);
  const [answered, setAnswered] = React.useState(null);
  const [done, setDone] = React.useState(!!daily.completed);

  // A fixed topic-like object so ExerciseView/ExerciseTitle render the same chips
  const dailyTopic = { id: 'daily-mix', title: 'Daily mix' };

  const ex = exercises[idx];

  const doShuffle = () => {
    const shuffled = [...exercises.slice(0, idx), ...shuffleArray(exercises.slice(idx))];
    setExercises(shuffled);
    onAdvance({ doneIndex: idx, mistakes, correct: correctCount, exercises: shuffled });
  };

  const handleAnswer = (correct) => {
    if (ex && ex._id && window.SRS) SRS.recordResult(ex._id, correct);
    if (correct) { setAnswered('correct'); setCorrectCount(c => c + 1); }
    else { setAnswered('wrong'); setMistakes(m => m + 1); }
  };

  const handleContinue = () => {
    setAnswered(null);
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      setDone(true);
      onComplete({ mistakes, correct: correctCount, total });
    } else {
      setIdx(nextIdx);
      onAdvance({ doneIndex: nextIdx, mistakes, correct: correctCount });
    }
  };

  if (done || total === 0) {
    const correct = Math.max(0, total - mistakes);
    return (
      <SuccessScreen value={correct} total={total || 5}
        subtitle="Daily mix done — back tomorrow for a fresh set" onDone={onExit} />
    );
  }

  const pct = (idx / total) * 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${idx + 1}/${total}`} />
      <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        <ExerciseView ex={ex} topic={dailyTopic} answered={answered} onAnswer={handleAnswer} />
      </div>
      <FeedbackBar answered={answered} ex={ex} onContinue={handleContinue} />
      {!answered && !done && idx < total && (
        <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
          <ShuffleButton onClick={doShuffle} />
        </div>
      )}
    </div>
  );
}

window.DailyScreen = DailyScreen;
