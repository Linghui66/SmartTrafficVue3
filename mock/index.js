const mockjs = require("mockjs");
module.exports = () => {
  return mockjs.mock({
    "notice|8": [
      {
        "id|+1": 1000,
        "noticeName": "@cword(10)",
        "noticeInfo": "@cparagraph(9)",
        "noticeTime": "@datetime",
        "noticeSurvivalDay": "@natural(1, 10)",
        "noticeType|1": ["unimportant", "warning", "dangerous"],
        "isOnline|1-2": true,
      },
    ],
  });
};
