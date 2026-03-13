import Hero from "../components/sections/Hero";
import Produtos from "../components/sections/Produtos";
import Sobre from "../components/sections/Sobre";
import CTA from "../components/sections/CTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Produtos />
      <Sobre />
      <CTA />
    </main>
  );
}