const { app, BrowserWindow, ipcMain } = require("electron");
const { createMainWindow } = require("./window");
const input = require("./input");
const FileContext = require("./fileContext");

let mainWindow = null;

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate-with-no-open-windows", function () {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", function () {
  //Process input from command line arguments on init
  let fileContext = new FileContext(input.getInitPath());
  console.log(fileContext); //Print fileContext

  mainWindow = createMainWindow();

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("file-context-data", fileContext);
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.openDevTools();
  }
});
