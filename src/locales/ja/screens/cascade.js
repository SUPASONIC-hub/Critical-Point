/** src/copy/cascade.js in Japanese: the CASCADE board's rule, the reveal's line on a link made, and the table's voice on the links. */
export default {
  mutation: {
    title: "あのときの決裁が戻ってきた",
    text: "数勝負前に大きく燃やしたカードの連結。この勝負は壁が{wall}近づく。",
  },
  linkMade: "{min}〜{max}勝負のうちに、ひとつの勝負の壁が{wall}近づく。",
  range: { next: "次の勝負", after: "{low}勝負後", within: "{low}〜{high}勝負のうち" },
  links: "連結 {live}。いちばん早いものは{range}、その勝負の壁が{wall}近づく",
};
