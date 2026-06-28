// hero-loop.jsx — 8-second seamless loop for site hero background
// Uses globals: React, Sprite, useTime, useSprite, Easing, clamp, GAMES, BRAND, Starfield

// Quick rapid-fire montage of all 10 games — each shown ~0.7s
function HeroLoopScene() {
  const t = useTime(); // 0..8
  const root = React.useRef(null);

  // Update screen-label for comments
  React.useEffect(() => {
    const sec = Math.floor(t);
    if (root.current) root.current.setAttribute('data-screen-label', `${sec.toString().padStart(2, '0')}s-loop`);
  }, [Math.floor(t)]);

  return (
    <div ref={root} id="hero-loop-root" data-screen-label="00s-loop" style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, ${BRAND.bg} 60%, #06060d 100%)`,
      overflow: 'hidden',
    }}>
      <Starfield count={70} />

      {/* Subtle drifting grid */}
      {(() => {
        const drift = Math.sin(t * 0.5) * 8;
        return (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `translate(${drift}px, ${drift * 0.5}px)`,
          }} />
        );
      })()}

      {/* Pulsing accent glow */}
      {(() => {
        const pulse = (Math.sin(t * 1.2) * 0.5 + 0.5);
        return (
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 1400, height: 1400,
            transform: `translate(-50%,-50%) scale(${0.8 + pulse * 0.15})`,
            background: `radial-gradient(circle, rgba(255,69,0,0.12) 0%, transparent 55%)`,
            pointerEvents: 'none',
          }} />
        );
      })()}

      {/* Rapid game montage — 10 games × 0.7s = 7s, last 1s fades to start for seamless loop */}
      {GAMES.map((g, i) => {
        const start = i * 0.7;
        const end = start + 0.85; // overlap slightly for crossfade
        if (t < start - 0.1 || t > end + 0.1) return null;
        const lt = t - start;

        const inT = Easing.easeOutCubic(clamp(lt / 0.2, 0, 1));
        const outT = clamp((lt - 0.55) / 0.3, 0, 1);
        const opacity = inT * (1 - outT);

        // Card flies in from random angle, settles, drifts out
        const angle = (i * 0.9);
        const sx = Math.cos(angle) * 200 * (1 - inT);
        const sy = Math.sin(angle) * 80 * (1 - inT);
        const driftX = outT * 120 * Math.cos(angle + 1);
        const driftY = outT * 60;

        const tilt = ((i * 13) % 9) - 4;
        const scale = 0.85 + inT * 0.15 - outT * 0.1;

        return (
          <div key={g.key} style={{
            position: 'absolute',
            left: 960, top: 540,
            width: 1100, height: 620,
            transform: `translate(-50%,-50%) translate(${sx + driftX}px, ${sy + driftY}px) scale(${scale}) rotate(${tilt}deg)`,
            opacity,
            willChange: 'transform, opacity',
          }}>
            {/* Color backing */}
            <div style={{
              position: 'absolute', inset: -16,
              background: `linear-gradient(135deg, ${g.color} 0%, ${g.color2} 100%)`,
              borderRadius: 24,
              transform: 'rotate(-1.5deg)',
              opacity: 0.85,
              boxShadow: `0 24px 70px ${g.color}55`,
            }} />

            {/* Card */}
            <div style={{
              position: 'absolute', inset: 0,
              background: BRAND.card,
              borderRadius: 20,
              overflow: 'hidden',
              border: `3px solid ${BRAND.ink}`,
              boxShadow: `0 16px 50px rgba(0,0,0,0.6)`,
            }}>
              <img src={g.img} style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                transform: `scale(${1 + lt * 0.05})`,
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.85) 100%)',
              }} />

              {/* Number stamp */}
              <div style={{
                position: 'absolute', top: 22, left: 22,
                fontFamily: BRAND.display,
                fontSize: 44, color: BRAND.ink,
                background: BRAND.accent,
                padding: '6px 18px',
                borderRadius: 10,
                letterSpacing: '2px',
                transform: `rotate(-3deg) scale(${inT})`,
                boxShadow: `0 6px 16px ${BRAND.glow}`,
                border: `3px solid ${BRAND.ink}`,
              }}>
                {(i + 1).toString().padStart(2, '0')}
              </div>

              {/* Title */}
              <div style={{
                position: 'absolute', left: 36, right: 36, bottom: 36,
              }}>
                <div style={{
                  fontFamily: BRAND.body,
                  fontSize: 14,
                  fontWeight: 700,
                  color: g.color,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  opacity: clamp((lt - 0.15) / 0.2, 0, 1),
                }}>
                  {g.cat}
                </div>
                <div style={{
                  fontFamily: BRAND.display,
                  fontSize: 56,
                  color: BRAND.ink,
                  letterSpacing: '1px',
                  lineHeight: 1.0,
                  textShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  transform: `translateX(${(1 - clamp((lt - 0.2) / 0.25, 0, 1)) * -40}px)`,
                  opacity: clamp((lt - 0.2) / 0.25, 0, 1),
                }}>
                  {g.title}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Persistent corner brand mark */}
      <div style={{
        position: 'absolute',
        left: 60, top: 60,
        display: 'flex', alignItems: 'center', gap: 12,
        zIndex: 20,
      }}>
        <div style={{
          fontSize: 38,
          filter: `drop-shadow(0 0 12px ${BRAND.glow})`,
        }}>🎮</div>
        <div style={{
          fontFamily: BRAND.display,
          fontSize: 30,
          color: BRAND.ink,
          letterSpacing: '1px',
          textShadow: `0 0 12px rgba(255,255,255,0.2)`,
        }}>Lord of the <span style={{ color: BRAND.accent }}>Games</span></div>
      </div>

      {/* Counter */}
      {(() => {
        const idx = clamp(Math.floor(t / 0.7), 0, 9);
        return (
          <div style={{
            position: 'absolute',
            right: 60, top: 60,
            fontFamily: BRAND.display,
            fontSize: 22,
            color: BRAND.muted,
            letterSpacing: '4px',
            zIndex: 20,
          }}>
            <span style={{ color: BRAND.accent, fontSize: 36 }}>{(idx + 1).toString().padStart(2, '0')}</span>
            <span style={{ opacity: 0.5 }}> / 10</span>
          </div>
        );
      })()}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Crossfade-to-start: last 0.4s fades whole frame slightly so loop is seamless */}
      {(() => {
        const fadeT = clamp((t - 7.6) / 0.4, 0, 1);
        return (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#06060d',
            opacity: fadeT * 0.6,
            pointerEvents: 'none',
          }} />
        );
      })()}
    </div>
  );
}

window.HeroLoopScene = HeroLoopScene;
