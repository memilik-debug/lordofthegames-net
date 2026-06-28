// scenes-main.jsx — Lord of the Games promo: scene components + master timeline
// Uses globals from animations.jsx and scenes.jsx.

const { useTime, useSprite } = window;

// ──────────────────────────────────────────────────────────────────────────
// SCENE 1 — Cold open (0–4s): logo assembles in starfield
// ──────────────────────────────────────────────────────────────────────────
function ColdOpen() {
  const t = useTime();
  if (t > 4.2) return null;

  const word1 = 'LORD OF THE';
  const word2 = 'GAMES';
  const letterDelay = 0.06;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Background pulse */}
      <Sprite start={0.4} end={4.2}>
        {({ localTime }) => {
          const pulse = Math.sin(localTime * 4) * 0.5 + 0.5;
          return (
            <div style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 1400, height: 1400,
              transform: `translate(-50%,-50%) scale(${0.6 + pulse * 0.1})`,
              background: 'radial-gradient(circle, rgba(255,69,0,0.18) 0%, transparent 55%)',
              opacity: clamp(localTime / 0.6, 0, 1) * (1 - clamp((localTime - 3.4) / 0.8, 0, 1)),
              pointerEvents: 'none',
            }} />
          );
        }}
      </Sprite>

      {/* Controller emoji slamming in */}
      <Sprite start={0.1} end={4.2}>
        {({ localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.5, 0, 1));
          const out = clamp((localTime - 3.6) / 0.6, 0, 1);
          const wobble = Math.sin(localTime * 3) * 4;
          return (
            <div style={{
              position: 'absolute',
              left: 960, top: 360,
              transform: `translate(-50%,-50%) scale(${inT * (1 - out * 0.3)}) rotate(${wobble}deg)`,
              fontSize: 180,
              opacity: 1 - out,
              filter: 'drop-shadow(0 0 30px rgba(255,69,0,0.8))',
            }}>🎮</div>
          );
        }}
      </Sprite>

      {/* "LORD OF THE" — letter-by-letter */}
      <Sprite start={0.6} end={4.2}>
        {({ localTime }) => {
          const out = clamp((localTime - 3.4) / 0.6, 0, 1);
          return (
            <div style={{
              position: 'absolute',
              left: 960, top: 540,
              transform: 'translate(-50%,-50%)',
              fontFamily: BRAND.display,
              fontSize: 88,
              color: BRAND.ink,
              letterSpacing: '4px',
              opacity: 1 - out,
              whiteSpace: 'nowrap',
              textShadow: '0 0 20px rgba(255,255,255,0.15)',
            }}>
              {word1.split('').map((ch, i) => {
                const delay = i * letterDelay;
                const lt = clamp((localTime - delay) / 0.4, 0, 1);
                const e = Easing.easeOutBack(lt);
                return (
                  <span key={i} style={{
                    display: 'inline-block',
                    opacity: lt,
                    transform: `translateY(${(1 - e) * 40}px) scale(${0.4 + e * 0.6})`,
                  }}>{ch === ' ' ? '\u00A0' : ch}</span>
                );
              })}
            </div>
          );
        }}
      </Sprite>

      {/* "GAMES" — bigger, orange */}
      <Sprite start={1.4} end={4.2}>
        {({ localTime }) => {
          const out = clamp((localTime - 2.6) / 0.6, 0, 1);
          return (
            <div style={{
              position: 'absolute',
              left: 960, top: 660,
              transform: 'translate(-50%,-50%)',
              fontFamily: BRAND.display,
              fontSize: 180,
              color: BRAND.accent,
              letterSpacing: '8px',
              opacity: 1 - out,
              whiteSpace: 'nowrap',
              textShadow: `0 0 40px ${BRAND.glow}, 0 0 80px ${BRAND.glow}`,
            }}>
              {word2.split('').map((ch, i) => {
                const delay = i * 0.08;
                const lt = clamp((localTime - delay) / 0.5, 0, 1);
                const e = Easing.easeOutBack(lt);
                const bounce = Math.sin((localTime - delay) * 6) * 3 * (1 - lt);
                return (
                  <span key={i} style={{
                    display: 'inline-block',
                    opacity: lt,
                    transform: `translateY(${(1 - e) * 80 + bounce}px) scale(${0.3 + e * 0.7})`,
                  }}>{ch}</span>
                );
              })}
            </div>
          );
        }}
      </Sprite>

      {/* Tagline strip */}
      <Sprite start={2.4} end={4.2}>
        {({ localTime }) => {
          const inT = clamp(localTime / 0.4, 0, 1);
          const out = clamp((localTime - 1.4) / 0.4, 0, 1);
          return (
            <div style={{
              position: 'absolute',
              left: 960, top: 800,
              transform: `translate(-50%,-50%) translateY(${(1 - inT) * 20}px)`,
              fontFamily: BRAND.body,
              fontSize: 28,
              color: BRAND.muted,
              letterSpacing: '6px',
              opacity: inT * (1 - out),
              fontWeight: 500,
              textTransform: 'uppercase',
            }}>
              ✦&nbsp;&nbsp;10 OYUN · 10 GAMES&nbsp;&nbsp;✦
            </div>
          );
        }}
      </Sprite>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 2 — Hero words (4–7.5s): "Oyna · Keşfet · Eğlen"
