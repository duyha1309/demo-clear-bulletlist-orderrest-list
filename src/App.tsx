import Editor from "./Editor";
import React, { forwardRef, Ref, useRef } from "react";
import "remirror/styles/all.css";
import { prosemirrorNodeToHtml } from "remirror";


export default function App() {
  const editorRef = React.useRef<any>();
  // const { useRemirrorContext, prosemirrorNodeToHtml } = editorRef.current || {};
  // console.log({ editorRef });
  const [content, SaveContent] = React.useState('');
  return (
    <div className="App">
      <div className="editor-container">
        <div className="remirror-theme">
          <Editor ref={editorRef} />
        </div>

        <button
          onClick={() => {
            console.log("click show");
            editorRef.current!.setContent(content);
          }}
        >
          set content
        </button>
        <button
          onClick={() => {
            console.log("click view", { editorRef });

            const view = editorRef.current!.view;
            const doc = prosemirrorNodeToHtml(view?.state.doc);
            SaveContent(doc);
            console.log({ doc }, JSON.stringify(doc));
          }}
        >
          view content
        </button>
      </div>
    </div>
  );
}
