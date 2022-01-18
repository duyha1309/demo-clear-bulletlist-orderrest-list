import { useCommands } from "@remirror/react";

const SubButton = () => {
  const commands = useCommands();
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => commands.toggleSubscript()}
    >
      Toggle Subscript
    </button>
  );
};

export default SubButton;
