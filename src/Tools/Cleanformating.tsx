import {
    useChainedCommands,
    useCurrentSelection,
    useCommands,
    useActive,
    useRemirrorContext,
    useEditorState
  } from "@remirror/react";

  // import {
  //   chainableEditorState,
  //   DispatchFunction,
  //   findParentNode,

  // } from '@remirror/core';

  import { isNumber, ProsemirrorNode } from "remirror";
import { Schema, Fragment, Slice, Node, NodeType, NodeRange  } from "@remirror/pm/model";
import { liftTarget, ReplaceAroundStep } from "@remirror/pm/transform";
import { HEADING, LIST_ITEM, PARAGRAPH } from "./NodeNames";
import isListNode from "./isListNode";
import { TextSelection } from "prosemirror-state";
import { Transform } from "prosemirror-transform";

// import { EditorState, Selection, TextSelection, Transaction } from '@remirror/pm/state';


import { compareNumber } from '../helper';

// import { isList, isListItemNode, isListNode as isListNodeRemirror } from '../list-ultis';

// function convertListItemNodeToParagraphs(
//   schema: Schema,
//   listItemNode: ProsemirrorNode
// ): ProsemirrorNode[] {
//   const result: ProsemirrorNode[] = [];
//   for (let i = 0; i < listItemNode.childCount; i++) {
//     const childNode = listItemNode.child(i);
//     result.push(...convertNodeToParagraphs(schema, childNode));
//   }
//   return result;
// }

// function convertListNodeToParagraphs(
//   schema: Schema,
//   listNode: ProsemirrorNode
// ): ProsemirrorNode[] {
//   const result: ProsemirrorNode[] = [];
//   for (let i = 0; i < listNode.childCount; i++) {
//     const listItemNode = listNode.child(i);
//     result.push(...convertListItemNodeToParagraphs(schema, listItemNode));
//   }
//   return result;
// }

// function convertNodeToParagraphs(
//   schema: Schema,
//   node: ProsemirrorNode
// ): ProsemirrorNode[] {
//   if (node.type.name === "paragraph") {
//     return [node];
//   }

//   if (node.type.name === "bulletList" || node.type.name === "orderedList") {
//     return convertListNodeToParagraphs(schema, node);
//   }

//   console.warn(`covert ${node.type.name} to paragraphs is not implemented yet`);
//   const textContent = node.textContent;
//   return [
//     schema.nodes.paragraph.createChecked(
//       null,
//       textContent ? schema.text(textContent) : undefined
//     )
//   ];
// }

// function getItemRange(itemType: NodeType, selection: Selection) {
//   const { $from, $to } = selection;

//   const range = $from.blockRange($to, (node) => node.firstChild?.type === itemType);

//   return range;
// }

// // Copied from `prosemirror-schema-list`
// function liftOutOfList(state: EditorState, dispatch: DispatchFunction, range: NodeRange) {
//   const tr = state.tr,
//     list = range.parent;

//   const originMappingLength = tr.mapping.maps.length;

//   // Merge the list items into a single big item
//   for (let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
//     pos -= list.child(i).nodeSize;
//     tr.delete(pos - 1, pos + 1);
//   }

//   const $start = tr.doc.resolve(range.start),
//     item = $start.nodeAfter;

//   if (!item) {
//     return false;
//   }

//   if (tr.mapping.slice(originMappingLength).map(range.end) !== range.start + item.nodeSize) {
//     return false;
//   }

//   const atStart = range.startIndex === 0,
//     atEnd = range.endIndex === list.childCount;
//   const parent = $start.node(-1),
//     indexBefore = $start.index(-1);

//   if (
//     !parent.canReplace(
//       indexBefore + (atStart ? 0 : 1),
//       indexBefore + 1,
//       item.content.append(atEnd ? Fragment.empty : Fragment.from(list)),
//     )
//   ) {
//     return false;
//   }

//   const start = $start.pos,
//     end = start + item.nodeSize;
//   // Strip off the surrounding list. At the sides where we're not at
//   // the end of the list, the existing list is closed. At sides where
//   // this is the end, it is overwritten to its end.
//   tr.step(
//     new ReplaceAroundStep(
//       start - (atStart ? 1 : 0),
//       end + (atEnd ? 1 : 0),
//       start + 1,
//       end - 1,
//       new Slice(
//         (atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(
//           atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty)),
//         ),
//         atStart ? 0 : 1,
//         atEnd ? 0 : 1,
//       ),
//       atStart ? 0 : 1,
//     ),
//   );
//   dispatch(tr.scrollIntoView());
//   return true;
// }

