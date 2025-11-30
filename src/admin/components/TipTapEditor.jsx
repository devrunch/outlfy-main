"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap';
import { useState, useCallback, useEffect, useRef } from 'react';

// Create lowlight instance with common languages (37 languages including JS, TS, CSS, HTML, Python, etc.)
const lowlight = createLowlight(common);

const TipTapEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const imageFileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary text-decoration-underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Color,
      TextStyle,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-3',
        placeholder: placeholder,
      },
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [editor, content]);

  const addLink = useCallback(() => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
    }
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl, linkText]);

  const resetImageModalState = useCallback(() => {
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setImagePreview('');
    setImageUploadError('');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  }, []);

  const addImage = useCallback(() => {
    if (!imageUrl) {
      setImageUploadError('Please provide an image URL or upload a file.');
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    resetImageModalState();
  }, [editor, imageUrl, imageAlt, resetImageModalState]);

  const handleImageFileChange = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError('Unsupported file type. Please select a JPG, PNG, WEBP, or GIF image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageUploadError('Image is too large. Please choose a file under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = typeof reader.result === 'string' ? reader.result : '';
      setImageUrl(base64);
      setImagePreview(base64);
      setImageUploadError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const addYoutube = useCallback(() => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480,
      });
    }
    setShowYoutubeModal(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

  if (!editor) {
    return <div className="p-3 text-center">Loading editor...</div>;
  }

  return (
    <div className="tiptap-editor">
      {/* Toolbar */}
      <div className="border border-bottom-0 p-2 bg-light rounded-top">
        <div className="d-flex flex-wrap gap-1 align-items-center">
          {/* Text Formatting */}
          <ButtonGroup size="sm">
            <Button
              variant={editor.isActive('bold') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <i className="fas fa-bold"></i>
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <i className="fas fa-italic"></i>
            </Button>
            <Button
              variant={editor.isActive('underline') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              <i className="fas fa-underline"></i>
            </Button>
            <Button
              variant={editor.isActive('strike') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <i className="fas fa-strikethrough"></i>
            </Button>
          </ButtonGroup>

          {/* Headings */}
          <ButtonGroup size="sm">
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
            >
              H1
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
            >
              H2
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
            >
              H3
            </Button>
          </ButtonGroup>

          {/* Lists */}
          <ButtonGroup size="sm">
            <Button
              variant={editor.isActive('bulletList') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <i className="fas fa-list-ul"></i>
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Ordered List"
            >
              <i className="fas fa-list-ol"></i>
            </Button>
          </ButtonGroup>

          {/* Alignment */}
          <ButtonGroup size="sm">
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
            >
              <i className="fas fa-align-left"></i>
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align Center"
            >
              <i className="fas fa-align-center"></i>
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
            >
              <i className="fas fa-align-right"></i>
            </Button>
          </ButtonGroup>

          {/* Media & Links */}
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => setShowLinkModal(true)}
              title="Add Link"
            >
              <i className="fas fa-link"></i>
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowImageModal(true)}
              title="Add Image"
            >
              <i className="fas fa-image"></i>
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowYoutubeModal(true)}
              title="Add YouTube Video"
            >
              <i className="fab fa-youtube"></i>
            </Button>
          </ButtonGroup>

          {/* Code & Quote */}
          <ButtonGroup size="sm">
            <Button
              variant={editor.isActive('code') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Inline Code"
            >
              <i className="fas fa-code"></i>
            </Button>
            <Button
              variant={editor.isActive('codeBlock') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              title="Code Block"
            >
              <i className="fas fa-terminal"></i>
            </Button>
            <Button
              variant={editor.isActive('blockquote') ? 'primary' : 'outline-secondary'}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <i className="fas fa-quote-right"></i>
            </Button>
          </ButtonGroup>

          {/* Table */}
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="Insert Table"
            >
              <i className="fas fa-table"></i>
            </Button>
          </ButtonGroup>

          {/* Undo/Redo */}
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <i className="fas fa-undo"></i>
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <i className="fas fa-redo"></i>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border rounded-bottom" style={{ minHeight: '200px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Link Text (optional)</Form.Label>
            <Form.Control
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addLink}>
            Add Link
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={resetImageModalState}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              ref={imageFileInputRef}
              onChange={handleImageFileChange}
            />
            <Form.Text className="text-muted">Supports JPG, PNG, WEBP, or GIF files up to 5MB.</Form.Text>
          </Form.Group>
          {imagePreview && (
            <div className="mb-3 text-center">
              <img
                src={imagePreview}
                alt="Uploaded preview"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Alt Text</Form.Label>
            <Form.Control
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Description of the image"
            />
          </Form.Group>
          {imageUploadError && (
            <div className="text-danger mt-2">{imageUploadError}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetImageModalState}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addImage}>
            Add Image
          </Button>
        </Modal.Footer>
      </Modal>

      {/* YouTube Modal */}
      <Modal show={showYoutubeModal} onHide={() => setShowYoutubeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add YouTube Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>YouTube URL</Form.Label>
            <Form.Control
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowYoutubeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addYoutube}>
            Add Video
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          outline: none;
          min-height: 200px;
          padding: 1rem;
        }
        
        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        
        .tiptap-editor .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1rem 0;
          padding-left: 1rem;
          font-style: italic;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .tiptap-editor .ProseMirror code {
          background-color: #f1f5f9;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
        }
        
        .tiptap-editor .ProseMirror pre {
          background-color: #1e293b;
          color: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .tiptap-editor .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .tiptap-editor .ProseMirror table td,
        .tiptap-editor .ProseMirror table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          vertical-align: top;
        }
        
        .tiptap-editor .ProseMirror table th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .tiptap-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror .youtube-wrapper {
          margin: 1rem 0;
        }
        
        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;
