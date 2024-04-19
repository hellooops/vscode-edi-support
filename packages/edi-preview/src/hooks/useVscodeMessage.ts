import { onMounted, onUnmounted } from "vue";


type MessageEventCallback = (data: Vcm["data"]) => void;

function useEvent(eventName: string, func: (event: any) => void) {
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

  function onReceiveMessage(vcmName: string, callback: MessageEventCallback) {
    useEvent("message", (event) => {
      const vcm = event.data as Vcm;
      if (vcmName === vcm.name) {
        callback && callback(vcm.data);
      }
    });
  }

  return {
    vscodeLog,
    onReceiveMessage
  };
}