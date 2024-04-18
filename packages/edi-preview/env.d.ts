/// <reference types="vite/client" />

type VSCodeMessage = {
  name: string;
  data: any;
}

type VSCode = {
  postMessage(message: VSCodeMessage): void;
  getState(): any;
  setState(state: any): void;
};

declare const vscode: VSCode;


