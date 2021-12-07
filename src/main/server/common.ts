import child_process from "child_process";
import { shell, dialog } from "electron";
import DB from "./data";
import { nanoid } from "nanoid";
import { options } from "../constant";

interface ExecTypeVo {
  err: any;
  stdout: Buffer | string;
  stderr: Buffer | string;
}

export default class Common {
  options: any;
  constructor() {
    this.options = options;
  }

  openDir(path) {
    shell.openPath(path);
    // return new Promise((resolve) => {
    //   child_process.exec(`open ${path}`, (err, stdout, stderr) => {
    //     resolve(null);
    //   });
    // });
  }

  cdDir(path): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec(`cd ${path}`, (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      });
    });
  }

  codeDir(path): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec(
        `code ${path}`,
        { ...this.options },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });
  }

  command(command: string, option = {}): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec(
        `${command}`,
        { ...this.options, ...option },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });
  }

  async chooseDir(name: string) {
    return new Promise((resolve) => {
      dialog
        .showSaveDialog({
          filters: [{ name: "All", extensions: ["*"] }],
        })
        .then((res) => resolve(res));
    });
  }
}
