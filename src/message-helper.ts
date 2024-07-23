import { StatusBarAlignment, commands, window, workspace } from "vscode";
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

  // fetchNotice 定时器
  private messageTimer: NodeJS.Timeout | null = null;

  constructor() {
    const token = workspace
      .getConfiguration()
      .get("AtomGitHelper.setting.AccessToken") as string;
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
      this.atomgitNoticeBarItem.show();

      const result = await window.showErrorMessage("请填写 AccessToken 来获取 AtomGit 消息","配置");
      if (result === "配置") {
        // 打开插件配置页
        commands.executeCommand(
          "workbench.action.openSettings",
          "@ext:" + extensionId
        );
      }
      return;
    }

    this.fetchNotice();
    this.messageTimer = globalThis.setInterval(() => {
      this.fetchNotice();
    }, this.timeSpan);
  }

  public stopListen() {
    if (this.messageTimer) {
      globalThis.clearInterval(this.messageTimer);
    }
    this.atomgitNoticeBarItem.dispose();
  }

  private async fetchNotice() {
    try {
      const noticeCount = (await this.service?.getMessages()) || 0;
      this.atomgitNoticeBarItem.text = `AtomGit：${
        noticeCount > 99 ? "99+" : noticeCount
      }`;
      this.atomgitNoticeBarItem.command = "atomgit-helper.noticeLink";
      this.atomgitNoticeBarItem.tooltip = "点击查看 AtomGit 消息列表";
      this.atomgitNoticeBarItem.show();
    } catch (err) {
      console.error(err);
      window.showWarningMessage("消息获取失败，请检查 Access Token 是否正确");
      if (this.messageTimer) {
        globalThis.clearInterval(this.messageTimer);
      }
    }
  }
}
