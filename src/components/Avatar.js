import React from 'react';

export default function Avatar({
  name = "",
  size = 50,
  width = 11,
  height = 11,
  theme = "light",
  src = ""
}) {
  const initials = name
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  const background = theme === 'light' ? '#0B1D51' : '#F1E7E7';
  const color = theme === 'light' ? '#F1E7E7' : '#0B1D51';

  const commonStyle = {
    width: `${width}rem`,
    height: `${height}rem`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: `${size}px`,
    cursor: 'pointer',
    userSelect: 'none',
    overflow: 'hidden',
    backgroundColor: background,
    color: color
  };

  return (
    <div style={commonStyle}>
      {src ? (
        <img
          src={src}
          alt="avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
