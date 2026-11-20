const sharp = require('sharp');
const fs = require('fs');

async function buildTrayV3() {
  const w = 880;
  const h = 600;

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Base Outer Marble Frame Border Gradient -->
      <linearGradient id="marbleRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#164634"/>
        <stop offset="25%" stop-color="#0E3324"/>
        <stop offset="75%" stop-color="#184E39"/>
        <stop offset="100%" stop-color="#0A2619"/>
      </linearGradient>

      <!-- Inner Deep Emerald Velvet Base Gradient -->
      <linearGradient id="velvetBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#071E14"/>
        <stop offset="50%" stop-color="#0A281B"/>
        <stop offset="100%" stop-color="#05170F"/>
      </linearGradient>

      <!-- Recessed Slot Gradient -->
      <linearGradient id="slotRecess" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#020B05" stop-opacity="0.95"/>
        <stop offset="15%" stop-color="#04140D" stop-opacity="0.85"/>
        <stop offset="85%" stop-color="#04140D" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#010703" stop-opacity="0.95"/>
      </linearGradient>

      <!-- Turtle Alcove Deep Molded Bed Gradient -->
      <radialGradient id="turtleBed" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#0A2A1E" stop-opacity="0.9"/>
        <stop offset="65%" stop-color="#05180F" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#020804" stop-opacity="1"/>
      </radialGradient>

      <!-- Recess Shadow Filter -->
      <filter id="recessShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
    </defs>

    <!-- 1. Outer Box Rim (Authentic Green Marble Bevel) -->
    <rect x="0" y="0" width="${w}" height="${h}" rx="22" fill="url(#marbleRim)" stroke="#2D664C" stroke-width="2.5"/>
    <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="18" fill="#030E07" stroke="#0E3322" stroke-width="1.8"/>

    <!-- 2. Interior Velvet Bed Plate -->
    <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="14" fill="url(#velvetBase)" stroke="#163E2B" stroke-width="1.8"/>

    <!-- 3. LEFT SECTION: EXACTLY 5 HORIZONTAL INCENSE COMPARTMENTS (Zero extra slots, filling full height) -->
    <!-- Slot 0: Earth (y: 24 to 124) -->
    <rect x="24" y="24" width="580" height="100" rx="10" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="26" y1="25" x2="602" y2="25" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="26" y1="123" x2="602" y2="123" stroke="#2F664A" stroke-width="1.2" opacity="0.4"/>

    <!-- Slot 1: Water (y: 136 to 236) -->
    <rect x="24" y="136" width="580" height="100" rx="10" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="26" y1="137" x2="602" y2="137" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="26" y1="235" x2="602" y2="235" stroke="#2F664A" stroke-width="1.2" opacity="0.4"/>

    <!-- Slot 2: Fire (y: 248 to 348) -->
    <rect x="24" y="248" width="580" height="100" rx="10" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="26" y1="249" x2="602" y2="249" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="26" y1="347" x2="602" y2="347" stroke="#2F664A" stroke-width="1.2" opacity="0.4"/>

    <!-- Slot 3: Air (y: 360 to 460) -->
    <rect x="24" y="360" width="580" height="100" rx="10" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="26" y1="361" x2="602" y2="361" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="26" y1="459" x2="602" y2="459" stroke="#2F664A" stroke-width="1.2" opacity="0.4"/>

    <!-- Slot 4: Space (y: 472 to 572) -->
    <rect x="24" y="472" width="580" height="100" rx="10" fill="url(#slotRecess)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>
    <line x1="26" y1="473" x2="602" y2="473" stroke="#000000" stroke-width="1.8" opacity="0.95"/>
    <line x1="26" y1="571" x2="602" y2="571" stroke="#2F664A" stroke-width="1.2" opacity="0.4"/>

    <!-- Subtle Gold Foil Roman Numerals & Element Names on Left Slot Tabs -->
    <g font-family="serif" font-size="9" fill="#C5A45B" opacity="0.35" letter-spacing="2">
      <text x="38" y="78">I • PRITHVI</text>
      <text x="38" y="190">II • JALA</text>
      <text x="38" y="302">III • AGNI</text>
      <text x="38" y="414">IV • VAYU</text>
      <text x="38" y="526">V • AKASHA</text>
    </g>

    <!-- 4. CENTRAL VERTICAL VELVET RIDGE -->
    <rect x="610" y="20" width="12" height="556" rx="6" fill="#0C2B1D" stroke="#1A4732" stroke-width="1.2"/>
    <line x1="616" y1="22" x2="616" y2="574" stroke="#336E4F" stroke-width="1.4" opacity="0.6"/>

    <!-- 5. RIGHT SECTION: PROPORTIONAL LUXURY TURTLE SANCTUARY -->
    <!-- Full Height Velvet Well -->
    <rect x="628" y="24" width="228" height="548" rx="12" fill="url(#turtleBed)" stroke="#1B4732" stroke-width="1.4" filter="url(#recessShadow)"/>

    <!-- Molded Velvet Alcove for Solid Brass Turtle Burner (centered vertically) -->
    <rect x="640" y="160" width="204" height="276" rx="28" fill="#020904" stroke="#265B41" stroke-width="1.6" stroke-dasharray="6 3.5" opacity="0.8"/>

    <!-- Subtle Luxury Gold Inscription inside Turtle Bed -->
    <g text-anchor="middle" font-family="serif" fill="#C5A45B" opacity="0.5">
      <circle cx="742" cy="225" r="4" fill="none" stroke="#C5A45B" stroke-width="1" opacity="0.55"/>
      <path d="M 736 225 L 748 225 M 742 219 L 742 231" stroke="#C5A45B" stroke-width="0.9" opacity="0.45"/>
      <text x="742" y="375" font-size="9" letter-spacing="2">KURMA</text>
      <text x="742" y="392" font-size="7.5" letter-spacing="1.5" opacity="0.85">SACRED KEEPSAKE</text>
      <text x="742" y="408" font-family="sans-serif" font-size="7" letter-spacing="1" opacity="0.65">SOLID BRASS BURNER</text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  const result = await sharp(svgBuffer).png().toBuffer();

  // Save to all target paths
  fs.writeFileSync('public/images/unboxing/kurma-bespoke-fitted-tray-v3.png', result);
  fs.writeFileSync('public/images/unboxing/kurma-5elements-exact-tray.png', result);
  fs.writeFileSync('public/images/unboxing/kurma-suite-tray-5elements.png', result);
  fs.writeFileSync('public/images/unboxing/empty-tray.png', result);

  console.log('Successfully written new bespoke fitted 880x600 tray images to all paths!');
}

buildTrayV3().catch(err => {
  console.error(err);
  process.exit(1);
});
