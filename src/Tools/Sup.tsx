import { useCommands } from "@remirror/react";

const SupButton = () => {
  const commands = useCommands();
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => commands.toggleSuperscript()}
    >
      Toggle Superscript
    </button>
  );
};

export default SupButton;
