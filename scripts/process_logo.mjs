import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  
  const rowSize = width * 4;
  const scanlines = Buffer.alloc(height * (rowSize + 1));
  for (let y = 0; y < height; y++) {
    const srcRow = y * rowSize;
    const dstRow = y * (rowSize + 1);
    scanlines[dstRow] = 0;
    rgbaBuffer.copy(scanlines, dstRow + 1, srcRow, srcRow + rowSize);
  }
  
  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  const idatChunks = [];
  let width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4;
  const raw = Buffer.alloc(width * height * 4);
  const rowSize = width * bpp;
  let srcPos = 0;
  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcPos++];
    const rowStart = y * rowSize;
    const prevRowStart = (y - 1) * rowSize;
    for (let x = 0; x < rowSize; x++) {
      const byte = decompressed[srcPos++];
      const left = x >= bpp ? raw[rowStart + x - bpp] : 0;
      const above = y > 0 ? raw[prevRowStart + x] : 0;
      const aboveLeft = (y > 0 && x >= bpp) ? raw[prevRowStart + x - bpp] : 0;
      let val = 0;
      if (filterType === 0) val = byte;
      else if (filterType === 1) val = (byte + left) & 0xff;
      else if (filterType === 2) val = (byte + above) & 0xff;
      else if (filterType === 3) val = (byte + Math.floor((left + above) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = left + above - aboveLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - above);
        const pc = Math.abs(p - aboveLeft);
        let pr = aboveLeft;
        if (pa <= pb && pa <= pc) pr = left;
        else if (pb <= pc) pr = above;
        val = (byte + pr) & 0xff;
      }
      raw[rowStart + x] = val;
    }
  }
  return { width, height, raw };
}

// Use Vitasta copy.png which contains the full logo and tagline
const decoded = decodePng('data/Vitasta copy.png');
const cropX = 410;
const cropY = 190;
const cropW = 1110;
const cropH = 490;

console.log('Cropping Vitasta copy.png to:', { cropX, cropY, cropW, cropH });

// 1. White logo (for dark backgrounds)
const whiteBuf = Buffer.alloc(cropW * cropH * 4);
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * decoded.width + (cropX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    decoded.raw.copy(whiteBuf, dstIdx, srcIdx, srcIdx + 4);
  }
}

// 2. Navy logo (for light backgrounds)
const navyBuf = Buffer.alloc(cropW * cropH * 4);
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * decoded.width + (cropX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    const r = decoded.raw[srcIdx];
    const g = decoded.raw[srcIdx+1];
    const b = decoded.raw[srcIdx+2];
    const a = decoded.raw[srcIdx+3];
    
    const isRed = (r > 130 && g < 110 && b < 110) || (r > 180 && g > 60 && g < 120 && b < 70);
    if (isRed) {
      navyBuf[dstIdx] = r;
      navyBuf[dstIdx+1] = g;
      navyBuf[dstIdx+2] = b;
      navyBuf[dstIdx+3] = a;
    } else if (a > 0) {
      const intensity = (r + g + b) / (3 * 255);
      navyBuf[dstIdx] = Math.round(11 * intensity);
      navyBuf[dstIdx+1] = Math.round(59 * intensity);
      navyBuf[dstIdx+2] = Math.round(96 * intensity);
      navyBuf[dstIdx+3] = a;
    }
  }
}

if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
}

fs.writeFileSync('public/images/vitasta-logo-white.png', encodePng(cropW, cropH, whiteBuf));
fs.writeFileSync('public/images/vitasta-logo-navy.png', encodePng(cropW, cropH, navyBuf));
fs.writeFileSync('public/images/vitasta-logo.png', encodePng(cropW, cropH, whiteBuf));
fs.copyFileSync('data/Vitasta copy.png', 'public/images/vitasta-copy.png');
console.log('Successfully generated logo assets from Vitasta copy.png in public/images/');
