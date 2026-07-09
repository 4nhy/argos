import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Live from "@/components/Live";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Argos — Live Book",
  description:
    "The combined market-neutral book, trading live. Real-time equity and exposure from the brokerage account.",
};

export default function LivePage() {
  return (
    <>
      <Starfield />
      <Nav />
      <main className="relative min-h-screen pt-16">
        <Live />
        <Footer />
      </main>
    </>
  );
}
