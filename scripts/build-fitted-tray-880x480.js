const sharp = require('sharp');
const fs = require('fs');

async function buildTailoredTray() {
  const w = 880;
  const h = 480;

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Outer Green Marble Rim Gradient -->
      <linearGradient id="marbleRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#164634"/>
        <stop offset="25%" stop-color="#0E3324"/>
        <stop offset="50%" stop-color="#1E5C41"/>
        <stop offset="75%" stop-color="#113B2A"/>
        <stop offset="100%" stop-color="#0A2619"/>
      </linearGradient>

      <!-- Inner Deep Emerald Velvet Base Gradient -->
      <linearGradient id="velvetBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#071E14"/>
        <stop offset="40%" stop-color="#0A281B"/>
        <stop offset="70%" stop-color="#0A271A"/>
        <stop offset="100%" stop-color="#05170F"/>
      </linearGradient>

      <!-- Recessed Slot Cavity Gradient -->
      <linearGradient id="slotRecess" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#020B05" stop-opacity="0.95"/>
        <stop offset="12%" stop-color="#04140D" stop-opacity="0.85"/>
        <stop offset="88%" stop-color="#04140D" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#010703" stop-opacity="0.95"/>
      </linearGradient>

      <!-- Turtle Sanctuary Deep Velvet Gradient -->
      <radialGradient id="turtleBed" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#0A2A1E" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="#05180F" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#020804" stop-opacity="1"/>
      </radialGradient>

      <!-- Recess Shadow Filter -->
      <filter id="recessShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.92"/>
      </filter>
    </defs>

    <!-- 1. Outer Box Rim (Solid Green Marble Border) -->
    <rect x="0" y="0" width="${w}" height="${h}" rx="20" fill="url(#marbleRim)" stroke="#2D664C" stroke-width="2.5"/>
    <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="17" fill="#030E07" stroke="#0E3322" stroke-width="1.8"/>

    <!-- 2. Interior Velvet Bed Plate (Edge-to-Edge Luxury Base) -->
    <rect x="12" y="12" width="${w - 24}" height="${h - 24}" rx="14" fill="url(#velvetBase)" stroke="#163E2B" stroke-width="1.8"/>

    <!-- 3. LEFT SECTION: EXACTLY 5 EQUAL HORIZONTAL PRODUCT SLOTS (Edge-to-edge, zero empty extra rows) -->
    <!-- Slot 0: Earth • Prithvi (y: 20 to 100) -->
    <rect x="22" y="20" width="568" height="80" rx="9" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="24" y1="21" x2="588" y2="21" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="24" y1="99" x2="588" y2="99" stroke="#2F664A" stroke-width="1.2" opacity="0.35"/>

    <!-- Slot 1: Water • Jala (y: 110 to 190) -->
    <rect x="22" y="110" width="568" height="80" rx="9" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="24" y1="111" x2="588" y2="111" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="24" y1="189" x2="588" y2="189" stroke="#2F664A" stroke-width="1.2" opacity="0.35"/>

    <!-- Slot 2: Fire • Agni (y: 200 to 280) -->
    <rect x="22" y="200" width="568" height="80" rx="9" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="24" y1="201" x2="588" y2="201" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="24" y1="279" x2="588" y2="279" stroke="#2F664A" stroke-width="1.2" opacity="0.35"/>

    <!-- Slot 3: Air • Vayu (y: 290 to 370) -->
    <rect x="22" y="290" width="568" height="80" rx="9" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="24" y1="291" x2="588" y2="291" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="24" y1="369" x2="588" y2="369" stroke="#2F664A" stroke-width="1.2" opacity="0.35"/>

    <!-- Slot 4: Space • Akasha (y: 380 to 460) -->
    <rect x="22" y="380" width="568" height="80" rx="9" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="24" y1="381" x2="588" y2="381" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="24" y1="459" x2="588" y2="459" stroke="#2F664A" stroke-width="1.2" opacity="0.35"/>

    <!-- Subtle Gold Foil Roman Numerals & Element Names on Left Slot Tabs -->
    <g font-family="serif" font-size="8.5" fill="#C5A45B" opacity="0.35" letter-spacing="2">
      <text x="34" y="65">I • PRITHVI</text>
      <text x="34" y="155">II • JALA</text>
      <text x="34" y="245">III • AGNI</text>
      <text x="34" y="335">IV • VAYU</text>
      <text x="34" y="425">V • AKASHA</text>
    </g>

    <!-- 4. CENTRAL VERTICAL VELVET RIDGE (Separating incense stack from turtle sanctuary) -->
    <rect x="598" y="16" width="12" height="448" rx="6" fill="#0C2B1D" stroke="#1A4732" stroke-width="1.2"/>
    <line x1="604" y1="18" x2="604" y2="462" stroke="#336E4F" stroke-width="1.4" opacity="0.6"/>

    <!-- 5. RIGHT SECTION: PERFECTLY PROPORTIONED TURTLE SANCTUARY -->
    <!-- Full Height Velvet Well -->
    <rect x="618" y="20" width="240" height="440" rx="12" fill="url(#turtleBed)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>

    <!-- Centered Molded Velvet Alcove for Solid Brass Turtle Burner -->
    <rect x="636" y="115" width="204" height="250" rx="26" fill="#020904" stroke="#265B41" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.75"/>

    <!-- Subtle Luxury Gold Inscription inside Turtle Bed -->
    <g text-anchor="middle" font-family="serif" fill="#C5A45B" opacity="0.45">
      <circle cx="738" cy="180" r="3.5" fill="none" stroke="#C5A45B" stroke-width="0.9" opacity="0.55"/>
      <path d="M 732 180 L 744 180 M 738 174 L 738 186" stroke="#C5A45B" stroke-width="0.8" opacity="0.45"/>
      <text x="738" y="300" font-size="8.5" letter-spacing="2">KURMA</text>
      <text x="738" y="316" font-size="7" letter-spacing="1.5" opacity="0.8">SACRED KEEPSAKE</text>
      <text x="738" y="330" font-family="sans-serif" font-size="6.5" letter-spacing="1" opacity="0.6">SOLID BRASS BURNER</text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  const result = await sharp(svgBuffer).png().toBuffer();

  const targets = [
    'public/images/unboxing/kurma-bespoke-fitted-tray-v3.png',
    'public/images/unboxing/kurma-5elements-exact-tray.png',
    'public/images/unboxing/kurma-suite-tray-5elements.png',
    'public/images/unboxing/kurma-fitted-suite-tray-v4.png',
    'public/images/unboxing/empty-tray.png',
  ];

  for (const t of targets) {
    fs.writeFileSync(t, result);
  }

  console.log('Successfully generated tailored 880x480 tray images to all paths!');
}

buildTailoredTray().catch(err => {
  console.error(err);
  process.exit(1);
});
