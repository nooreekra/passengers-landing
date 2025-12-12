"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { useSection } from "@/shared/lib/SectionContext";
import { useTranslation } from "react-i18next";

const Quote = () => {
    const { activeSection } = useSection();
    const { t } = useTranslation();

    const content = t(`quote.${activeSection}`, { returnObjects: true }) as { title: string; subtitle?: string };

    return (
        <div className="bg-gradient-to-r from-blue-linear-start to-blue-linear-end text-white max-w-[1140px] rounded-md mx-auto px-6 py-6 flex items-start space-x-8">
            <Image src="/images/quote.png" alt="quote" width={70} height={70} />
            <div className={clsx("flex flex-col", content.subtitle ? 'items-start space-y-3' : 'items-center my-auto')}>
                <h3 className="text-white font-semibold">{content.title}</h3>
                {content.subtitle && !!content.subtitle.trim() && (
                    <h4 className="text-white/90">{content.subtitle}</h4>
                )}
            </div>
        </div>
    );
};

export default Quote;
