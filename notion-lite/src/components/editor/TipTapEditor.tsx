"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Editor } from "@tiptap/core";

type Props = {
  initialContent: any | null;
  saveAction: (formData: FormData) => Promise<void>;
};

export default function TipTapEditor({ initialContent, saveAction }: Props) {
  const [json, setJson] = useState<any>(initialContent ?? { type: "doc", content: [{ type: "paragraph" }] });
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: json,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      setJson(editor.getJSON());
    },
  });

  useEffect(() => {
    // sync external initial content once on mount
    if (initialContent) {
      editor?.commands.setContent(initialContent);
      setJson(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("content_json", JSON.stringify(editor.getJSON()));
      await saveAction(fd);
    } finally {
      setSaving(false);
    }
  }, [editor, saveAction]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Toolbar editor={editor} />
        <button
          type="button"
          onClick={save}
          className="ml-auto rounded bg-black text-white px-3 py-1 text-sm disabled:opacity-60"
          disabled={!editor || saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="rounded border">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const Btn = useMemo(() => {
    return function Btn({ active, onClick, children }: { active?: boolean; onClick: () => void; children: any }) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={`rounded border px-2 py-1 text-sm ${active ? "bg-gray-900 text-white" : "bg-white"}`}
        >
          {children}
        </button>
      );
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</Btn>
      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
      <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
    </div>
  );
}
