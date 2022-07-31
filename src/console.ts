import { watch } from "vue";
import { useStore } from "./store";

const store = useStore();

export default function () {
  if (import.meta.env.MODE !== "development")
    (($console: Console) => {

      function log(level: console_type, ...args: unknown[]) {
        const arg = args
          .map((e) => (typeof e === "object" ? JSON.stringify(e) : e))
          .join(" ");
        $console[level](arg);
        store.logs.unshift({
          level,
          time: timeline(),
          text: arg,
        });
      }

      const dev = {
        ...$console,
        debug(...args: unknown[]) {
          log("debug", ...args);
        },
        info(...args: unknown[]) {
          log("info", ...args);
        },
        log(...args: unknown[]) {
          log("log", ...args);
        },
        warn(...args: unknown[]) {
          log("warn", ...args);
        },
        error(...args: unknown[]) {
          log("error", ...args);
        },
        clear() {
          store.logs = [];
          $console.clear();
        },
      };

      watch(
        () => store.props["menu/dev_tools"],
        (v) => watchFn(v as boolean),
        { immediate: true }
      );

      function watchFn(v: boolean) {
        if (v) {
          window.console = dev;
          console.debug("[開發者模式] 正在紀錄中");
        } else {
          console.clear();
          window.console = $console;
        }
      }
      
    })(window.console);
}

//生成時間戳
function timeline() {
  const time = new Date();
  const fixed = (num: number, pad = 2): string =>
    num.toString().padStart(pad, "0");
  return `${fixed(time.getHours())}:${fixed(time.getMinutes())}:${fixed(
    time.getSeconds()
  )}:${fixed(time.getMilliseconds(), 3)}`;
}

type console_type = "debug" | "info" | "log" | "warn" | "error";