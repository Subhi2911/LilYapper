import React from 'react';
import EmojiInput from './EmojiInput';

const Keyboard = ({ onSend, onTyping, isDisabled, editingText, setEditingText, isEditing }) => {
  return <EmojiInput value={editingText}
    onChange={(val) => setEditingText(val)}
    onSend={onSend}
    isEditing={isEditing}
    onTyping={onTyping}
    isDisabled={isDisabled} />;
};

export default Keyboard;
