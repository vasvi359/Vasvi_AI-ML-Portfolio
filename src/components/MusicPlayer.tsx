import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Music2,
  Pause,
  Play,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  MUSIC_BY_CATEGORY,
  getTimeCategory,
  isPlayableTrack,
} from "../music";
import type { Track } from "../music";
import { EASE } from "./ui";

const VOLUME_KEY = "vasvi-music-volume";
const TRACK_KEY = "vasvi-music-track";
const DEFAULT_VOLUME = 0.25;

function readStoredVolume() {
  try {
    const stored = Number(window.localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(stored) && stored > 0 && stored <= 1) return stored;
  } catch {
    /* storage can be unavailable — fall back to the default. */
  }
  return DEFAULT_VOLUME;
}

function SoundBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="soundbar block h-full w-[2px] rounded-full bg-accent"
          style={{ animationDelay: `${bar * 0.14}s` }}
        />
      ))}
    </span>
  );
}

export default function MusicPlayer() {
  const reduceMotion = useReducedMotion();

  /** Captured once on mount — the visit's local time decides the soundtrack. */
  const [category] = useState(() => getTimeCategory(new Date()));
  const [collapsed, setCollapsed] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      return window.sessionStorage.getItem(TRACK_KEY);
    } catch {
      return null;
    }
  });
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(readStoredVolume);
  const [error, setError] = useState<string | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const userPaused = useRef(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeRef = useRef(volume);
  const fadeFrame = useRef<number | null>(null);
  const lastAudibleVolume = useRef(volume || DEFAULT_VOLUME);

  const tracks = useMemo(
    () => MUSIC_BY_CATEGORY[category].filter(isPlayableTrack),
    [category],
  );
  const currentTrack = tracks.find((track) => track.id === selectedId) ?? tracks[0];
  const currentTrackRef = useRef<Track | undefined>(currentTrack);
  const label = CATEGORY_LABELS[category];

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volumeRef.current;
  }, []);

  const cancelFade = useCallback(() => {
    if (fadeFrame.current !== null) {
      cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (
      audio: HTMLAudioElement,
      target: number,
      duration: number,
      onDone?: () => void,
    ) => {
      cancelFade();
      const from = audio.volume;

      if (duration <= 0 || Math.abs(target - from) < 0.01) {
        audio.volume = target;
        onDone?.();
        return;
      }

      const started = performance.now();
      const step = (now: number) => {
        // The rAF timestamp is the frame's start time and can be slightly older
        // than `started`; without clamping this yields a negative volume and
        // throws IndexSizeError, which would strand playback at volume 0.
        const progress = Math.min(1, Math.max(0, (now - started) / duration));
        audio.volume = Math.min(1, Math.max(0, from + (target - from) * progress));
        if (progress < 1) {
          fadeFrame.current = requestAnimationFrame(step);
        } else {
          fadeFrame.current = null;
          onDone?.();
        }
      };
      fadeFrame.current = requestAnimationFrame(step);
    },
    [cancelFade],
  );

  const startTrack = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelFade();
      audio.pause();
      audio.src = track.src;
      audio.load();
      audio.volume = 0;
      setError(null);

      audio
        .play()
        .then(() => {
          setPlaying(true);
          setAutoplayBlocked(false);
          fadeTo(audio, volumeRef.current, 600);
        })
        .catch((reason: unknown) => {
          setPlaying(false);
          if (reason instanceof DOMException && reason.name === "NotAllowedError") {
            // Browsers require a gesture before audible playback; the retry
            // listeners below start the track on the visitor's first input.
            setAutoplayBlocked(true);
            setError(null);
            return;
          }
          setError(`Could not start “${track.title}”. Check public${track.src}.`);
        });
    },
    [cancelFade, fadeTo],
  );

  const changeVolume = (value: number) => {
    const next = Math.min(1, Math.max(0, value));
    volumeRef.current = next;
    setVolume(next);

    const audio = audioRef.current;
    if (audio) {
      cancelFade();
      if (playing) audio.volume = next;
    }

    if (next > 0) lastAudibleVolume.current = next;

    try {
      window.localStorage.setItem(VOLUME_KEY, String(next));
    } catch {
      /* the slider still works for this visit */
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      lastAudibleVolume.current = volume;
      changeVolume(0);
    } else {
      changeVolume(lastAudibleVolume.current || DEFAULT_VOLUME);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrackRef.current) return;

    if (playing) {
      userPaused.current = true;
      fadeTo(audio, 0, 220, () => {
        audio.pause();
        audio.volume = volumeRef.current;
      });
      setPlaying(false);
      return;
    }

    userPaused.current = false;
    const track = currentTrackRef.current;
    const sameLoadedTrack =
      audio.currentSrc.endsWith(track.src) && audio.currentTime > 0 && !audio.ended;

    if (sameLoadedTrack) {
      // Resume where the visitor stopped instead of restarting the track.
      audio.volume = 0;
      setError(null);
      audio
        .play()
        .then(() => {
          setPlaying(true);
          fadeTo(audio, volumeRef.current, 500);
        })
        .catch(() => {
          setError(`Could not resume “${track.title}”.`);
        });
      return;
    }

    startTrack(track);
  };

  const switchTrack = (track: Track, autoplay: boolean) => {
    setSelectedId(track.id);
    try {
      window.sessionStorage.setItem(TRACK_KEY, track.id);
    } catch {
      /* session-only choice is still respected */
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (!autoplay) {
      cancelFade();
      audio.pause();
      setPlaying(false);
      setError(null);
      return;
    }

    if (playing) fadeTo(audio, 0, 220, () => startTrack(track));
    else startTrack(track);
  };

  const goNext = () => {
    if (tracks.length < 2) return;
    const index = tracks.findIndex((track) => track.id === currentTrack?.id);
    switchTrack(tracks[(index + 1) % tracks.length], playing);
  };

  // Start the current soundtrack as soon as the player mounts. Chrome and
  // Safari may reject this until the visitor interacts; when that happens,
  // `autoplayBlocked` turns on and the retry effect below waits for a gesture.
  useEffect(() => {
    const track = currentTrackRef.current;
    if (track) startTrack(track);
  }, [startTrack]);

  useEffect(() => {
    if (!autoplayBlocked) return;

    const retry = (event: Event) => {
      if (userPaused.current) return;
      const target = event.target;
      // Let the player's own controls handle their clicks, so the track is
      // not started twice on the same gesture.
      if (target instanceof Element && target.closest("[data-music-player]")) return;
      const track = currentTrackRef.current;
      if (track) startTrack(track);
    };

    const events: ("click" | "keydown")[] = ["click", "keydown"];
    events.forEach((name) => window.addEventListener(name, retry, true));
    return () => events.forEach((name) => window.removeEventListener(name, retry, true));
  }, [autoplayBlocked, startTrack]);

  useEffect(() => {
    if (collapsed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCollapsed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapsed]);

  useEffect(
    () => () => {
      cancelFade();
      audioRef.current?.pause();
    },
    [cancelFade],
  );

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      data-music-player
      className="fixed right-4 z-40 sm:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <audio
        ref={audioRef}
        preload="none"
        loop
        onError={() => {
          const track = currentTrackRef.current;
          setPlaying(false);
          if (track) setError(`Audio not found. Add an MP3 at public${track.src}.`);
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <motion.button
            key="dock"
            type="button"
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
            aria-controls="ambient-music-panel"
            aria-label={`Open ambient music player — ${label} soundtrack${
              tracks.length ? "" : ", no tracks uploaded yet"
            }`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE }}
            className={`group relative isolate flex h-12 w-12 items-center justify-center rounded-full border bg-surface/95 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-petal ${
              playing
                ? "border-petal shadow-[0_0_0_1px_rgba(239,169,192,0.6),0_16px_36px_-16px_rgba(217,111,150,0.7)]"
                : "border-blush shadow-[0_12px_28px_-18px_rgba(52,48,57,0.45)]"
            }`}
          >
            {playing && (
              <span
                aria-hidden
                className="absolute -inset-1.5 -z-10 rounded-full bg-petal/30 blur-md motion-safe:animate-glow"
              />
            )}
            {playing ? (
              <SoundBars />
            ) : (
              <Music2
                className="h-[18px] w-[18px] text-accent transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.6}
                aria-hidden
              />
            )}
          </motion.button>
        ) : (
          <motion.section
            key="panel"
            id="ambient-music-panel"
            aria-label="Ambient music player"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE }}
            className="w-[min(84vw,19rem)] origin-bottom-right overflow-hidden rounded-2xl border border-blush bg-surface/95 p-4 shadow-[0_26px_60px_-32px_rgba(179,78,115,0.55)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    playing ? "bg-rose" : "bg-petal/60"
                  }`}
                  aria-hidden
                />
                {label} soundtrack
              </p>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-expanded
                aria-controls="ambient-music-panel"
                aria-label="Collapse music player"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream hover:text-accent"
              >
                <ChevronDown className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              </button>
            </div>

            <div className="mt-2.5 min-w-0" aria-live="polite">
              <p className="truncate font-serif text-[1.05rem] leading-snug text-ink">
                {currentTrack ? currentTrack.title : "No track uploaded"}
              </p>
              <p className="mt-0.5 break-words font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                {currentTrack
                  ? `${label} · ${
                      playing
                        ? "now playing · looping"
                        : autoplayBlocked
                          ? "waiting for a tap"
                          : "paused"
                    }`
                  : `Add MP3s to public/music/${category}/`}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayback}
                disabled={!currentTrack}
                aria-label={
                  !currentTrack
                    ? "Play ambient music — no tracks uploaded"
                    : playing
                      ? "Pause ambient music"
                      : "Play ambient music"
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-deep text-white shadow-[0_10px_20px_-12px_rgba(179,78,115,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-blush disabled:text-muted disabled:shadow-none disabled:hover:translate-y-0"
              >
                {playing ? (
                  <Pause className="h-4 w-4" strokeWidth={2} aria-hidden />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" strokeWidth={2} aria-hidden />
                )}
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={tracks.length < 2}
                aria-label={
                  tracks.length < 2
                    ? "Next track — no other tracks in this soundtrack"
                    : "Next ambient track"
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blush text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-petal hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <SkipForward className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              </button>

              <div className="ml-auto flex min-w-0 flex-1 items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={volume === 0 ? "Unmute music" : "Mute music"}
                  className="shrink-0 rounded-full p-1 text-muted transition-colors hover:text-accent"
                >
                  <VolumeIcon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  aria-label="Music volume"
                  aria-valuetext={`${Math.round(volume * 100)} percent`}
                  className="h-1 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-blush accent-rose-deep"
                />
              </div>
            </div>

            {autoplayBlocked && !error && (
              <p
                role="status"
                className="mt-2.5 break-words rounded-lg bg-cream px-2.5 py-2 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.08em] text-accent"
              >
                Autoplay is blocked by the browser. Press play, or click anywhere, to start.
              </p>
            )}

            {error && (
              <p
                role="status"
                className="mt-2.5 break-words rounded-lg bg-cream px-2.5 py-2 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.08em] text-accent"
              >
                {error}
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
