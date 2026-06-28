/* ===========================================================
   Lord of the Games — WhatsApp Kanal Yüzen Butonu
   Her sayfada sağ alt köşede görünen davet butonu.
   Kanal: Lordofthegames.net
   NOT: Aşağıdaki WHATSAPP_CHANNEL_URL'i kanalın gerçek davet
        linkiyle (https://whatsapp.com/channel/...) değiştir.
   =========================================================== */
(function () {
  // ⚠️ Kanal davet linkini buraya yapıştır (şimdilik placeholder):
  const WHATSAPP_CHANNEL_URL = "#"; // örn: "https://whatsapp.com/channel/0029XXXXXXXXXXXX"
  const CHANNEL_NAME = "Lordofthegames.net";

  // Aynı butonu iki kere eklemeyelim
  if (document.getElementById("lotg-whatsapp-float")) return;

  // CSS'i tek bir <style> ile inject et
  const style = document.createElement("style");
  style.textContent = `
    #lotg-whatsapp-float {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 99998;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #lotg-whatsapp-float .lotg-wa-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45),
                  0 0 0 0 rgba(37, 211, 102, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: lotgWaPulse 2.2s infinite;
      text-decoration: none;
      padding: 0;
    }
    #lotg-whatsapp-float .lotg-wa-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 10px 30px rgba(37, 211, 102, 0.6);
    }
    #lotg-whatsapp-float .lotg-wa-btn svg {
      width: 32px;
      height: 32px;
      fill: #fff;
    }
    @keyframes lotgWaPulse {
      0%   { box-shadow: 0 6px 20px rgba(37,211,102,0.45), 0 0 0 0   rgba(37,211,102,0.6); }
      70%  { box-shadow: 0 6px 20px rgba(37,211,102,0.45), 0 0 0 18px rgba(37,211,102,0); }
      100% { box-shadow: 0 6px 20px rgba(37,211,102,0.45), 0 0 0 0   rgba(37,211,102,0); }
    }

    /* Popup kartı */
    #lotg-whatsapp-float .lotg-wa-card {
      position: absolute;
      right: 0;
      bottom: 78px;
      width: 290px;
      background: #ffffff;
      border-radius: 14px;
      padding: 16px 16px 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
      transform: translateY(10px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #lotg-whatsapp-float.open .lotg-wa-card {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    #lotg-whatsapp-float .lotg-wa-card::after {
      content: '';
      position: absolute;
      right: 22px;
      bottom: -8px;
      width: 16px;
      height: 16px;
      background: #fff;
      transform: rotate(45deg);
      box-shadow: 3px 3px 6px rgba(0,0,0,0.08);
    }
    #lotg-whatsapp-float .lotg-wa-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    #lotg-whatsapp-float .lotg-wa-logo {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366, #128C7E);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #lotg-whatsapp-float .lotg-wa-logo svg { width: 22px; height: 22px; fill: #fff; }
    #lotg-whatsapp-float .lotg-wa-title {
      font-size: 14px;
      font-weight: 700;
      color: #111b21;
      line-height: 1.25;
    }
    #lotg-whatsapp-float .lotg-wa-sub {
      font-size: 11px;
      color: #667781;
      margin-top: 1px;
    }
    #lotg-whatsapp-float .lotg-wa-body {
      font-size: 13px;
      color: #3b4a54;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    #lotg-whatsapp-float .lotg-wa-body strong { color: #111b21; }
    #lotg-whatsapp-float .lotg-wa-join {
      display: block;
      width: 100%;
      background: #25D366;
      color: #fff;
      text-align: center;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s ease;
      border: none;
      cursor: pointer;
    }
    #lotg-whatsapp-float .lotg-wa-join:hover { background: #128C7E; }
    #lotg-whatsapp-float .lotg-wa-close {
      position: absolute;
      top: 8px; right: 10px;
      width: 22px; height: 22px;
      background: transparent;
      border: none;
      color: #667781;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
    }
    #lotg-whatsapp-float .lotg-wa-close:hover { color: #111b21; }

    /* İlk açılış tooltip (popup'tan farklı, daha küçük) */
    #lotg-whatsapp-float .lotg-wa-bubble {
      position: absolute;
      right: 74px;
      bottom: 14px;
      background: #1f2c33;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 8px;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 0.3s, transform 0.3s;
      pointer-events: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
    }
    #lotg-whatsapp-float .lotg-wa-bubble::after {
      content: '';
      position: absolute;
      right: -6px; top: 50%;
      transform: translateY(-50%);
      border-style: solid;
      border-width: 6px 0 6px 6px;
      border-color: transparent transparent transparent #1f2c33;
    }
    #lotg-whatsapp-float.bubble-show .lotg-wa-bubble {
      opacity: 1;
      transform: translateX(0);
    }

    @media (max-width: 600px) {
      #lotg-whatsapp-float { right: 14px; bottom: 14px; }
      #lotg-whatsapp-float .lotg-wa-btn { width: 54px; height: 54px; }
      #lotg-whatsapp-float .lotg-wa-btn svg { width: 28px; height: 28px; }
      #lotg-whatsapp-float .lotg-wa-card { width: 260px; right: -4px; }
      #lotg-whatsapp-float .lotg-wa-bubble { display: none; }
    }
  `;
  document.head.appendChild(style);

  // WhatsApp logosu SVG'si
  const WA_ICON = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16.001 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.354.622 4.566 1.709 6.483L2.667 29.333l7.024-1.677A13.275 13.275 0 0 0 16 29.333c7.363 0 13.333-5.971 13.333-13.333S23.363 2.667 16 2.667zm0 24c-2.075 0-4.013-.6-5.65-1.633l-.405-.241-4.171.995.997-4.064-.264-.42A10.621 10.621 0 0 1 5.333 16c0-5.882 4.785-10.667 10.667-10.667S26.667 10.118 26.667 16 21.882 26.667 16.001 26.667zm5.847-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.353-.499-2.578-1.591-.953-.85-1.596-1.901-1.783-2.221-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.624-.524-.539-.72-.549l-.613-.011a1.18 1.18 0 0 0-.853.4c-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.467 4.823.764.329 1.359.526 1.823.673.766.243 1.463.209 2.013.127.614-.092 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/></svg>';

  // Container'ı oluştur
  const container = document.createElement("div");
  container.id = "lotg-whatsapp-float";
  container.innerHTML = `
    <div class="lotg-wa-bubble">📢 Kanala katıl!</div>
    <div class="lotg-wa-card" role="dialog" aria-label="WhatsApp kanalına katıl">
      <button class="lotg-wa-close" aria-label="Kapat">×</button>
      <div class="lotg-wa-head">
        <div class="lotg-wa-logo">${WA_ICON}</div>
        <div>
          <div class="lotg-wa-title">${CHANNEL_NAME}</div>
          <div class="lotg-wa-sub">Resmi WhatsApp Kanalı</div>
        </div>
      </div>
      <div class="lotg-wa-body">
        🎮 <strong>Yeni oyunlar, güncellemeler ve özel duyurular</strong> için WhatsApp kanalımıza katıl! Hiçbir yeni sürümü kaçırma.
      </div>
      <a class="lotg-wa-join" href="${WHATSAPP_CHANNEL_URL}" target="_blank" rel="noopener noreferrer">
        ✅ Kanala Katıl
      </a>
    </div>
    <button class="lotg-wa-btn" aria-label="WhatsApp kanalı ${CHANNEL_NAME}">
      ${WA_ICON}
    </button>
  `;
  document.body.appendChild(container);

  // Etkileşimler
  const btn = container.querySelector(".lotg-wa-btn");
  const card = container.querySelector(".lotg-wa-card");
  const closeBtn = container.querySelector(".lotg-wa-close");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    container.classList.toggle("open");
    container.classList.remove("bubble-show");
    try { localStorage.setItem("lotg_wa_seen", "1"); } catch (err) {}
  });

  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("open");
  });

  // Kart dışına tıklayınca kapansın
  document.addEventListener("click", function (e) {
    if (!container.contains(e.target)) {
      container.classList.remove("open");
    }
  });

  // İlk ziyarette küçük bubble göster (3sn sonra, 6sn boyunca)
  try {
    if (!localStorage.getItem("lotg_wa_seen")) {
      setTimeout(function () {
        container.classList.add("bubble-show");
        setTimeout(function () {
          container.classList.remove("bubble-show");
        }, 6000);
      }, 3000);
    }
  } catch (err) {}
})();
