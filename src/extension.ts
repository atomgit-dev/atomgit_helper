// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { displayMethod, emojiList } from "./emoji";
import type { GitExtension, Repository } from "./git";
import { MessageHelper } from "./message-helper";

/**
 * 获取 Git Extension 实例
 * @returns Git Extension API
 */
function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;
  // https://github.com/microsoft/vscode/blob/main/extensions/git/README.md
  return gitExtension && gitExtension.getAPI(1);
}

/**
 * add emoji prefix to git commit message
 * @param repository 仓库信息
 * @param prefix 前缀
 */
function addCommitPrefix(repository: Repository, prefix: string) {
  repository.inputBox.value = `${prefix}${repository.inputBox.value}`;
}

function commitPrefixQuickPickOptions(type = "") {
  return {
    matchOnDescription: true,
    matchOnDetail: true,
    ignoreFocusOut: true,
    placeHolder: `Search Type - ${type}`,
  };
}

let messageHelper: MessageHelper | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log(
  //   'Congratulations, your extension is now active!'
  // );

  const handleEmojiPick = (uri: any) => {
    // 需要安装了 git 插件
    const git = getGitExtension();
    if (!git) {
      vscode.window.showErrorMessage("unable to load Git Extension");
      return;
    }
    // 根据用户设置，选择不同的 emoji 列表展示方式
    const method_key = context.globalState.get("displayMethod", "use emoji");
    let items = emojiList.map(displayMethod[method_key]);

    // 显示选项列表，提示用户选择
    vscode.window
      .showQuickPick(items, commitPrefixQuickPickOptions(method_key))
      .then(function (selected) {
        if (selected) {
          // 这条命令，是打开 git 插件的 scm 视图(source control)
          vscode.commands.executeCommand("workbench.view.scm");
          if (uri) {
            let selectedRepository = git.repositories.find((repository) => {
              const uriRoot = uri._rootUri ? uri._rootUri : uri.rootUri;
              return repository.rootUri.path === uriRoot?.path;
            });
            if (selectedRepository) {
              addCommitPrefix(selectedRepository, selected.emoji);
              vscode.commands.executeCommand("workbench.scm.focus");
            }
          } else {
            // 如果有多个 git 仓库打开了，全部执行添加前缀
            for (const repo of git.repositories) {
              addCommitPrefix(repo, selected.emoji);
            }
          }
        }
      });
  };

  // 监听配置变化
  const watchConfig = vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      [
        "GitEmojiAtomGit.setting.noticeToggle",
        "GitEmojiAtomGit.setting.AccessToken",
        "GitEmojiAtomGit.setting.noticeInterval",
      ].some((str) => event.affectsConfiguration(str))
    ) {
      updateMessageHelper();
    }
  });

  async function updateMessageHelper() {
    const atomgitNoticeStatus = vscode.workspace
      .getConfiguration()
      .get("GitEmojiAtomGit.setting.noticeToggle") as boolean;

    if (messageHelper) {
      messageHelper.stopListen();
    }

    if (atomgitNoticeStatus) {
      messageHelper = new MessageHelper();
      messageHelper.startListen();
      // vscode.window.showInformationMessage("已启用 AtomGit 消息助手");
    } else {
      const result = await vscode.window.showInformationMessage(
        "AtomGit 消息助手已关闭，如需开启请点击开启按钮",
        "开启"
      );
      if (result === "开启") {
        // 打开插件配置页
        const extensionId = "atomgit.git-emoji-atomgit";
        vscode.commands.executeCommand(
          "workbench.action.openSettings",
          "@ext:" + extensionId
        );
        vscode.window.showInformationMessage("请勾选是否开启AtomGit 消息助手");
      }
    }
  }

  updateMessageHelper();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const fetchNotice = vscode.commands.registerCommand(
    "git-emoji-atomgit.fetchNotice",
    () => {
      updateMessageHelper();
    }
  );

  const noticeLink = vscode.commands.registerCommand(
    "git-emoji-atomgit.noticeLink",
    () => {
      vscode.env.openExternal(
        vscode.Uri.parse("https://atomgit.com/-/profile/notice/announce")
      );
    }
  );

  const gitEmoji = vscode.commands.registerCommand(
    "git-emoji-atomgit.gitEmoji",
    (uri?) => {
      handleEmojiPick(uri);
    }
  );

  const emojiFormatSwitch = vscode.commands.registerCommand(
    "git-emoji-atomgit.emojiFormatSwitch",
    (uri?) => {
      const items = [];
      for (const key in displayMethod) {
        items.push(key);
      }
      vscode.window
        .showQuickPick(items, { placeHolder: "Select Prefix Method" })
        .then((res) => {
          context.globalState.update("displayMethod", res);
        })
        .then(() => {
          handleEmojiPick(uri);
        });
    }
  );

context.subscriptions.push(...[watchConfig, fetchNotice, noticeLink, gitEmoji, emojiFormatSwitch]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
