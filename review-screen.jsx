// ─── VOCABULARY REVIEW — card stack, reveal on tap ──────────────
// Single source for the palette so the spec colours live in one place.
const VOCAB = {
  cardBorder: '#EDF1F6',
  cardFront:  '#FFFFFF',
  cardBack:   '#EDF1F6',   // revealed fill
  noBg:   '#FDDDDD', noFg:   '#E61F1F',
  yesBg:  '#BBEDD5', yesFg:  '#15A35E',
  track:  '#EDF1F6', fill:   '#ACB3BC',
  success: '#15A35E',
};
const CARD_H = 282;

function ReviewScreen({ onExit, onComplete }) {
  const [idx, setIdx] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [knownCount, setKnownCount] = React.useState(0);
  const [deck, setDeck] = React.useState(() => shuffleDeck(VOCAB_CARDS).slice(0, 20));
  const [swipeX, setSwipeX] = React.useState(0);
  const recorded = React.useRef(false);

  const card = deck[idx];
  const done = idx >= deck.length;
  const total = deck.length;

  React.useEffect(() => {
    if (done && !recorded.current) {
      recorded.current = true;
      onComplete && onComplete({ total: deck.length, known: knownCount });
    }
  }, [done, knownCount, deck.length, onComplete]);

  if (done) {
    return <VocabSuccess known={knownCount} total={total} onExit={onExit} />;
  }

  const next = (known) => {
    if (window.SRS && card) {
      const revId = 'rev#' + card.en.replace(/\s+/g, '_');
      SRS.recordResult(revId, known);
    }
    if (known) setKnownCount(c => c + 1);
    setSwipeX(known ? 380 : -380);
    setTimeout(() => { setFlipped(false); setSwipeX(0); setIdx(i => i + 1); }, 240);
  };

  // Shuffle current + remaining cards without recording an SRS result
  const doShuffle = () => {
    setFlipped(false);
    setDeck(d => [...d.slice(0, idx), ...shuffleArray(d.slice(idx))]);
  };

  const pct = (idx / total) * 100;
  // Up to three dummy cards peek behind the active one — purely visual,
  // we still step through all 20 words via idx.
  const peek = Math.min(3, total - idx - 1);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: DS.paper, fontFamily: DS.sans,
    }}>
      {/* Top bar — close, progress, trophy */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: `max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) 20px 10px`,
        flexShrink: 0,
      }}>
        <button onClick={onExit} className="tap" aria-label="Close"
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, lineHeight: 0 }}>
          <img src="icons/x.svg" alt="" width="28" height="28" />
        </button>
        <div style={{ flex: 1, height: 12, borderRadius: 999, background: VOCAB.track, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%', background: VOCAB.fill, borderRadius: 999,
            transition: `width 360ms ${DS.ease}`,
          }} />
        </div>
        <img src="icons/trophy.svg" alt="" width="24" height="24" style={{ flexShrink: 0 }} />
      </div>

      {/* Card stack */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 300, height: CARD_H + 27 }}>
          {/* peek cards behind — static; they stay put as the active card leaves */}
          {Array.from({ length: peek }, (_, i) => peek - i).map((k) => (
            <div key={k} style={{
              position: 'absolute', top: (3 - k) * 9, left: `${k * 3}%`, right: `${k * 3}%`,
              height: CARD_H, borderRadius: 24, background: VOCAB.cardFront,
              border: `2px solid ${VOCAB.cardBorder}`, boxSizing: 'border-box', zIndex: 0,
            }} />
          ))}
          {/* active card — only this one swipes away; the next rises into place */}
          <div key={idx} className="card-rise" style={{
            position: 'absolute', top: 27, left: 0, right: 0, height: CARD_H, zIndex: 1,
            perspective: 1600,
            transform: `translateX(${swipeX}px) rotate(${swipeX * 0.03}deg)`,
            opacity: swipeX ? 0 : 1,
            transition: `transform 240ms ${DS.ease}, opacity 240ms ${DS.ease}`,
          }}>
            <div onClick={() => setFlipped(f => !f)} style={{
              position: 'relative', width: '100%', height: '100%', cursor: 'pointer',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: `transform 560ms ${DS.ease}`,
            }}>
              <div style={cardFace(false)}>
                <div style={{
                  fontFamily: DS.display, fontSize: 26, fontWeight: 600,
                  color: DS.ink, letterSpacing: -0.4, lineHeight: 1.2, textAlign: 'center',
                }}>{card.en}</div>
              </div>
              <div style={cardFace(true)}>
                <div style={{
                  fontFamily: DS.display, fontSize: 23, fontWeight: 700,
                  color: DS.ink, lineHeight: 1.25, letterSpacing: -0.4, textAlign: 'center',
                }}>{card.def}</div>
                <div style={{
                  fontSize: 14, color: DS.ink3, marginTop: 14, lineHeight: 1.45,
                  fontWeight: 500, letterSpacing: -0.1, textAlign: 'center',
                }}>{card.ex}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          fontSize: 14, fontWeight: 600, color: DS.ink3, letterSpacing: 0.28,
          textTransform: 'uppercase', marginTop: 26,
        }}>Tap to reveal</div>
      </div>

      {/* Answer buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => next(false)} className="tap" aria-label="Still learning"
          style={vocabAnswerBtn(VOCAB.noBg)}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M22.6667 9.33337L9.33334 22.6667M9.33334 9.33337L22.6667 22.6667"
              stroke={VOCAB.noFg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={() => next(true)} className="tap" aria-label="I know it"
          style={vocabAnswerBtn(VOCAB.yesBg)}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M26.6667 8L12 22.6667L5.33333 16"
              stroke={VOCAB.yesFg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Shuffle */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: `18px 0 calc(20px + env(safe-area-inset-bottom, 0px))`, flexShrink: 0,
      }}>
        <button onClick={doShuffle} className="tap" aria-label="Shuffle"
          style={{
            width: 56, height: 56, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: VOCAB.track, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <img src="icons/refresh.svg" alt="" width="24" height="24" />
        </button>
      </div>
    </div>
  );
}