export const FORMATTING_NODE_TYPES = [
  'heading',
  'code_block',
  'blockquote',
  'ordered_list',
  'bullet_list',
  'list_item',
];
export const FORMATTING_MARK_TYPES = [
  'link',
  'em',
  'code',
  'strike',
  'strong',
  'underline',
];

// function unwrapNodesFromSelection(
//   tr: Transform,
//   listNodePos: number,
//   nodes: any,
//   unwrapParagraphNode?: Node,
//   from?: number,
//   to?: number
// ): Transform {
//   const contentBlocksBefore: any = [];
//   const contentBlocksSelected: any = [];
//   const contentBlocksAfter: any = [];
//   const paragraph = nodes;
//   const listItem = nodes;
//   const listNode: any = tr.doc.nodeAt(listNodePos);

//   tr.doc.nodesBetween(
//     listNodePos,
//     listNodePos + listNode.nodeSize,
//     (node, pos, parentNode, index) => {
//       if (node.type !== paragraph) {
//         return true;
//       }
//       const block = {
//         node,
//         pos,
//         parentNode,
//         index,
//       };

//       if (isNumber(from) && (pos + node.nodeSize <= from)) {
//         contentBlocksBefore.push(block);
//       } else if (isNumber(to) && (pos > to)) {
//         contentBlocksAfter.push(block);
//       } else {
//         contentBlocksSelected.push(block);
//       }
//       return false;
//     }
//   );

//   if (!contentBlocksSelected.length) {
//     return tr;
//   }

//   tr = tr.delete(listNodePos, listNodePos + listNode.nodeSize);

//   const listNodeType = listNode.type;
//   const attrs = { indent: listNode.attrs.indent, start: 1 };

//   if (contentBlocksAfter.length) {
//     const nodes = contentBlocksAfter.map((block: any) => {
//       return listItem.create({}, Fragment.from(block.node));
//     });
//     const frag = Fragment.from(
//       listNodeType.create(attrs, Fragment.from(nodes))
//     );
//     tr = tr.insert(listNodePos, frag);
//   }

//   if (contentBlocksSelected.length) {
//     const nodes = contentBlocksSelected.map((block: any) => {
  
//       return block.node;
      
//     });
//     const frag = Fragment.from(nodes);
//     tr = tr.insert(listNodePos, frag);
//   }

//   if (contentBlocksBefore.length) {
//     const nodes = contentBlocksBefore.map((block: any) => {
//       return listItem.create({}, Fragment.from(block.node));
//     });
//     const frag = Fragment.from(
//       listNodeType.create(attrs, Fragment.from(nodes))
//     );
//     tr = tr.insert(listNodePos, frag);
//   }

