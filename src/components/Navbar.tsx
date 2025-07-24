"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow w-full">
      <Link href="/" className="text-xl font-bold text-pink-500">
        Divyansh
      </Link>
      <div className="flex gap-4">
        <Link href="/about">About</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">
          <Button>Contact</Button>
        </Link>
      </div>
    </nav>
  );
}
