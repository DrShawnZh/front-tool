import child_process from "child_process";
import DB from "./data";
import { nanoid } from "nanoid";
import { write } from "fs";

interface ExecTypeVo {
  err: any;
  stdout: string;
  stderr: string;
}

export default class Settings {
  constructor() {}

  initEnv(): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec("node -v", (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      });
    });
  }

  getSettings() {
    return DB.get("settings").value();
  }

  setSettings(data) {
    const settings = DB.get("settings").value();
    console.log(data, settings);
    return DB.set("settings", { ...settings, ...data }).write();
  }
}
