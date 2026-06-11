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
    if (ex && ex._id && window.SRS) SRS.recordResult(ex._id, correct);
    if (correct) { setAnswered('correct'); setCorrectCount(c => c + 1); }
    else { setAnswered('wrong'); setMistakes(m => m + 1); }
  };

  const handleContinue = () => {
    if (answered === 'wrong') setQueue(q => [...q, ex]);
    setAnswered(null);
    if (idx + 1 >= queue.length) onComplete({ mistakes, correct: correctCount, total: lesson.exercises.length });
    else setIdx(i => i + 1);
  };

  // Re-shuffle the current exercise and everything still ahead.
  // The not-yet-answered current item isn't reported to SRS — we just drop it
  // in place of a random one from the remaining queue.
  const doShuffle = () => {
    setQueue(q => [...q.slice(0, idx), ...shuffleArray(q.slice(idx))]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${idx + 1}/${total}`} />
      <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        <ExerciseView ex={ex} topic={topic} answered={answered} onAnswer={handleAnswer} />
      </div>
      <FeedbackBar answered={answered} ex={ex} onContinue={handleContinue} />
      {!answered && idx + 1 < queue.length && (
        <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
          <ShuffleButton onClick={doShuffle} />
        </div>
      )}
    </div>
  );
}

function ExerciseView({ ex, topic, answered, onAnswer }) {
  if (ex.type === 'choice') return <ChoiceExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'gap')    return <GapExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'gaptype') return <GapTypeExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'bank')   return <BankExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'type')   return <TypeExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'match')  return <MatchExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'dialogue') return <DialogueExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'replace')  return <ReplaceExercise  ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'simile')   return <SimileExercise   ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'explain')  return <ExplainExercise  ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'extraword') return <ExtraWordExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'cloze' && window.ClozeExercise)         return <ClozeExercise     ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'transform' && window.TransformExercise) return <TransformExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  if (ex.type === 'bankgroup' && window.BankgroupExercise) return <BankgroupExercise ex={ex} topic={topic} answered={answered} onAnswer={onAnswer} />;
  return null;
}

function ExerciseTitle({ text, topic, kind }) {
  const c = (window.UNIT_COLORS && window.UNIT_COLORS[topic.id]) || { bg: DS.paperDeep, fg: DS.ink };
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ marginBottom: 12 }}>
        <Chip bg={c.bg} color={c.fg} style={{ fontWeight: 600 }}>{topic.title}</Chip>
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
    gaptype: 'Fill the gap',
    bank: 'Word bank',
    type: 'Type the answer',
    match: 'Match pairs',
    dialogue: 'Dialogue',
    replace: 'Replace the words',
    simile: 'Simile',
    explain: 'Explain the idiom',
    cloze: 'Connected text',
    transform: 'Rewrite the sentence',
    bankgroup: 'Word bank · group',
    extraword: 'Find the extra word',
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
              }}>{isCorrect ? <CheckIcon /> : isWrong ? <CrossIcon /> : null}</span>
              <span style={{ flex: 1 }}>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GapSentence({ sentence, value, color }) {
  const parts = sentence.split('___');
  return (
    <div style={{
      background: DS.paperCard, borderRadius: 18,
      padding: '20px 20px', marginBottom: 18,
      boxShadow: DS.shadowSm,
    }}>
      <div style={{
        fontFamily: DS.display,
        fontSize: 19, lineHeight: 1.5, color: DS.ink, fontWeight: 500, letterSpacing: -0.3,
      }}>
        {parts[0]}
        <span style={{
          display: 'inline-block', minWidth: 60, padding: '0 10px',
          borderBottom: `2px solid ${color}`, color, fontWeight: 600,
          margin: '0 2px', transition: `all 220ms ${DS.ease}`,
        }}>{value}</span>
        {parts[1]}
      </div>
    </div>
  );
}

function GapExercise({ ex, answered, onAnswer, topic }) {
  const [picked, setPicked] = React.useState(null);
  const opts = React.useMemo(() => shuffle(ex.options), [ex]);
  React.useEffect(() => { setPicked(null); }, [ex]);
  const commit = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };

  const blankColor = answered ? (picked === ex.answer ? DS.correct : DS.wrong) : picked ? DS.accent : DS.ink3;

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('gap')} />
      <GapSentence sentence={ex.sentence} value={picked || '______'} color={blankColor} />
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

function GapTypeExercise({ ex, answered, onAnswer, topic }) {
  const [val, setVal] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { setVal(''); setTimeout(() => inputRef.current?.focus(), 50); }, [ex]);

  const norm = s => s.trim().toLowerCase();
  const accepted = [ex.answer, ...(ex.accept || [])].map(norm);
  const commit = () => {
    if (answered || !val.trim()) return;
    onAnswer(accepted.includes(norm(val)));
  };
  const isCorrect = answered && accepted.includes(norm(val));

  const blankColor = answered ? (isCorrect ? DS.correct : DS.wrong) : val.trim() ? DS.accent : DS.ink3;

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('gaptype')} />
      <GapSentence sentence={ex.sentence} value={val.trim() || '______'} color={blankColor} />
      <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && commit()} disabled={!!answered}
        placeholder="Type the missing word…"
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
    const v = val.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    const a = ex.answer.toLowerCase().replace(/[.,!?;:]/g, '');
    const isShort = a.split(/\s+/).length <= 2;
    const ok = isShort ? (v === a || a.includes(v) || v.includes(a)) : v === a;
    onAnswer(ok);
  };
  const isCorrect = answered && val.trim().toLowerCase().replace(/[.,!?;:]/g, '') === ex.answer.toLowerCase().replace(/[.,!?;:]/g, '');

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

// ─── DIALOGUE — fill the blank inside a chat-style exchange ─────
function DialogueLine({ line, side, isBlank, value, blankColor }) {
  const align = side === 'r' ? 'flex-end' : 'flex-start';
  const parts = (line.text || '').split('___');
  const bubbleBg = isBlank ? DS.accentSoft : DS.paperCard;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, marginBottom: 14 }}>
      <div style={{
        fontSize: 11, color: DS.ink3, fontWeight: 600, letterSpacing: 0.5,
        textTransform: 'uppercase', margin: side === 'r' ? '0 16px 4px 0' : '0 0 4px 16px',
      }}>{line.speaker}</div>
      <div style={{
        maxWidth: '80%', background: bubbleBg, color: DS.ink,
        padding: '12px 16px', borderRadius: 18, boxShadow: DS.shadowSm,
        fontFamily: DS.sans, fontSize: 15, lineHeight: 1.45, letterSpacing: -0.1,
      }}>
        {parts.length === 1 ? line.text : (
          <>
            {parts[0]}
            <span style={{
              display: 'inline-block', minWidth: 70, padding: '0 8px',
              borderBottom: `2px solid ${blankColor}`, color: blankColor,
              fontWeight: 600, margin: '0 2px',
            }}>{value || '______'}</span>
            {parts[1]}
          </>
        )}
      </div>
    </div>
  );
}

function DialogueExercise({ ex, topic, answered, onAnswer }) {
  const isPick = ex.mode !== 'type';
  const [picked, setPicked] = React.useState(null);
  const [val, setVal] = React.useState('');
  const inputRef = React.useRef(null);

  const opts = React.useMemo(() => isPick ? shuffle(ex.options || []) : [], [ex]);
  React.useEffect(() => {
    setPicked(null); setVal('');
    if (!isPick) setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [ex]);

  const norm = s => s.trim().toLowerCase();
  const accepted = [ex.answer, ...(ex.accept || [])].map(norm);

  const commitPick = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };
  const commitType = () => { if (answered || !val.trim()) return; onAnswer(accepted.includes(norm(val))); };

  const typedCorrect = !isPick && answered && accepted.includes(norm(val));
  const pickedCorrect = isPick && answered && picked === ex.answer;
  const blankColor = isPick
    ? (answered ? (pickedCorrect ? DS.correct : DS.wrong) : picked ? DS.accent : DS.ink3)
    : (answered ? (typedCorrect ? DS.correct : DS.wrong) : val.trim() ? DS.accent : DS.ink3);
  const blankValue = isPick ? picked : (val.trim() || null);

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('dialogue')} />
      <div style={{ marginBottom: 16 }}>
        {(ex.lines || []).map((line, i) => (
          <DialogueLine key={i}
            line={line}
            side={i % 2 === 0 ? 'l' : 'r'}
            isBlank={/___/.test(line.text || '')}
            value={/___/.test(line.text || '') ? blankValue : null}
            blankColor={blankColor}
          />
        ))}
      </div>
      {isPick ? (
        <div className="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {opts.map((o, i) => {
            const isCorrect = answered && o === ex.answer;
            const isWrong = answered && picked === o && o !== ex.answer;
            const isPicked = picked === o;
            return (
              <button key={i} onClick={() => commitPick(o)} disabled={!!answered}
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
      ) : (
        <>
          <input ref={inputRef} value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && commitType()}
            disabled={!!answered}
            placeholder="Type the missing word…"
            className={answered && !typedCorrect ? 'anim-shake' : ''}
            style={{
              width: '100%', padding: '17px 18px', borderRadius: 16,
              border: `1.5px solid ${answered ? (typedCorrect ? DS.correct : DS.wrong) : 'transparent'}`,
              fontSize: 17, fontWeight: 500, fontFamily: DS.sans,
              background: DS.paperCard, color: DS.ink, outline: 'none', boxSizing: 'border-box',
              boxShadow: DS.shadowSm, letterSpacing: -0.3,
            }}/>
          {!answered && (
            <div style={{ marginTop: 18 }}>
              <PrimaryButton onClick={commitType} color={val.trim() ? DS.ink : DS.ink5} disabled={!val.trim()}>
                Check answer
              </PrimaryButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── REPLACE — swap the *underlined* words for an idiom/phrasal ─────
function ReplaceSentence({ sentence, replacement, color }) {
  // *text* marks the underlined target; renders sageSoft chip-like span
  const parts = (sentence || '').split(/(\*[^*]+\*)/g);
  return (
    <div style={{
      background: DS.paperCard, borderRadius: 18,
      padding: 20, marginBottom: 18, boxShadow: DS.shadowSm,
    }}>
      <div style={{
        fontFamily: DS.display, fontSize: 18, lineHeight: 1.5,
        color: DS.ink, letterSpacing: -0.2, fontWeight: 500,
      }}>
        {parts.map((p, i) => {
          const m = /^\*([^*]+)\*$/.exec(p);
          if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
          if (replacement) {
            return (
              <span key={i} style={{
                display: 'inline-block', background: DS.accentSoft, color: DS.accentDark,
                borderRadius: 6, padding: '1px 8px', fontWeight: 600,
                transition: 'all 300ms ease',
              }}>{replacement}</span>
            );
          }
          return (
            <span key={i} style={{
              display: 'inline-block', background: DS.sageSoft, color: DS.ink,
              borderRadius: 6, padding: '1px 6px', fontWeight: 600,
            }}>{m[1]}</span>
          );
        })}
      </div>
    </div>
  );
}

function ReplaceExercise({ ex, topic, answered, onAnswer }) {
  const isPick = ex.mode !== 'type';
  const [picked, setPicked] = React.useState(null);
  const [val, setVal] = React.useState('');
  const inputRef = React.useRef(null);

  const opts = React.useMemo(() => isPick ? shuffle(ex.options || []) : [], [ex]);
  React.useEffect(() => {
    setPicked(null); setVal('');
    if (!isPick) setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [ex]);

  const norm = s => s.trim().toLowerCase();
  const accepted = [ex.answer, ...(ex.accept || [])].map(norm);

  const commitPick = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };
  const commitType = () => { if (answered || !val.trim()) return; onAnswer(accepted.includes(norm(val))); };

  const typedCorrect = !isPick && answered && accepted.includes(norm(val));
  const pickedCorrect = isPick && answered && picked === ex.answer;
  const replacement = answered
    ? ex.answer
    : (isPick ? (picked || null) : (val.trim() || null));

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('replace')} />
      <ReplaceSentence sentence={ex.sentence}
        replacement={(answered && (pickedCorrect || typedCorrect)) ? replacement : (answered ? ex.answer : null)} />
      {isPick ? (
        <div className="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {opts.map((o, i) => {
            const isCorrect = answered && o === ex.answer;
            const isWrong = answered && picked === o && o !== ex.answer;
            const isPicked = picked === o;
            return (
              <button key={i} onClick={() => commitPick(o)} disabled={!!answered}
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
      ) : (
        <>
          <input ref={inputRef} value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && commitType()}
            disabled={!!answered}
            placeholder="Type the replacement expression…"
            className={answered && !typedCorrect ? 'anim-shake' : ''}
            style={{
              width: '100%', padding: '17px 18px', borderRadius: 16,
              border: `1.5px solid ${answered ? (typedCorrect ? DS.correct : DS.wrong) : 'transparent'}`,
              fontSize: 17, fontWeight: 500, fontFamily: DS.sans,
              background: DS.paperCard, color: DS.ink, outline: 'none', boxSizing: 'border-box',
              boxShadow: DS.shadowSm, letterSpacing: -0.3,
            }}/>
          {!answered && (
            <div style={{ marginTop: 18 }}>
              <PrimaryButton onClick={commitType} color={val.trim() ? DS.ink : DS.ink5} disabled={!val.trim()}>
                Check answer
              </PrimaryButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SIMILE — "as ___ as a cucumber" ────────────────────────────
function SimileExercise({ ex, topic, answered, onAnswer }) {
  const [picked, setPicked] = React.useState(null);
  const opts = React.useMemo(() => shuffle(ex.options || []), [ex]);
  React.useEffect(() => { setPicked(null); }, [ex]);
  const commit = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };

  const blankColor = answered ? (picked === ex.answer ? DS.correct : DS.wrong) : picked ? DS.accent : DS.ink3;
  const parts = (ex.template || '').split('___');

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('simile')} />
      <div style={{
        background: DS.paperCard, borderRadius: 20, padding: 30,
        boxShadow: DS.shadowMd, marginBottom: 18, textAlign: 'center', minHeight: 140,
      }}>
        <div style={{
          fontFamily: DS.display, fontSize: 28, fontWeight: 700,
          letterSpacing: -0.8, lineHeight: 1.2, color: DS.ink,
        }}>
          {parts[0]}
          <span style={{
            display: 'inline-block', minWidth: 80, padding: '0 10px',
            borderBottom: `3px solid ${blankColor}`, color: blankColor, fontWeight: 600,
          }}>{picked || '______'}</span>
          {parts[1]}
        </div>
        {ex.meaning && (
          <div style={{
            fontSize: 13, color: DS.ink3, marginTop: 14, fontWeight: 500, lineHeight: 1.4, letterSpacing: -0.1,
          }}>means: {ex.meaning}</div>
        )}
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

// ─── EXPLAIN — what does this idiom mean? ───────────────────────
function ExplainExercise({ ex, topic, answered, onAnswer }) {
  const [picked, setPicked] = React.useState(null);
  const opts = React.useMemo(() => shuffle(ex.options || []), [ex]);
  React.useEffect(() => { setPicked(null); }, [ex]);
  const commit = (o) => { if (answered) return; setPicked(o); onAnswer(o === ex.answer); };

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('explain')} />
      <div style={{
        background: DS.sageSoft, borderRadius: 18, padding: 22, marginBottom: 18, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 12, color: DS.sageDark, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
        }}>{ex.prompt}</div>
        <div style={{
          fontFamily: DS.display, fontSize: 22, fontWeight: 700,
          letterSpacing: -0.5, color: DS.ink, lineHeight: 1.25,
        }}>“{ex.idiom}”</div>
      </div>
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
                fontSize: 15, fontWeight: 500, lineHeight: 1.4, letterSpacing: -0.2,
              }}>
              <span style={{
                width: 22, height: 22, borderRadius: 99,
                background: isCorrect ? DS.correct : isWrong ? DS.wrong : 'transparent',
                color: (isCorrect || isWrong) ? DS.paperCard : DS.ink3,
                border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : DS.ink5}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>{isCorrect ? <CheckIcon /> : isWrong ? <CrossIcon /> : null}</span>
              <span style={{ flex: 1 }}>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── EXTRA WORD — find the word that shouldn't be there ─────────
// ex.extra is the extra word (must appear in the sentence), or null
// when the sentence is correct. The user taps the extra word, or the
// "Sentence is correct" button. Error correction = production skill.
function ExtraWordExercise({ ex, topic, answered, onAnswer }) {
  const [picked, setPicked] = React.useState(null); // word index or 'correct'
  React.useEffect(() => { setPicked(null); }, [ex]);

  const words = React.useMemo(() => (ex.sentence || '').split(/\s+/), [ex]);
  const clean = w => w.replace(/[.,!?;:""'']/g, '').toLowerCase();
  const extraIdx = React.useMemo(() => {
    if (!ex.extra) return -1;
    return words.findIndex(w => clean(w) === ex.extra.toLowerCase());
  }, [words, ex]);

  const commitWord = (i) => {
    if (answered) return;
    setPicked(i);
    onAnswer(ex.extra ? i === extraIdx : false);
  };
  const commitCorrect = () => {
    if (answered) return;
    setPicked('correct');
    onAnswer(!ex.extra);
  };

  return (
    <div>
      <ExerciseTitle text={ex.prompt} topic={topic} kind={kindOf('extraword')} />
      <div style={{
        background: DS.paperCard, borderRadius: 18, padding: 20,
        marginBottom: 16, boxShadow: DS.shadowSm,
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {words.map((w, i) => {
          const isExtra = answered && i === extraIdx;
          const isWrongPick = answered && picked === i && i !== extraIdx;
          return (
            <button key={i} onClick={() => commitWord(i)} disabled={!!answered}
              className={`tap ${isWrongPick ? 'anim-shake' : ''}`}
              style={{
                padding: '7px 10px', borderRadius: 10, border: 'none',
                background: isExtra ? DS.correctSoft : isWrongPick ? DS.wrongSoft : DS.paper,
                color: isExtra ? DS.correctDark : isWrongPick ? DS.wrongDark : DS.ink,
                textDecoration: isExtra ? 'line-through' : 'none',
                fontFamily: DS.display, fontSize: 17, fontWeight: 500, letterSpacing: -0.2,
                cursor: answered ? 'default' : 'pointer',
              }}>{w}</button>
          );
        })}
      </div>
      {!answered && (
        <button onClick={commitCorrect} className="tap"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 16,
            border: `1.5px solid ${DS.line}`, background: DS.paperCard,
            color: DS.ink2, fontFamily: DS.sans, fontSize: 15, fontWeight: 600,
            letterSpacing: -0.2, cursor: 'pointer', boxShadow: DS.shadowSm,
          }}>
          Sentence is correct — no extra word
        </button>
      )}
      {answered && !ex.extra && (
        <div style={{
          fontSize: 14, color: DS.ink3, letterSpacing: -0.1, padding: '0 4px',
        }}>This sentence was correct as written.</div>
      )}
    </div>
  );
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
        }}>{correct ? <CheckIcon size={13} /> : <CrossIcon size={13} />}</div>
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
          {(() => {
            const notes = [];
            if (!correct && ex.why) notes.push(ex.why);
            else if (ex.hint) notes.push(ex.hint);
            if (!correct && ex.accept && ex.accept.length) notes.push('also accepted: ' + ex.accept.join(', '));
            if (!notes.length) return null;
            return (
              <div style={{ fontSize: 13, color: DS.ink3, marginTop: 4, letterSpacing: -0.1, lineHeight: 1.45 }}>
                {notes.join(' · ')}
              </div>
            );
          })()}
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
window.ExerciseView = ExerciseView;
window.FeedbackBar = FeedbackBar;
