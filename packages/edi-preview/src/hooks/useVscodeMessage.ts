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
  function postMessage(name: string, data?: Vcm["data"]) {
    vscode.postMessage({
      name,
      data
    });
  }

  function vscodeLog(message: string) {
    postMessage("log", message);
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
    postMessage,
    vscodeLog,
    onReceiveMessage
  };
}
