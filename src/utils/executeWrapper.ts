import * as vscode from "vscode";

import * as ChildProcess from "child_process";

export interface Output {
    stdout: string;
    stderr: string;
}

export const executeCommand = async (command: string, args: string[]): Promise<Output> => {
    const child = ChildProcess.spawn(command, args);
    let data = "";
    for await (const chunk of child.stdout) {
        data += chunk;
    }
    let error = "";
    for await (const chunk of child.stderr) {
        error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
        child.on('close', resolve);
    });

    return {
        stdout: data,
        stderr: error,
    };
};
