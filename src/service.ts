import axios, { AxiosInstance } from "axios";

// AtomGit OpenAPI 文档详见 https://docs.atomgit.com/openAPI/api_versioned/remind-page-list
const ATOMGIT_API_BASE_URL = "https://api.atomgit.com";

const MAX_RETRY = 3;

export class Service {
  private request: AxiosInstance;
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

  public async getMessages(): Promise<number | undefined> {
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
      const messageCount = total;
      this.messageFailCount = 0;
      return messageCount;
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
        throw new Error("AtomGit 消息 OpenAPI 重复调用失败");
      }
    }
  }
}
