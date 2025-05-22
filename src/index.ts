#!/usr/bin/env node
import { terminal } from "terminal-kit"
import concurrently, { ConcurrentlyResult } from "concurrently"
import fs from "fs"

interface Module {
    name: string,
    enabled: boolean
    workingDir: string,
    command: string
}

terminal.on("key", (name: string) => {
    if (name === "CTRL_C") {
        if (workingModules) {
            workingModules.commands.forEach(command => {
                terminal("\n").red(`Killing ${command.name}...`)
                command.kill("SIGINT")
            })
        }
        terminal("\n").red("Exiting...")
        terminal.processExit(0)
    }
})

let fileModulesName = "stack-up.json"

let modules : Array<Module>

function clear() {
    terminal.reset().clear().bold().blue("stack-up").styleReset()
}

let workingModules: ConcurrentlyResult

export default function start() {
    if (process.argv.length > 2) {
        fileModulesName = process.argv[2]
    }
    if (!fs.existsSync(fileModulesName)) {
        terminal.red("File not found.")
        terminal.processExit(1)
        return
    }
    modules = JSON.parse(fs.readFileSync(fileModulesName, "utf-8")) as Module[]
    menu()
}

function menu() {
    clear()
    terminal("\n")
   
    const menuOptions = modules.map((module, i) => {
        return `${module.enabled ? "✅" : "❌"} ${module.name}`
    })
    menuOptions.push("🏃 Start")
    menuOptions.push("➡️ Exit")
    terminal.singleColumnMenu(menuOptions, (error, response) => {
        if (response.selectedIndex > modules.length) {
            terminal.processExit(0)
        }
        if (response.selectedIndex === modules.length) {
            terminal.reset().clear()
            workingModules = concurrently(modules.filter(module => module.enabled).map(module => {
                return {
                    command: module.command.replace("{{workingDir}}", module.workingDir),
                    name: module.name
                }
            }), {
                prefix: "name",
                killOthers: ["failure", "success"]
            })
            return
        }
        if (response.selectedIndex < menuOptions.length - 2) {
            modules[response.selectedIndex].enabled = !modules[response.selectedIndex].enabled
            menu()
        }
    })
}

start()