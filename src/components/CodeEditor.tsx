"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const parent = editorRef.current;

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        keymap.of([indentWithTab]),
        updateListener,
        EditorView.theme({
          "&": { height: "100%", fontSize: "14px" },
          ".cm-scroller": {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          },
          ".cm-gutters": {
            minWidth: "36px",
          },
          ".cm-content": {
            padding: "8px 0",
          },
          ".cm-line": {
            padding: "0 8px",
          },
          ".cm-content, .cm-line": {
            caretColor: "#fff",
          },
          "&.cm-focused .cm-cursorLayer": {
            animation: "steps(1) cm-blink 1.2s infinite",
          },
          "&.cm-focused": {
            outline: "none",
          },
        }),
      ],
      parent,
    });

    viewRef.current = view;

    const resizeObserver = new ResizeObserver(() => {
      view.requestMeasure();
    });
    resizeObserver.observe(parent);

    return () => {
      resizeObserver.disconnect();
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  return (
    <div
      ref={editorRef}
      className="h-full w-full text-base sm:text-sm"
      style={{ minHeight: "250px" }}
    />
  );
}
