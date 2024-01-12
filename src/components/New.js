import React, { useState, useRef } from 'react';

const New = () => {
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const textAreaRef = useRef(null);
   
    const handleChange = () => {
       setContent(textAreaRef.current.innerText);
       setHtmlContent(textAreaRef.current.innerHTML);
    };
   
    const handleBold = () => {
       const selection = window.getSelection();
       const range = selection.getRangeAt(0);
       const boldText = document.createElement('b');
       range.surroundContents(boldText);
       selection.removeAllRanges();
       selection.addRange(range);
    };
   
    const handleItalic = () => {
       const selection = window.getSelection();
       const range = selection.getRangeAt(0);
       const italicText = document.createElement('i');
       range.surroundContents(italicText);
       selection.removeAllRanges();
       selection.addRange(range);
    };
   
    const handleUnderline = () => {
       const selection = window.getSelection();
       const range = selection.getRangeAt(0);
       const underlineText = document.createElement('u');
       range.surroundContents(underlineText);
       selection.removeAllRanges();
       selection.addRange(range);
    };
 return (
    <div>
      <div
        contentEditable="true"
        onInput={handleChange}
        ref={textAreaRef}
        style={{
          border: '1px solid black',
          padding: '10px',
          width: '500px',
          margin: 'auto',
          height: '300px',
        }}
      ></div>
      <button onClick={handleBold}>Bold</button>
      <button onClick={handleItalic}>Italic</button>
      <button onClick={handleUnderline}>Underline</button>
      <h2>HTML Content:</h2>
      <textarea
        readOnly
        value={htmlContent}
        style={{
          border: '1px solid black',
          padding: '10px',
          height: '300px',
          width: '500px',
          margin: 'auto'
        }}
      ></textarea>
    </div>
 );
};

export default New;