import child_process from "child_process";
import { nanoid } from "nanoid";
import { options } from "../constant";

export default class GitHandle {
  options: any;
  constructor() {
    this.options = options;
  }

  gitClone(git: string, options = {}) {
    return new Promise((resolve) => {
      child_process.exec(
        `git clone ${git}`,
        { ...this.options, ...options },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });
  }
}
