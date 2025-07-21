import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiInput = ({ onSend, onTyping }) => {
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    textareaRef.current.focus();
    if (onTyping) onTyping(); // Notify typing on emoji click
  };

  const sendMessage = () => {
    if (input.trim()) {
      if (typeof onSend === 'function') {
        onSend(input.trim());
      }
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (onTyping) onTyping(); // Notify typing on input change
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '8px 12px',
        backgroundColor: '#e1e7f0',
        borderRadius: '25px',
        border: '1.5px solid #5459AC',
        maxWidth: '100%',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      <button
        ref={emojiButtonRef}
        onClick={() => setShowPicker((val) => !val)}
        style={{
          fontSize: '1.4rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#5459AC',
          outline: 'none',
        }}
        aria-label="Toggle Emoji Picker"
        type="button"
      >
        😀
      </button>

      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={() => setShowPicker(false)} // Close picker when textarea clicked
        placeholder="Type your message..."
        style={{
          flexGrow: 1,
          fontSize: '1rem',
          border: 'none',
          outline: 'none',
          resize: 'none',
          backgroundColor: 'transparent',
          maxHeight: '120px',
          overflowY: 'auto',
          padding: '4px 8px',
          borderRadius: '20px',
          color: '#333',
          fontFamily: 'inherit',
        }}
      />

      <button
        type="button"
        title="Send"
        aria-label="Send Message"
        onClick={sendMessage}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: hovered ? '#3d4189' : '#5459AC',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          transition: 'background-color 0.2s ease-in-out',
        }}
      >
        <i className="fa-solid fa-paper-plane" style={{ fontSize: '1rem' }} />
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '12px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
