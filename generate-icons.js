// Script to generate PWA icons
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Icon sizes to generate
const sizes = [96, 192, 512];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

sizes.forEach(size => {
  // Create canvas
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#1976d2';
  ctx.fillRect(0, 0, size, size);
  
  // Add rounded corners
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = '#000000';
  const radius = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw bank/money icon
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.03;
  
  // Draw a simple bank/card icon
  const margin = size * 0.2;
  const cardWidth = size * 0.6;
  const cardHeight = size * 0.4;
  const cardX = margin;
  const cardY = size * 0.3;
  
  // Card outline
  ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
  
  // Card chip
  const chipSize = size * 0.08;
  ctx.fillRect(cardX + size * 0.1, cardY + size * 0.08, chipSize, chipSize);
  
  // Card lines
  ctx.beginPath();
  ctx.moveTo(cardX + size * 0.1, cardY + cardHeight - size * 0.12);
  ctx.lineTo(cardX + cardWidth - size * 0.1, cardY + cardHeight - size * 0.12);
  ctx.stroke();
  
  // Yuan symbol
  ctx.font = `bold ${size * 0.2}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('¥', size * 0.5, size * 0.15);
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), buffer);
  console.log(`Generated icon-${size}.png`);
});

console.log('All icons generated successfully!');