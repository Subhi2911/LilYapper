import React from 'react'
import EmojiInput from './EmojiInput'

const Keyboard = ({onSend}) => { 
    
    return (
        <EmojiInput onSend={onSend}/>
    )
}

export default Keyboard
