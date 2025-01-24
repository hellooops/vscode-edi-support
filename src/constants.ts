export namespace nativeCommands {
  export const revealLine = "revealLine";
  export const focusFirstEditorGroup = "workbench.action.focusFirstEditorGroup";
  export const open = "vscode.open";
}

export namespace commands {
  export const minifyDocumentCommand = {
    name: "edi-support.minify",
    label: "Minify"
  };
  export const prettifyDocumentCommand = {
    name: "edi-support.prettify",
    label: "Prettify"
  };
  export const selectTextByPositionCommand = {
    name: "edi-support.selectTextByPosition",
    label: "Select Text By Position"
  };
  export const toggleInlayHintsCommand = {
    name: "edi-support.toggleInlayHints",
    label: "Inlay hints"
  };
  export const toggleLoopAnnotationsCommand = {
    name: "edi-support.toggleLoopAnnotationsCommand",
    label: "Loop annotations"
  };
  export const toggleIndentSegmentsInLoopCommand = {
    name: "edi-support.toggleIndentSegmentsInLoopCommand",
    label: "Segment indent"
  };
  export const previewDocumentCommand = {
    name: "edi-support.preview",
    label: "Preview"
  };
}

export namespace ediDocument {
  export const lineBreak = "\n";
  export const x12 = {
    name: "x12",
    segment: {
      ISA: "ISA",
      ST: "ST",
      GS: "GS",
      GE: "GE",
      IEA: "IEA",
    },
    defaultSeparators: {
      segmentSeparator: "~",
      dataElementSeparator: "*",
      componentElementSeparator: ":",
    }
  };
  export const edifact = {
    name: "edifact",
    segment: {
      UNA: "UNA",
      UNB: "UNB",
      UNH: "UNH",
      UNZ: "UNZ",
      UNT: "UNT",
    },
    defaultSeparators: {
      segmentSeparator: "'",
      dataElementSeparator: "+",
      componentElementSeparator: ":",
      releaseCharacter: "?"
    }
  };
  export const vda = {
    name: "vda",
    segment: {
      segment_511: "511",
      segment_711: "711",
    },
  };
}

export namespace configuration {
  export const ediSupport = "ediSupport";
  export const inlayHints = {
    segmentNames: "inlayHints.segmentNames",
  };
  export const enableCodelens = "enableCodelens";
  export const enableLoopAnnotations = "enableLoopAnnotations";
  export const formatting = {
    indentSegmentsInLoop: "formatting.indentSegmentsInLoop",
  };
  export const enableHover = "enableHover";
  export const enableTrailingAnnotations = "enableTrailingAnnotations";
}

export namespace colors {
  export const trailingLineForegroundColor = "ediSupport.trailingLineForegroundColor";
}

export namespace diagnostic {
  export const diagnosticCollectionId = "ediDiagnostics";
}

export namespace explorers {
  export const treeExplorerId = "edi-support-explorer";
  export const refreshEdiExplorer = "edi-support.refreshEdiExplorer";
}

export namespace webviews {
  export const previewViewType = "edi-support-preview";
}

export namespace errors {
  export const methodNotImplemented = "Method not implemented.";
  export const ediSupportError = "EDI Support Error";
  export const importSchemaError = "Failed to import schema {0}";
  export const schemaFileNotFound = "Schema file {0} not found";
}

export namespace common {
  export const kasoftware = {
    name: "kasoftware",
    url: "https://www.kasoftware.com",
    allRightsReserved: "知行软件 (www.kasoftware.com) All rights reserved",
    schemaViewer: {
      url: "https://www.kasoftware.com/schema/"
    }
  };
}

export namespace themeIcons {
  export const symbolParameter = "symbol-parameter";
  export const recordSmall = "record-small";
  export const mention = "mention";
  export const symbolNumber = "symbol-number";
  export const outputViewIcon = "output-view-icon";
  export const openEditorsViewIcon = "open-editors-view-icon";
  export const notebookOpenAsText = "notebook-open-as-text";
}
