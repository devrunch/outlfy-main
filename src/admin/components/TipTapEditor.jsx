"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap';
import { useState, useCallback, useEffect, useRef } from 'react';

// Every extension/toolbar button here must only ever produce markup the
// backend content validator accepts (src/admin/models/Testimonial.js:
// b, strong, i, em, u, br, p, span, and safe <img>). Headings, lists,
// links, code blocks, blockquotes, tables and the YouTube embed were
// previously offered here but always failed validation on save — worse,
// the YouTube button inserted a raw <iframe> into the testimonial text,
// which is the same injection shape as the earlier video-overflow bug.
// Keep this list narrow rather than widening the schema: testimonial
// cards are small, fixed-size, line-clamped boxes that only fit plain
// quote text.
const TipTapEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const imageFileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        strike: false,
        horizontalRule: false,
        link: false,
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
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

          {/* Media */}
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => setShowImageModal(true)}
              title="Add Image"
            >
              <i className="fas fa-image"></i>
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
        
        .tiptap-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;
