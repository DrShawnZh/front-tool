import child_process from "child_process";
import { options } from "../constant";

interface ExecTypeVo {
  err: any;
  stdout: string | Buffer;
  stderr: string | Buffer;
}

export default class InitEnv {
  options: any;
  constructor() {
    this.options = options;
  }

  async initEnv(): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec(
        "node -v",
        // @ts-ignore
        { ...this.options },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });
  }

  async getNodeV(): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      // @ts-ignore
      child_process.exec("n ls", { ...this.options }, (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      });
    });
  }

  async switchNV(v: string): Promise<Boolean> {
    if (!v) return;
    await new Promise((resolve) => {
      child_process.exec(
        `n ${v}`,
        { ...this.options },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });
    const res = await this.initEnv();
    console.log(res, v);
    return res.stdout.slice(0, -1) === `v${v}`;
  }

  async deleteNode(v: string): Promise<Boolean> {
    if (!v) return;
    return new Promise((resolve) => {
      child_process.exec(
        `n rm ${v}`,
        { ...this.options },
        (err, stdout, stderr) => {
          resolve(true);
        }
      );
    });
  }

  async testNpmi() {
    const build = child_process.exec("npm i dayjs");
    build.stdout.on("data", (data) => {
      console.log("stdout: ", data);
    });
  }
}
