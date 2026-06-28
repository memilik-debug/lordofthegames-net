// scenes.jsx — Lord of the Games promo video scenes
// Loaded after animations.jsx; uses globals: React, Stage, Sprite, useTime, useSprite,
// TextSprite, ImageSprite, RectSprite, Easing, interpolate, animate, clamp.

// ── Game data ───────────────────────────────────────────────────────────────
const GAMES = [
  {
    key: 'alan_kazanma',
    title: 'TÜRK.IO',
    sub: 'Haritayı Fethettir',
    subEn: 'Conquer the Map',
    cat: 'Strateji',
    catEn: 'Strategy',
    img: 'images/alan_kazanma.png',
    color: '#e63946',
    color2: '#457b9d',
    emoji: '🗺️',
    tag: 'HOT',
  },
  {
    key: 'angry_birds',
    title: 'BirdBlast',
    sub: 'Piksel Edisyon',
    subEn: 'Pixel Edition',
    cat: 'Aksiyon',
    catEn: 'Action',
    img: 'images/angry_birds.png',
    color: '#f4a261',
    color2: '#e76f51',
    emoji: '🐦',
    tag: 'PIXEL',
  },
  {
    key: 'araba_yaris',
    title: 'TURBO RUSH',
    sub: 'F1 Kariyer Modu',
    subEn: 'F1 Career Mode',
    cat: 'Yarış',
    catEn: 'Racing',
    img: 'images/araba_yaris.png',
    color: '#f77f00',
    color2: '#d62828',
    emoji: '🏎️',
    tag: 'HOT',
  },
  {
    key: 'evrim',
    title: 'Evrim Sim v3',
    sub: 'Doğal Seçilim',
    subEn: 'Natural Selection',
    cat: 'Simülasyon',
    catEn: 'Simulation',
    img: 'images/evrim_similasyonu.png',
    color: '#40916c',
    color2: '#1b4332',
    emoji: '🧬',
    tag: 'NEW',
  },
  {
    key: 'koy_savunma',
    title: 'Kale Savunma',
    sub: 'Efsanevi Sürüm',
    subEn: 'Legendary Edition',
    cat: 'Tower Defense',
    catEn: 'Tower Defense',
    img: 'images/koy_savunma.png',
    color: '#7209b7',
    color2: '#f72585',
    emoji: '🏰',
    tag: 'TD',
  },
  {
    key: 'matematik',
    title: 'Matematik Tarihi',
    sub: 'Zaman Çizelgesi',
    subEn: 'Timeline of Math',
    cat: 'Eğitim',
    catEn: 'Education',
    img: 'images/matematik_oyunu.png',
    color: '#00b4d8',
    color2: '#0077b6',
    emoji: '📐',
    tag: 'EDU',
  },
  {
    key: 'minecraft',
    title: 'Minecraft 2D Pro',
    sub: 'Kaz · İnşa Et · Yaşa',
    subEn: 'Mine · Build · Survive',
    cat: 'Sandbox',
    catEn: 'Sandbox',
    img: 'images/minecraft.png',
    color: '#52b788',
    color2: '#2d6a4f',
    emoji: '⛏️',
    tag: 'PIXEL',
  },
  {
    key: 'savas_hoi',
    title: 'Strateji İmp.',
    sub: '1936 Dünyası',
    subEn: 'World of 1936',
    cat: 'Strateji',
    catEn: 'Strategy',
    img: 'images/savas_hoi.png',
    color: '#9d0208',
    color2: '#370617',
    emoji: '🌍',
    tag: 'HOT',
  },
  {
    key: 'futbol',
    title: 'Futbol Manager',
    sub: 'Şampiyonluğa Yürü',
    subEn: 'March to Glory',
    cat: 'Spor',
    catEn: 'Sports',
    img: 'images/futbol.png',
    color: '#10b981',
    color2: '#065f46',
    emoji: '⚽',
    tag: 'NEW',
  },
  {
    key: 'war_countries',
    title: 'War of Countries',
    sub: 'Dünyaya Hükmet',
    subEn: 'Rule the World',
    cat: 'Strateji',
    catEn: 'Strategy',
    img: 'images/war_of_countries.png',
    color: '#7c3aed',
    color2: '#dc2626',
    emoji: '⚔️',
    tag: 'NEW',
  },
];

