# Stack-up

Stack-up is a simple tool written in JavaScript that allows you to run multiple programs concurrently in the terminal. It is designed to be configurable through a json file, enabling you to specify the programs you want to run, their working directories, and commands.
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
To use stack-up, you'll need to create a module.json file in the root directory of your project. This file will contain an array of objects, each representing a program you want to run concurrently. Here's an example of json file:
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
        "command": "node index.js"
    }
]
```
- name: A descriptive name for your program.
- enabled: Set to true to enable the program to run as default option, or false to disable it.
- workingDir: The working directory where the program should be executed from.
- command: The command to run the program. Use {{workingDir}} as a placeholder for the orkingDir.

You can add as many objects as needed to run multiple programs concurrently.
## Usage
Once you have your module.json file configured, you can run stack-up:
```bash
npm start modules.json
```
This will start all the programs specified in the module.json file concurrently in separate terminal windows using the terminal-kit library.
## Author
- Bubexel
## License
This project is licensed under the MIT License - see the LICENSE file for details.