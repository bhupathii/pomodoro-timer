const fs = require("fs");
const { createCanvas } = require("canvas");
const path = require("path");

// Skip execution on Vercel
if (process.env.VERCEL === "1") {
  console.log("Skipping favicon generation on Vercel");
  process.exit(0);
}

// Try to install canvas if not available
try {
  require.resolve("canvas");
} catch (e) {
  console.log(
    "Canvas package not found. Please install it with: npm install canvas"
  );
  process.exit(1);
}

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext("2d");

// Draw a red circle (representing the pomodoro timer)
ctx.fillStyle = "#e44041";
ctx.beginPath();
ctx.arc(16, 16, 14, 0, Math.PI * 2);
ctx.fill();

// Draw a small white clock face
ctx.fillStyle = "white";
ctx.beginPath();
ctx.moveTo(16, 16);
ctx.lineTo(16, 8);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(16, 16);
ctx.lineTo(22, 16);
ctx.stroke();

// Convert to PNG buffer
const pngBuffer = canvas.toBuffer("image/png");

// Save to public directory
const outputPath = path.join(__dirname, "public", "favicon.ico");
fs.writeFileSync(outputPath, pngBuffer);

console.log(`Favicon created at ${outputPath}`);
