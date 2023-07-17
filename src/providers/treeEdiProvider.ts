import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { VscodeUtils } from "../utils/utils";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { EdiParserBase } from "../parser/ediParserBase";
import { ICommandable } from "../interfaces/commandable";

export class TreeEdiProvider implements vscode.TreeDataProvider<{ key: string }>, IProvidable, ICommandable {
  name: string = "edi-support.refreshEdiExplorer";
  static readonly icons = {
    segment: "$(selection)",
    element: "$(record-small)",
  };
  private static readonly elementDesignatorPattern = /\d\d/;
  private static readonly compositeElementDesignatorPattern = /\d\d\d\d/;
  private _parser: EdiParserBase;
  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  public refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  async getTreeItem(element: { key: string; }): Promise<vscode.TreeItem> {
    const treeItem = new vscode.TreeItem(element.key);
    const segments = await this._parser.parseSegments();
    const segmentOrElement = this.getSegmentOrElementByName(segments, element.key);
    if (segmentOrElement instanceof EdiSegment) {
      // Segment
      const segmentDesc = segmentOrElement.ediReleaseSchemaSegment?.desc ?? "";
      return {
        label: segmentOrElement.id,
        iconPath: VscodeUtils.icons.segment,
        description: segmentDesc,
        tooltip: segmentDesc,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      };
    } else if (segmentOrElement instanceof EdiElement) {
      // Element
      const elementDesc = segmentOrElement.ediReleaseSchemaElement?.desc ?? "";
      const isDataElement = segmentOrElement.components && segmentOrElement.components.length > 0;

      return {
        label: segmentOrElement.getDesignator(),
        iconPath: VscodeUtils.icons.element,
        description: elementDesc,
        tooltip: elementDesc,
        collapsibleState: isDataElement ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      };
    } else {
      return treeItem;
    }
  }

  async getChildren(element?: { key: string; } | undefined): Promise<{ key: string; }[] | null | undefined> {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) {
      return;
    }

    if (!element) {
      const diagnostics: vscode.Diagnostic[] = [];
      const { parser, ediType } = VscodeUtils.getEdiParser(document);
      this._parser = parser;
      if (ediType === EdiType.UNKNOWN) {
        return;
      }

      let segments = await parser.parseSegments();

      return segments.map((segment) => {
        return {
          key: segment.id,
        };
      });
    }
    
    const segments = await this._parser.parseSegments();
    const segmentOrElement = this.getSegmentOrElementByName(segments, element.key);
    if (segmentOrElement instanceof EdiSegment) {
      // Segment
      const segment = segments.filter(segment => segment.id === element.key)[0];
      if (!segment.elements) {
        return;
      }

      return segment.elements.map((element) => {
        return {
          key: element.getDesignator(),
        };
      });
    } else if (segmentOrElement instanceof EdiElement) {
      // Element
      const elementDesc = segmentOrElement.ediReleaseSchemaElement?.desc ?? "";
      const isDataElement = segmentOrElement.components && segmentOrElement.components.length > 0;

      if (!isDataElement) {
        return;
      }

      return segmentOrElement.components.map((element) => {
        return {
          key: element.getDesignator(),
        };
      });
    } else {
      return;
    }
  }

  getParent?(element: { key: string; }): vscode.ProviderResult<{ key: string; }> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(item: vscode.TreeItem, element: { key: string; }, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    return item;
  }

  private getSegmentOrElementByName(segments: EdiSegment[], name: string): EdiSegment | EdiElement | undefined {
    if (!name) {
      return;
    }

    if (this.isCompositeElement(name)) {
      const elementDesignator = name.substring(0, name.length - 2);
      const element = this.getSegmentOrElementByName(segments, elementDesignator) as EdiElement;
      const compositeElementIndex = parseInt(name.substring(name.length - 2, name.length)) - 1;
      return element.components[compositeElementIndex];
    } else if (this.isDataElement(name)) {
      const segmentNameLength = name.length - 2;
      const segmentName = name.substring(0, segmentNameLength);
      const elementIndex = parseInt(name.substring(segmentNameLength, segmentNameLength + 2)) - 1;
      const segment = this.getSegmentOrElementByName(segments, segmentName) as EdiSegment;
      return segment.elements[elementIndex];
    } else {
      return segments.filter(segment => segment.id === name)[0];
    }
  }

  private isDataElement(name: string): boolean {
    if (!name || this.isCompositeElement(name) || !TreeEdiProvider.elementDesignatorPattern.test(name)) {
      return false;
    }

    return name.length > 3; // T01 is segmentName
  }

  private isCompositeElement(name: string): boolean {
    if (!name || !TreeEdiProvider.compositeElementDesignatorPattern.test(name)) {
      return false;
    }


    return name.length > 5; // T0102
  }
  
  command(...args: any[]) {
    this.refresh();
  }

  public registerFunctions(): vscode.Disposable[] {
    return [
      vscode.window.createTreeView("edi-support-explorer", {
        treeDataProvider: this,
        showCollapseAll: true,
      }),
    ];
  }
}
