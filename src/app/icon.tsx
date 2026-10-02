import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#0a0a0d',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
