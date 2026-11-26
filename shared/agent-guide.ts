import { artifactLocale } from "./language";

export const ARTIFACT_GUIDE_MARKER = "[paseo-artifact-viewer]";

const koreanGuide = `${ARTIFACT_GUIDE_MARKER}
사용자가 아티팩트를 요청하거나 대화에서 열어 다시 쓸 독립 실행형 결과물(계산기, 시뮬레이터, 시각화 등)을 원하면 Paseo 아티팩트로 전달한다. 일반 질문에는 그대로 답하고, 기존 앱의 코드 수정이나 파일만 요청한 경우에는 그 요청을 따른다.

만들기: 사용 가능한 도구에서 artifact_publish를 찾아 호출한다. format은 html, svg, react 중 하나이며, title과 content(실행 가능한 단일 파일 전체), 새 requestId를 전달한다. 예를 들어 “색상 실험실 만들어줘”에는 색을 바꾸는 버튼이 작동하는 HTML 본문을 발행한다. React는 default export를 사용하며 react, react-dom, lucide-react, recharts를 지원한다. 파일도 요청받았다면 파일 저장과 아티팩트 발행을 모두 수행한다.
수정하기: “색 하나 더 추가해줘”처럼 기존 결과를 고치는 요청은 현재 대화의 artifactId를 사용한다. 대상이 불분명하면 artifact_list로 찾고 artifact_read로 최신 본문을 읽는다. 수정한 전체 본문을 같은 artifactId로 발행해 다음 버전을 만든다. 같은 호출의 재시도에는 동일한 requestId와 입력을 쓰고, 새로운 수정에는 새 requestId를 쓴다.
열기: “다시 열어줘”에는 artifact_open을 사용한다. 특정 버전을 원하면 version도 지정한다. 발행 성공은 status가 ok인지 확인한 뒤 알린다. 열기는 opened일 때만 열렸다고 하고 deferred이면 대화로 돌아올 때 열기 대기 중이라고 알린다. 발행에 성공하면 답변은 짧게 마친다. 대화 카드와 artifact_open은 대화 옆 패널에 연다. 왼쪽 아티팩트 보관함에서 결과물을 누르면 메인 영역 전체에 열린다.
도구가 제공되지 않는 대화에서는 완성한 본문을 html, svg 또는 tsx 코드 블록으로 답한다. 예를 들어 색상 실험실의 여는 줄은 html artifact="color-lab" title="색상 실험실"로 적고, 수정 시 같은 키를 유지한다.`;

const englishGuide = `${ARTIFACT_GUIDE_MARKER}
When the user asks for an artifact or a standalone result they can open and use in the conversation, such as a calculator, simulation, or visualization, deliver it as a Paseo artifact. Answer ordinary questions directly. Follow requests to edit an existing app or deliver only a file.

Create: Call artifact_publish with format html, svg, or react, a title, the complete runnable single-file content, and a new requestId. For example, a color lab should include a working color button. For React, use a default export. Supported packages are react, react-dom, lucide-react, and recharts. If the user also requests a file, save the file and publish the artifact.
Edit: To change an existing result, use its artifactId in the current conversation. If needed, find it with artifact_list and read the latest content with artifact_read. Publish the complete revised content using the same artifactId to create the next version. Retry the same operation using the same requestId and input. Use a new requestId for a new edit.
Open: Use artifact_open to reopen a result. Include version when a particular revision is requested. Confirm publication only after status is ok. Report that the artifact opened only for opened. For deferred, tell the user it is waiting for them to return to the conversation. Keep the reply short after publishing. Conversation cards and artifact_open display the result beside the conversation. Selecting an artifact in the library opens it in the main area.
If the tools are unavailable, return the complete content in an html, svg, or tsx code fence. For example, open the color lab fence with html artifact="color-lab" title="Color lab". Keep the same key for edits.`;

export function getArtifactGuide(locale?: string): string {
  return artifactLocale(locale) === "ko" ? koreanGuide : englishGuide;
}
