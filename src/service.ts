import axios, { AxiosInstance } from "axios";
import { API_MAX_RETRY, ATOMGIT_API_BASE_URL } from './constant';

export class Service {
  private request: AxiosInstance;
  private notifyFailCount = 0;

  constructor(token: string) {
    this.request = axios.create({
      baseURL: ATOMGIT_API_BASE_URL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // AtomGit OpenAPI 文档详见 https://docs.atomgit.com/openAPI/api_versioned/remind-page-list
  private getInfos() {
    const url = "/notifications/threads";
    return this.request.get(url, {
      params: {
        unread: true,
        page: 1,
      },
    });
  }

  private getPrivateMessages() {
    const url = "/notifications/messages";
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const since = threeDaysAgo.toISOString();
    return this.request.get(url, {
      params: {
        unread: true,
        page: 1,
        since,
      },
    });
  }

  public async getAll(): Promise<number | undefined> {
    try {
      const [info, message] = await Promise.all([
        this.getInfos(),
        this.getPrivateMessages(),
      ]);

      const {
        data: { total: infoCount = 0 },
      } = info;
      const {
        data: { total: messageCount = 0 },
      } = message;
      this.notifyFailCount = 0;
      return infoCount + messageCount;
    } catch (error) {
      this.notifyFailCount++;
      const {
        response: {
          data: { error: errMsg, error_description },
        },
      } = error as any;
      const errMessage = error_description || errMsg;
      console.error("request error: ", errMessage);
      // 失败三次就不再刷新
      if (this.notifyFailCount === API_MAX_RETRY) {
        throw new Error("AtomGit 通知获取失败");
      }
      return undefined;
    }
  }
}
