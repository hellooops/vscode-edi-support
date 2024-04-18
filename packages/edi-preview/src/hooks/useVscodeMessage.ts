import { onMounted, onUnmounted } from "vue";


type RefreshCallback = (data: VcmMessage["data"]) => void;

function useEvent(eventName: string, func: any) {
  let eventListener: any;
  onMounted(() => {
    eventListener = window.addEventListener(eventName, func);
  });
  onUnmounted(() => {
    eventListener && window.removeEventListener(eventName, eventListener);
  });
}

export default function useVcm() {
  function vscodeLog(message: string) {
    vscode.postMessage({
      name: "log",
      data: message
    });
  }

  function onRefresh(callback: RefreshCallback) {
    useEvent("message", (event: any) => {
      const vscodeMessage = event.data as VcmMessage;
      callback(vscodeMessage.data);
    });
  }

  return {
    vscodeLog,
    onRefresh
  };
}