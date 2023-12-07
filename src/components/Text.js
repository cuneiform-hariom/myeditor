import React, { useRef, useState, useEffect } from 'react';
// import './App.css';

const Text = () => {
  // const [a, setA] = useState('<b>helow</b>')

  const a = `<strong>Hellow</strong>`


  const [editorText, setEditorText] = useState('');

  console.log("editorText :", editorText)

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

  // const handleText= (e)=> {
  //   const value = e.target.value
  //   setA(value)
  // }

  return (
    <div className='container'>
      <div className='options'>
        <button onClick={() => handleFormat('strong')}>Bold</button>
        <button onClick={() => handleFormat('i')}>Italic</button>
        <button onClick={() => handleFormat('u')}>Underline</button>
        <button onClick={() => handleFormat('s')}>Strikethrough</button>
      </div>
      <div
        className='textarea'
        ref={editorRef}
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: a }}
      // onInput={(e) => setA(e.target.innerHTML)}
      >
      </div>
      {/* <textarea
      onChange={(e)=> handleText(e)}>
      
        {a}
      </textarea> */}
    </div>
  );
};

export default Text;
