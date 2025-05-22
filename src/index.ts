#!/usr/bin/env node
import { terminal } from "terminal-kit";
import concurrently, { ConcurrentlyResult } from "concurrently";
import fs from "fs";

interface Module {
  name: string;
  enabled: boolean;
  workingDir: string;
  command: string;
}

terminal.on("key", (name: string) => {
  if (name === "CTRL_C") {
    if (workingModules) {
      workingModules.commands.forEach((command) => {
        terminal("\n").red(`Killing ${command.name}...`);
        command.kill("SIGINT");
      });
    }
    terminal("\n").red("Exiting...");
    terminal.processExit(0);
  }
});

let fileModulesName = "stack-up.json";

let modules: Array<Module>;

function clear() {
  terminal.reset().clear().bold().blue("stack-up").styleReset();
}

let workingModules: ConcurrentlyResult;

export default function start() {
  let directStart:Boolean = false;
  // Check argv if have --direct or -d
  if (process.argv.includes("--direct") || process.argv.includes("-d")) {
    directStart = true;
    // remove --direct or -d from argv
    process.argv = process.argv.filter((arg) => arg !== "--direct" && arg !== "-d");
  }
  // Check argv not start with - or -- and have more than 2 args
  if (
    process.argv.length > 2 &&
    !process.argv[2].startsWith("-") &&
    !process.argv[2].startsWith("--")
  ) {
    fileModulesName = process.argv[2];
  }
  // Check if fileModulesName is a valid file
  if (!fs.existsSync(fileModulesName)) {
    terminal.red("File not found.");
    terminal.processExit(1);
    return;
  }
  modules = JSON.parse(fs.readFileSync(fileModulesName, "utf-8")) as Module[];
  if (directStart) {
    workingModules = startModules();
  } else {
    menu();
  }
}

function startModules() {
  return concurrently(
    modules
      .filter((module) => module.enabled)
      .map((module) => {
        return {
          command: module.command.replace("{{workingDir}}", module.workingDir),
          name: module.name,
        };
      }),
    {
      prefix: "name",
      killOthers: ["failure", "success"],
    }
  );
}

function menu() {
  clear();
  terminal("\n");

  const menuOptions = modules.map((module, i) => {
    return `${module.enabled ? "✅" : "❌"} ${module.name}`;
  });
  menuOptions.push("🏃 Start");
  menuOptions.push("➡️ Exit");
  terminal.singleColumnMenu(menuOptions, (error, response) => {
    if (response.selectedIndex > modules.length) {
      terminal.processExit(0);
    }
    if (response.selectedIndex === modules.length) {
      terminal.reset().clear();
      workingModules = startModules();
      return;
    }
    if (response.selectedIndex < menuOptions.length - 2) {
      modules[response.selectedIndex].enabled =
        !modules[response.selectedIndex].enabled;
      menu();
    }
  });
}

start();
