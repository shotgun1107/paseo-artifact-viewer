export type ArtifactLocale = "en" | "ko";

export function artifactLocale(tag?: string): ArtifactLocale {
  return tag?.trim().split("-")[0].toLowerCase() === "ko" ? "ko" : "en";
}

export function localized(locale: string | undefined, en: string, ko: string): string {
  return artifactLocale(locale) === "ko" ? ko : en;
}
