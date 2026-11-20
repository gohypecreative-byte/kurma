const sharp = require('sharp');
const fs = require('fs');

async function buildTray() {
  const w = 682;
  const h = 570;

  // We craft a bespoke luxury emerald velvet interior
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Base Inner Velvet Gradient -->
      <linearGradient id="velvetBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#092218"/>
        <stop offset="50%" stop-color="#0B261B"/>
        <stop offset="100%" stop-color="#061810"/>
      </linearGradient>

      <!-- Recessed Slot Gradient -->
      <linearGradient id="slotRecess" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#04120B" stop-opacity="0.95"/>
        <stop offset="25%" stop-color="#061810" stop-opacity="0.85"/>
        <stop offset="75%" stop-color="#061810" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#030E08" stop-opacity="0.95"/>
      </linearGradient>

      <!-- Turtle Compartment Deep Bed Gradient -->
      <radialGradient id="turtleBed" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#0C2B1F" stop-opacity="0.8"/>
        <stop offset="65%" stop-color="#061A11" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#030C08" stop-opacity="1"/>
      </radialGradient>

      <!-- Divider Bevel Filter -->
      <filter id="recessShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.75"/>
      </filter>

      <filter id="embossHighlight" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-color="#2D5C43" flood-opacity="0.6"/>
      </filter>
    </defs>

    <!-- 1. Background Velvet Plate covering the inner cavity -->
    <rect x="14" y="14" width="654" height="516" rx="14" fill="url(#velvetBase)" stroke="#133525" stroke-width="2"/>

    <!-- 2. LEFT SECTION: EXACTLY 5 EQUAL HORIZONTAL PRODUCT SLOTS -->
    <!-- Slot 0: Prithvi • Earth (y: 22 to 114) -->
    <rect x="22" y="22" width="442" height="92" rx="8" fill="url(#slotRecess)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>
    <line x1="24" y1="23" x2="462" y2="23" stroke="#020805" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="113" x2="462" y2="113" stroke="#2D5C43" stroke-width="1" opacity="0.3"/>

    <!-- Slot 1: Jala • Water (y: 124 to 216) -->
    <rect x="22" y="124" width="442" height="92" rx="8" fill="url(#slotRecess)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>
    <line x1="24" y1="125" x2="462" y2="125" stroke="#020805" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="215" x2="462" y2="215" stroke="#2D5C43" stroke-width="1" opacity="0.3"/>

    <!-- Slot 2: Agni • Fire (y: 226 to 318) -->
    <rect x="22" y="226" width="442" height="92" rx="8" fill="url(#slotRecess)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>
    <line x1="24" y1="227" x2="462" y2="227" stroke="#020805" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="317" x2="462" y2="317" stroke="#2D5C43" stroke-width="1" opacity="0.3"/>

    <!-- Slot 3: Vayu • Air (y: 328 to 420) -->
    <rect x="22" y="328" width="442" height="92" rx="8" fill="url(#slotRecess)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>
    <line x1="24" y1="329" x2="462" y2="329" stroke="#020805" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="419" x2="462" y2="419" stroke="#2D5C43" stroke-width="1" opacity="0.3"/>

    <!-- Slot 4: Akasha • Space (y: 430 to 522) -->
    <rect x="22" y="430" width="442" height="92" rx="8" fill="url(#slotRecess)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>
    <line x1="24" y1="431" x2="462" y2="431" stroke="#020805" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="521" x2="462" y2="521" stroke="#2D5C43" stroke-width="1" opacity="0.3"/>

    <!-- Subtle Gold Foil Roman Numerals & Element Names on Left Slot Tabs -->
    <g font-family="serif" font-size="8.5" fill="#C5A45B" opacity="0.32" letter-spacing="2">
      <text x="34" y="72">I • PRITHVI</text>
      <text x="34" y="174">II • JALA</text>
      <text x="34" y="276">III • AGNI</text>
      <text x="34" y="378">IV • VAYU</text>
      <text x="34" y="480">V • AKASHA</text>
    </g>

    <!-- 3. CENTRAL VERTICAL VELVET RIDGE (Separates incense from turtle) -->
    <rect x="470" y="20" width="10" height="504" rx="5" fill="#0E2D1F" stroke="#1C4834" stroke-width="1"/>
    <line x1="475" y1="22" x2="475" y2="522" stroke="#2F664A" stroke-width="1.2" opacity="0.5"/>

    <!-- 4. RIGHT SECTION: SINGLE DEDICATED TURTLE SANCTUARY (NO EXTRA EMPTY BOXES!) -->
    <!-- Full Height Velvet Well -->
    <rect x="486" y="22" width="176" height="500" rx="10" fill="url(#turtleBed)" stroke="#1A422F" stroke-width="1.2" filter="url(#recessShadow)"/>

    <!-- Sculpted Bed for Solid Brass Turtle Burner (centered vertically) -->
    <rect x="496" y="145" width="156" height="254" rx="28" fill="#04110A" stroke="#204A35" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.65"/>

    <!-- Subtle Luxury Gold Inscription inside Turtle Bed -->
    <g text-anchor="middle" font-family="serif" fill="#C5A45B" opacity="0.45">
      <circle cx="574" cy="210" r="4" fill="none" stroke="#C5A45B" stroke-width="0.8" opacity="0.5"/>
      <path d="M 568 210 L 580 210 M 574 204 L 574 216" stroke="#C5A45B" stroke-width="0.8" opacity="0.4"/>
      <text x="574" y="348" font-size="8" letter-spacing="2">KURMA</text>
      <text x="574" y="362" font-size="7" letter-spacing="1.5" opacity="0.8">SACRED KEEPSAKE</text>
      <text x="574" y="376" font-family="sans-serif" font-size="6.5" letter-spacing="1" opacity="0.6">SOLID BRASS BURNER</text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  
  // Composite with the original base box frame to keep authentic outer bevel & shadow
  const result = await sharp('public/images/unboxing/empty-tray.backup.png')
    .composite([{ input: svgBuffer, blend: 'over' }])
    .png()
    .toBuffer();

  fs.writeFileSync('public/images/unboxing/kurma-suite-tray-5elements.png', result);
  fs.writeFileSync('public/images/unboxing/empty-tray.png', result);
  console.log('Successfully written new 5-slot + 1-turtle tray images!');
}

buildTray().catch(err => {
  console.error(err);
  process.exit(1);
});
