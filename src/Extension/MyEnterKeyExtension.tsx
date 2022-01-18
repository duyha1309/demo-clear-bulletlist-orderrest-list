  import { PlainExtension, convertCommand } from "remirror";
  import {
    chainCommands,
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlockKeepMarks
  } from "@remirror/pm/commands";

  import {  useRemirrorContext
  } from "@remirror/react";
  
  class MyEnterKeyExtension extends PlainExtension {
    name = "myEnterKeymap";
  
    createKeymap() {

      return {
        // Using `splitBlockKeepMarks` to replace `splitBlock`
        

        Enter({next, state, view} : any) {
          // const { view: editorView, schema } = useRemirrorContext();
          let tr = view.state.tr;
          // const state = editorView.state;
          const { $from, $to } = tr.selection;
          const nodeBefore = $from.nodeBefore;
          const marks = nodeBefore?.marks;
          console.log({
            next,
            state, 
            view,
            nodeBefore,
            marks,

          });

          // view?.dispatch(tr.setStoredMarks(marks));
          tr.addMark( $from.pos, $to.pos , marks);
            view?.dispatch(tr);
                      convertCommand(
            chainCommands(
              newlineInCode,
              createParagraphNear,
              liftEmptyBlock,
              splitBlockKeepMarks
            )
          )
          next();

          
          return true;
        }
      };
    }
  }

  export default MyEnterKeyExtension;