import type { ChallengeProgressStatRow } from "@/types/challenge-progress-card";

export const CHALLENGE_PROGRESS_BACKGROUND_IMAGE = "/images/analytics/bgmask.png";
export const CHALLENGE_PROGRESS_SHIELD_ICON = "/images/analytics/shield.svg";

export const CHALLENGE_PROGRESS_DONUT_GRADIENT =
  "linear-gradient(180deg, #0CE9A0 0%, #108961 100%)";

export const CHALLENGE_PROGRESS_DONUT_INSET_SHADOW =
  "0px 1.33px 1.33px 2.65px rgba(255, 255, 255, 0.25) inset";

export const mockChallengeProgressStats: ChallengeProgressStatRow[] = [
  {
    id: "completed",
    label: "Completed",
    valuePrimary: "72%",
    valueSecondary: "72%",
    tone: "completed",
  },
  {
    id: "remaining",
    label: "Remaining",
    valuePrimary: "28%",
    valueSecondary: "28.0%",
    tone: "remaining",
  },
];
