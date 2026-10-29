import { localizeTables } from "../locale.js";

/**
 * 다른 기기에서 이어하기 once opened (CloudSavePanelBody.jsx, a chunk of its
 * own): the words it prints, read by key so another language can be laid
 * over them (src/locale.js, 다국어 틀). The Korean is the panel's own, moved
 * here unchanged. The sync status lines are cloudSave.js's.
 */
const cloudSaveBodyCopy = {
  toggle: "온라인 저장 사용",
  myCode: "내 이어하기 코드",
  copy: "복사",
  loadOnline: "온라인의 진행 불러오기",
  overwrite: "이 기기의 진행으로 덮어쓰기",
  otherCode: "다른 기기의 코드",
  loadAndContinue: "불러와서 이어하기",
  uploadNow: "지금 올리기",
  deleteOnline: "온라인에 올린 기록 지우기",
  confirm: {
    load: "이 기기의 저장을 불러온 진행으로 바꿉니다. 계속할까요?",
    overwrite: "온라인에 있는 다른 기기의 진행을 이 기기의 진행으로 바꿉니다. 되돌릴 수 없습니다. 계속할까요?",
    remove: "온라인에 올린 진행 기록을 지웁니다. 이 기기의 저장은 그대로 남습니다. 계속할까요?",
  },
  outcome: {
    notFound: "그 코드로 저장된 진행이 없습니다.",
    cannotWrite: "브라우저 저장소에 쓸 수 없어 불러오지 못했습니다.",
    uploaded: "이 기기의 진행을 온라인에 올렸습니다.",
    noServer: "이 배포에는 온라인 저장 서버가 없어 여기서는 온라인 사본을 지울 수 없습니다.",
    deleted: "온라인에 올린 진행 기록을 지웠습니다.",
    nothingOnline: "온라인에 남아 있는 진행 기록이 없습니다.",
    copied: "이어하기 코드를 복사했습니다.",
    writeDown: "코드를 직접 적어 두세요: {code}",
    turnedOff: "온라인 저장을 껐습니다. 이미 올린 진행 기록은 아래에서 지울 수 있습니다.",
  },
};
export default cloudSaveBodyCopy;

localizeTables("screens", { cloudSaveBody: cloudSaveBodyCopy });
