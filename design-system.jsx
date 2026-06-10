// ─── DESIGN SYSTEM — Family-style iOS: clean, rounded, SF Pro ────

const IOS_TOP_SAFE = 60;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const DS = {
  // INK — neutral near-black
  ink:   '#0E1013',
  ink2:  '#2B2F36',
  ink3:  '#7C828A',
  ink4:  '#B5BAC1',
  ink5:  '#DFE2E6',

  // SURFACES — white canvas, grey cards (Joi style)
  paper:      '#FFFFFF',   // app canvas (white)
  paperDeep:  '#EAEAEC',   // hover / pressed rows
  paperCard:  '#F5F5F7',   // card / surface (light grey)
  paperWhite: '#FFFFFF',

  // ACCENT — iOS-style soft blue (single primary color)
  accent:     '#2D6BFF',
  accentSoft: '#E6EEFF',
  accentDark: '#1F4FCC',

  // Secondary — warm peach for highlight / "today"
  sage:       '#E89165',
  sageSoft:   '#FBE5D7',
  sageDark:   '#B5683F',

  // STATES
  correct:     '#1F9D58',
  correctSoft: '#E2F4EA',
  correctDark: '#147542',
  wrong:       '#E2483C',
  wrongSoft:   '#FBE4E2',
  wrongDark:   '#A82B22',

  streak:     '#E89165',
  streakSoft: '#FBE5D7',

  // Hairlines — very soft
  line:       '#E5E5E7',
  lineSoft:   '#EEEEF0',
  lineDark:   '#D5D5D7',

  // Shadows — flat look: grey fills carry the hierarchy, not shadows.
  // shadowLg kept for genuinely floating elements (e.g. the shuffle pill).
  shadowSm: 'none',
  shadowMd: 'none',
  shadowLg: '0 12px 28px rgba(14, 16, 19, 0.10), 0 2px 6px rgba(14, 16, 19, 0.05)',

  // backwards-compat aliases
  get bg()          { return this.paper; },
  get bgCard()      { return this.paperCard; },
  get primary()     { return this.ink; },
  get primaryDark() { return this.ink2; },
  get primarySoft() { return this.accentSoft; },

  topSafe: IOS_TOP_SAFE,
  ease: EASE,
  easeOut: EASE_OUT,

  // type — SF Pro Rounded on Apple, Nunito everywhere else
  display: `ui-rounded, "SF Pro Rounded", "Nunito", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
  sans:    `ui-rounded, "SF Pro Rounded", "Nunito", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
  mono:    `ui-monospace, "SF Mono", Menlo, "JetBrains Mono", monospace`,
  // alias kept for compat — points to the same rounded family
  get serif() { return this.display; },
};

