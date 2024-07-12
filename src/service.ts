import axios, { AxiosInstance } from 'axios';

export const baseUrl = 'https://api.atomgit.com';
export interface Message {
  message: string;
  count: number;
  url: string;
}

export class Service {
  private request: AxiosInstance;
  private messageFailCount = 0;

  NoticeEventCount: number = 0;
  NoticeRefererCount: number = 0;
  NoticeAllCount: number = 0;

  lastFanCount: number = 0;
  lastCommentCount: number = 0;
  lastNewsCount: number = 0;
  lastNoticeCount: number = 0;

  constructor(accessToken='atp_ixeclnfdal97d2fsb8ymqwl0csl7fd25') {
    this.request = axios.create({
      method: 'get',
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
      },
      params: {
    unread: true,
    page: 1,
  },
    });
  }

  public async getMessages(): Promise<Message[] | undefined> {
    const url = '/notifications/threads';

    try {
      const { data: { data, err_no } } = await this.request.get(url);

      if (err_no !== 0) {
        // 失败三次就不再刷新了
        if (this.messageFailCount === 3) {
          throw new Error();
        }
        this.messageFailCount += 1;
        return await this.getMessages();
      }

      const { count } = data;

      const messages = [];
      let collentAndDiggCount = count["1"];
      let fanCount = count["2"];
      let commentCount = count["3"];
      let noticeCount = count["4"];
      let newsCount = count["7"];

      if (fanCount !== this.lastFanCount && fanCount > 0) {
        messages.push({
          message: `个新的粉丝`,
          url: '/notification/follow',
          count: fanCount,
        });
      }

      if (commentCount !== this.lastCommentCount && commentCount > 0) {
        messages.push({
          message: `条新的评论`,
          url: '/notification',
          count: commentCount,
        });
      }

      if (newsCount !== this.lastNewsCount && newsCount > 0) {
        messages.push({
          message: `条新的私信`,
          url: '/notification/im',
          count: newsCount,
        });
      }

      if (noticeCount !== this.lastNoticeCount && noticeCount > 0) {
        messages.push({
          message: `条新的系统通知`,
          url: '/notification/system',
          count: noticeCount,
        });
      }

      this.lastFanCount = fanCount;
      this.lastCommentCount = commentCount;
      this.lastNewsCount = newsCount;
      this.lastNoticeCount = noticeCount;

      this.messageFailCount = 0;

      return messages;
    } catch {
      // 失败三次就不再刷新了
      if (this.messageFailCount === 3) {
        throw new Error();
      }
    }
  }
}
