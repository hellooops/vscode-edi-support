import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiVersion, EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { StringBuilder } from "../utils/utils";
import { SchemaViewerUtils } from "../utils/schemaViewerUtils";
import { EdiUtils } from "../utils/ediUtils";
import * as constants from "../constants";

export abstract class HoverProviderBase implements vscode.HoverProvider, IProvidable {
  async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover | undefined | null> {
    if (vscode.workspace.getConfiguration(constants.configuration.ediSupport).get(constants.configuration.enableHover) !== true) {
      return null;
    }
    return null;
    // const { parser, ediType } = EdiUtils.getEdiParser(document);
    // if (!parser) {
    //   return null;
    // }

    // let ediVersion = parser.parseReleaseAndVersion();
    // if (!ediVersion) return;
    // const { segments } = await parser.parse();
    // let realPosition = document.offsetAt(
    //   new vscode.Position(position.line, position.character)
    // );
    // const { element, segment } = EdiUtils.getSegmentOrElementByPosition(realPosition, segments);
    // if (!segment) return;

    // if (element) {
    //   return new vscode.Hover(this.buildElementMarkdownString(ediType, ediVersion, segment, element));
    // } else {
    //   return new vscode.Hover(this.buildSegmentMarkdownString(ediType, ediVersion, segment));
    // }
  }

  public abstract getLanguageName(): string;

  private buildSegmentMarkdownString(ediType: EdiType, ediVersion: EdiVersion, segment: EdiSegment) : vscode.MarkdownString[] {
    const part2MdSb = new StringBuilder();
    if (segment?.ediReleaseSchemaSegment?.desc) {
      part2MdSb.append(`**${segment.ediReleaseSchemaSegment.desc}**\n\n`);
    }
    if (segment?.ediReleaseSchemaSegment?.purpose) {
      part2MdSb.append(`${segment.ediReleaseSchemaSegment.purpose}\n\n`);
    }
    part2MdSb.append(`\`\`\`${this.getLanguageName()}\n${segment}\n\`\`\``);
    const segmentSchemaViewerUrl: string = SchemaViewerUtils.getSegmentUrl(ediType, ediVersion.release, segment.id);
    const mdStrings: vscode.MarkdownString[] = [
      new vscode.MarkdownString(
        `**${segment.id}** (Segment)`
      ),
      new vscode.MarkdownString(part2MdSb.toString()),
    ];

    if (!segment?.ediReleaseSchemaSegment?.mock) {
      mdStrings.push(new vscode.MarkdownString(
        `[EDI Schema Reference](${segmentSchemaViewerUrl})\n`
      ));
    }
    return mdStrings;
  }

  private buildElementMarkdownString(ediType: EdiType, ediVersion: EdiVersion, segment: EdiSegment, element: EdiElement) : vscode.MarkdownString[] {
    const part1MdSb = new StringBuilder();
    part1MdSb.append(`**${segment.id}**${element.designatorIndex} (Element)`);
    if (element?.ediReleaseSchemaElement) {
      if (element.ediReleaseSchemaElement.id !== undefined) {
        part1MdSb.append(`\n\n\`Id ${element.ediReleaseSchemaElement.id}\``);
      }
      if (element.ediReleaseSchemaElement.dataType !== undefined) {
        part1MdSb.append(` \`Type ${element.ediReleaseSchemaElement.dataType}\``);
      }
      if (element.ediReleaseSchemaElement.minLength !== undefined && element.ediReleaseSchemaElement.maxLength !== undefined) {
        part1MdSb.append(` \`Min ${element.ediReleaseSchemaElement.minLength} / Max ${element.ediReleaseSchemaElement.maxLength}\``);
      }
    }

    const part2MdSb = new StringBuilder();
    if (element?.ediReleaseSchemaElement) {
      if (element.ediReleaseSchemaElement.desc) {
        part2MdSb.append(`**${element.ediReleaseSchemaElement.desc}**\n\n`);
      }
      if (element.ediReleaseSchemaElement.definition) {
        part2MdSb.append(`${element.ediReleaseSchemaElement.definition}\n\n`);
      }
    }
    part2MdSb.append(`\`\`\`${this.getLanguageName()}\n${segment}\n\`\`\``);

    const mdStrings: vscode.MarkdownString[] = [
      new vscode.MarkdownString(part1MdSb.toString()),
      new vscode.MarkdownString(part2MdSb.toString()),
    ];

    const elementSchemaViewerUrl: string = SchemaViewerUtils.getElementUrl(ediType, ediVersion.release, segment.id, element.getDesignator());
    if (element?.ediReleaseSchemaElement?.qualifierRef) {
      const codes = element?.ediReleaseSchemaElement?.getCodes();
      const part3MdSb = new StringBuilder();
      if (element.value) {
        const elementValueCode = element?.ediReleaseSchemaElement?.getCodeByValue(element.value);
        if (element.value && elementValueCode) {
          part3MdSb.append(`${element.value}: \`${elementValueCode.desc}\`\n\n`);
        }
      }

      if (codes && codes.length > 0) {
        part3MdSb.append(`Available codes: ${codes.map(code => `[\`${code.value}\`](${elementSchemaViewerUrl} "${code.getEscapedDesc()}")`).join(" ")}`);
      }

      const part3MdStr = part3MdSb.toString();
      if (part3MdStr.length > 0) {
        mdStrings.push(new vscode.MarkdownString(part3MdStr));
      }
    }

    if (!element?.ediReleaseSchemaElement?.mock) {
      mdStrings.push(new vscode.MarkdownString(
        `[EDI Schema Reference](${elementSchemaViewerUrl})\n`
      ));
    }
    return mdStrings;
  }

  public abstract registerFunctions(): vscode.Disposable[];
}