(function injectMotionCSS() {
  if (typeof document === 'undefined' || document.getElementById('motion-css')) return;
  const css = `
    .tap { transition: transform 200ms ${EASE}, background 180ms ${EASE}, border-color 180ms ${EASE}, opacity 180ms ${EASE}, color 180ms ${EASE}, box-shadow 180ms ${EASE}; }
    .tap:active:not(:disabled) { transform: scale(0.975); }

    @keyframes slideInRight { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInUp    { from { opacity: 0; transform: translateY(10px); }  to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn       { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn        { 0% { transform: scale(0.75); opacity: 0; } 60% { transform: scale(1.04); opacity: 1; } 100% { transform: scale(1); } }
    @keyframes shake        { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }

    .anim-slide-r { animation: slideInRight 380ms ${EASE} both; }
    .anim-slide-u { animation: slideInUp 340ms ${EASE} both; }
    .anim-fade    { animation: fadeIn 280ms ${EASE} both; }
    .anim-pop     { animation: popIn 460ms ${EASE} both; }
    .anim-shake   { animation: shake 360ms ${EASE}; }

    .stagger > * { animation: slideInUp 340ms ${EASE} both; }
    .stagger > *:nth-child(1)  { animation-delay: 0ms; }
    .stagger > *:nth-child(2)  { animation-delay: 35ms; }
    .stagger > *:nth-child(3)  { animation-delay: 70ms; }
    .stagger > *:nth-child(4)  { animation-delay: 105ms; }
    .stagger > *:nth-child(5)  { animation-delay: 140ms; }
    .stagger > *:nth-child(6)  { animation-delay: 175ms; }
    .stagger > *:nth-child(7)  { animation-delay: 210ms; }
    .stagger > *:nth-child(8)  { animation-delay: 245ms; }
    .stagger > *:nth-child(9)  { animation-delay: 280ms; }
    .stagger > *:nth-child(10) { animation-delay: 315ms; }
    .stagger > *:nth-child(11) { animation-delay: 350ms; }
    .stagger > *:nth-child(12) { animation-delay: 385ms; }
    .stagger > *:nth-child(13) { animation-delay: 420ms; }
    .stagger > *:nth-child(14) { animation-delay: 455ms; }
    .stagger > *:nth-child(15) { animation-delay: 490ms; }
    .stagger > *:nth-child(16) { animation-delay: 525ms; }
    .stagger > *:nth-child(17) { animation-delay: 560ms; }
    .stagger > *:nth-child(18) { animation-delay: 595ms; }
    .stagger > *:nth-child(19) { animation-delay: 630ms; }
    .stagger > *:nth-child(20) { animation-delay: 665ms; }
    .stagger > *:nth-child(21) { animation-delay: 700ms; }
    .stagger > *:nth-child(22) { animation-delay: 735ms; }
    .stagger > *:nth-child(23) { animation-delay: 770ms; }
    .stagger > *:nth-child(24) { animation-delay: 805ms; }
    .stagger > *:nth-child(25) { animation-delay: 840ms; }
    .stagger > *:nth-child(26) { animation-delay: 875ms; }
    .stagger > *:nth-child(27) { animation-delay: 910ms; }

    .row-press { transition: background 160ms ${EASE}, transform 200ms ${EASE}; }
    .row-press:active:not(:disabled) { background: ${DS.paperDeep} !important; transform: scale(0.992); }

    .tick  { font-variant-numeric: tabular-nums; }

    .scroll::-webkit-scrollbar { width: 0; height: 0; }

    /* hide scrollbars on every scroll area inside the app */
    #root *::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none; }
    #root * { scrollbar-width: none; -ms-overflow-style: none; }
  `;
  const s = document.createElement('style');
  s.id = 'motion-css';
  s.textContent = css;
  document.head.appendChild(s);
})();

// ── Primary button — soft rounded pill
function PrimaryButton({ children, onClick, color = DS.ink, disabled, style = {} }) {
  return (
    <button
      className="tap"
      onClick={() => !disabled && onClick && onClick()}
      disabled={disabled}
      style={{
        width: '100%', border: 'none',
        background: disabled ? DS.ink5 : color,
        color: DS.paperCard, padding: '17px 20px',
        borderRadius: 999, fontSize: 16, fontWeight: 600,
        fontFamily: DS.sans, cursor: disabled ? 'default' : 'pointer',
        letterSpacing: -0.2,
        boxShadow: disabled ? 'none' : DS.shadowSm,
        ...style,
      }}>{children}</button>
  );
}

function BackButton({ onClick, label = 'Back', color = DS.ink }) {
  return (
    <button
      className="tap"
      onClick={onClick}
      style={{
        background: 'transparent', border: 'none', padding: '6px 6px 6px 2px',
        cursor: 'pointer', fontFamily: DS.sans,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        color, fontSize: 15, fontWeight: 500, letterSpacing: -0.2,
        marginLeft: -4,
      }}>
      <svg width="18" height="18" viewBox="0 0 16 16">
        <path d="M10 3L5 8l5 5" stroke={color} strokeWidth="1.8" fill="none"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{label}</span>
    </button>
  );
}

