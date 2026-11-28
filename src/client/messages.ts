import { defineTranslations } from "@getpaseo/plugin/client";

/** Declarative labels of static registrations; the host resolves them in its own language and follows changes. */
export const messages = defineTranslations({
  resources: {
    en: {
      artifacts: "Artifacts",
      preview: "Artifact preview",
      openLibrary: "Open artifact library",
      slashArtifact: "Create an HTML or React artifact",
      slashArtifactHint: "Describe what to create or change",
      slashGuide: "Apply the artifact guide to this conversation",
      slashGuideHint: "Optional: a request to handle right away",
      pillOpen: "Open artifact",
      pillOpening: "Opening…",
      pillTitle: "Open the waiting artifact in this conversation's sidebar",
    },
    ko: {
      artifacts: "아티팩트",
      preview: "아티팩트 미리보기",
      openLibrary: "아티팩트 보관함 열기",
      slashArtifact: "HTML·React 아티팩트 만들기",
      slashArtifactHint: "만들거나 수정할 결과물 설명",
      slashGuide: "아티팩트 작성 가이드를 이 대화에 적용",
      slashGuideHint: "선택: 바로 처리할 요청",
      pillOpen: "아티팩트 열기",
      pillOpening: "여는 중…",
      pillTitle: "대기 중인 아티팩트를 이 대화의 사이드바에서 열기",
    },
  },
});
