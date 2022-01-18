import React from "react";
import {
  useCommands,
  useChainedCommands,
  useCurrentSelection,
  useActive,
  useHelpers,
  // useEditorState
} from "@remirror/react";
import ItalicButton from "./Italic";
import FontSizeButtons from "./FontSize";
import HeadingButtons from "./Heading";
import StrikeButton from "./Strike";
import SupButton from "./Sup";
import SubButton from "./Sub";
import CleanFormat from "./Cleanformating";
import BulletAndOrderList from './BulletAndOrderList';


const Menu = ({ props }: any) => {
  const chain = useChainedCommands();
  const commands = useCommands();
  const active = useActive();
  const helper = useHelpers();
  // const state = useEditorState();

  // const {$from, $to, ranges } = state.selection;
  const { from, to, empty } = useCurrentSelection();

  // console.log({$from, $to, ranges, from, to});
  
  // active.
  // commands.set


  return (
    <>
      <button
        onClick={() => {
          commands.toggleBold();
        }}
      >
        B
      </button>
      <SubButton />
      <SupButton />
      <StrikeButton />
      <ItalicButton />
      <BulletAndOrderList />
      <FontSizeButtons />
      <HeadingButtons />
      <button
        onClick={() => {
          chain.increaseIndent().run();
        }}
      >
        Set Indent
      </button>
      <button
        onClick={() => {
          chain.decreaseIndent().run();
        }}
      >
        Set Outdent
      </button>
      <button
        onClick={() => {
          chain.setFontFamily('Arial, Helvetica, sans-serif').run();
        }}
      >
        Set font name
      </button>
      <button
        onClick={() => {
          chain.setTextColor("green").run();
        }}
      >
        Set TextColor
      </button>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          commands.createTable({
            rowsCount: 4,
            columnsCount: 4,
            withHeaderRow: false
          })
        }
      >
        create a 4*4 table
      </button>
      <CleanFormat />
    </>
  );
};

export default Menu;
