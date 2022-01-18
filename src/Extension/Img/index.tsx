import { ImageExtension as ImageExtensionRemmiror } from "remirror/extensions";

import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  DelayedPromiseCreator,
  EditorView,
  ErrorConstant,
  extension,
  ExtensionTag,
  getTextSelection,
  invariant,
  isElementDomNode,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeViewMethod,
  omitExtraAttributes,
  PrimitiveSelection,
  ProsemirrorAttributes,
  ProsemirrorNode
} from "@remirror/core";
import { PasteRule } from "@remirror/pm/paste-rules";
import { insertPoint } from "@remirror/pm/transform";
import { ExtensionImageTheme } from "@remirror/theme";

import { ResizableImageView } from "./resizable-image-view";

type DelayedImage = DelayedPromiseCreator<ImageAttributes>;

export interface ImageOptions {
  createPlaceholder?: (view: EditorView, pos: number) => HTMLElement;
  updatePlaceholder?: (
    view: EditorView,
    pos: number,
    element: HTMLElement,
    progress: number
  ) => void;
  destroyPlaceholder?: (view: EditorView, element: HTMLElement) => void;

  /**
   * The upload handler for the image extension.
   *
   * It receives a list of dropped or pasted files and returns a promise for the
   * attributes which should be used to insert the image into the editor.
   *
   * @param files - a list of files to upload.
   * @param setProgress - the progress handler.
   */
  uploadHandler?: (files: FileWithProgress[]) => DelayedImage[];

  /**
   * Enable resizing.
   *
   * If true, the image node will be rendered by `nodeView` instead of `toDOM`.
   *
   * @default false
   */
  enableResizing: boolean;
}

interface FileWithProgress {
  file: File;
  progress: SetProgress;
}

export type ImageAttributes = ProsemirrorAttributes<ImageExtensionAttributes>;

export interface ImageExtensionAttributes {
  align?:
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";
  alt?: string;
  height?: string;
  width?: string;
  rotate?: string;
  src: string;
  title?: string;

  /** The file name used to create the image. */
  fileName?: string;
}

/**
 * Set the progress.
 *
 * @param progress - a value between `0` and `1`.
 */
type SetProgress = (progress: number) => void;
const MAX_FILE_SIZE = 0.8 * 1024 * 1024;
export class ImageExtension extends ImageExtensionRemmiror {
  createNodeViews(): NodeViewMethod | Record<string, NodeViewMethod> {
    if (this.options.enableResizing) {
      return (
        node: ProsemirrorNode,
        view: EditorView,
        getPos: boolean | (() => number)
      ) => {
        return new ResizableImageView(node, view, getPos as () => number);
      };
    }

    return {};
  }

//   createPasteRules(): PasteRule[] {
//     const superPasteRule = super.createPasteRules()[0] as FilePasteRule;

//     return [
//       {
//         ...superPasteRule,
//         fileHandler: (props) => {
//           for (const file of props.files) {
//             if (file.size > MAX_FILE_SIZE) {
//               alert("file is too big");
//               return true;
//             }
//           }

//           return superPasteRule.fileHandler(props);
//         }
//       }
//     ];
//   }
}
