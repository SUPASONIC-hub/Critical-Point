import { localizeTables } from "../locale.js";

/**
 * The background music's buttons (components/AdaptiveMusic.jsx): what the
 * toggle prints and announces, and the volume button's name, read by key so
 * another language can be laid over them (src/locale.js, 다국어 틀). The
 * Korean is the component's own, moved here unchanged. The mode and volume
 * names (CONTROLLED, LOW) are English in every language and stay there.
 */
const musicCopy = {
  unsupported: "이 브라우저는 배경음을 지원하지 않습니다",
  turnOn: "배경음 켜기",
  turnOff: "배경음 끄기",
  resume: "배경음 재생하기",
  volume: "배경음악 볼륨",
  volumeLevel: "배경음악 볼륨 {level}",
};
export default musicCopy;

localizeTables("screens", { music: musicCopy });
