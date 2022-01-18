import { cx } from "remirror";

import { useActive, useCommands } from "@remirror/react";

const HeadingButtons = () => {
  const commands = useCommands();
  const active = useActive(true);
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => commands.toggleHeading({ level })}
          className={cx(active.heading({ level }) && "active")}
        >
          H{level}
        </button>
      ))}
    </>
  );
};

export default HeadingButtons;
