/// <reference types="vite/client" />

type VSCode = {
  postMessage(message: VSCodeMessage): void;
  getState(): any;
  setState(state: any): void;
};

declare const vscode: VSCode;
