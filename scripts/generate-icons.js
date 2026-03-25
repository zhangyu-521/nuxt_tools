import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '..', 'public')

// 生成不同尺寸的图标
async function generateIcons() {
  const sizes = [192, 512]

  for (const size of sizes) {
    // 创建圆角矩形背景
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size / 4}" fill="url(#grad)"/>
        <line x1="${size / 4}" y1="${size / 3}" x2="${size * 3 / 4}" y2="${size / 3}" stroke="white" stroke-width="${Math.max(2, size / 32)}" stroke-linecap="round" opacity="0.9"/>
        <line x1="${size / 4}" y1="${size / 2}" x2="${size * 3 / 4}" y2="${size / 2}" stroke="white" stroke-width="${Math.max(2, size / 32)}" stroke-linecap="round" opacity="0.9"/>
        <line x1="${size / 4}" y1="${size * 2 / 3}" x2="${size / 2}" y2="${size * 2 / 3}" stroke="white" stroke-width="${Math.max(2, size / 32)}" stroke-linecap="round" opacity="0.9"/>
      </svg>
    `

    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(publicDir, `icon-${size}x${size}.png`))

    console.log(`Generated icon-${size}x${size}.png`)
  }

  // 生成 apple-touch-icon.png (180x180)
  const appleSize = 180
  const appleSvg = `
    <svg width="${appleSize}" height="${appleSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${appleSize}" height="${appleSize}" rx="${appleSize / 4}" fill="url(#grad)"/>
      <line x1="${appleSize / 4}" y1="${appleSize / 3}" x2="${appleSize * 3 / 4}" y2="${appleSize / 3}" stroke="white" stroke-width="${Math.max(2, appleSize / 32)}" stroke-linecap="round" opacity="0.9"/>
      <line x1="${appleSize / 4}" y1="${appleSize / 2}" x2="${appleSize * 3 / 4}" y2="${appleSize / 2}" stroke="white" stroke-width="${Math.max(2, appleSize / 32)}" stroke-linecap="round" opacity="0.9"/>
      <line x1="${appleSize / 4}" y1="${appleSize * 2 / 3}" x2="${appleSize / 2}" y2="${appleSize * 2 / 3}" stroke="white" stroke-width="${Math.max(2, appleSize / 32)}" stroke-linecap="round" opacity="0.9"/>
    </svg>
  `

  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  console.log('Generated apple-touch-icon.png')
}

generateIcons().catch(console.error)
