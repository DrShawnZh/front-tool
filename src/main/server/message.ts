import { ipcMain } from "electron";
import InitEnv from "./init";
import Projects from "./projects";
import Common from "./common";
import Settings from "./setting";
import Git from "./git";
import { ProjectItemVo } from "./projects";

class InitListener {
  envClass: InitEnv;
  proClass: Projects;
  commonClass: Common;
  settingClass: Settings;
  gitClass: Git;
  constructor() {
    this.envClass = new InitEnv();
    this.proClass = new Projects();
    this.commonClass = new Common();
    this.gitClass = new Git();
    this.settingClass = new Settings();
    this.initEnvListener();
    this.initProjectsListener();
    this.commonListener();
    this.initSettingListener();
  }

  commonListener() {
    ipcMain.on("open-dir", async (event, path) => {
      await this.commonClass.openDir(path);
      event.returnValue = { success: true };
    });

    ipcMain.on("code-dir", async (event, path) => {
      await this.commonClass.codeDir(path);
      event.returnValue = { success: true };
    });

    ipcMain.on("choose-dir", async (event, filename) => {
      const res = await this.commonClass.chooseDir(filename);
      event.returnValue = res;
    });
  }

  initEnvListener() {
    ipcMain.on("init-env", async (event) => {
      const res = await this.envClass.initEnv();

      event.returnValue = {
        trunk: res.stdout,
        err: res.stderr,
        code: 200,
      };
    });

    ipcMain.on("get-node-version", async (event) => {
      const res = await this.envClass.getNodeV();
      event.returnValue = {
        trunk: res.stdout,
        err: res.err,
        code: 200,
      };
    });

    ipcMain.on("switch-node-v", async (event, v) => {
      const res = await this.envClass.switchNV(v);
      event.returnValue = {
        success: res,
        code: 200,
      };
    });

    ipcMain.on("delete-node-v", async (event, v) => {
      const res = await this.envClass.deleteNode(v);
      event.returnValue = {
        success: res,
        code: 200,
      };
    });

    // ipcMain.on('test-npm-install', async (event) => {
    //   this.envClass.testNpmi();
    // })
  }

  initProjectsListener() {
    ipcMain.on("get-projects-list", async (event) => {
      const res = this.proClass.getProjectList();
      event.returnValue = res;
    });

    ipcMain.on("add-project", async (event, data: ProjectItemVo) => {
      console.log("add project", data);
      await this.proClass.insertProject({
        ...data,
        projectPath: data.projectPath + "/" + data.fileName,
      });
      if (data.local === "1") {
        event.sender.send("install-and-run-reply", {
          finished: true,
        });
        return;
      }
      await this.gitClass.gitClone(data.gitPath, { cwd: data.projectPath });
      event.sender.send("install-and-run-reply", {
        install: 0,
        run: 0,
        added: 2,
        finished: data.install === "2" && data.run === "2",
      });
      if (data.install === "1") {
        event.sender.send("install-and-run-reply", {
          install: 1,
          run: 0,
          added: 2,
        });
        await this.commonClass.command("npm install", {
          cwd: data.projectPath + "/" + data.fileName,
        });
        event.sender.send("install-and-run-reply", {
          install: 2,
          run: 0,
          added: 2,
          finished: data.run === "2",
        });
      }
      if (data.run === "1") {
        event.sender.send("install-and-run-reply", {
          install: 2,
          run: 1,
          added: 2,
        });
        await this.commonClass.command(data.run, {
          cwd: data.projectPath + "/" + data.fileName,
        });
        event.sender.send("install-and-run-reply", {
          install: 2,
          run: 2,
          added: 2,
          finished: true,
        });
      }
    });

    ipcMain.on("delete-project", async (event, id) => {
      const res = this.proClass.deleteProject(id);
      event.returnValue = { success: true };
    });
  }

  initSettingListener() {
    ipcMain.on("get-settings", async (event) => {
      const res = await this.settingClass.getSettings();
      event.returnValue = res;
    });
    ipcMain.on("save-settings", async (event, data) => {
      console.log(data, "message");
      const res = await this.settingClass.setSettings(data);
      event.returnValue = { success: true };
    });
  }
}

export default InitListener;
