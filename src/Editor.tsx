import "remirror/styles/all.css";

import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
  useCallback
} from "react";
// import { htmlToProsemirrorNode } from 'remirror';
import { TableExtension } from "@remirror/extension-react-tables";
import {
  BoldExtension,
  HeadingExtension,
  ItalicExtension,
  UnderlineExtension,
  TextColorExtension,
  TextHighlightExtension,
  FontSizeExtension,
  FontFamilyExtension,
  StrikeExtension,
  SubExtension,
  SupExtension,
  BulletListExtension,
  OrderedListExtension,
  EventsExtension,
  NodeFormattingExtension
  // ImageExtension
} from "remirror/extensions";
import { ComponentsTheme } from "@remirror/theme";
import { useRemirrorContext, useKeymap } from "@remirror/react";
import { ImageExtension } from "./Extension/Img";
import MyEnterKeyExtension from './Extension/MyEnterKeyExtension';

import { useRemirror, Remirror, ThemeProvider } from "@remirror/react";

import Menu from "./Tools/Menu";

const extensions = () => [
  new HeadingExtension(),
  new BoldExtension({}),
  new ItalicExtension(),
  new UnderlineExtension(),
  new ImageExtension({ enableResizing: true }),
  new TextColorExtension(),
  new FontSizeExtension(),
  new FontFamilyExtension(),
  new StrikeExtension(),
  new SubExtension(),
  new SupExtension(),
  new TableExtension(),
  new MyEnterKeyExtension(),
  new BulletListExtension(),
  new OrderedListExtension(),
  new TextHighlightExtension(),
  new NodeFormattingExtension()
];

export interface EditorRef {
  setContent: (content: any) => void;
  view: any;
  commands: any;
}

const ImperativeHandle = forwardRef((_: unknown, ref: Ref<EditorRef>) => {
  const { setContent, view, commands } = useRemirrorContext({
    autoUpdate: true
  });

  // Expose content handling to outside
  useImperativeHandle(ref, () => ({ setContent, view, commands }));

  return (
    <div
      className={ComponentsTheme.EDITOR_WRAPPER}
      {...useRemirrorContext().getRootProps()}
      spellCheck="false"
    />
  );
});

// const hooks = [
//   () => {
//     // const { getJSON } = useHelpers();

//     const onEnter = useCallback(
//       (props) => {
//         console.log('Enter', {props});
//         const { state } = props;


//         return true; // Prevents any further key handlers from being run.
//       },
//       [],
//     );

//     // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
//     useKeymap('Mod-Enter', onEnter);
//   },
// ];

const Editor = forwardRef((_: unknown, ref: any) => {
  const editorRef = useRef<EditorRef | null>(null);

  // const eventExtension = React.useMemo(() => {
  //   const extension = new EventsExtension();
  //   extension.addHandler('keydown', (e: any) => {
  //     console.log(`You clicked link: `, {e});
  //     return true;
  //   });
  //   // extension.addHandler('keydown', (e: any) => {
  //   //   console.log('keydown ', {e});
  //   //   return true;
  //   // })
  //   return extension;
  // }, []);
  const { manager, state, setState, onChange } = useRemirror({
    extensions: () => [...extensions()],
    content: "",
    selection: "end",
    stringHandler: 'html'
  });

  useImperativeHandle(
    ref,
    () => {
      // console.log({ editorRef });
      return {
        setContent: editorRef.current!.setContent,
        view: editorRef.current!.view,
        commands: editorRef.current!.commands
      };
    },
    [editorRef]
  );
  // console.log({ editorRefIn: editorRef });
  return (
    <div>
      <Remirror
        manager={manager}
        initialContent={state}
        state={state}
        onChange={onChange}
        autoFocus
        // hooks={hooks}
      >
        <Menu />
        {/* <MyEditorComponent /> */}
        <ImperativeHandle ref={editorRef} />
      </Remirror>
    </div>
  );
});
export default Editor;
