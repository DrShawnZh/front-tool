import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import InitListener from "./server/message";
// import ProjectsListener from "./server/projects";
import DB from "./server/data";

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      // contextIsolation: true,
      preload: path.resolve(__dirname, "./preload.js"),
    },
  });
  win.loadURL("http://localhost:8084")
  // win.loadFile(path.resolve(__dirname, '../render/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  new InitListener();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

export { win };
