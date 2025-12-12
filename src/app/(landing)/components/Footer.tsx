"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-background-dark text-white py-12 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <Image src="/images/logo.png" alt="Logo" width={122} height={27} />
                    <div className="flex space-x-4 mt-4">
                        <Link href="#"><Image src="/images/social/instagram.png" alt="Instagram" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/social/facebook.png" alt="Facebook" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/social/whatsapp.png" alt="WhatsApp" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/social/telegram.png" alt="Telegram" width={24} height={24} /></Link>
                    </div>
                </div>

                {/* Центр: навигация */}
                <div className="body-M-bold flex flex-col space-y-2 md:space-y-1">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <Link href="#" className="text-label-secondary hover:text-white">{t("footer.agency")}</Link>
                        <Link href="#" className="text-label-secondary hover:text-white">{t("footer.getDemo")}</Link>
                        <Link href="#" className="text-label-secondary hover:text-white">{t("footer.agent")}</Link>
                        <Link href="#" className="text-label-secondary hover:text-white">{t("footer.help")}</Link>
                        <Link href="#" className="text-label-secondary hover:text-white">{t("footer.airline")}</Link>
                    </div>
                </div>

                {/* Правая часть: контакты */}
                <div className="text-sm space-y-4">
                    <div>
                        <p className="text-gray-400">{t("footer.phoneLabel")}</p>
                        <Link href="tel:+77027023010">
                            <p className="md:text-[20px] md:leading-[24px] xl:text-[28px] xl:leading-[32px] font-medium">
                                +77027023010
                            </p>
                        </Link>
                    </div>
                    <div>
                        <p className="text-gray-400">{t("footer.emailLabel")}</p>
                        <Link href="mailto:info@imssavvy.co.uk" className="font-semibold">
                            <p className="md:text-[20px] md:leading-[24px] xl:text-[28px] xl:leading-[32px] font-medium">
                                info@imssavvy.co.uk
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
