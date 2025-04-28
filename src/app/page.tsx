import Hero from "@/components/hero";
import Interactive3D from "@/components/interactive-3d";
import Timeline from "@/components/timeline";
import InteractiveTerminal from "@/components/terminal";
import Projects from "@/components/projects";
import HiddenGames from "@/components/hidden-games";
import Navigation from "@/components/navigation";
import LoadingScreen from "@/components/loading";
import ScrollToTopButton from "@/components/scroll-to-top";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-transparent to-gray-900 dark:to-gray-950 transition-colors duration-300">
      <LoadingScreen />
      <Navigation />
      <ScrollToTopButton />
      
      {/* Hero section with typing effect and 3D element */}
      <section id="home" className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Hero />
        <div className="absolute inset-0 z-0 opacity-70">
          <Interactive3D />
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-300 dark:text-gray-300" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>
      
      {/* Interactive Terminal section - Moved up to come right after Home */}
      <section id="terminal" className="min-h-screen py-20 px-4 md:px-10 bg-gray-800/50 dark:bg-gray-900/50">
        <h2 className="text-3xl font-bold text-center mb-16 text-white dark:text-gray-100">Terminal</h2>
        <div className="max-w-4xl mx-auto">
          <InteractiveTerminal />
        </div>
      </section>
      
      {/* Interactive Timeline section */}
      <section id="timeline" className="min-h-screen py-20 px-4 md:px-10 bg-gradient-to-b from-gray-800/50 to-gray-700/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <h2 className="text-3xl font-bold text-center mb-16 text-white dark:text-gray-100">My Journey</h2>
        <Timeline />
      </section>
      
      {/* Projects section */}
      <section id="projects" className="min-h-screen py-20 px-4 md:px-10 bg-gray-700/50 dark:bg-gray-900/50">
        <h2 className="text-3xl font-bold text-center mb-16 text-white dark:text-gray-100">Projects</h2>
        <Projects />
      </section>
      
      {/* Hidden Games - not visible in the navigation */}
      <HiddenGames />
      
      <footer className="py-8 text-center text-sm text-gray-300 dark:text-gray-400 bg-gray-800 dark:bg-gray-900">
        © {new Date().getFullYear()} My Interactive Portfolio. Click around, you might find some easter eggs!
      </footer>
    </div>
  );
}
