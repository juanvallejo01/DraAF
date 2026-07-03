import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            fontFamily: 'serif',
          }}
        >
          AF
        </span>
      </div>
    ),
    { ...size },
  );
}
