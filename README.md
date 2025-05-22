# Stack-up

Stack-up is a simple tool written in JavaScript that allows you to run multiple programs concurrently in the terminal. It is designed to be configurable through a json file, enabling you to specify the programs you want to run, their working directories, and commands.
## Using with npx
You can use stack-up without installing it globally by using npx:
```bash
npx @fneira/stack-up modules.json
```
This will download the latest version of stack-up and run it with the specified module.json file.
## Installing globally
You can also install stack-up globally to use it as a command line tool:
```bash
npm install -g @fneira/stack-up
```
After installing it globally, you can run stack-up from any directory:
```bash
stack-up stack-up.json
```
## Installation

Before using stack-up, ensure you have Node.js installed on your system. You can download it here.
1. Clone this repository:
```bash
git clone https://github.com/Bubexel/stack-up.git
```
Navigate to the project directory:
```bash
cd stack-up
```
Install dependencies:
```bash
npm install
```
## Configuration
To use stack-up, you'll need to create a stack-up.json file or name you wish. This file will contain an array of objects, each representing a program you want to run concurrently. Here's an example of json file:
```json
[
    {
        "name": "My program",
        "enabled": true,
        "workingDir": "/home/user/myprogram/",
        "command": "npm run --prefix {{workingDir}} start"
    },
    {
        "name": "Another program",
        "enabled": true,
        "workingDir": "/path/to/another/program/",
        "command": "cd {{workingDir}} && node index.js"
    }
]
```
- name: A descriptive name for your program.
- enabled: Set to true to enable the program to run as default option, or false to disable it.
- workingDir: The working directory where the program should be executed from.
- command: The command to run the program. Use {{workingDir}} as a placeholder for the orkingDir.

You can add as many objects as needed to run multiple programs concurrently.
## Usage
Once you have your stack-up.json file configured, you can run stack-up:
```bash
npm start my-stack-up-file.json
```
This will start all the programs specified in the stack-up.json file concurrently in the same terminal window using the concurrently library.

### Running with --direct or -d

You can use the `--direct` or `-d` flag to execute the enabled programs immediately, without showing the interactive menu. This runs all enabled commands from your configuration file right away, skipping any prompts.

Example:
```bash
stack-up stack-up.json --direct
```
or
```bash
stack-up stack-up.json -d
```
## Author
- Ferran Neira
## License
This project is licensed under the MIT License - see the LICENSE file for details.