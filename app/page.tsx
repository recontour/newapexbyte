import WebGLBackground from "@/components/WebGLBackground";
import CinematicWelcomeScreen from "@/components/CinematicWelcomeScreen";
import WorkShowcaseSection from "@/components/WorkShowcaseSection";
import ViewportScaler from "@/components/ViewportScaler";

export default function Home() {
  return (
    <main className="main-wrapper">
      <ViewportScaler />
      <WebGLBackground />
      <CinematicWelcomeScreen />
      <WorkShowcaseSection />
    </main>
  );
}
