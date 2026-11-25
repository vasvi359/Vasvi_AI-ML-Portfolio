import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Education from "../components/Education";
import Contact from "../components/Contact";
import CatCursor from "../components/CatCursor";
import Preloader from "../components/Preloader";
import PetalPixelDivider from "../components/PetalPixelDivider";
import WaveDivider from "../components/WaveDivider";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Preloader />
      <CatCursor />
      <a
        href="#main"
        className="pointer-events-none fixed left-5 top-4 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white transition-transform duration-200 focus:pointer-events-auto focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <PetalPixelDivider />
        <Skills />
        <WaveDivider from="cream" to="white" />
        <Experience />
        <WaveDivider from="white" to="cream" mirror />
        <Projects />
        <WaveDivider from="cream" to="white" />
        <Achievements />
        <WaveDivider from="white" to="cream" mirror />
        <Education />
        <WaveDivider from="cream" to="white" />
        <Contact />
      </main>
    </div>
  );
}
