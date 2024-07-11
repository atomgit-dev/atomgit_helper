interface IEmoji {
  readonly emoji: any;
  readonly entity?: any;
  readonly code: any;
  readonly description: any;
  readonly name: any;
}

const emojiList: IEmoji[] = [
  {
    emoji: "🎉",
    entity: "&#x1f3a8;",
    code: ":tada:",
    description: "desc初次提交/初始化项目😬",
    name: "name庆祝",
  },
  {
    emoji: "✨",
    entity: "&#x1f525;",
    code: ":fire:",
    description: "引入新功能🙃",
    name: "火花",
  },
  {
    emoji: "🐛",
    entity: "&#x1f41b;",
    code: ":bug:",
    description: "修复 bug😭",
    name: "bug",
  },
  {
    emoji: "🔀",
    code: ":twisted_rightwards_arrows:",
    description: "Merge 分支🤣",
    name: "merge",
  },
  {
    emoji: "🎨",
    entity: "&#x2728;",
    code: ":sparkles:",
    description: "改进代码结构/代码格式😍",
    name: "调色板",
  },
  {
    emoji: "⚡️",
    code: ":zap:",
    description: "提高性能/优化🤪",
    name: "性能",
  },
  {
    emoji: "📝",
    code: ":memo:",
    description: "添加/更新文档😁",
    name: "文档",
  },
  {
    emoji: "🔨",
    code: ":hammer:",
    description: "重构代码🙄",
    name: "重构",
  },
  {
    emoji: "✅",
    code: ":white_check_mark:",
    description: "增加测试😋",
    name: "测试",
  },
  {
    emoji: "🚧",
    code: ":construction:",
    description: "缓存进行中的工作🤒",
    name: "进行中",
  },
  {
    emoji: "🔥",
    code: ":fire:",
    description: "删除文件😔",
    name: "删除",
  },
  {
    emoji: "🚚",
    code: ":truck:",
    description: "移动文件或重命名🙃",
    name: "移动文件",
  },
  {
    emoji: "🔖",
    code: ":bookmark:",
    description: "发布版本/添加标签😃",
    name: "Tag",
  },

  {
    emoji: "✅",
    entity: "&#x1f680;",
    code: ":rocket:",
    description: "增加测试代码🤑",
    name: "测试",
  },
  {
    emoji: "🚀",
    entity: "&#127881;",
    code: ":tada:",
    description: "发布新版本😄",
    name: "发布",
  },
  {
    emoji: "🔧",
    entity: "&#x1f527;",
    code: ":wrench:",
    description: "修改配置文件🙄",
    name: "配置",
  },
  {
    emoji: "⬆️",
    code: ":arrow_up:",
    description: "升级依赖",
    name: "升级",
  },
  {
    emoji: "⬇️",
    code: ":arrow_down:",
    description: "降级依赖",
    name: "降级",
  },
  {
    emoji: "💄",
    entity: "&#x1f525;",
    code: ":lipstick:",
    description: "更新 UI 和样式文件",
    name: "口红",
  },
  {
    emoji: "🌐",
    entity: "&#127760;",
    code: ":globe_with_meridians:🤒",
    description: "多语言/国际化",
    name: "国际化",
  },
  {
    emoji: "🚑",
    entity: "&#128657;",
    code: ":ambulance:",
    description: "添加重要补丁😔",
    name: "急救车",
  },
  {
    emoji: "📦",
    entity: "&#x1f4dd;",
    code: ":pencil:",
    description: "添加新文件/引入新功能😋",
    name: "添加",
  },
  {
    emoji: "🤔",
    code: ":ideas:",
    description: "思考 & 计划🥺",
    name: "思考",
  },
];

type EmojiType = "emoji" | "code" | "both";

const useEmoji = (emoji: IEmoji, type: EmojiType) => {
  const generateLabel = () => `${emoji.emoji} ${emoji.description}`;
  const generateDescription = () => `[${emoji.name}]`;

  let emojiField: string;
  switch (type) {
    case "emoji":
      emojiField = emoji.emoji + " ";
      break;
    case "code":
      emojiField = emoji.code + " ";
      break;
    case "both":
      emojiField = `${emoji.emoji} ${emoji.code}: `;
      break;
    default:
      emojiField = emoji.emoji + " "; // 默认使用 emoji
  }

  return {
    label: generateLabel(),
    code: emoji.code,
    emoji: emojiField,
    description: generateDescription(),
    detail: 'iiii detail',
  };
};

const use_emoji = (emoji: IEmoji) => ({
  label: `${emoji.emoji} ${emoji.description}`,
  code: emoji.code,
  emoji: emoji.emoji + " ",
  description: "[" + emoji.name + "]",
});

const use_label = (emoji: IEmoji) => ({
  label: `${emoji.emoji} ${emoji.description}`,
  code: emoji.code,
  emoji: emoji.code + " ",
  description: "[" + emoji.name + "]",
});

const use_both = (emoji: IEmoji) => ({
  label: `${emoji.emoji} ${emoji.description}`,
  code: emoji.code,
  emoji: `${emoji.emoji} ${emoji.code}: `,
  description: `[${emoji.name}]`,
});

const displayMethod = {
  default: (emoji: IEmoji) => useEmoji(emoji, "emoji"),
  "use label": (emoji: IEmoji) => useEmoji(emoji, "code"), // 注意这里我们使用 'code' 作为 'use label' 的替代，因为原 use_label 是使用 code 的
  "use emoji": (emoji: IEmoji) => useEmoji(emoji, "emoji"),
  "use both": (emoji: IEmoji) => useEmoji(emoji, "both"),
};

export { displayMethod, emojiList };
