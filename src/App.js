import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [editorText, setEditorText] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('input', () => {
        setEditorText(editor.innerHTML);
      });
    }
  }, []);

  const handleFormat = (format) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Check if the selected text already contains the specified tag
    const currentTag = range.commonAncestorContainer.parentNode.tagName.toLowerCase();
    const containsTag = currentTag === format;

    if (containsTag) {
      // If the selected text already contains the tag, remove it
      const contents = range.extractContents();
      range.commonAncestorContainer.parentNode.replaceWith(contents);
    } else {
      // Create a new element for the specified format
      const tag = document.createElement(format);

      // Wrap the selected text with the new tag
      tag.appendChild(range.extractContents());
      range.insertNode(tag);
    }

    // Clear the selection
    selection.removeAllRanges();
  };


  return (
    <div className='container'>
      <div className='options'>
        <button onClick={() => handleFormat('b')}>Bold</button>
        <button onClick={() => handleFormat('em')}>Italic</button>
        <button onClick={() => handleFormat('u')}>Underline</button>
      </div>
      <div
        className='textarea'
        ref={editorRef}
        contentEditable
      // dangerouslySetInnerHTML={{ __html: editorText }}
      />
    </div>
  );
};

export default App;