// One flip-card face. Front (word) is white; back (definition) fills #EDF1F6.
function cardFace(back) {
  return {
    position: 'absolute', inset: 0, borderRadius: 24, boxSizing: 'border-box',
    border: `2px solid ${VOCAB.cardBorder}`,
    background: back ? VOCAB.cardBack : VOCAB.cardFront,
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    transform: back ? 'rotateY(180deg)' : 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  };
}

function vocabAnswerBtn(bg) {
  return {
    width: 82, height: 82, borderRadius: 999, border: 'none', cursor: 'pointer',
    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0,
  };
}

// ─── Deck-complete success — big green circle drops in with a bounce ──
function VocabSuccess({ known, total, onExit }) {
  return (
    <div style={{
      height: '100%', background: DS.paper, display: 'flex', flexDirection: 'column',
      alignItems: 'center', fontFamily: DS.sans, color: DS.ink, textAlign: 'center',
      padding: `max(${DS.topSafe}px, env(safe-area-inset-top, ${DS.topSafe}px)) 20px calc(24px + env(safe-area-inset-bottom, 0px))`,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="anim-drop" style={{
          width: 216, height: 216, borderRadius: 999, background: VOCAB.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 56,
        }}>
          <MaskIcon src="icons/check.svg" size={100} color="#FFFFFF" />
        </div>
        <h1 style={{
          fontFamily: DS.display, fontSize: 28, fontWeight: 700,
          letterSpacing: -0.5, margin: 0, color: DS.ink,
        }}>Well done!</h1>
        <p style={{
          fontSize: 16, color: DS.ink3, margin: '12px 0 0', fontWeight: 500,
          letterSpacing: -0.1, lineHeight: 1.5,
        }}>See you tomorrow for the next deck</p>
        <div className="tick" style={{
          fontSize: 14, fontWeight: 600, color: DS.ink, letterSpacing: 0.28, marginTop: 14,
        }}>{known}/{total}</div>
      </div>
      <button onClick={onExit} className="tap" style={{
        width: '100%', border: 'none', borderRadius: 999, padding: '17px 20px',
        background: '#1B77E7', color: '#FFFFFF', cursor: 'pointer',
        fontFamily: DS.sans, fontSize: 16, fontWeight: 700, letterSpacing: -0.2,
      }}>Back to home</button>
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
                }}>{isCorrect ? <CheckIcon /> : isWrong ? <CrossIcon /> : null}</span>
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
            }}>{picked === q.card.en ? <CheckIcon size={13} /> : <CrossIcon size={13} />}</div>
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
