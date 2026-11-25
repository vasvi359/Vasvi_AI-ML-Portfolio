# Ambient music assets

Drop royalty-free or self-owned MP3 files into the matching time-of-day folder:

```
public/music/morning/
public/music/afternoon/
public/music/evening/
public/music/night/
```

Then register each file in `src/music.ts`:

```ts
{
  id: "morning-light",
  title: "Morning Light",
  src: "/music/morning/morning-light.mp3",
  category: "morning",
}
```

Use the browser path, not the `public/` folder, and percent-encode spaces and brackets — for example
`/music/afternoon/Alfaaz%20Hamza%20Malik%20x%20Zain%20Zohaib%20Official%20Visualiser.mp3`.
The browser reports the encoded form in `audio.currentSrc`, so the manifest must match it.

Rules the player follows:

- Playback starts only after the visitor presses play.
- A folder can hold several tracks; the skip button cycles through them.
- The category is chosen from the visitor's local time when the page first opens:
  morning 06:00–11:59, afternoon 12:00–16:59, evening 17:00–20:59, night 21:00–05:59.
- A manual choice is remembered for the browsing session and is never overridden by the clock.
- Entries marked `placeholder` (or with an empty `src`) are never treated as playable.

Four uploaded tracks are currently registered in `src/music.ts`. If a listed file is missing, the
player shows a short "audio not found" message instead of failing silently.