//   return tr;
// }

  const CleanFormat = () => {
    // const { from, to, empty} = useCurrentSelection();
 
    const chain = useChainedCommands();
    const command = useCommands();
    const active = useActive();
    const { view: editorView, schema } = useRemirrorContext();

    const handleClearFormat = () => {

      let tr = editorView.state.tr;
      const state = editorView.state;
      console.log({ tr });

      const { $from, $to } = tr.selection;
      const { doc } = tr;
      
      // remove marks
      tr.removeMark($from.pos, $to.pos);
  
      // tr.doc.nodesBetween($from.pos, $to.pos, (node, startPos) => {
      //   console.log({type: node.type.name});
        
      //   if (node.isBlock && (node.type.name === 'anchor' || node.type.name === 'heading' || node.type.name === 'blockquote' || node.type.name === 'code_block')) {
      //     const text = node.textContent
      //     const textNode = state.schema.text(text)
      //     const paragraphNode = state.schema.nodes.paragraph.create(null, textNode)
      //     tr = tr.replaceWith(startPos, startPos + node.nodeSize, paragraphNode)
      //   } else if (node.isBlock && (node.type.name === 'bulletList' || node.type.name === 'orderedList')) {
      //     let fromPos = tr.doc.resolve(tr.mapping.map(startPos + 1));
      //     let toPos = tr.doc.resolve(tr.mapping.map(startPos + node.nodeSize - 1));
      //     const nodeRange = fromPos.blockRange(toPos);
      //     // tr.lift(nodeRange, targetLiftDepth);
      //     // console.log({nodeRange});
      //     if (nodeRange) {
            
            
      //                 const targetLiftDepth: number | undefined | null = liftTarget(nodeRange);
      //                 console.log({targetLiftDepth});
                      
      //                 if (targetLiftDepth || targetLiftDepth === 0) {
      //                   tr.lift(nodeRange, targetLiftDepth);
      //                 }
         
      //     }
      //     // const paragraphNodes: any = []
      //     // node.forEach((childNode) => {
      //     //   paragraphNodes.push(state.schema.nodes.paragraph.create(null, state.schema.text(childNode.textContent)))
      //     // })
      //     // tr = tr.replaceWith(startPos + 1, startPos + node.nodeSize -1, paragraphNodes)
      //   }
      // })

      // console.log({marks: tr.selection.});
      

      // traverse all nodes within selection recursively and deal with each
      // -------------------------------------------------------------------------
      tr.doc.nodesBetween($from.pos, $to.pos, (node: ProsemirrorNode, pos: number) => {
        const formattedNodeType: NodeType<any> = state.schema.nodes[node.type.name];
        

        
        console.log({formattedNodeType, isListNode: !isListNode(node), node});

        if (
          (formattedNodeType && formattedNodeType.name !== 'paragraph') ||
          formattedNodeType.name !== 'text' ||
          // dont want to perform any lift on ordered or bullet lists
          !isListNode(node) // is not a bullet or ordered list node
        ) {
          let fromPos = tr.doc.resolve(tr.mapping.map(pos + 1));
          let toPos = tr.doc.resolve(tr.mapping.map(pos + node.nodeSize - 1));
          const nodeRange = fromPos.blockRange(toPos);
          console.log({
            childCountFromNode: node.childCount,
            node,
            nodeContent: node.content,
            openStart: $from.start,
            openEnd: $to.end,
            $from: $from.pos, 
            $to: $to.pos,
            childCount: node.content.childCount
          })
          
          if (nodeRange) {
            const targetLiftDepth: number | undefined | null = liftTarget(nodeRange);
            console.log({targetLiftDepthouter: targetLiftDepth, node});
  
            if (formattedNodeType.isTextblock) {
              // remove headers
              tr.setNodeMarkup(nodeRange.start, state.schema.nodes.paragraph);
              return false;
            } else if (targetLiftDepth || targetLiftDepth === 0) {
              // remove list_items, links, blockquotes
              console.log({
                nodeRange,
                targetLiftDepth,
                formattedNodeType,
                node
              });
              debugger;
              //|| formattedNodeType.name === "orderedList"

              // if (formattedNodeType.name === "listItem" ) {
              //   const result: ProsemirrorNode[] = [];
              //   for (let i = 0; i < node.childCount; i++) {
              //     const listItemNode = node.child(i);
              //     result.push(...convertListItemNodeToParagraphs(schema, listItemNode));
              //   }
              //   console.log({result});
                
              //   // const stateInner = chainableEditorState(tr, state);
              //   // const range = getItemRange(formattedNodeType, tr.selection);
            
              //   // if (!range) {
              //   //   return false;
              //   // }
            
            
              //   // liftOutOfList(stateInner, editorView.dispatch, range);
              //   const paragraphNodes: any = [];
              //   node.forEach((childNode) => {
              //     paragraphNodes.push(state.schema.nodes.paragraph.create(null, state.schema.text(childNode.textContent)));
                  
              //   });
              //   tr = tr.replaceWith(pos, pos + node.nodeSize, paragraphNodes);
                
              // } 

              tr.lift(nodeRange, targetLiftDepth);
            
              return false;
            }
          }
        }
      });
      // -------------------------------------------------------------------------


      // const { schema } = memo;
      // let { tr } = memo;

      // if (!tr.doc || !tr.selection) {
      //   return tr;
      // }

      // const { nodes } = schema;
      // const paragraph = nodes[PARAGRAPH];
      // const listItem = nodes[LIST_ITEM];

      // if (!listItem || !paragraph) {
      //   return tr;
      // }
      // // const fromSelection = TextSelection.create(
      // //   doc,
      // //   tr?.selection?.from,
      // //   tr?.selection?.from
      // // );
      // // const listNode = tr.doc.nodeAt(listNodePos);
      // // if (!isListNode(listNode)) {
      // //   return tr;
      // // }

      // const initialSelection = tr.selection;
      // const { from, to } = initialSelection;

      // const listNodePoses: any = [];

      // // keep all list type nodes starting position
      // tr.doc.nodesBetween(from, to, (node, pos) => {
      //   if (isListNode(node)) {
      //     listNodePoses.push(pos);
      //   }
      // });

      // if (from === to && from < 1) {
      //   return tr;
      // }
      // // Unwraps all selected list
      // listNodePoses
      //   .sort(compareNumber)
      //   .reverse()
      //   .forEach((pos: any) => {
      //     tr = unwrapNodesFromSelection(
      //       tr,
      //       pos,
      //       nodes,
      //       undefined,
      //       from,
      //       to
      //     );
      //   });

      tr.setStoredMarks([]);

     // insert text to selection
    // const selection = tr.selection;

    // // check we will actually need a to dispatch transaction
    // let shouldUpdate = false;

    // state.doc.nodesBetween(selection.from, selection.to, (node, position) => {
    //     // we only processing text, must be a selection
    //     if (!node.isTextblock || selection.from === selection.to) return;

    //     // calculate the section to replace
    //     const startPosition = Math.max(position + 1, selection.from);
    //     const endPosition = Math.min(position + node.nodeSize, selection.to);

    //     // grab the content
    //     const substringFrom = Math.max(0, selection.from - position - 1);
    //     const substringTo = Math.max(0, selection.to - position - 1);
    //     const updatedText = node.textContent.substring(substringFrom, substringTo);

    //     // set the casing
    //     const textNode = state.schema.text(updatedText.toUpperCase(), node.marks);

    //     // replace
    //     tr = tr.replaceWith(startPosition, endPosition, textNode);
    //     shouldUpdate = true;
    // });

    // if (editorView.dispatch && shouldUpdate) {
    //   editorView.dispatch(tr.scrollIntoView());
    //   return;
    // }

      editorView.dispatch(tr);
      return true;
      // console.log({
      //   from, to, empty
      // })
      // const h1Active = active.heading({ level: 1 });
      // const h2Active = active.heading({ level: 2 });
      // const h3Active = active.heading({ level: 3 });
      // const h4Active = active.heading({ level: 4 });
      // const h5Active = active.heading({ level: 5 });
      // const h6Active = active.heading({ level: 6 });
      // console.log({
      //   h1Active,
      //   h2Active,
      //   h3Active,
      //   h4Active,
      //   h5Active,
      //   h6Active
      // });
      // active.textColor
      // active.textHighlight
      // active.fontSize
      // active.fontFamily
      // command.removeBold();
      // active.italic() && command.toggleItalic();
      // active.sub() && command.toggleSubscript();
      // active.sup() && command.toggleSuperscript();
      // active.strike() && command.toggleStrike();
      // command.setFontSize("11pt");
      // command.removeTextColor();
      // h1Active && command.toggleHeading({ level: 1 });
      // h2Active && command.toggleHeading({ level: 2 });
      // h3Active && command.toggleHeading({ level: 3 });
      // h4Active && command.toggleHeading({ level: 4 });
      // h5Active && command.toggleHeading({ level: 5 });
      // h6Active && command.toggleHeading({ level: 6 });
        // command.removeBold();
        // active.italic() && command.toggleItalic();
        // active.sub() && command.toggleSubscript();
        // active.sup() && command.toggleSuperscript();
        // active.strike() && command.toggleStrike();
        // command.setFontSize("11pt");
        // command.removeTextColor();
        // command.removeTextHighlight();
        // command.convertParagraph();
        // command.toggleBulletList();

        // process.nextTick(() => {
        //   const tr = view.state.tr;
        //   console.log({ tr });
        //   const oldSlice = view.state.selection.content();
        //   const oldFragment = oldSlice.content;
        //   console.log({
        //     oldSlice,
        //     oldSliceString: oldSlice.toString(),
        //     oldFragmentString: oldFragment.toString(),
        //     oldFragment,
        //     childCount: oldFragment.childCount
        //   });
        //   const newNodes: ProsemirrorNode[] = [];
        //   for (let i = 0; i < oldFragment.childCount; i++) {
        //     const oldNode = oldFragment.child(i);
        //     console.log({ oldNode });
        //     newNodes.push(...convertNodeToParagraphs(schema, oldNode));
        //   }
        //   const newFragment = Fragment.fromArray(newNodes);
        //   console.log({ newFragment });
        //   const newSlice = new Slice(
        //     newFragment,
        //     oldSlice.openStart,
        //     oldSlice.openEnd
        //   );
        //   console.log({ newSlice });
        //   tr.replaceSelection(newSlice);
        //   view.dispatch(tr);

        // })

    };
    return <button onClick={handleClearFormat}>Clear Format</button>;
  };
  
  export default CleanFormat;
  