export type TimeCategory = "morning" | "afternoon" | "evening" | "night";

export type Track = {
  id: string;
  /** Shown in the player. */
  title: string;
  /** Public path, e.g. "/music/morning/morning-light.mp3". */
  src: string;
  category: TimeCategory;
  /**
   * Placeholder slots describe where an upload will live. They are never
   * played or advertised as playable audio.
   */
  placeholder?: boolean;
};

export const CATEGORY_LABELS: Record<TimeCategory, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

/**
 * Register a file by its public URL — never the `public/` folder itself.
 * Filenames containing spaces or brackets must be percent-encoded, because
 * the encoded form is what the browser reports back in `audio.currentSrc`.
 *
 * Only entries with a non-empty `src` and no `placeholder` flag are treated
 * as playable.
 */
export const MUSIC_BY_CATEGORY: Record<TimeCategory, readonly Track[]> = {
  morning: [
    {
      id: "morning-golden-hour",
      title: "Golden Hour (Instrumental)",
      src: "/music/morning/JVKE_-_golden_hour_instrumental_(mp3.pm).aac",
      category: "morning",
    },
  ],
  afternoon: [
    {
      id: "afternoon-alfaaz",
      title: "Alfaaz",
      src: "/music/afternoon/Alfaaz%20Hamza%20Malik%20x%20Zain%20Zohaib%20Official%20Visualiser.mp3",
      category: "afternoon",
    },
  ],
  evening: [
    {
      id: "evening-swim",
      title: "Swim",
      src: "/music/evening/Chase%20Atlantic%20-%20Swim.mp3",
      category: "evening",
    },
  ],
  night: [
    {
      id: "night-liggi",
      title: "Liggi",
      src: "/music/night/Ritviz_-_Liggi_%5BOfficial_Music_Video%5D(128k).mp3",
      category: "night",
    },
  ],
};

/** Morning 6–11:59, afternoon 12–16:59, evening 17–20:59, night 21–5:59. */
export function getTimeCategory(date: Date): TimeCategory {
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function isPlayableTrack(track: Track): boolean {
  return !track.placeholder && track.src.trim().length > 0;
}
