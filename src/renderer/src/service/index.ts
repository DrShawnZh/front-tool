const initEnv = () => {
  // @ts-ignore
  window.ipcRenderer.send("init-env");
};

export { initEnv };
