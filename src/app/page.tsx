import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Navbar />
      </div>
      <div className="flex-[2]">
        <Hero />
        <Gallery />
      </div>
    </div>
  );
}
