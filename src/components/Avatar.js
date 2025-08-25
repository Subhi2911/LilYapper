import React from 'react';

export default function Avatar({
  name = "",
  size = 50,
  width = 11,
  height = 11,
  theme = "light",
  src = "",
  isOnline = false,
  isGroup,
  hideBorder = false 
}) {
  const initials = name
    .trim()
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

    

  const background = theme === 'light' ? '#0B1D51' : '#F1E7E7';
  const color = theme === 'light' ? '#F1E7E7' : '#0B1D51';
  
  const borderColor = isGroup
    ? 'transparent'
    : isOnline
      ? '#4CAF50'     // green
      : '#E57373';    // red

  const containerStyle = {
    width: `${width}rem`,
    height: `${height}rem`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: `${size/5}px`,
    cursor: 'pointer',
    userSelect: 'none',
    overflow: 'hidden',
    backgroundColor: background,
    color: color,
    border: hideBorder
      ? 'none'
      : !isGroup
        ? `3px solid ${borderColor}`
        : `1.5px solid ${borderColor}`,
  };


  return (
    <div style={containerStyle}>
      {(src && src !== "" && src !== "undefined" && src !== "null") ? (
        <img
          src={src}
          alt="avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      ) : (
        // if no image, show initials
        initials
      )}
    </div>
  );
}
