/// <reference types="vite/client" />

type VSCode = {
  postMessage(message: Vcm): void;
  getState(): any;
  setState(state: any): void;
};

declare const vscode: VSCode;
