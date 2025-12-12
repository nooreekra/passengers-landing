"use client";

import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import Header from "@/app/(landing)/components/Header";
import {useSection} from "@/shared/lib/SectionContext";
import {SectionType} from "@/shared/types/landing";
import AuthForm from "@/app/(landing)/components/AuthForm";
import Demo from "@/app/(landing)/components/Demo";
import {useTranslation} from "react-i18next";
import clsx from "clsx";

interface HeroContent {
    title: string;
    title1?: string;
    subtitle: string;
    loginTitle: string;
}

const backgrounds: Record<SectionType, string> = {
    agent: "/images/main_bg1.webp",
    agency: "/images/main_bg1.webp",
    airline: "/images/main_bg2.webp",
};

const Hero = () => {
    const {t} = useTranslation();
    const {activeSection} = useSection();
    const prevSection = useRef<string>(activeSection);
    const [openDemo, setOpenDemo] = useState(false);

    useEffect(() => {
        const prev = prevSection.current as SectionType;
        const next = activeSection as SectionType;
        const shouldAnimate = backgrounds[prev] !== backgrounds[next];

        if (shouldAnimate) {
            const timeout = setTimeout(() => {
                prevSection.current = next;
            }, 1000);
            return () => clearTimeout(timeout);
        }
        prevSection.current = next;
    }, [activeSection]);

    const content = t(`hero.${activeSection}`, {returnObjects: true}) as HeroContent;

    return (
        <section className="relative min-h-screen text-white flex items-center justify-center overflow-hidden">
            <Header/>

            {Object.entries(backgrounds).map(([section, src]) => (
                <Image
                    key={section}
                    src={src}
                    alt="Hero Background"
                    fill
                    priority
                    className={`
            object-cover absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out
            ${activeSection === section ? "opacity-100 z-0 scale-105" : "opacity-0 z-[-1]"}
          `}
                />
            ))}

            <div className="absolute inset-0 bg-black/50 z-10"/>

            <div
                className="py-[112px] z-[40] text-center px-4 flex flex-col lg:flex-row justify-between items-center w-full max-w-[1440px] md:mx-[80px] xl:mx-[150px]">
                <div className="text-left max-w-2xl mb-12 lg:mb-0">
                    <p className={clsx("text-[24px] sm:text-[36px] md:text-[48px] xl:text-[60px] font-semibold leading-tight",
                        activeSection === 'airline' && "whitespace-nowrap"
                        )}>
                        {content.title}
                    </p>
                    {content.title1 && (
                        <p className="text-[24px] sm:text-[36px] md:text-[48px] xl:text-[60px] font-semibold leading-tight">
                            {content.title1}
                        </p>
                    )}
                    <p className="text-[18px] sm:text-[24px] md:text-[32px] font-medium mt-4">
                        {content.subtitle}
                    </p>
                    {
                        activeSection !== "agent" && (
                            <button
                                onClick={() => setOpenDemo(true)}
                                className="mt-6 bg-white text-black px-6 py-3 rounded font-semibold"
                            >
                                {t("hero.access")}
                            </button>
                        )}
                </div>
                
                {/* Форма авторизации - в мобильной версии ниже текста, в десктопе справа */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                    <AuthForm/>
                </div>
            </div>
            <Demo isOpen={openDemo} onClose={() => setOpenDemo(false)}/>
        </section>
    );
};

export default Hero;
