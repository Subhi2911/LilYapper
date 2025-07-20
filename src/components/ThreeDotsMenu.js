// ThreeDotsMenu.js
import React, { useState, useRef, useEffect } from 'react';

const ThreeDotsMenu = ({ options = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="More options"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.3rem',
          color: 'inherit',
          padding: 0,
        }}
      >
        <i className="fa-solid fa-ellipsis-vertical mx-1" style={{ fontSize: '1.3rem', color:'white' }}></i>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 8,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: 5,
            minWidth: 150,
            zIndex: 1000,
          }}
        >
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                userSelect: 'none',
                borderTop: i !== 0 ? '1px solid #eee' : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreeDotsMenu;
