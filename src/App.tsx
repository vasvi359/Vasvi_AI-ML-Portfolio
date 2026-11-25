import { useEffect } from "react";
import { RouterProvider, useRouter } from "./router";
import { ThemeProvider } from "./theme";
import HomePage from "./pages/HomePage";
import EduMindPage from "./pages/EduMindPage";
import SarcasmDetectionPage from "./pages/SarcasmDetectionPage";
import NotFoundPage from "./pages/NotFoundPage";
import MusicPlayer from "./components/MusicPlayer";

function Routes() {
  const { path } = useRouter();
  const normalized = path.replace(/\/+$/, "") || "/";

  useEffect(() => {
    if (normalized === "/") {
      document.title = "Vasvi Bali — AI/ML Engineer & Backend Developer";
    }
  }, [normalized]);

  if (normalized === "/projects/edumind") return <EduMindPage />;
  if (normalized === "/projects/sarcasm-detection") return <SarcasmDetectionPage />;
  if (normalized === "/") return <HomePage />;
  return <NotFoundPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Routes />
        {/* Mounted outside the routes so audio keeps playing across pages. */}
        <MusicPlayer />
      </RouterProvider>
    </ThemeProvider>
  );
}
