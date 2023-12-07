import React, { useState } from 'react';
import '../RichTextEditor.css';

const RichTextEditor = () => {
  const [content, setContent] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const handleToggleBold = () => {
    setBold(!bold);
  };

  const handleToggleItalic = () => {
    setItalic(!italic);
  };

  const handleToggleUnderline = () => {
    setUnderline(!underline);
  };

  const getStyle = () => {
    let style = '';
    if (bold) style += 'bold ';
    if (italic) style += 'italic ';
    if (underline) style += 'underline ';
    return style.trim();
  };

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button onClick={handleToggleBold}>B</button>
        <button onClick={handleToggleItalic}>I</button>
        <button onClick={handleToggleUnderline}>U</button>
      </div>
      <div className={`editor-content ${getStyle()}`}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your text here..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
