// ─── QUICK PRACTICE — every exercise, with live category & shuffle controls ──
// Reuses ExerciseView / FeedbackBar / LessonTopBar. Unlike CategoryScreen,
// the category chips and the shuffle button live ON this screen and can be
// changed at any moment while practising — not picked once before the start.

function QuickTestScreen({ onExit, onComplete }) {
  const pool = React.useMemo(() => {
    const arr = [];
    TOPICS.forEach(t => {
      const lesson = LESSONS[t.id];
      if (!lesson) return;
      lesson.exercises.forEach((ex, i) => {
        arr.push({ id: ex._id || (t.id + '#' + i), ex, unitId: t.id });
      });
    });
    if (window.generateReverseExercises) {
      generateReverseExercises().forEach(ex => {
        arr.push({ id: ex._id, ex, unitId: '__vocab__' });
      });
    }
    return arr;
  }, []);

  const byId = React.useMemo(() => {
    const m = {}; pool.forEach(p => { m[p.id] = p; }); return m;
  }, [pool]);

  const units = React.useMemo(() => {
    const base = TOPICS.map(t => ({
      id: t.id,
      short: t.title.split(/[ &]/)[0],
      topic: t,
      color: (window.UNIT_COLORS && window.UNIT_COLORS[t.id]) || { bg: DS.paperDeep, fg: DS.ink },
    }));
    if (pool.some(p => p.unitId === '__vocab__')) {
      base.push({
        id: '__vocab__',
        short: 'Vocab',
        topic: { id: '__vocab__', title: 'Vocabulary' },
        color: { bg: '#E6EEFF', fg: '#1F4FCC' },
      });
    }
    return base;
  }, [pool]);

  const groupedOrder = React.useMemo(() => pool.map((_, i) => i), [pool]);

  const [enabled, setEnabled] = React.useState(() => {
    const ids = new Set(TOPICS.map(t => t.id));
    if (pool.some(p => p.unitId === '__vocab__')) ids.add('__vocab__');
    return ids;
  });
  const [mode, setMode] = React.useState('mix'); // 'mix' | 'production' | 'recognition'
  const [order, setOrder] = React.useState(groupedOrder);
  const [seen, setSeen] = React.useState(() => new Set());
  const [activeId, setActiveId] = React.useState(() => (pool.length ? pool[0].id : null));
  const [answered, setAnswered] = React.useState(null);
  const [mistakes, setMistakes] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const recorded = React.useRef(false);

  const matchesMode = React.useCallback((ex) => {
    if (mode === 'mix') return true;
    const prod = window.isProduction ? window.isProduction(ex) : false;
    return mode === 'production' ? prod : !prod;
  }, [mode]);

  const pickNext = React.useCallback((excludeId) => {
    for (const i of order) {
      const p = pool[i];
      if (p.id === excludeId) continue;
      if (!enabled.has(p.unitId)) continue;
      if (seen.has(p.id)) continue;
      if (!matchesMode(p.ex)) continue;
      return p.id;
    }
    return null;
  }, [order, pool, enabled, seen, matchesMode]);

  // When the active exercise's category/mode is switched off (and we're not in
  // the middle of showing feedback), skip to the next still-eligible exercise.
  React.useEffect(() => {
    if (answered) return;
    const cur = activeId ? byId[activeId] : null;
    if (cur && (!enabled.has(cur.unitId) || !matchesMode(cur.ex))) {
      setActiveId(pickNext(activeId));
    } else if (!activeId) {
      const n = pickNext(null);
      if (n) setActiveId(n);
    }
  }, [enabled, mode, answered, activeId, byId, pickNext, matchesMode]);

  const remainingOf = (uid) => pool.filter(p => p.unitId === uid && !seen.has(p.id) && matchesMode(p.ex)).length;
  const doneCount = seen.size;
  const remaining = order.filter(i => {
    const p = pool[i];
    return enabled.has(p.unitId) && !seen.has(p.id) && matchesMode(p.ex);
  }).length;
  const totalActive = doneCount + remaining;

  const active = activeId ? byId[activeId] : null;
  const finished = doneCount > 0 && remaining === 0 && enabled.size > 0;

  React.useEffect(() => {
    if (finished && !recorded.current) {
      recorded.current = true;
      onComplete && onComplete({ total: doneCount, correct: correctCount });
    }
  }, [finished, doneCount, correctCount, onComplete]);

  const handleAnswer = (correct) => {
    if (active && active.ex && active.ex._id && window.SRS) SRS.recordResult(active.ex._id, correct);
    if (correct) { setAnswered('correct'); setCorrectCount(c => c + 1); }
    else { setAnswered('wrong'); setMistakes(m => m + 1); }
  };
  const handleContinue = () => {
    const nextId = pickNext(activeId);
    setSeen(s => { const n = new Set(s); n.add(activeId); return n; });
    setActiveId(nextId);
    setAnswered(null);
  };
  const toggleUnit = (uid) => {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid); else next.add(uid);
      return next;
    });
  };
  // Shuffle is an action: each press re-randomises the remaining queue and
  // jumps to a fresh exercise so the screen visibly changes every time.
  const doShuffle = () => {
    const newOrder = shuffleArray(groupedOrder);
    const newSeen = answered && activeId ? new Set(seen).add(activeId) : seen;
    let nextId = null;
    for (const i of newOrder) {
      const p = pool[i];
      if (!answered && p.id === activeId) continue;
      if (!enabled.has(p.unitId)) continue;
      if (newSeen.has(p.id)) continue;
      nextId = p.id; break;
    }
    if (nextId === null && !answered) nextId = activeId;
    setOrder(newOrder);
    if (answered && activeId) setSeen(newSeen);
    setActiveId(nextId);
    setAnswered(null);
  };

  if (finished) {
    const acc = Math.round((correctCount / doneCount) * 100);
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
          }}>{acc}<span style={{ fontSize: 20, opacity: 0.5 }}>%</span></div>
          <h1 className="anim-slide-u" style={{
            fontFamily: DS.display, fontSize: 28, fontWeight: 700,
            letterSpacing: -0.7, margin: '4px 0 6px',
          }}>Practice done</h1>
          <p style={{ color: DS.ink3, fontSize: 15, marginBottom: 28, letterSpacing: -0.1 }}>
            {correctCount}/{doneCount} correct · {mistakes} mistake{mistakes === 1 ? '' : 's'}.
          </p>
        </div>
        <PrimaryButton onClick={onExit} color={DS.ink}>Back to home</PrimaryButton>
      </div>
    );
  }

  const pct = totalActive ? (doneCount / totalActive) * 100 : 0;

  // Compact mode toggle that lives in the top bar — single icon button
  // that cycles Mix → Production → Recognition → Mix, with a label.
  const modeMeta = {
    mix:         { label: 'Mix', icon: <span style={{ fontSize: 11, lineHeight: 1 }}>⚡</span> },
    production:  { label: 'Prod', icon: <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 7l1.7 1.7L9.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    recognition: { label: 'Rec',  icon: <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 1.5a5.5 5.5 0 010 11z" fill="currentColor"/></svg> },
  };
  const cycleMode = () => setMode(m => m === 'mix' ? 'production' : m === 'production' ? 'recognition' : 'mix');
  const modeOn = mode !== 'mix';
  const modePill = (
    <button onClick={cycleMode} className="tap"
      aria-label={`Mode: ${modeMeta[mode].label} — tap to change`}
      style={{
        flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
        border: 'none', background: modeOn ? DS.ink : 'transparent',
        color: modeOn ? DS.paperCard : DS.ink3,
        fontFamily: DS.sans, fontSize: 12, fontWeight: 600, letterSpacing: -0.1,
      }}>
      {modeMeta[mode].icon}
      {modeMeta[mode].label}
    </button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans, position: 'relative' }}>
      <LessonTopBar pct={pct} onExit={onExit} label={`${doneCount}/${totalActive || 0}`} trailing={modePill} />

      {/* Single row of flat category chips + expander */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '2px 16px 14px', background: DS.paper }}>
        <div style={{
          flex: 1, minWidth: 0, display: 'flex', gap: 6,
          flexWrap: tagsOpen ? 'wrap' : 'nowrap',
          overflow: 'hidden',
        }}>
          {(tagsOpen ? units : units.slice(0, 3)).map(u => {
            const on = enabled.has(u.id);
            const cnt = remainingOf(u.id);
            return (
              <button key={u.id} onClick={() => toggleUnit(u.id)} className="tap"
                style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
                  border: 'none',
                  fontFamily: DS.sans, fontSize: 12, fontWeight: 600, letterSpacing: -0.1,
                  background: on ? u.color.bg : 'transparent',
                  color: on ? u.color.fg : DS.ink4,
                  transition: `background 180ms ${DS.ease}, color 180ms ${DS.ease}`,
                }}>
                {u.short}
                <span style={{ opacity: 0.55, fontWeight: 500 }}>{cnt}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => setTagsOpen(o => !o)} className="tap"
          aria-label={tagsOpen ? 'Collapse categories' : 'Show all categories'}
          style={{
            flexShrink: 0, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center',
            padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
            border: 'none', background: DS.ink, color: DS.paperCard,
            fontFamily: DS.sans, fontSize: 12, fontWeight: 700, letterSpacing: -0.1,
          }}>
          {tagsOpen ? 'Hide' : `+${units.length - 3}`}
        </button>
      </div>

      {active ? (
        <div key={active.id} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
          <ExerciseView
            ex={active.ex}
            topic={units.find(u => u.id === active.unitId).topic}
            answered={answered}
            onAnswer={handleAnswer}
          />
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '0 32px',
          textAlign: 'center', color: DS.ink3,
        }}>
          <div style={{
            fontFamily: DS.display, fontSize: 20, fontWeight: 700,
            color: DS.ink, letterSpacing: -0.5, marginBottom: 6,
          }}>Nothing to practise here</div>
          <div style={{ fontSize: 14, letterSpacing: -0.1, lineHeight: 1.4 }}>
            Turn on a category, change the mode, or shuffle the deck.
          </div>
        </div>
      )}

      {active && answered && <FeedbackBar answered={answered} ex={active.ex} onContinue={handleContinue} />}

      {/* Floating Shuffle pill — sits above content, doesn't take a full row */}
      {!answered && (
        <button onClick={doShuffle} className="tap"
          aria-label="Shuffle"
          style={{
            position: 'absolute', bottom: 20, right: 20, zIndex: 5,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 16px 12px 14px', borderRadius: 999,
            border: 'none', cursor: 'pointer',
            background: DS.ink, color: DS.paperCard,
            fontFamily: DS.sans, fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
            boxShadow: DS.shadowLg,
          }}>
          <ShuffleIcon size={16} color="currentColor" strokeWidth={2.2} />
          Shuffle
        </button>
      )}
    </div>
  );
}

window.QuickTestScreen = QuickTestScreen;
