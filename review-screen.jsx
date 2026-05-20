// ─── VOCABULARY REVIEW — clean flashcards, SF Pro ───────────────

function ReviewScreen({ onExit, onComplete }) {
  const [idx, setIdx] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [knownCount, setKnownCount] = React.useState(0);
  const [deck, setDeck] = React.useState(() => shuffleDeck(VOCAB_CARDS).slice(0, 20));
  const [swipeX, setSwipeX] = React.useState(0);
  const recorded = React.useRef(false);

  const card = deck[idx];
  const done = idx >= deck.length;

  React.useEffect(() => {
    if (done && !recorded.current) {
      recorded.current = true;
      onComplete && onComplete({ total: deck.length, known: knownCount });
    }
  }, [done, knownCount, deck.length, onComplete]);

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
            fontSize: 38, letterSpacing: -1.2,
            marginBottom: 20,
          }}>{knownCount}<span style={{ fontSize: 20, opacity: 0.5 }}>/{deck.length}</span></div>
          <h1 className="anim-slide-u" style={{
            fontFamily: DS.display, fontSize: 28, fontWeight: 700,
            letterSpacing: -0.7, margin: '4px 0 6px',
          }}>Deck complete</h1>
          <p style={{
            color: DS.ink3, fontSize: 15, marginBottom: 28, letterSpacing: -0.1,
          }}>See you tomorrow for the next deck.</p>
        </div>
        <PrimaryButton onClick={onExit} color={DS.ink}>Back to home</PrimaryButton>
      </div>
    );
  }

  const next = (known) => {
    if (window.SRS && card) {
      const revId = 'rev#' + card.en.replace(/\s+/g, '_');
      SRS.recordResult(revId, known);
    }
    if (known) setKnownCount(c => c + 1);
    setFlipped(false);
    setSwipeX(known ? 360 : -360);
    setTimeout(() => { setSwipeX(0); setIdx(i => i + 1); }, 260);
  };

  // Shuffle current + remaining cards without recording an SRS result
  const doShuffle = () => {
    setFlipped(false);
    setDeck(d => [...d.slice(0, idx), ...shuffleArray(d.slice(idx))]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={(idx / deck.length) * 100} onExit={onExit} label={`${idx + 1}/${deck.length}`} />
      <div style={{ padding: '2px 20px 6px', display: 'flex', gap: 6 }}>
        <Chip bg={DS.accentSoft} color={DS.accentDark} style={{ fontWeight: 600 }}>Flashcards</Chip>
        <Chip>{knownCount} known</Chip>
      </div>

      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          perspective: 1200,
          transform: `translateX(${swipeX}px) rotate(${swipeX * 0.04}deg)`,
          opacity: swipeX ? 0 : 1,
          transition: `transform 260ms ${DS.ease}, opacity 260ms ${DS.ease}`,
        }}>
          <div
            onClick={() => setFlipped(f => !f)}
            style={{
              position: 'relative', width: '100%', height: 360,
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: `transform 560ms ${DS.ease}`,
              cursor: 'pointer',
            }}>
            <FlashFace back={false} card={card} n={idx + 1} />
            <FlashFace back={true} card={card} n={idx + 1} />
          </div>
        </div>
        <div style={{
          textAlign: 'center', marginTop: 18,
          fontSize: 13, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1,
        }}>Tap card to {flipped ? 'hide' : 'reveal'} the definition</div>
      </div>

      <div style={{ padding: '0 20px 10px' }}>
        <ShuffleButton onClick={doShuffle} />
      </div>
      <div style={{ padding: '0 20px 24px', display: 'flex', gap: 10 }}>
        <button onClick={() => next(false)} className="tap" style={secondaryBtnStyle(DS.wrong, DS.wrongSoft)}>
          Still learning
        </button>
        <button onClick={() => next(true)} className="tap" style={secondaryBtnStyle(DS.correct, DS.correctSoft)}>
          I know it
        </button>
      </div>
    </div>
  );
}

