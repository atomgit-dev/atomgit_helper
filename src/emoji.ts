interface IEmoji {
  readonly emoji: string;
  readonly shortname: string;
  readonly unicode: string;
  readonly htmlEntity: string;
  readonly gitType: string;
  readonly detail: string;
}

const emojiList: IEmoji[] = [
  {
    emoji: "✨",
    shortname: ":sparkles:",
    unicode: "2728",
    htmlEntity: "&#10024;",
    gitType: "feat",
    detail: "新增功能",
  },
  {
    emoji: "🐛",
    shortname: ":bug:",
    unicode: "1f41b",
    htmlEntity: "&#128027;",
    gitType: "fix",
    detail: "修复 bug",
  },
  {
    emoji: "🚑",
    shortname: ":ambulance:",
    unicode: "1f691",
    htmlEntity: "&#128657;",
    gitType: "hotfix",
    detail: "线上 hotfix",
  },
  {
    emoji: "⚡",
    shortname: ":zap:",
    unicode: "26a1",
    htmlEntity: "&#9889;",
    gitType: "perf",
    detail: "优化相关内容，比如提升性能、体验、算法等",
  },
  {
    emoji: "📝",
    shortname: ":memo:",
    unicode: "1F4DD",
    htmlEntity: "&#128221;",
    gitType: "docs",
    detail: "仅修改文档，比如 README, CHANGELOG 等等",
  },
  {
    emoji: "⏪",
    shortname: ":rewind:",
    unicode: "23ea",
    htmlEntity: "&#9194;",
    gitType: "revert",
    detail: "回滚到上一个版本",
  },
  {
    emoji: "🔀",
    shortname: ":twisted_rightwards_arrows:",
    unicode: "1f500",
    htmlEntity: "&#128256;",
    gitType: "merge",
    detail: "代码合并",
  },
  {
    emoji: "✅",
    shortname: ":white_check_mark:",
    unicode: "2705",
    htmlEntity: "&#9989;",
    gitType: "test",
    detail: "增加/修改测试用例，包括单元测试、集成测试等",
  },
  {
    emoji: "💄",
    shortname: ":lipstick:",
    unicode: "1f484",
    htmlEntity: "&#128132;",
    gitType: "style",
    detail: "修改了空行、缩进格式、引用包排序等等（不改变代码逻辑）",
  },
  {
    emoji: "♻️",
    shortname: ":recycling_symbol:",
    unicode: "267B FE0F",
    htmlEntity: "&#x267B;&#xFE0F;",
    gitType: "refactor",
    detail: "代码重构（没有新功能或者 bug 修复）",
  },
  {
    emoji: "🗑️",
    shortname: ":wastebasket:",
    unicode: "1F5D1 FE0F",
    htmlEntity: "&#x1F5D1;&#xFE0F;",
    gitType: "remove",
    detail: "代码、文件废弃或移除",
  },
  {
    emoji: "🔧",
    shortname: ":wrench:",
    unicode: "1f527",
    htmlEntity: "&#128295;",
    gitType: "chore",
    detail: "改变构建流程、或者增加依赖库、工具等",
  },
  {
    emoji: "🎉",
    shortname: ":tada:",
    unicode: "1f389",
    htmlEntity: "&#127881;",
    gitType: "init",
    detail: "初始化项目",
  },
  {
    emoji: "📦",
    shortname: ":package:",
    unicode: "1f4e6",
    htmlEntity: "&#128230;",
    gitType: "package",
    detail: "更新依赖",
  },
  {
    emoji: "💡",
    shortname: ":bulb:",
    unicode: "1f4a1",
    htmlEntity: "&#128161;",
    gitType: "idea",
    detail: "idea，新的想法",
  },
  {
    emoji: "🚧",
    shortname: ":construction:",
    unicode: "1f6a7",
    htmlEntity: "&#128679;",
    gitType: "construction",
    detail: "工作进行中",
  },
  {
    emoji: "🌐",
    shortname: ":globe_with_meridians:",
    unicode: "1f310",
    htmlEntity: "&#127760;",
    gitType: "i18n",
    detail: "国际化或本地化",
  },
  {
    emoji: "🚀",
    shortname: ":rocket:",
    unicode: "1f680",
    htmlEntity: "&#128640;",
    gitType: "version",
    detail: "发布新版本",
  },
  {
    emoji: "🔖",
    shortname: ":bookmark:",
    unicode: "1f516",
    htmlEntity: "&#128278;",
    gitType: "tag",
    detail: "标签-tag",
  },
  {
    emoji: "♿",
    shortname: ":wheelchair:",
    unicode: "267f",
    htmlEntity: "&#9855;",
    gitType: "a11y",
    detail: "可访问性",
  },
  {
    emoji: "📄",
    shortname: ":page_facing_up:",
    unicode: "1f4c4",
    htmlEntity: "&#128196;",
    gitType: "license",
    detail: "更新 license",
  },
];

type PrefixType = "emoji" | "shortname" | "emoji_with_type";

const getCommitPrefix = (emojiItem: IEmoji, type: PrefixType) => {
  const { emoji, shortname, gitType, detail } = emojiItem;

  let commitPrefix = "";
  switch (type) {
    case "emoji":
      commitPrefix = emoji + " ";
      break;
    case "shortname":
      commitPrefix = shortname + " ";
      break;
    case "emoji_with_type":
      commitPrefix = `${emoji} ${gitType}: `;
      break;
    default:
      commitPrefix = emoji + " "; // 默认使用 emoji
  }

  return {
    label: type === "emoji_with_type" ? `${emoji} ${gitType} ` : commitPrefix,
    description: type === "emoji_with_type" ? "" : gitType,
    emoji: commitPrefix,
    detail,
  };
};

const displayMethod = {
  "use emoji": (emoji: IEmoji) => getCommitPrefix(emoji, "emoji"),
  "use shortname": (emoji: IEmoji) => getCommitPrefix(emoji, "shortname"),
  "use emoji_with_type": (emoji: IEmoji) =>
    getCommitPrefix(emoji, "emoji_with_type"),
};

export { displayMethod, emojiList };
