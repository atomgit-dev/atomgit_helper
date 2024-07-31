import { MarkdownString, StatusBarAlignment, commands, window, workspace } from "vscode";
import { defaultTimeSpan, extensionId } from './constant';
import { Service } from "./service";

export class MessageHelper {
  private atomgitNoticeBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left,
    10
  );

  private hasToken: boolean = false;

  // 消息获取间隔
  private timeSpan: number;

  // axios 实例
  private service: Service | null = null;

  // fetchNotification 定时器
  private notifyTimer: NodeJS.Timeout | null = null;

  constructor() {
    const token = workspace
      .getConfiguration()
      .get("AtomGitHelper.setting.PersonalAccessToken") as string;
    // 默认 5 分钟获取一次
    this.timeSpan =
      (workspace.getConfiguration().get("AtomGitHelper.setting.noticeInterval") as number) *
        60 *
        1000 || defaultTimeSpan * 60 * 1000;

      if (!token) {return;}

    this.hasToken = true;

    this.service = new Service(token);
  }

  public async startListen() {
    if(!this.hasToken){
      this.atomgitNoticeBarItem.text = "未配置Token";
      const tooltip = new MarkdownString('', true);
      tooltip.supportHtml = true;
      tooltip.isTrusted = true;
      tooltip.appendMarkdown(`[点击](command:workbench.action.openSettings?%22@ext:${extensionId}%22 "配置个人访问令牌")前往配置`);
      this.atomgitNoticeBarItem.tooltip = tooltip;
      this.atomgitNoticeBarItem.show();

      const result = await window.showErrorMessage("请填写 Personal Access Token 来获取 AtomGit 消息","配置");
      if (result === "配置") {
        // 打开插件配置页
        commands.executeCommand(
          "workbench.action.openSettings",
          "@ext:" + extensionId
        );
      }
      return;
    }

    this.fetchNotification();
    this.notifyTimer = globalThis.setInterval(() => {
      this.fetchNotification();
    }, this.timeSpan);
  }

  public stopListen() {
    if (this.notifyTimer) {
      globalThis.clearInterval(this.notifyTimer);
    }
    this.atomgitNoticeBarItem.dispose();
  }

  private async fetchNotification() {
    try {
      const notifyCount = (await this.service?.getAll()) || 0;
      this.atomgitNoticeBarItem.text = `AtomGit：${
        notifyCount > 99 ? "99+" : notifyCount
      }`;
      this.atomgitNoticeBarItem.command = "atomgit-helper.noticeLink";
      this.atomgitNoticeBarItem.tooltip = "点击查看 AtomGit 消息列表";
      this.atomgitNoticeBarItem.show();
    } catch (err) {
      console.error(err);
      window.showWarningMessage("消息获取失败，请检查 Personal Access Token 是否正确");
      if (this.notifyTimer) {
        globalThis.clearInterval(this.notifyTimer);
      }
    }
  }

}
