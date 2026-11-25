type Tone = "white" | "cream";

const TONES: Record<Tone, { surface: string; ink: string }> = {
  white: { surface: "bg-paper", ink: "text-paper" },
  cream: { surface: "bg-cream", ink: "text-cream" },
};

type WaveDividerProps = {
  /** Colour of the section above the seam. */
  from: Tone;
  /** Colour of the section below the seam. */
  to: Tone;
  /** Mirror the curve so repeated seams do not look stamped. */
  mirror?: boolean;
};

/**
 * Organic seam between a white section and a blush-cream one. Static SVG, no
 * animation cost — it just softens the hard colour change.
 */
export default function WaveDivider({ from, to, mirror = false }: WaveDividerProps) {
  const { surface } = TONES[to];
  const { ink } = TONES[from];

  return (
    <div
      aria-hidden
      className={`relative h-12 w-full overflow-hidden sm:h-16 lg:h-20 ${surface}`}
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${ink} ${mirror ? "-scale-x-100" : ""}`}
      >
        <path
          fill="currentColor"
          d="M0 0h1440v34c-108 26-214 44-330 40-124-4-206-34-318-30-118 4-196 44-306 48C286 96 164 70 0 42Z"
        />
        <path
          fill="currentColor"
          opacity="0.5"
          d="M0 0h1440v16c-128 16-236 34-356 32-128-2-214-22-330-18-116 4-208 30-322 34C300 68 160 46 0 22Z"
        />
      </svg>
    </div>
  );
}
