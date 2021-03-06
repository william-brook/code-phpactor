import { commands, Disposable, window, workspace } from "vscode";
import { transformFile } from "../phpactor/phpactor";
import { handleResponse } from "../phpactor/response-handler";

async function handle() {
    const editor = window.activeTextEditor;
    const workspaces = workspace.workspaceFolders;
    if (editor === undefined || workspaces === undefined) {
        return;
    }
    const workingDirs = workspaces.filter(
        (wf) => editor.document.uri.toString().startsWith(wf.uri.toString())
    );
    if (workingDirs.length === 0) {
        return;
    }
    const workingDir = workingDirs[0];
    const phpactorPath = workspace.getConfiguration("phpactor").get("phpactorExecutablePath");
    if (typeof phpactorPath !== "string") {
        return;
    }
    const resp = await transformFile(
        phpactorPath,
        workingDir.uri.fsPath,
        editor.document.getText(),
        editor.document.uri.fsPath
    );
    await handleResponse(resp.action, resp.parameters);
}

export function register(): Disposable {
    return commands.registerCommand("extension.phpactorClassInflect", () => {
        handle();
    });
}