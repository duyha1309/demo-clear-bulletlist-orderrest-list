import { cx } from "remirror";
import { useActive, useCommands } from "@remirror/react";

const StrikeButton = () => {
  const commands = useCommands();
  const active = useActive(true);
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => commands.toggleStrike()}
      className={cx(active.strike() && "active")}
    >
      Strike
    </button>
  );
};

export default StrikeButton;
