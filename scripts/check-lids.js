const sharp = require('sharp');

async function checkLidImages() {
  const files = [
    'public/images/unboxing/suite-5-elements-lid-top.png',
    'public/images/unboxing/suite-5-elements-lid-inner.png',
    'public/images/unboxing/suite-5-elements-clasp-lip.png',
  ];
  for (const f of files) {
    const meta = await sharp(f).metadata();
    console.log(`${f}: ${meta.width}x${meta.height}`);
  }
}
checkLidImages();