// ──────────────────────────────────────────────────────────────────────────
function HeroWords() {
  const t = useTime();
  if (t < 4 || t > 7.6) return null;
  const lt = t - 4;

  const words = [
    { tr: 'Oyna.', en: 'Play.', start: 0.0 },
    { tr: 'Keşfet.', en: 'Explore.', start: 0.7 },
    { tr: 'Eğlen.', en: 'Have Fun.', start: 1.4 },
  ];
  const exitStart = 3.0;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {words.map((w, i) => {
        const dt = lt - w.start;
        if (dt < 0) return null;
        const inT = Easing.easeOutBack(clamp(dt / 0.45, 0, 1));
        const exitT = clamp((lt - exitStart) / 0.5, 0, 1);
        const opacity = clamp(dt / 0.3, 0, 1) * (1 - exitT);
        const yBase = 360 + i * 160;
        return (
          <React.Fragment key={i}>
            <div style={{
              position: 'absolute',
              left: 960,
              top: yBase,
              transform: `translate(-50%,-50%) scale(${0.5 + inT * 0.5}) translateY(${(1 - inT) * 30 - exitT * 20}px)`,
              fontFamily: BRAND.display,
              fontSize: 130,
              color: i === 1 ? BRAND.accent : BRAND.ink,
              letterSpacing: '2px',
              opacity,
              textShadow: i === 1 ? `0 0 50px ${BRAND.glow}` : 'none',
              whiteSpace: 'nowrap',
            }}>
              {w.tr}
            </div>
            <div style={{
              position: 'absolute',
              left: 960,
              top: yBase + 70,
              transform: `translate(-50%,-50%) translateY(${(1 - inT) * 10 - exitT * 10}px)`,
              fontFamily: BRAND.body,
              fontSize: 28,
              fontStyle: 'italic',
              color: BRAND.muted,
              letterSpacing: '4px',
              opacity: opacity * 0.8,
              whiteSpace: 'nowrap',
            }}>
              {w.en}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 3 — Game montage (7.5–22.5s): one card per 1.5s, 10 cards
// ──────────────────────────────────────────────────────────────────────────
function GameCard({ game, index }) {
  const start = 7.5 + index * 1.5;
  const end = start + 1.6;
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;

  // Card animation: fly in tilted, settle, fly out
  const inT = Easing.easeOutBack(clamp(lt / 0.45, 0, 1));
  const outT = Easing.easeInCubic(clamp((lt - 1.2) / 0.4, 0, 1));
  const opacity = clamp(lt / 0.25, 0, 1) * (1 - outT);

  // Slight bob during hold
  const hold = clamp((lt - 0.45) / (dur - 0.85), 0, 1);
  const bobY = Math.sin(hold * Math.PI * 1.5) * 6;

  // Random tilt per game (deterministic)
  const tilt = ((index * 17) % 7) - 3; // -3..3 degrees
  const tiltX = tilt + (1 - inT) * -8 + outT * 12;

  // Image zoom (subtle ken burns)
  const imgScale = 1 + hold * 0.06;

  return (
    <div style={{
      position: 'absolute',
      left: 960, top: 540,
      transform: `translate(-50%,-50%) translateY(${(1 - inT) * 60 + outT * -40 + bobY}px) scale(${0.7 + inT * 0.3 - outT * 0.15}) rotate(${tiltX}deg)`,
      opacity,
      width: 1200, height: 720,
      willChange: 'transform, opacity',
    }}>
      {/* Color flood backing card (offset for depth) */}
      <div style={{
        position: 'absolute',
        inset: -20,
        background: `linear-gradient(135deg, ${game.color} 0%, ${game.color2} 100%)`,
        borderRadius: 28,
        transform: 'rotate(-2deg)',
        opacity: 0.85,
        boxShadow: `0 30px 80px ${game.color}66`,
      }} />

      {/* Main card */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: BRAND.card,
        borderRadius: 24,
        overflow: 'hidden',
        border: `3px solid ${BRAND.ink}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6)`,
      }}>
        {/* Game screenshot */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}>
          <img src={game.img} style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
            transformOrigin: 'center',
          }} />
          {/* Gradient overlay for text legibility */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
          }} />
        </div>

        {/* Number stamp */}
        <div style={{
          position: 'absolute',
          top: 24, left: 24,
          fontFamily: BRAND.display,
          fontSize: 56,
          color: BRAND.ink,
          background: BRAND.accent,
          padding: '8px 24px',
          borderRadius: 12,
          letterSpacing: '2px',
          transform: `rotate(${-3 - inT * 0}deg) scale(${inT})`,
          boxShadow: `0 8px 20px ${BRAND.glow}`,
          border: `3px solid ${BRAND.ink}`,
        }}>
          0{index + 1 === 10 ? null : ''}{index + 1}
          <span style={{ fontSize: 22, marginLeft: 8, opacity: 0.7 }}>/10</span>
        </div>

        {/* Tag stamp (top right) */}
        <div style={{
          position: 'absolute',
          top: 32, right: 32,
          fontFamily: BRAND.body,
          fontSize: 18,
          fontWeight: 800,
          color: BRAND.ink,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          padding: '8px 16px',
          borderRadius: 999,
          letterSpacing: '2px',
          border: `2px solid ${game.color}`,
          transform: `rotate(${4}deg) scale(${clamp((lt - 0.3) / 0.3, 0, 1)})`,
        }}>
          {game.tag === 'HOT' ? '🔥 HOT' : game.tag === 'NEW' ? '✦ YENİ' : `${game.emoji} ${game.tag}`}
        </div>

        {/* Bottom info block */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          padding: '40px 48px 36px',
        }}>
          {/* Category pill */}
          <div style={{
            display: 'inline-block',
            fontFamily: BRAND.body,
            fontSize: 16,
            fontWeight: 700,
            color: game.color,
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 16px',
            borderRadius: 6,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 14,
            transform: `translateX(${(1 - clamp((lt - 0.2) / 0.3, 0, 1)) * -40}px)`,
            opacity: clamp((lt - 0.2) / 0.3, 0, 1),
          }}>
            {game.cat} · {game.catEn}
          </div>

          {/* Title */}
          <div style={{
            fontFamily: BRAND.display,
            fontSize: 76,
            color: BRAND.ink,
            letterSpacing: '1px',
            lineHeight: 1.0,
            marginBottom: 12,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            transform: `translateX(${(1 - clamp((lt - 0.3) / 0.35, 0, 1)) * -60}px)`,
            opacity: clamp((lt - 0.3) / 0.35, 0, 1),
          }}>
            {game.title}
          </div>

          {/* Subtitle */}
          <div style={{
            fontFamily: BRAND.body,
            fontSize: 26,
            fontWeight: 500,
            color: BRAND.ink,
            opacity: clamp((lt - 0.45) / 0.3, 0, 1) * 0.9,
            transform: `translateX(${(1 - clamp((lt - 0.45) / 0.3, 0, 1)) * -40}px)`,
          }}>
            {game.sub} <span style={{ color: BRAND.muted, fontStyle: 'italic' }}>· {game.subEn}</span>
          </div>
        </div>

        {/* Color flash on entry */}
        <div style={{
          position: 'absolute', inset: 0,
          background: game.color,
          opacity: clamp(0.45 - lt * 1.2, 0, 0.45),
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

function GameMontage() {
  const t = useTime();
  if (t < 7.3 || t > 23) return null;

  const currentIdx = Math.floor((t - 7.5) / 1.5);
  const visibleIdx = clamp(currentIdx, 0, 9);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Progress dots at top */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 60,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 12,
        zIndex: 10,
      }}>
        {GAMES.map((_, i) => (
          <div key={i} style={{
            width: i === visibleIdx ? 40 : 12,
            height: 6,
            borderRadius: 4,
            background: i <= visibleIdx ? BRAND.accent : 'rgba(255,255,255,0.18)',
            transition: 'all 0.3s',
            boxShadow: i === visibleIdx ? `0 0 12px ${BRAND.glow}` : 'none',
          }} />
        ))}
      </div>

      {/* Counter "OYUN N / 10" */}
      <div style={{
        position: 'absolute',
        left: 80, bottom: 80,
        fontFamily: BRAND.display,
        fontSize: 28,
        color: BRAND.muted,
        letterSpacing: '4px',
        zIndex: 10,
      }}>
        <span style={{ color: BRAND.accent, fontSize: 48 }}>{(visibleIdx + 1).toString().padStart(2, '0')}</span>
        <span style={{ opacity: 0.5 }}> / 10 · GAMES</span>
      </div>

      {GAMES.map((g, i) => <GameCard key={g.key} game={g} index={i} />)}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 4 — Grid assemble (22.5–26s)
// ──────────────────────────────────────────────────────────────────────────
function GridAssemble() {
  const t = useTime();
  if (t < 22.5 || t > 26.5) return null;
  const lt = t - 22.5;

  // 5 cols × 2 rows
  const cols = 5, rows = 2;
  const cardW = 320, cardH = 200;
  const gap = 20;
  const totalW = cols * cardW + (cols - 1) * gap;
  const totalH = rows * cardH + (rows - 1) * gap;
  const startX = (1920 - totalW) / 2;
  const startY = (1080 - totalH) / 2 - 60;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {GAMES.map((g, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const targetX = startX + col * (cardW + gap);
        const targetY = startY + row * (cardH + gap);
        // Stagger arrival
        const delay = i * 0.04;
        const dt = lt - delay;
        const inT = Easing.easeOutBack(clamp(dt / 0.7, 0, 1));
        // Start position (random scatter)
        const angle = (i * 0.7);
        const dist = 600;
        const sx = 1920 / 2 + Math.cos(angle) * dist - cardW / 2;
        const sy = 1080 / 2 + Math.sin(angle) * dist - cardH / 2;
        const x = sx + (targetX - sx) * inT;
        const y = sy + (targetY - sy) * inT;
        const rot = (1 - inT) * (((i * 23) % 60) - 30);
        const scale = 0.5 + inT * 0.5;
        const opacity = clamp(dt / 0.3, 0, 1);

        return (
          <div key={g.key} style={{
            position: 'absolute',
            left: x, top: y,
            width: cardW, height: cardH,
            transform: `rotate(${rot}deg) scale(${scale})`,
            opacity,
            borderRadius: 16,
            overflow: 'hidden',
            border: `3px solid ${BRAND.ink}`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.6)`,
          }}>
            <img src={g.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)`,
            }} />
            <div style={{
              position: 'absolute', left: 14, bottom: 12,
              fontFamily: BRAND.display, fontSize: 22, color: BRAND.ink,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px',
            }}>{g.title}</div>
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: BRAND.accent,
              fontFamily: BRAND.display,
              fontSize: 16, color: BRAND.ink,
              padding: '3px 10px', borderRadius: 6,
              letterSpacing: '1px',
              border: `2px solid ${BRAND.ink}`,
            }}>{(i + 1).toString().padStart(2, '0')}</div>
          </div>
        );
      })}

      {/* Stamp lands when grid is done */}
      <Sprite start={23.6} end={26.5}>
        {({ localTime }) => {
          const inT = Easing.easeOutBack(clamp(localTime / 0.5, 0, 1));
          const outT = clamp((localTime - 2.4) / 0.5, 0, 1);
          return (
            <div style={{
              position: 'absolute',
              left: 960, top: 920,
              transform: `translate(-50%,-50%) scale(${0.4 + inT * 0.6}) rotate(${(1 - inT) * 8 - 2}deg)`,
              opacity: 1 - outT,
            }}>
              <div style={{
                background: BRAND.accent,
                color: BRAND.ink,
                fontFamily: BRAND.display,
                fontSize: 44,
                letterSpacing: '4px',
                padding: '14px 40px',
                borderRadius: 14,
                border: `4px solid ${BRAND.ink}`,
                boxShadow: `0 12px 40px ${BRAND.glow}, 0 0 60px ${BRAND.glow}`,
                whiteSpace: 'nowrap',
              }}>
                10 OYUN · ÜCRETSİZ · TARAYICIDA
              </div>
              <div style={{
                marginTop: 12,
                textAlign: 'center',
                fontFamily: BRAND.body,
                fontSize: 22,
                color: BRAND.muted,
                fontStyle: 'italic',
                letterSpacing: '2px',
              }}>
                10 GAMES · FREE · IN YOUR BROWSER
              </div>
            </div>
          );
        }}
      </Sprite>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 5 — CTA (26–30s)
// ──────────────────────────────────────────────────────────────────────────
function CTA() {
  const t = useTime();
  if (t < 26 || t > 30) return null;
  const lt = t - 26;

  const slamT = Easing.easeOutBack(clamp(lt / 0.5, 0, 1));
  const cursorT = clamp((lt - 1.0) / 0.8, 0, 1);
  const clickT = clamp((lt - 1.8) / 0.15, 0, 1);
  const winkT = clamp((lt - 2.2) / 1.0, 0, 1);

  // Cursor moves from right side toward Play button
  const cursorX = 1500 - cursorT * 480;
  const cursorY = 660 + (cursorT * 80);
  const cursorScale = 1 - clickT * 0.15;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Big background glow */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: 1600, height: 1600,
        transform: `translate(-50%,-50%) scale(${0.5 + slamT * 0.6})`,
        background: `radial-gradient(circle, ${BRAND.glow} 0%, transparent 50%)`,
        opacity: slamT * 0.7,
        pointerEvents: 'none',
      }} />

      {/* Logo mark */}
      <div style={{
        position: 'absolute',
        left: 960, top: 280,
        transform: `translate(-50%,-50%) scale(${slamT}) rotate(${(1 - slamT) * 8}deg)`,
        opacity: slamT,
        fontSize: 140,
        filter: `drop-shadow(0 0 40px ${BRAND.glow})`,
      }}>🎮</div>

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        left: 960, top: 460,
        transform: `translate(-50%,-50%) translateY(${(1 - slamT) * 30}px)`,
        opacity: slamT,
        fontFamily: BRAND.display,
        fontSize: 64,
        color: BRAND.ink,
        letterSpacing: '2px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        Hadi <span style={{ color: BRAND.accent, textShadow: `0 0 30px ${BRAND.glow}` }}>oyna!</span>
      </div>

      <div style={{
        position: 'absolute',
        left: 960, top: 540,
        transform: `translate(-50%,-50%)`,
        opacity: slamT * 0.7,
        fontFamily: BRAND.body,
        fontSize: 26,
        color: BRAND.muted,
        letterSpacing: '4px',
        fontStyle: 'italic',
      }}>
        Let's play.
      </div>

      {/* URL pill (acts as the "play button" target) */}
      <div style={{
        position: 'absolute',
        left: 960, top: 720,
        transform: `translate(-50%,-50%) scale(${slamT * (1 - clickT * 0.06)})`,
        opacity: slamT,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accent2})`,
          color: BRAND.ink,
          fontFamily: BRAND.display,
          fontSize: 72,
          letterSpacing: '3px',
          padding: '24px 80px',
          borderRadius: 20,
          border: `5px solid ${BRAND.ink}`,
          boxShadow: `0 20px 60px ${BRAND.glow}, 0 0 100px ${BRAND.glow}`,
          whiteSpace: 'nowrap',
        }}>
          lordofthegames.net
        </div>
      </div>

      {/* Cursor */}
      {cursorT > 0 && (
        <div style={{
          position: 'absolute',
          left: cursorX, top: cursorY,
          transform: `translate(-10%,-10%) scale(${cursorScale})`,
          width: 60, height: 60,
          pointerEvents: 'none',
          filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.6))`,
        }}>
          <svg viewBox="0 0 24 24" width="60" height="60">
            <path d="M3 2l7 18 2.5-7.5L20 10z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Click ripple */}
      {clickT > 0 && clickT < 1 && (
        <div style={{
          position: 'absolute',
          left: cursorX, top: cursorY + 4,
          transform: `translate(-50%,-50%) scale(${clickT * 4})`,
          width: 80, height: 80,
          borderRadius: '50%',
          border: `4px solid ${BRAND.accent}`,
          opacity: 1 - clickT,
          pointerEvents: 'none',
        }} />
      )}

      {/* Wink — cute "made by Cem İlişik" footer */}
      <div style={{
        position: 'absolute',
        left: 960, top: 950,
        transform: `translate(-50%,-50%) translateY(${(1 - winkT) * 20}px)`,
        opacity: winkT,
        fontFamily: BRAND.body,
        fontSize: 22,
        color: BRAND.muted,
        letterSpacing: '2px',
        textAlign: 'center',
      }}>
        ✦ <span style={{ color: BRAND.ink, fontWeight: 600 }}>Cem İlişik</span> tarafından yapıldı · made with ♥
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// MASTER SCENE
// ──────────────────────────────────────────────────────────────────────────
function MasterScene() {
  const t = useTime();
  // Very subtle camera drift on the whole frame
  const drift = Math.sin(t * 0.4) * 6;
  return (
    <div id="video-root" data-screen-label="00s" style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, ${BRAND.bg} 60%, #06060d 100%)`,
      overflow: 'hidden',
    }}>
      <Starfield count={90} />

      {/* Very faint grid pattern for tech feel */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        transform: `translate(${drift}px, ${drift * 0.5}px)`,
        opacity: 0.6,
      }} />

      <ColdOpen />
      <HeroWords />
      <GameMontage />
      <GridAssemble />
      <CTA />

      {/* Confetti bursts at key moments */}
      <Confetti start={3.0} end={4.5} count={26} />
      <Confetti start={23.5} end={25.2} count={30} />
      <Confetti start={26.0} end={28.0} count={20} />

      <Vignette />
      <TimeTag />
    </div>
  );
}

Object.assign(window, { MasterScene });
