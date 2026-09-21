import type { TIdleJob } from "@/types/space";

const urgent: TIdleJob[] = [];
const later: TIdleJob[] = [];
let scheduled = false;

function runSlice(): void {
  scheduled = false;
  const job = urgent.shift() ?? later.shift();
  if (job) {
    job();
  }
  if (urgent.length > 0 || later.length > 0) {
    schedule();
  }
}

function schedule(): void {
  if (scheduled) {
    return;
  }
  scheduled = true;
  const idle = window.requestIdleCallback;
  if (typeof idle === "function") {
    idle(() => runSlice(), { timeout: 80 });
    return;
  }
  window.setTimeout(runSlice, 24);
}

export function enqueueIdle(job: TIdleJob): void {
  later.push(job);
  schedule();
}

export function enqueueIdleSoon(job: TIdleJob): void {
  urgent.push(job);
  schedule();
}
