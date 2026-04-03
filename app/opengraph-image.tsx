import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'OneWayTaxi.ai — #1 One Way Drop Taxi Service in South India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F3D3E 0%, #134E4A 50%, #0F3D3E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top badge */}
        <div
          style={{
            background: '#F59E0B',
            color: '#0F3D3E',
            padding: '8px 24px',
            borderRadius: '20px',
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          #1 RATED IN SOUTH INDIA
        </div>

        {/* Main title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '64px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          OneWayTaxi.ai
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#99F6E4',
            fontSize: '32px',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          One Way Drop Taxi — Pay Only One Side
        </div>

        {/* Features row */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            color: '#ffffff',
            fontSize: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>*</span> Starting Rs.13/km
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>*</span> 120+ Cities
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>*</span> 24/7 Service
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>*</span> Save 40%
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            color: '#6EE7B7',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          onewaytaxi.ai
        </div>
      </div>
    ),
    { ...size }
  );
}
