import type { PaseoAgentTimelineHandle } from "@getpaseo/client";
import { localized, type ArtifactLocale } from "../shared/language";

export type TimelineReader = Pick<PaseoAgentTimelineHandle, "refetch">;
export type TimelinePage = Awaited<ReturnType<TimelineReader["refetch"]>>;
export type TimelineEntry = TimelinePage["entries"][number];

export function checkTimelinePage(page: TimelinePage, epoch: string, locale?: ArtifactLocale) {
  if (!epoch || page.error || page.epoch !== epoch || page.staleCursor || page.gap || page.reset) {
    throw new Error(localized(locale, "Conversation history changed. Fetch it again to continue.",
      "대화 기록이 변경됐습니다. 다시 조회하세요."));
  }
}

/** Newest page first; callers decide whether to import a bounded tail or inspect all pages. */
export async function* timelinePages(timeline: TimelineReader, maxPages = Infinity, locale?: ArtifactLocale) {
  let page = await timeline.refetch({ direction: "tail", limit: 200 });
  const epoch = page.epoch;
  const cursors = new Set<string>();
  for (let count = 1; ; count++) {
    checkTimelinePage(page, epoch, locale);
    yield page;
    if (!page.hasOlder || count >= maxPages) return;
    const cursor = page.startCursor;
    const key = JSON.stringify(cursor);
    if (!cursor || cursors.has(key)) throw new Error(localized(locale,
      "Invalid conversation history cursor.", "대화 기록을 이어서 조회할 수 없습니다."));
    cursors.add(key);
    page = await timeline.refetch({ direction: "before", limit: 200, cursor });
  }
}