function Chip({ children, bg, color, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg || DS.paperDeep, color: color || DS.ink2,
      padding: '5px 11px', borderRadius: 99,
      fontSize: 12, fontWeight: 500, letterSpacing: -0.1,
      fontFamily: DS.sans,
      ...style,
    }}>{children}</span>
  );
}

function ProgressBar({ pct, color = DS.ink, height = 6, bg = DS.ink5, style }) {
  return (
    <div style={{
      flex: 1, height, background: bg, borderRadius: 99,
      overflow: 'hidden', ...style,
    }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%',
        background: color, borderRadius: 99,
        transition: `width 500ms ${EASE_OUT}`,
      }} />
    </div>
  );
}

function LessonTopBar({ pct, onExit, label, trailing }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: `${IOS_TOP_SAFE}px 20px 14px`,
      background: DS.paper,
    }}>
      <button onClick={onExit} className="tap" style={{
        background: 'transparent', border: 'none', padding: 4,
        cursor: 'pointer', color: DS.ink3,
        marginLeft: -4,
      }}>
        <svg width="22" height="22" viewBox="0 0 18 18">
          <path d="M4 4l10 10M14 4L4 14" stroke={DS.ink2} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
      <ProgressBar pct={pct} color={DS.ink} height={6} bg={DS.ink5} />
      {label && (
        <span className="tick" style={{ fontSize: 13, color: DS.ink3, fontWeight: 600, letterSpacing: -0.1 }}>{label}</span>
      )}
      {trailing}
    </div>
  );
}

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 13, color: DS.ink3, fontWeight: 500,
      letterSpacing: -0.1, margin: '22px 4px 10px',
      ...style,
    }}>{children}</div>
  );
}

function Divider({ label, color = DS.line, text = DS.ink3 }) {
  return (
    <div style={{
      fontSize: 13, color: text, fontWeight: 500,
      letterSpacing: -0.1, margin: '22px 4px 10px',
    }}>{label}</div>
  );
}

function Tick({ children, style }) {
  return (
    <span className="tick" style={{
      fontSize: 12, color: DS.ink3, fontWeight: 500, letterSpacing: -0.1,
      ...style,
    }}>{children}</span>
  );
}

// Soft round letter mark used for topic avatars
function Mark({ letter, color = DS.ink, bg = DS.paperCard, size = 44, border = DS.line }) {
  return (
    <div style={{
      width: size, height: size,
      background: bg, color,
      border: `1px solid ${border}`,
      borderRadius: size / 2,
      fontFamily: DS.display, fontWeight: 600, fontSize: size * 0.42,
      letterSpacing: -0.4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{letter}</div>
  );
}

// Clean shuffle icon (Feather-style) — two crossing arrows
function ShuffleIcon({ size = 22, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

// Fisher–Yates shuffle — returns a new shuffled array
function shuffleArray(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Big dark Shuffle button — same visual everywhere
function ShuffleButton({ onClick }) {
  return (
    <button onClick={onClick} className="tap"
      style={{
        width: '100%', padding: '16px', borderRadius: 16, border: 'none',
        cursor: 'pointer', background: DS.ink, color: DS.paperCard,
        fontFamily: DS.sans, fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      }}>
      <ShuffleIcon size={19} color="currentColor" strokeWidth={2.2} />
      Shuffle
    </button>
  );
}

window.DS = DS;
window.PrimaryButton = PrimaryButton;
window.BackButton = BackButton;
window.Chip = Chip;
window.ProgressBar = ProgressBar;
window.LessonTopBar = LessonTopBar;
window.SectionLabel = SectionLabel;
window.Divider = Divider;
window.Tick = Tick;
window.Mark = Mark;
window.ShuffleIcon = ShuffleIcon;
window.ShuffleButton = ShuffleButton;
window.shuffleArray = shuffleArray;
window.BigButton = PrimaryButton;
window.StreakIcon = () => null;
window.XPIcon = () => null;
window.HeartIcon = () => null;
window.FlameIcon = () => null;
window.GemIcon = () => null;