function secondaryBtnStyle(color, soft) {
  return {
    flex: 1, padding: '15px 16px', borderRadius: 999,
    background: soft, border: 'none', color,
    fontSize: 14, fontWeight: 600, letterSpacing: -0.2,
    cursor: 'pointer', fontFamily: DS.sans,
  };
}

function FlashFace({ back, card, n }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 24,
      background: back ? DS.ink : DS.paperCard,
      color: back ? DS.paperCard : DS.ink,
      backfaceVisibility: 'hidden',
      transform: back ? 'rotateY(180deg)' : 'none',
      padding: 26, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      textAlign: 'center',
      boxShadow: back ? DS.shadowLg : DS.shadowMd,
    }}>
      {back ? (
        <>
          <div className="tick" style={{
            position: 'absolute', top: 18, left: 18,
            fontSize: 12, letterSpacing: -0.1, opacity: 0.5, fontWeight: 500,
          }}>№ {String(n).padStart(3, '0')}</div>
          <div style={{
            fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
            opacity: 0.6, marginBottom: 10,
          }}>Definition</div>
          <div style={{
            fontFamily: DS.display,
            fontSize: 22, fontWeight: 600, lineHeight: 1.3,
            margin: '4px 0 18px', letterSpacing: -0.5,
          }}>{card.def}</div>
          <div style={{
            fontSize: 14, lineHeight: 1.5, opacity: 0.7, letterSpacing: -0.1,
            paddingTop: 14, borderTop: `1px solid rgba(255,255,255,0.14)`,
            width: '100%',
          }}>"{card.ex}"</div>
        </>
      ) : (
        <>
          <div className="tick" style={{
            position: 'absolute', top: 18, left: 18,
            fontSize: 12, color: DS.ink3, letterSpacing: -0.1, fontWeight: 500,
          }}>№ {String(n).padStart(3, '0')}</div>
          <div style={{
            fontSize: 12, fontWeight: 600, letterSpacing: -0.1,
            color: DS.accent, marginBottom: 6,
          }}>Word</div>
          <div style={{
            fontFamily: DS.display,
            fontSize: 34, fontWeight: 700, marginTop: 8,
            color: DS.ink, letterSpacing: -1.2, lineHeight: 1.1,
          }}>{card.en}</div>
          <div style={{
            position: 'absolute', bottom: 22,
            fontSize: 13, color: DS.ink3, letterSpacing: -0.1,
            fontWeight: 500,
          }}>Tap to reveal</div>
        </>
      )}
    </div>
  );
}

