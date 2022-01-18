import React from "react";
import { useCommands } from "@remirror/react";
const BulletAndOrderList = () => {
  const command = useCommands();
  return (
    <>
      <button
        onClick={() => {
          command.toggleBulletList();
        }}
      >
        BulletList
      </button>
      <button
        onClick={() => {
          command.toggleOrderedList();
        }}
      >
        OrderList
      </button>
    </>
  );
};
export default BulletAndOrderList;
