"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full bg-gray-800 border border-gray-600 rounded-lg animate-pulse"
      style={{ minHeight: "250px" }}
    >
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  ),
});

// Import the CSS only on client side

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [editorValue, setEditorValue] = useState(value);
  const quillRef = useRef(false);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true;
    }

    const timer = setTimeout(() => {
      if (typeof document !== "undefined") {
        document.querySelectorAll(".ql-editor").forEach((element, index) => {
          if (index > 0) {
            element.remove();
          }
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="relative w-full">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={modules}
        placeholder="Write your content here..."
        className="quill-dark rounded-lg text-white placeholder:text-white"
        style={{
          minHeight: "250px",
        }}
      />
      {/* Dark Theme Styling */}
      <style jsx>{`
        .quill-dark .ql-toolbar {
          background-color: #1c1c1c;
          border: 1px solid #2e2e2e;
          border-radius: 8px 8px 0 0;
        }
        .quill-dark .ql-container {
          background-color: #1c1c1c;
          border: 1px solid #2e2e2e;
          border-top: none;
          border-radius: 0 0 8px 8px;
          color: #fff;
        }
        .quill-dark .ql-editor {
          min-height: 200px;
          color: #fff;
          font-size: 1rem;
        }
        .quill-dark .ql-picker,
        .quill-dark .ql-picker-label,
        .quill-dark .ql-picker-item {
          color: #fff;
        }
        .quill-dark .ql-stroke {
          stroke: #fff;
        }
        .quill-dark .ql-fill {
          fill: #fff;
        }
        .quill-dark .ql-toolbar .ql-picker-options {
          background-color: #1c1c1c;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
