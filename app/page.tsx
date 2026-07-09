import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Strategy from "@/components/Strategy";
import Performance from "@/components/Performance";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Strategy />
        <Performance />
        <Footer />
      </main>
    </>
  );
}
