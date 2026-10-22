import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getAllCVData } from '@/lib/cv-data'
import { PREVIEW_IMAGE, SITE_URL, shortRole } from '@/lib/seo'
import { MARK_BACKGROUND, siteMarkSvg } from '@/lib/siteMark'

// The link preview of every page (Open Graph and Twitter): the mark, his name, his role from the
// summary and the domain, in the site's pixel face.

export const size = { width: PREVIEW_IMAGE.width, height: PREVIEW_IMAGE.height }
export const contentType = 'image/png'

const FONT_FILE = join(process.cwd(), 'src', 'assets', 'fonts', 'Silkscreen-Regular.ttf')
const markSource = `data:image/svg+xml;base64,${Buffer.from(siteMarkSvg()).toString('base64')}`

export default async function OpenGraphImage() {
  const [cv, font] = await Promise.all([getAllCVData('en'), readFile(FONT_FILE)])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          padding: 80,
          background: MARK_BACKGROUND,
          color: '#f2efe6',
          fontFamily: 'Silkscreen',
        }}
      >
        <img src={markSource} width={320} height={320} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>{cv.fullName}</div>
          <div style={{ fontSize: 34, lineHeight: 1.3, color: '#b9b4a8' }}>{shortRole(cv.professionalSummary.headline)}</div>
          <div style={{ fontSize: 28, color: '#e8a462' }}>{new URL(SITE_URL).host}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Silkscreen', data: font, style: 'normal', weight: 400 }] },
  )
}
