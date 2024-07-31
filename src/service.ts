import axios, { AxiosInstance } from "axios";

// AtomGit OpenAPI 文档详见 https://docs.atomgit.com/openAPI/api_versioned/remind-page-list
const ATOMGIT_API_BASE_URL = "https://api.atomgit.com";

const MAX_RETRY = 3;

export class Service {
  private request: AxiosInstance;
  private infoFailCount = 0;
  private messageFailCount = 0;

  constructor(token: string) {
    this.request = axios.create({
      baseURL: ATOMGIT_API_BASE_URL,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 获取未读通知
  public async getInfos(): Promise<number | undefined> {
    const url = "/notifications/threads";

    try {
      const data = await this.request.get(url, {
        params: {
          unread: true,
          page: 1,
        },
      });
      const {
        data: { total = 0 },
      } = data;
      this.infoFailCount = 0;
      return total;
    } catch (error) {
      this.infoFailCount++;
      const {
        response: {
          data: { error: errMsg, error_description },
        },
      } = error as any;
      const errMessage = error_description || errMsg;
      console.error("request error: ", errMessage);
      // 失败三次就不再刷新
      if (this.infoFailCount === MAX_RETRY) {
        throw new Error("AtomGit 通知获取失败");
      }
    }
  }

  // 获取未读私信
  public async getPrivateMessages(): Promise<number | undefined> {
    const url = "/notifications/messages";

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const since = threeDaysAgo.toISOString();

    try {
      const data = await this.request.get(url, {
        params: {
          unread: true,
          since,
          page: 1,
        },
      });
      const {
        data: { total = 0 },
      } = data;
      this.messageFailCount = 0;
      return total;
    } catch (error) {
      this.messageFailCount++;
      const {
        response: {
          data: { error: errMsg, error_description },
        },
      } = error as any;
      const errMessage = error_description || errMsg;
      console.error("request error: ", errMessage);
      // 失败三次就不再刷新
      if (this.messageFailCount === MAX_RETRY) {
        throw new Error("AtomGit 私信获取失败");
      }
    }
  }
}
