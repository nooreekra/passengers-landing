"use client"

import { Suspense } from 'react';
import '../globals.css';
import Hero from "@/app/(landing)/components/Hero";
import Partners from "@/app/(landing)/components/Partners";
import Footer from "@/app/(landing)/components/Footer";
import Loyalty from "@/app/(landing)/components/Loyalty";
import AutoAuth from "@/app/(landing)/components/AutoAuth";

export default function Home() {
  return (
      <main>
          <Suspense fallback={null}>
              <AutoAuth />
          </Suspense>
          <Hero/>
          <Partners/>
          <Loyalty/>
          <Footer/>
      </main>
  );
}
