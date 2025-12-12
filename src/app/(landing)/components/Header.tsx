"use client";

import Image from "next/image";
import {useState, useRef, useEffect} from "react";
import {useSection} from "@/shared/lib/SectionContext";
import {Globe, Menu, X} from "lucide-react";
import {SectionType} from "@/shared/types/landing";
import Link from "next/link";
import {useTranslation} from "react-i18next";

const LANGUAGES = [
    {code: "en", label: "EN"},
    {code: "ru", label: "RU"}
];

const Header = () => {
    const {activeSection, setActiveSection} = useSection();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    const linkClass = (section: string) =>
        `body-M-regular relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
     after:h-[2px] after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform 
     ${
            activeSection === section
                ? "after:scale-x-100 font-bold text-white"
                : "text-white hover:after:scale-x-100"
        }`;

    const handleClick = (section: SectionType) => {
        setActiveSection(section);
        setMobileOpen(false);
    };

    // Закрытие мобильного меню при клике вне
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setMobileOpen(false);
            }
        };

        if (mobileOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [mobileOpen]);

    const LanguageSwitcher = () => {
        const {i18n} = useTranslation();
        const [open, setOpen] = useState(false);
        const switcherRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    switcherRef.current &&
                    !switcherRef.current.contains(event.target as Node)
                ) {
                    setOpen(false);
                }
            };
            if (open) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [open]);

        return (
            <div className="relative ml-6" ref={switcherRef}>
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-white body-M-regular transition min-w-[64px]"
                    onClick={() => setOpen((prev) => !prev)}
                    type="button"
                >
                    <Globe size={20} className="text-white"/>
                    {LANGUAGES.find((l) => l.code === i18n.language)?.label || "EN"}
                </button>
                {open && (
                    <div
                        className="absolute left-0 mt-2 bg-white border border-black/60 rounded-xl shadow-xl z-[90] min-w-[80px]">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                className={`block w-full rounded-xl text-left text-black px-4 py-2 text-base transition
                                    ${i18n.language === lang.code ? "font-bold" : ""}
                                    hover:bg-neutral-100
                                  `}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setOpen(false);
                                }}
                                disabled={i18n.language === lang.code}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <header className="h-[90px] absolute top-0 left-0 w-full z-[70] px-6 lg:px-12 pt-6">
            <div className="flex justify-between items-center max-w-[1440px] mx-auto">
                <Image src="/images/logo.png" alt="Logo" width={180} height={40}/>

                <nav className="hidden lg:flex space-x-16 text-white">
                    <button onClick={() => handleClick("agent")} className={linkClass("agent")}>
                        {mounted ? t("header.agent") : ""}
                    </button>
                    <button onClick={() => handleClick("agency")} className={linkClass("agency")}>
                        {mounted ? t("header.agency") : ""}
                    </button>
                    <button onClick={() => handleClick("airline")} className={linkClass("airline")}>
                        {mounted ? t("header.airline") : ""}
                    </button>
                </nav>

                <div className="hidden lg:flex items-center">
                    <Link href={`tel:${t("header.phone")}`} className="text-white body-L-semibold">
                        {mounted ? t("header.phone") : ""}
                    </Link>
                    {mounted && <LanguageSwitcher/>}
                </div>

                <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                    <Menu size={28}/>
                </button>
            </div>

            {mobileOpen && (
                <div
                    ref={mobileMenuRef}
                    className="absolute top-0 left-0 w-full bg-background-dark text-white z-[80] animate-fade-down transition-all duration-300"
                >
                    <div className="flex justify-between px-6 lg:px-12 py-6">
                        <Image src="/images/logo.png" alt="Logo" width={180} height={40}/>
                        <button className="lg:hidden text-white" onClick={() => setMobileOpen(false)}>
                            <X size={28}/>
                        </button>
                    </div>
                    <nav className="flex flex-col items-center space-y-6 py-8">
                        <button onClick={() => handleClick("agent")} className={linkClass("agent")}>
                            {mounted ? t("header.agent") : ""}
                        </button>
                        <button onClick={() => handleClick("agency")} className={linkClass("agency")}>
                            {mounted ? t("header.agency") : ""}
                        </button>
                        <button onClick={() => handleClick("airline")} className={linkClass("airline")}>
                            {mounted ? t("header.airline") : ""}
                        </button>
                        {mounted && <LanguageSwitcher/>}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
