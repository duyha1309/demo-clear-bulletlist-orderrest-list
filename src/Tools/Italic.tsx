import { cx } from "remirror";

import { useActive, useCommands } from "@remirror/react";

const ItalicButton = () => {
  const commands = useCommands();
  const active = useActive(true);
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => commands.toggleItalic()}
      className={cx(active.italic() && "active")}
    >
      Italic
    </button>
  );
};
export default ItalicButton;
