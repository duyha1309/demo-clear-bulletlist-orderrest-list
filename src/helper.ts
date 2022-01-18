import { Node } from "@remirror/pm/model";

import {BULLET_LIST, ORDERED_LIST} from './NodeNames';

export function isBulletListNode(node: Node): boolean {
  return node.type.name === BULLET_LIST;
}
export function isOrderedListNode(node: Node): boolean {
  return node.type.name === ORDERED_LIST;
}
export default function isListNode(node: Node): boolean {
  if (node instanceof Node) {
    return isBulletListNode(node) || isOrderedListNode(node);
  }
  return false;
}

export const findParentNode =
  (predicate: any) =>
  ({ $from }: any) =>
    findParentNodeClosestToPos($from, predicate);

// :: ($pos: ResolvedPos, predicate: (node: ProseMirrorNode) → boolean) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// Iterates over parent nodes starting from the given `$pos`, returning the closest node and its start position `predicate` returns truthy for. `start` points to the start position of the node, `pos` points directly before the node.
//
// ```javascript
// const predicate = node => node.type === schema.nodes.blockquote;
// const parent = findParentNodeClosestToPos(state.doc.resolve(5), predicate);
// ```
export const findParentNodeClosestToPos = ($pos: any, predicate: any) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }
};

// (nodeType: union<NodeType, [NodeType]>) → boolean
// Checks if the type a given `node` equals to a given `nodeType`.
export const equalNodeType = (nodeType: any, node: any) => {
  return (
    (Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) ||
    node.type === nodeType
  );
};

export const findParentNodeOfType = (nodeType: any) => (selection: any) => {
  return findParentNode((node: any) => equalNodeType(nodeType, node))(selection);
};

export function compareNumber(a: number, b: number): number {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}