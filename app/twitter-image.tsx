import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MRCP PACES Exam Prep - Pass Your Pre-Reg Exam First Time'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}
          >
            <span style={{ fontSize: '42px', color: 'white', fontWeight: 'bold' }}>G</span>
          </div>
          <span
            style={{
              fontSize: '38px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            MRCP PACES Exam Prep
          </span>
        </div>

        {/* Main Headline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '25px',
          }}
        >
          Pass Your Pre-Reg Exam First Time
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '50px',
            marginTop: '15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#4ade80' }}>94%</span>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>Pass Rate</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#4ade80' }}>2000+</span>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>Questions</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#4ade80' }}>8,500+</span>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>Students</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '35px',
            fontSize: '22px',
            color: '#64748b',
          }}
        >
          www.mrcppacesprep.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