// ── Brand tokens ────────────────────────────────────────────────────────────
const BRAND = {
  bg: '#0d0d1a',
  bg2: '#13131f',
  card: '#1a1a2e',
  border: '#2a2a44',
  ink: '#f0f0f8',
  muted: '#8888aa',
  accent: '#ff4500',
  accent2: '#ff7a00',
  glow: 'rgba(255, 69, 0, 0.45)',
  display: "'Fredoka One', cursive",
  body: "'Inter', system-ui, sans-serif",
};

// ── Time-tag broadcaster ────────────────────────────────────────────────────
// Updates the Stage root's data-screen-label every second so comments resolve cleanly.
function TimeTag() {
  const t = useTime();
  React.useEffect(() => {
    const sec = Math.floor(t);
    const root = document.getElementById('video-root');
    if (root) root.setAttribute('data-screen-label', `${sec.toString().padStart(2, '0')}s`);
  }, [Math.floor(t)]);
  return null;
}

// ── Starfield (always on, layered behind everything) ────────────────────────
function Starfield({ count = 80 }) {
  const t = useTime();
  // Generate stable star positions once
  const stars = React.useMemo(() => {
    const arr = [];
    let seed = 1;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rand() * 1920,
        y: rand() * 1080,
        size: rand() * 2.5 + 0.8,
        phase: rand() * 6,
        speed: rand() * 0.6 + 0.4,
        maxOp: rand() * 0.6 + 0.2,
      });
    }
    return arr;
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s, i) => {
        const op = (Math.sin((t + s.phase) * s.speed) * 0.5 + 0.5) * s.maxOp;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: s.x, top: s.y,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: op,
            boxShadow: s.size > 2 ? `0 0 ${s.size * 3}px rgba(255,255,255,0.6)` : 'none',
          }} />
        );
      })}
    </div>
  );
}

// ── Vignette / bg gradient overlay ──────────────────────────────────────────
function Vignette() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }} />
  );
}

// ── Floating confetti shapes (pure decoration) ──────────────────────────────
function Confetti({ start, end, count = 18, palette = ['#ff4500', '#ff7a00', '#ffd166', '#fff'] }) {
  const t = useTime();
  const items = React.useMemo(() => {
    const arr = [];
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        x0: rand() * 1920,
        y0: 1200 + rand() * 400,
        vx: (rand() - 0.5) * 200,
        vy: -(rand() * 600 + 700),
        size: rand() * 14 + 8,
        rot0: rand() * 360,
        rotSpeed: (rand() - 0.5) * 600,
        color: palette[Math.floor(rand() * palette.length)],
        shape: rand() > 0.5 ? 'sq' : 'rect',
        delay: rand() * 0.3,
      });
    }
    return arr;
  }, [count]);

  if (t < start || t > end + 1) return null;
  const local = t - start;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {items.map((p, i) => {
        const pt = Math.max(0, local - p.delay);
        const x = p.x0 + p.vx * pt;
        const y = p.y0 + p.vy * pt + 0.5 * 600 * pt * pt;
        const rot = p.rot0 + p.rotSpeed * pt;
        if (y < -50 || y > 1200) return null;
        const op = clamp(1 - pt / (end - start), 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x, top: y,
            width: p.shape === 'sq' ? p.size : p.size * 0.4,
            height: p.size,
            background: p.color,
            transform: `rotate(${rot}deg)`,
            opacity: op,
            borderRadius: 2,
          }} />
        );
      })}
    </div>
  );
}

Object.assign(window, { GAMES, BRAND, TimeTag, Starfield, Vignette, Confetti });
