import React from 'react';
import EmojiInput from './EmojiInput';

const Keyboard = ({ onSend, onTyping }) => {
  return <EmojiInput onSend={onSend} onTyping={onTyping} />;
};

export default Keyboard;
