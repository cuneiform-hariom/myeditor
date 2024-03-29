import React, { useRef, useState, useEffect } from 'react';
import '../App.css';

const Editor = () => {
    const initialText = 'Good Morning';

    const [editorText, setEditorText] = useState(initialText);
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);

    const editorRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('black')

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.addEventListener('input', () => {
                setEditorText(editor.innerHTML);
            });

            editor.addEventListener('click', handleLinkClick);
        }
    }, []);

    const handleFormat = (format) => {
        const selection = window.getSelection();

        if (format === 'link') {
            const url = prompt('Enter the link URL:');
            if (url) {
                applyLinkToSelection(url);
            }
        } else if (format === 'unlink') {
            removeLink();
        } else if (selection && selection.toString().trim() !== '') {
            const range = selection.getRangeAt(0);

            // Check if the selected text already contains the specified tag
            const currentTag = range.commonAncestorContainer.parentNode.tagName.toLowerCase();
            const containsTag = currentTag === format;

            if (containsTag) {
                // If the selected text already contains the tag, remove it
                const contents = range.extractContents();
                range.commonAncestorContainer.parentNode.replaceWith(contents);
            } else {
                // Handle list cases separately
                if (format === 'ul' || format === 'ol') {
                    handleListFormat(format);
                } else {
                    // Create a new element for the specified format
                    const tag = document.createElement(format);

                    // Wrap the selected text with the new tag
                    tag.appendChild(range.extractContents());
                    range.insertNode(tag);

                    // If the parent of the newly added tag is the same format, merge them
                    const parentTag = tag.parentNode;
                    if (parentTag && parentTag.tagName.toLowerCase() === format) {
                        const contents = parentTag.innerHTML;
                        parentTag.parentNode.replaceChild(tag, parentTag);
                        tag.innerHTML = contents;
                    }
                }
            }

            // Clear the selection
            selection.removeAllRanges();
        }
    };

    useEffect(() => {
        changeColor()
    }, [selectedColor])


    const changeColor = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim() !== '') {
            const range = selection.getRangeAt(0);
            const currentTag = range.commonAncestorContainer.parentNode.tagName.toLowerCase();
            const containsTag = currentTag === 'span';
            if (containsTag) {
                range.commonAncestorContainer.parentNode.style.color = selectedColor
            } else {
                const span = document.createElement('span');
                span.style.color = selectedColor;
                span.appendChild(document.createTextNode(range.toString()));
                range.deleteContents();
                range.insertNode(span);
            }
        }
    };


    const handleListFormat = (format) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const listTag = document.createElement(format);
        const listItemTag = document.createElement('li');

        // Wrap the selected text with the list item tag
        listItemTag.appendChild(range.extractContents());
        listTag.appendChild(listItemTag);
        range.insertNode(listTag);

        // If the parent of the newly added tag is the same format, merge them
        const parentTag = listTag.parentNode;
        if (parentTag && parentTag.tagName.toLowerCase() === format) {
            const contents = parentTag.innerHTML;
            parentTag.parentNode.replaceChild(listTag, parentTag);
            listTag.innerHTML = contents;
        }
    };

    const applyLinkToSelection = (url) => {
        // Check if the URL is an absolute URL
        const isAbsoluteUrl = /^(https?|ftp):\/\//i.test(url);

        // If not an absolute URL, convert it to an absolute URL
        const absoluteUrl = isAbsoluteUrl ? url : `http://${url}`;

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = absoluteUrl; // Use the absolute URL
        link.appendChild(range.extractContents());
        range.deleteContents();
        range.insertNode(link);
        setIsEditingLink(true);
    };

    const handleLinkClick = (event) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'a') {
            setIsEditingLink(true);
            setHoveredLink(null); // Reset hovered link when clicking on the link
        } else {
            setIsEditingLink(false);
        }
    };

    const handleLinkHover = (url) => {
        setHoveredLink(url);
    };

    const removeLink = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const link = range.commonAncestorContainer.parentNode;

        if (link.tagName.toLowerCase() === 'a') {
            const contents = link.innerHTML;
            const parent = link.parentNode;
            parent.replaceChild(document.createTextNode(contents), link);
        }

        setIsEditingLink(false);
    };

    const renderLinkTooltip = () => {
        return hoveredLink && (
            <div className="link-tooltip">
                <a href={hoveredLink} target="_blank" rel="noopener noreferrer">
                    {hoveredLink}
                </a>
                <button onClick={() => handleEditLink(hoveredLink)}>Edit Link</button>
                {isEditingLink && <button onClick={() => handleFormat('unlink')}>Unlink</button>}
            </div>
        );
    };

    const handleEditLink = (url) => {
        const newUrl = prompt('Edit the link URL:', url);
        if (newUrl) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            const link = range.commonAncestorContainer.parentNode;

            if (link.tagName.toLowerCase() === 'a') {
                link.href = newUrl;
            }

            setIsEditingLink(false);
        }
    };

    return (
        <>
            <div className="mainbox">
                <div className='container'>
                    <div className='options'>
                        <button onClick={() => handleFormat('b')}>Bold</button>
                        <button onClick={() => handleFormat('i')}>Italic</button>
                        <button onClick={() => handleFormat('u')}>Underline</button>
                        <button onClick={() => handleFormat('s')}>Strikethrough</button>
                        <button onClick={() => handleFormat('ul')}>Unordered List</button>
                        <button onClick={() => handleFormat('ol')}>Ordered List</button>
                        <button onClick={() => handleFormat('link')}>Link</button>
                        <input
                            type="color"
                            name=""
                            id=""
                            onChange={(e) => setSelectedColor(e.target.value)}
                        />
                        
                    </div>
                    <div
                        className='textarea'
                        ref={editorRef}
                        contentEditable="true"
                        dangerouslySetInnerHTML={{ __html: initialText }}
                        onClick={(event) => handleLinkHover(event.target.href)}
                        role='textbox'
                        aria-multiline="true"
                    >
                    </div>
                    {renderLinkTooltip()}

                    <pre className="textarea prevarea">
                        <code>
                            {editorText}
                        </code>
                    </pre>

                </div>
            </div>
        </>
    );
};

export default Editor;