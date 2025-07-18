import type { ChildProcessWithoutNullStreams } from "node:child_process";

export class ProcessError extends Error {
  constructor(args: readonly string[], code: number | null, output: string) {
    let message = "Process failed";
    if (code !== null) message += ` (${code.toString()})`;
    message += `: ${args.join(" ")}`;

    const trimmedOutput = output.trim();
    if (trimmedOutput !== "") message += `\n${trimmedOutput}`;

    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export async function waitProcess(
  proc: ChildProcessWithoutNullStreams,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    proc.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    proc.stderr.on("data", (chunk: Buffer) => chunks.push(chunk));

    proc.on("error", reject);
    proc.stdin.on("error", reject);
    proc.stdout.on("error", reject);
    proc.stderr.on("error", reject);

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const output = Buffer.concat(chunks).toString();
        reject(new ProcessError(proc.spawnargs, code, output));
      }
    });
  });
}
