import { localizeTables } from "../locale.js";

/**
 * 다른 기기에서 이어하기, the fold on the intro (CloudSavePanel.jsx): the words
 * it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the fold's own, moved here
 * unchanged. What the opened panel prints is src/copy/cloudSaveBody.js, in
 * the panel's own chunk, so the entry chunk does not carry it.
 */
const cloudSaveCopy = {
  summary: "다른 기기에서 이어하기",
  text: "진행은 이 기기에만 저장됩니다. 온라인 저장을 켜면 그때부터 진행 기록(사건, 판단 로그, 자원)이 이어하기 코드 아래 온라인에도 올라가고, 다른 기기에서 그 코드를 입력하면 멈춘 자리에서 이어집니다. 이름과 피드백 내용은 올리지 않습니다. 올린 기록은 마지막으로 올린 날부터 {days}일 동안 보관한 뒤 지우며, 그 전에도 여기서 지울 수 있습니다.",
  noServer: "이 배포에는 온라인 저장 서버가 없어 이 기기에만 저장합니다.",
  loadFailed: "온라인 저장 화면을 불러오지 못했습니다. ",
  retry: "다시 불러오기",
  loading: "온라인 저장 화면을 불러오는 중입니다.",
};
export default cloudSaveCopy;

localizeTables("screens", { cloudSave: cloudSaveCopy });