function shuffleDeck(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── VOCABULARY TEST — pick the word that matches the definition ──

function buildVocabQuiz(n) {
  const deck = shuffleDeck(VOCAB_CARDS).slice(0, n);
  return deck.map(card => {
    const distractors = shuffleDeck(VOCAB_CARDS.filter(c => c.en !== card.en))
      .slice(0, 3)
      .map(c => c.en);
    return { card, options: shuffleDeck([card.en, ...distractors]) };
  });
}

function VocabTestScreen({ onExit, onComplete }) {
  const [quiz, setQuiz] = React.useState(() => buildVocabQuiz(10));
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const recorded = React.useRef(false);

  const done = idx >= quiz.length;
  const q = quiz[idx];

  React.useEffect(() => {
    if (done && !recorded.current) {
      recorded.current = true;
      onComplete && onComplete({ total: quiz.length, correct: correctCount });
    }
  }, [done, correctCount, quiz.length, onComplete]);

  if (done) {
    const acc = Math.round((correctCount / quiz.length) * 100);
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
          }}>Test complete</h1>
          <p style={{ color: DS.ink3, fontSize: 15, marginBottom: 28, letterSpacing: -0.1 }}>
            {correctCount}/{quiz.length} words correct.
          </p>
        </div>
        <PrimaryButton onClick={onExit} color={DS.ink}>Back to home</PrimaryButton>
      </div>
    );
  }

  const commit = (o) => {
    if (picked) return;
    setPicked(o);
    if (o === q.card.en) setCorrectCount(c => c + 1);
  };
  const next = () => { setPicked(null); setIdx(i => i + 1); };
  const doShuffle = () => {
    setQuiz(qz => [...qz.slice(0, idx), ...shuffleArray(qz.slice(idx))]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: DS.paper, fontFamily: DS.sans }}>
      <LessonTopBar pct={(idx / quiz.length) * 100} onExit={onExit} label={`${idx + 1}/${quiz.length}`} />
      <div style={{ padding: '2px 20px 6px', display: 'flex', gap: 6 }}>
        <Chip bg={DS.accentSoft} color={DS.accentDark} style={{ fontWeight: 600 }}>Vocabulary test</Chip>
        <Chip>{correctCount} correct</Chip>
      </div>

      <div key={idx} className="anim-slide-r" style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: DS.ink3,
            letterSpacing: -0.1, margin: '4px 4px 8px',
          }}>Which word means…</div>
          <div style={{
            background: DS.paperCard, borderRadius: 18, padding: '18px 18px',
            boxShadow: DS.shadowSm,
          }}>
            <div style={{
              fontFamily: DS.display, fontSize: 20, fontWeight: 600,
              color: DS.ink, lineHeight: 1.35, letterSpacing: -0.4,
            }}>{q.card.def}</div>
          </div>
        </div>

        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((o, i) => {
            const isCorrect = picked && o === q.card.en;
            const isWrong = picked === o && o !== q.card.en;
            return (
              <button key={i} onClick={() => commit(o)} disabled={!!picked}
                className={`tap ${isWrong ? 'anim-shake' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '15px 16px', borderRadius: 16,
                  background: isCorrect ? DS.correctSoft : isWrong ? DS.wrongSoft : DS.paperCard,
                  border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : 'transparent'}`,
                  boxShadow: !picked ? DS.shadowSm : 'none',
                  cursor: picked ? 'default' : 'pointer', textAlign: 'left', fontFamily: DS.sans,
                  color: isCorrect ? DS.correctDark : isWrong ? DS.wrongDark : DS.ink,
                  fontSize: 15, fontWeight: 500, lineHeight: 1.35, letterSpacing: -0.2,
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 99,
                  background: isCorrect ? DS.correct : isWrong ? DS.wrong : 'transparent',
                  color: (isCorrect || isWrong) ? DS.paperCard : DS.ink3,
                  border: `1.5px solid ${isCorrect ? DS.correct : isWrong ? DS.wrong : DS.ink5}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{isCorrect ? '✓' : isWrong ? '✕' : ''}</span>
                <span style={{ flex: 1 }}>{o}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!picked && idx + 1 < quiz.length && (
        <div style={{ padding: '8px 20px 24px', background: DS.paper }}>
          <ShuffleButton onClick={doShuffle} />
        </div>
      )}

      {picked && (
        <div className="anim-slide-u" style={{
          background: picked === q.card.en ? DS.correctSoft : DS.wrongSoft,
          padding: '18px 20px 22px',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div className="anim-pop" style={{
              width: 28, height: 28, borderRadius: 99,
              background: picked === q.card.en ? DS.correct : DS.wrong, color: DS.paperCard,
              fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{picked === q.card.en ? '✓' : '✕'}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: DS.display, fontSize: 18, fontWeight: 700,
                color: picked === q.card.en ? DS.correctDark : DS.wrongDark,
                lineHeight: 1.2, letterSpacing: -0.4,
              }}>{picked === q.card.en ? 'Correct!' : 'Not quite.'}</div>
              <div style={{ fontSize: 14, color: DS.ink2, marginTop: 4, letterSpacing: -0.1 }}>
                <b style={{ color: DS.ink }}>{q.card.en}</b> — “{q.card.ex}”
              </div>
            </div>
          </div>
          <PrimaryButton onClick={next} color={picked === q.card.en ? DS.correct : DS.ink}>
            Continue
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

window.ReviewScreen = ReviewScreen;
window.VocabTestScreen = VocabTestScreen;
