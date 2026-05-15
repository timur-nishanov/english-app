// ─── LESSON SCREENS — clean rounded cards, SF Pro ───────────────

function LessonScreen({ lessonId, lesson, topic, onComplete, onExit }) {
  const [idx, setIdx] = React.useState(0);
  const [mistakes, setMistakes] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [answered, setAnswered] = React.useState(null);
  const [queue, setQueue] = React.useState(lesson.exercises);

  const ex = queue[idx];
  const total = queue.length;
  const pct = (idx / total) * 100;

  const handleAnswer = (correct) => {
    if (correct) { setAnswered('correct'); setCorrectCount(c => c + 1); }
    else { setAnswered('wrong'); setMistakes(m => m + 1); }
  };

  const handleContinue = () => {
    if (answered === 'wrong') setQueue(q => [...q, ex]);
    setAnswered(null);
    if (idx + 1 >= queue.length) onComplete({ mistakes, correct: correctCount + (answered === 'correct' ? 0 : 0), total: lesson.exercises.length });
    else setIdx(i => i + 1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${idx + 1}/${total}`} />
      <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        <ExerciseView ex={ex} topic={topic} answered={answered} onAnswer={handleAnswer} />
      </div>
      <FeedbackBar answered={answered} ex={ex} onContinue={handleContinue} />
    </div>
  );
}

function ExerciseView({ ex, topic, answered, onAnswer }) {
  if (ex.type === 'choice') return <ChoiceExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'gap')    return <GapExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'bank')   return <BankExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'type')   return <TypeExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'match')  return <MatchExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  return null;
}

function ExerciseTitle({ text, topic, kind }) {
  const c = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || { bg: DS.paperDeep, fg: DS.ink };
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <Chip bg={c.bg} color={c.fg} style={{ fontWeight: 600 }}>{topic.title}</Chip>
        <Chip>{kind}</Chip>
      </div>
      <h2 style={{
        fontFamily: DS.display,
        fontSize: 22, fontWeight: 700, color: DS.ink,
        lineHeight: 1.25, letterSpacing: -0.6, margin: 0,
      }}>{text}</h2>
    </div>
  );
}

function kindOf(type) {
  return ({
    choice: 'Multiple choice',
    gap: 'Fill the gap',
    bank: 'Word bank',
    type: 'Type the answer',
    match: 'Match pairs',
  })[type] || '';
}

function ChoiceExercise({ ex, answered, onAnswer, topic }) {
  const [picked, setPicked] = React.useState(null);
  const opts = React.useMemo(() => shuffle(ex.options), [ex]);
  React.useEffect(() => { setPicked(null); }, [ex]);
  const commit = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('choice')} />
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((o, i) => {
          const isCorrect = answered && o === ex.answer;
          const isWrong = answered && picked === o && o !== ex.answer;
          const isPicked = picked === o;
          return (
            <button key={i} onClick={() => commit(o)} disabled={!!answered}
              className={`tap ${isWrong ? 'anim-shake' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '15px 16px', borderRadius: 16,
                background: isCorrect ? DS.correctSoft : isWrong ? DS.wrongSoft : DS.paperCard,
                border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : isPicked ? DS.ink : 'transparent'}`,
                boxShadow: !answered && !isPicked ? DS.shadowSm : 'none',
                cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontFamily: DS.sans,
                color: isCorrect ? DS.correctDark : isWrong ? DS.wrongDark : DS.ink,
                fontSize: 15, fontWeight: 500, lineHeight: 1.35, letterSpacing: -0.2,
              }}>
              <span style={{
                width: 22, height: 22, borderRadius: 99,
                background: isCorrect ? DS.correct : isWrong ? DS.wrong : 'transparent',
                color: (isCorrect || isWrong) ? DS.paperCard : DS.ink3,
                border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : DS.ink5}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0, letterSpacing: 0,
                transition: `all 200ms ${DS.ease}`,
              }}>{isCorrect ? '✓' : isWrong ? '✕' : ''}</span>
              <span style={{ flex: 1 }}>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GapExercise({ ex, answered, onAnswer, topic }) {
  const [picked, setPicked] = React.useState(null);
  const opts = React.useMemo(() => shuffle(ex.options), [ex]);
  React.useEffect(() => { setPicked(null); }, [ex]);
  const commit = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };

  const parts = ex.sentence.split('___');
  const blank = picked || '______';
  const blankColor = answered ? (picked === ex.answer ? DS.correct : DS.wrong) : picked ? DS.accent : DS.ink3;

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('gap')} />
      <div style={{
        background: DS.paperCard, borderRadius: 18,
        padding: '20px 20px', marginBottom: 20,
        boxShadow: DS.shadowSm,
      }}>
        <div style={{
          fontFamily: DS.display,
          fontSize: 19, lineHeight: 1.5, color: DS.ink, fontWeight: 500, letterSpacing: -0.3,
        }}>
          {parts[0]}
          <span style={{
            display: 'inline-block', minWidth: 60, padding: '0 10px',
            borderBottom: `2px solid ${blankColor}`, color: blankColor, fontWeight: 600,
            margin: '0 2px', transition: `all 220ms ${DS.ease}`,
          }}>{blank}</span>
          {parts[1]}
        </div>
      </div>
      <div className="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {opts.map((o, i) => {
          const isCorrect = answered && o === ex.answer;
          const isWrong = answered && picked === o && o !== ex.answer;
          const isPicked = picked === o;
          return (
            <button key={i} onClick={() => commit(o)} disabled={!!answered}
              className={`tap ${isWrong ? 'anim-shake' : ''}`}
              style={{
                padding: '11px 16px', borderRadius: 999,
                background: isCorrect ? DS.correctSoft : isWrong ? DS.wrongSoft : isPicked ? DS.ink : DS.paperCard,
                border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : isPicked ? DS.ink : 'transparent'}`,
                boxShadow: !isPicked && !answered ? DS.shadowSm : 'none',
                fontSize: 15, fontWeight: 500, cursor: answered ? 'default' : 'pointer',
                color: isCorrect ? DS.correctDark : isWrong ? DS.wrongDark : isPicked ? DS.paperCard : DS.ink,
                fontFamily: DS.sans, letterSpacing: -0.2,
              }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

function BankExercise({ ex, answered, onAnswer, topic }) {
  const [chosen, setChosen] = React.useState([]);
  const bankIdxs = React.useMemo(() => shuffle(ex.bank.map((_, i) => i)), [ex]);
  React.useEffect(() => { setChosen([]); }, [ex]);
  const inAnswer = ex.answer.trim().split(/\s+/);
  const built = chosen.map(i => ex.bank[i]).join(' ');
  const commit = () => { if (answered) return; onAnswer(built.toLowerCase() === ex.answer.toLowerCase()); };
  const isFull = chosen.length >= inAnswer.length;

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('bank')} />
      {ex.meaning && (
        <div style={{
          color: DS.ink3, padding: '0 4px 12px', fontSize: 14, letterSpacing: -0.1,
        }}>{ex.meaning}</div>
      )}
      <div style={{
        background: DS.paperCard, minHeight: 96,
        borderRadius: 18, padding: 14,
        marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start',
        boxShadow: DS.shadowSm,
      }}>
        {chosen.length === 0 && (
          <div style={{
            color: DS.ink3, fontSize: 14, alignSelf: 'center', margin: '0 auto',
            letterSpacing: -0.1,
          }}>Tap the words below to build your sentence</div>
        )}
        {chosen.map((i, pos) => (
          <button key={pos} onClick={() => !answered && setChosen(c => c.filter((_, p) => p !== pos))}
            disabled={!!answered}
            className="tap anim-pop"
            style={{
              padding: '8px 14px', borderRadius: 999,
              background: DS.ink, border: 'none',
              color: DS.paperCard, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: DS.sans,
              letterSpacing: -0.2,
            }}>{ex.bank[i]}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {bankIdxs.map(i => {
          const used = chosen.includes(i);
          return (
            <button key={i} disabled={used || !!answered}
              onClick={() => setChosen(c => [...c, i])}
              className="tap"
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: DS.paperCard, border: 'none',
                color: used ? 'transparent' : DS.ink,
                fontSize: 15, fontWeight: 500, cursor: used ? 'default' : 'pointer',
                fontFamily: DS.sans, opacity: used ? 0.25 : 1,
                boxShadow: used ? 'none' : DS.shadowSm, letterSpacing: -0.2,
              }}>{ex.bank[i]}</button>
          );
        })}
      </div>
      {!answered && (
        <div style={{ marginTop: 20 }}>
          <PrimaryButton onClick={commit} color={isFull ? DS.ink : DS.ink5} disabled={!isFull}>
            Check answer
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

function TypeExercise({ ex, answered, onAnswer, topic }) {
  const [val, setVal] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { setVal(''); setTimeout(() => inputRef.current?.focus(), 50); }, [ex]);
  const commit = () => {
    if (answered || !val.trim()) return;
    const v = val.trim().toLowerCase();
    const a = ex.answer.toLowerCase();
    onAnswer(v === a || a.includes(v) || v.includes(a));
  };
  const isCorrect = answered && val.trim().toLowerCase() === ex.answer.toLowerCase();

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('type')} />
      <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && commit()} disabled={!!answered}
        placeholder="Type here…"
        className={answered && !isCorrect ? 'anim-shake' : ''}
        style={{
          width: '100%', padding: '17px 18px', borderRadius: 16,
          border: `1.5px solid ${answered ? (isCorrect ? DS.correct : DS.wrong) : 'transparent'}`,
          fontSize: 17, fontWeight: 500, fontFamily: DS.sans,
          background: DS.paperCard, color: DS.ink, outline: 'none', boxSizing: 'border-box',
          transition: `border-color 200ms ${DS.ease}`,
          boxShadow: DS.shadowSm, letterSpacing: -0.3,
        }}/>
      {ex.hint && (
        <div style={{
          marginTop: 10, fontSize: 13, color: DS.ink3,
          padding: '0 4px', letterSpacing: -0.1,
        }}>Hint: {ex.hint}</div>
      )}
      {!answered && (
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={commit} color={val.trim() ? DS.ink : DS.ink5} disabled={!val.trim()}>
            Check answer
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

function MatchExercise({ ex, answered, onAnswer, topic }) {
  const [leftPick, setLeftPick] = React.useState(null);
  const [rightPick, setRightPick] = React.useState(null);
  const [matched, setMatched] = React.useState({});
  const [wrongFlash, setWrongFlash] = React.useState(null);

  const leftItems = React.useMemo(() =>
    ex.pairs.map((p, i) => ({ text: p[0], idx: i })), [ex]);
  const rightItems = React.useMemo(() =>
    shuffle(ex.pairs.map((p, i) => ({ text: p[1], idx: i }))), [ex]);

  React.useEffect(() => {
    setLeftPick(null); setRightPick(null); setMatched({}); setWrongFlash(null);
  }, [ex]);

  const tryMatch = (l, r) => {
    if (l === null || r === null) return;
    if (l === r) {
      const nm = { ...matched, [l]: r };
      setMatched(nm); setLeftPick(null); setRightPick(null);
      if (Object.keys(nm).length === ex.pairs.length) setTimeout(() => onAnswer(true), 300);
    } else {
      setWrongFlash({ l, r });
      setTimeout(() => { setWrongFlash(null); setLeftPick(null); setRightPick(null); }, 400);
    }
  };
  const pickLeft = i => { if (matched[i] !== undefined || answered) return; setLeftPick(i); tryMatch(i, rightPick); };
  const pickRight = i => { if (Object.values(matched).includes(i) || answered) return; setRightPick(i); tryMatch(leftPick, i); };

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('match')} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {leftItems.map(item => {
            const done = matched[item.idx] !== undefined;
            return (
              <button key={item.idx} onClick={() => pickLeft(item.idx)} disabled={done || !!answered}
                className={`tap ${wrongFlash?.l === item.idx ? 'anim-shake' : ''}`}
                style={matchBtn({ done, picked: leftPick === item.idx, flash: wrongFlash?.l === item.idx })}>
                {item.text}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rightItems.map(item => {
            const done = Object.values(matched).includes(item.idx);
            return (
              <button key={item.idx} onClick={() => pickRight(item.idx)} disabled={done || !!answered}
                className={`tap ${wrongFlash?.r === item.idx ? 'anim-shake' : ''}`}
                style={matchBtn({ done, picked: rightPick === item.idx, flash: wrongFlash?.r === item.idx })}>
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function matchBtn({ done, picked, flash }) {
  return {
    padding: '12px 12px', borderRadius: 14, minHeight: 56,
    background: done ? DS.correctSoft : flash ? DS.wrongSoft : picked ? DS.ink : DS.paperCard,
    border: `1.5px solid ${done ? DS.correct : flash ? DS.wrong : picked ? DS.ink : 'transparent'}`,
    boxShadow: !picked && !done && !flash ? DS.shadowSm : 'none',
    color: done ? DS.correctDark : flash ? DS.wrongDark : picked ? DS.paperCard : DS.ink,
    fontSize: 14, fontWeight: 500, cursor: done ? 'default' : 'pointer',
    fontFamily: DS.sans, letterSpacing: -0.2,
    opacity: done ? 0.75 : 1,
    lineHeight: 1.35, textAlign: 'center',
    transition: `all 220ms ${DS.ease}`,
  };
}

function FeedbackBar({ answered, ex, onContinue }) {
  if (!answered) return null;
  const correct = answered === 'correct';
  return (
    <div className="anim-slide-u" style={{
      background: correct ? DS.correctSoft : DS.wrongSoft,
      padding: '18px 20px 22px',
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div className="anim-pop" style={{
          width: 28, height: 28, borderRadius: 99,
          background: correct ? DS.correct : DS.wrong, color: DS.paperCard,
          fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{correct ? '✓' : '✕'}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: DS.display, fontSize: 18, fontWeight: 700,
            color: correct ? DS.correctDark : DS.wrongDark, lineHeight: 1.2, letterSpacing: -0.4,
          }}>{correct ? 'Nice one!' : 'Not quite.'}</div>
          {!correct && ex.answer && (
            <div style={{ fontSize: 14, color: DS.ink2, marginTop: 4, letterSpacing: -0.1 }}>
              Correct answer: <b style={{ color: DS.ink }}>{ex.answer}</b>
            </div>
          )}
          {ex.hint && (
            <div style={{ fontSize: 13, color: DS.ink3, marginTop: 4, letterSpacing: -0.1 }}>Hint: {ex.hint}</div>
          )}
        </div>
      </div>
      <PrimaryButton onClick={onContinue} color={correct ? DS.correct : DS.ink}>
        Continue
      </PrimaryButton>
    </div>
  );
}

function ResultsScreen({ mistakes, total, onDone }) {
  const correct = Math.max(0, total - mistakes);
  const acc = Math.round((correct / total) * 100);
  return (
    <div style={{
      height: '100%', background: DS.paper,
      display: 'flex', flexDirection: 'column',
      padding: `${DS.topSafe}px 24px 24px`,
      color: DS.ink, textAlign: 'center', fontFamily: DS.sans,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="anim-pop" style={{
          width: 120, height: 120, borderRadius: 99,
          background: DS.ink, color: DS.paperCard,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: DS.display, fontWeight: 700,
          fontSize: 42, letterSpacing: -1.5,
          marginBottom: 22,
        }}>
          {acc}<span style={{ fontSize: 22, fontWeight: 600, marginLeft: 1 }}>%</span>
        </div>

        <h1 className="anim-slide-u" style={{
          fontFamily: DS.display, fontSize: 28, fontWeight: 700,
          letterSpacing: -0.7, margin: '0 0 6px', color: DS.ink,
        }}>Lesson complete</h1>
        <p className="anim-slide-u" style={{
          color: DS.ink3, fontSize: 15, marginBottom: 28,
          animationDelay: '160ms', letterSpacing: -0.1,
        }}>Great work — keep the streak going.</p>
        <div className="stagger" style={{ display: 'flex', gap: 10, width: '100%' }}>
          <StatCard label="Correct" value={correct} />
          <StatCard label="Mistakes" value={mistakes} />
          <StatCard label="Total" value={total} />
        </div>
      </div>
      <PrimaryButton onClick={onDone} color={DS.ink}>Continue</PrimaryButton>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      flex: 1, background: DS.paperCard, borderRadius: 16,
      padding: '14px 0', textAlign: 'center',
      boxShadow: DS.shadowSm,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 500, color: DS.ink3,
        letterSpacing: -0.1,
      }}>{label}</div>
      <div className="tick" style={{
        fontSize: 24, fontWeight: 700, color: DS.ink,
        marginTop: 4, letterSpacing: -0.6, fontFamily: DS.display,
      }}>{value}</div>
    </div>
  );
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

window.LessonScreen = LessonScreen;
window.ResultsScreen = ResultsScreen;
