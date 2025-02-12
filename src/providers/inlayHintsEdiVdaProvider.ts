import * as vscode from "vscode";
import { EdiType } from "../parser/entities";
import { InlayHintsEdiProvider } from "./inlayHintsEdiProvider";
import * as constants from "../constants";
import { EdiUtils } from "../utils/ediUtils";

export class InlayHintsEdiVdaProvider extends InlayHintsEdiProvider {
  async provideInlayHints(document: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.InlayHint[] | null | undefined> {
    const enableElementIndexAnnotation = !!vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableElementIndexAnnotation);
    if (!enableElementIndexAnnotation) {
      return [];
    }
    const { parser } = EdiUtils.getEdiParser(document)!;
    if (!parser) {
      return [];
    }

    const ediDocument = await parser.parse();
    const segments = ediDocument.getSegments(true);

    return segments.flatMap(segment => {
      return segment.elements?.map(ele => {
        const inlayHint = new vscode.InlayHint(
          EdiUtils.getElementStartPosition(document, segment, ele),
          ele.designatorIndex
        );
        inlayHint.paddingLeft = true;
        return inlayHint;
      });
    });
  }

  getLanguageId(): string {
    return EdiType.VDA;
  }
}
