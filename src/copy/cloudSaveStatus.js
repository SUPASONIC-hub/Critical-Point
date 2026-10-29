import { localizeTables } from "../locale.js";

/**
 * What online save says about itself (cloudSave.js, in the entry chunk): the
 * one status line each phase prints, and what a refusal or a failed call is
 * told, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is cloudSave.js's, moved here unchanged.
 */
const cloudSaveStatusCopy = {
  phases: {
    idle: "아직 저장된 진행이 없습니다.",
    pending: "기기에 저장됨 · 곧 온라인에 올립니다.",
    syncing: "온라인에 올리는 중입니다.",
    synced: "기기와 온라인 모두 최신입니다.",
    offline: "오프라인 · 기기에 저장해 두었고, 연결되면 자동으로 올립니다.",
    // True of both ways into a conflict: another device's upload, and a
    // reset on this one (holdCloudCopyThroughReset).
    conflict: "온라인에 이 기기의 지금 진행과 이어지지 않는 저장이 있어 올리기를 멈췄습니다. 다른 기기에서 저장했거나 초기화하기 전의 진행입니다. 아래에서 어느 쪽을 남길지 골라 주세요.",
    error: "온라인 저장에 실패했습니다. 기기 저장은 안전하며 잠시 뒤 다시 시도합니다.",
    disabled: "온라인 저장이 꺼져 있습니다. 이 기기에만 저장합니다.",
    unavailable: "이 배포에는 온라인 저장 서버가 없어 이 기기에만 저장합니다.",
  },
  failures: {
    codeLimit: "오늘 이 네트워크에서 새로 만들 수 있는 이어하기 코드를 모두 썼습니다. 내일 다시 켜 주세요. 이 기기 저장은 안전합니다.",
    rateLimit: "온라인 저장 요청이 너무 잦습니다. 잠시 뒤에 다시 시도합니다. 이 기기 저장은 안전합니다.",
    tooLarge: "진행 기록이 온라인 저장 한도보다 커서 올리지 못했습니다. 이 기기 저장은 안전합니다.",
    unreachable: "온라인 저장 서버에 연결하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.",
    failed: "온라인 저장에 실패했습니다. 이 기기 저장은 안전하며 잠시 뒤 다시 시도합니다.",
  },
  badCode: "이어하기 코드는 12자리 영문·숫자입니다.",
  noServer: "이 배포에는 온라인 저장 서버가 설정되어 있지 않습니다.",
  offlineLoad: "오프라인이라 불러올 수 없습니다. 연결된 뒤 다시 시도하세요.",
  offlineDelete: "오프라인이라 온라인 사본을 지울 수 없습니다. 연결된 뒤 다시 시도하세요.",
};
export default cloudSaveStatusCopy;

localizeTables("screens", { cloudSaveStatus: cloudSaveStatusCopy });
