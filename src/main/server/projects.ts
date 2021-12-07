import child_process from "child_process";
import DB from "./data";
import { nanoid } from "nanoid";
import { dialog } from "electron";
import { options } from "../constant";

interface ExecTypeVo {
  err: any;
  stdout: string;
  stderr: string;
}

export interface ProjectItemVo {
  projectName: string;
  projectPath: string;
  gitPath: string;
  desc?: string;
  id?: string;
  install?: string; // 1是 2否
  run?: string; // 1是 2否
  fileName?: string;
  local?: string;
  [k: string]: any;
}

export default class Projects {
  constructor() {}

  initEnv(): Promise<ExecTypeVo> {
    return new Promise((resolve) => {
      child_process.exec("node -v", (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      });
    });
  }

  getProjectList() {
    return DB.get("projects").value();
  }

  insertProject(data: ProjectItemVo) {
    return DB.get("projects")
      .push({ ...data, id: nanoid(10) })
      .write();
  }

  deleteProject(id: string) {
    return DB.get("projects").remove({ id }).write();
  }
}
