import { onMounted, onUnmounted } from "vue";


type FileChangeCallback = (data: VSCodeMessageFileChange["data"]) => void;

function useEvent(eventName: string, func: any) {
  let eventListener: any;
  onMounted(() => {
    eventListener = window.addEventListener(eventName, func);
  });
  onUnmounted(() => {
    eventListener && window.removeEventListener(eventName, eventListener);
  });
}

export default function useVscodeMessage() {
  function vscodeLog(message: string) {
    vscode.postMessage({
      name: "log",
      data: message
    });
  }

  function onFileChange(callback: FileChangeCallback) {
    useEvent("message", (event: any) => {
      const vscodeMessage = event.data as VSCodeMessageFileChange;
      callback(vscodeMessage.data);
    });
  }

  return {
    vscodeLog,
    onFileChange
  };
}