import {  useCommands, } from '@remirror/react';


const FontSizeButtons = () => {
  const commands = useCommands();
  return (
    <>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.setFontSize(8)}
      >
        Small
      </button>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.setFontSize(24)}
      >
        Large
      </button>
    </>
  );
};

export default FontSizeButtons;
