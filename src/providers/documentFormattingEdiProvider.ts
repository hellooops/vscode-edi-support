import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiSegment, EdiType } from "../parser/entities";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";
import { StringBuilder } from "../utils/utils";

export class DocumentFormattingEditEdiProvider implements vscode.DocumentFormattingEditProvider, IProvidable {
  async provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Promise<vscode.TextEdit[] | null | undefined> {
    const { parser } = EdiUtils.getEdiParser(document);
    if (!parser) return;

    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return;
    }

    const result: vscode.TextEdit[] = [];
    result.push(new vscode.TextEdit(
      new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      ),
      ediDocument.toString()
    ));
    return result;
  }

  private formatSegments(segments: EdiSegment[], indent: number = 2, parentIndent: number = 0): string {
    const sb = new StringBuilder();
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (i !== 0) {
        sb.append(constants.ediDocument.lineBreak);
      }

      if (segment.isLoop()) {
        sb.append(this.formatSegments(segment.Loop!.slice(0, 1), indent, parentIndent));
        if (segment.Loop!.length > 1) {
          sb.append(constants.ediDocument.lineBreak);
          sb.append(this.formatSegments(segment.Loop!.slice(1), indent, parentIndent + indent));
        }
      } else {
        Array(parentIndent).fill(0).forEach(i => { sb.append(" ") });
        sb.append(segment.toString());
      }
    }

    return sb.toString();
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.X12 }, this),
      vscode.languages.registerDocumentFormattingEditProvider({ language: EdiType.EDIFACT }, this),
    ];
  }
}
