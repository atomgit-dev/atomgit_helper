English | [简体中文](./README_CN.md)

# atomgit-helper extension

## Features

Atomgit helper is a VSCode extension for git supporter, provided by [Atomgit]（ <https://atomgit.com> ）, it has the following features at present:

- [git commit emoji](#git-commit-emoji)
- [AtomGit Message](#atomgit-message)

## git commit emoji

In the git commit message, add an emoji to highlight the content of this commit, it can also be used to standardize the commit record:

![features](resources/demo/atomgit-helper-demo.gif)

After pushing to the repository, the commit effect is as follows:

![commit-emoji](resources/demo/commit_emoji.png)

In the emoji list, you can filter based on the commit type or commit description to quickly select the emoji you need.

The commit types corresponding to the emojis currently are based on the [Angular team specification](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type), and i add some more emojis to this.

### Use emojis in commit

You can use emojis in commit messages in the following format:

```bash
<intention> [scope?][:?] <message>
```

- `intention`: An emoji from the list.
- `scope`: An optional string that adds contextual information for the scope of the change.
- `message`: A brief explanation of the change.

### Mode switch

This extension offered three modes for commit emoji prefix ：

| mode        | demo    |  is Default  |
| --------   | :----:  | :----: |
| emoji      | `✨ some features` |   true    |
| shortname  | `:sparkles: some features` |   false   |
| emoji_with_type        | `✨ feat: some features` |   false   |

You can switch modes by holding down the Alt key and click on the corresponding icon in the UI interface, or by entering 'emoji format' in the command panel.

> command panel ：
> windows ：Ctrl+Shift+P
> Mac：Command + Shift + P

## AtomGit Message

The extension will periodically retrieve AtomGit unread messages and display them in the bottom status bar:

![message_bar](resources/demo/message_bar.png)

You can click on the status bar to jump to the message page.

### Settings

You can configure the following options in the extension settings (Setting - Search AtomGitHelper):

- enable/disable message retrieval
- Personal Access Token：if Personal Access Token is not configured or has a wrong scope, the extension is unable to get message status; visit [AtomGit PAT](https://docs.atomgit.com/user/pats) for more information.

> When generating a Personal Access Token, the scope should include 'user'

- Message acquisition frequency

![message_setting](resources/demo/message_setting.png)

## Download

Search for 'atomgit helper' in VSCode Extensions to find this plugin.

## 开发

Recommended node version >= 16

- Install global dependencies

```bash
npm install -g yo generator-code yarn
```

- Install project dependencies

```bash
yarn install
```

- Debugger：Press `F5` to start debugger

## issues

You can issue us [here](https://github.com/atomgit-dev/atomgit_helper/issues).
