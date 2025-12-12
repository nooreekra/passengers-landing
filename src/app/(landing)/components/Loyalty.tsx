"use client";

import Image from "next/image";
import { useSection } from "@/shared/lib/SectionContext";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import AnimatedCounter from "./AnimatedCounter";

export default function Loyalty() {
    const { activeSection } = useSection();
    const { t } = useTranslation();

    const commonTitle = t("loyalty.commonTitle");

    return (
        <section className="relative flex items-center justify-center text-white">
            <Image
                src="/images/second_bg.webp"
                alt="Plane background"
                fill
                className="object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="relative z-20 text-center px-6 max-w-6xl w-full py-20 md:py-32 lg:py-44">
                <p className="text-[32px] md:text-[40px] lg:text-[52px] font-medium mb-12 md:mb-20 lg:mb-24">{commonTitle}</p>
                {activeSection === "airline" ? (
                    <AirlineLoyaltyContent />
                ) : (
                    <AgentLoyaltyContent section={activeSection} />
                )}
            </div>
        </section>
    );
}

const AirlineLoyaltyContent = () => {
    const { t } = useTranslation();
    const content = t("loyalty.airline", { returnObjects: true }) as any;

    // Animation sequences
    const marketsValues = [1, 3, 10, 15];
    const passengersValues = [500, 8000, 65000, 150000];
    const travelAgenciesValues = [50, 200, 650, 1000];
    const travelAgentsValues = [500, 2500, 8500, 10000];
    const corporateClientsValues = [30, 350, 800, 1500];

    // Format numbers with spaces as thousands separators
    const formatNumber = (num: number) => {
        return num.toLocaleString("en-US").replace(/,/g, " ");
    };

    return (
        <div className="flex flex-col space-y-3 md:space-y-5">
            <div className="w-full flex flex-col justify-center md:flex-row md:space-x-5 space-y-3 md:space-y-0">
                <div className="w-full md:w-[30%] border border-white/80 rounded-md px-10 py-5 h-44 text-center flex flex-col justify-center whitespace-pre-wrap">
                    <p className="text-[40px] font-bold leading-tight">
                        <AnimatedCounter values={marketsValues} formatNumber={formatNumber} />
                    </p>
                    <h4 className="mt-1 font-semibold text-[16px] leading-[20px] lg:text-[24px] lg:leading-[28px]">
                        {content.block1.subtitle}
                    </h4>
                </div>
                <div className="w-full md:w-[55%] border border-white/80 rounded-md px-10 py-5 h-44 text-center flex flex-col justify-center whitespace-pre-wrap">
                    <p className="text-[40px] font-bold leading-tight">{content.block2.title}</p>
                    <h4 className="mt-1 font-semibold text-[16px] leading-[20px] lg:text-[24px] lg:leading-[28px]">
                        {content.block2.subtitle}
                    </h4>
                </div>
            </div>

            <div className="w-full flex flex-col justify-center md:flex-row md:space-x-5 space-y-3 md:space-y-0">
                <div className="w-full md:w-[55%] border border-white/80 rounded-md px-10 py-5 h-44 text-center flex flex-col justify-center whitespace-pre-wrap">
                    <h4 className="mt-1 font-bold text-[16px] leading-[20px] lg:text-[24px] lg:leading-[28px] whitespace-pre-line">
                        <AnimatedCounter values={travelAgenciesValues} formatNumber={formatNumber} />{" "}
                        {content.block3.travelAgencies}
                        {"\n"}
                        <AnimatedCounter values={travelAgentsValues} formatNumber={formatNumber} />{" "}
                        {content.block3.travelAgents}
                        {"\n"}
                        <AnimatedCounter values={corporateClientsValues} formatNumber={formatNumber} />{" "}
                        {content.block3.corporateClients}
                    </h4>
                </div>
                <div className="w-full md:w-[30%] border border-white/80 rounded-md px-10 py-5 h-44 text-center flex flex-col justify-center whitespace-pre-wrap">
                    <p className="text-[40px] font-bold leading-tight">
                        <AnimatedCounter values={passengersValues} formatNumber={formatNumber} />
                    </p>
                    <h4 className="mt-1 font-semibold text-[16px] leading-[20px] lg:text-[24px] lg:leading-[28px]">
                        {content.block4.subtitle}
                    </h4>
                </div>
            </div>
        </div>
    );
};

interface AgentLoyaltyContentProps {
    section: "agent" | "agency";
}

const AgentLoyaltyContent = ({ section }: AgentLoyaltyContentProps) => {
    const { t } = useTranslation();
    const content = t(`loyalty.${section}`, { returnObjects: true }) as { title: string; subtitle: string }[];

    if (!Array.isArray(content)) {
        return <div>— loyalty.{section} is not an array in locale —</div>;
    }

    // Animation sequences for agent/agency section
    const airlinesValues = [10, 15, 20, 25];
    const hotelBrandsValues = [50, 70, 85, 100];

    // Format numbers with spaces as thousands separators
    const formatNumber = (num: number) => {
        return num.toLocaleString("en-US").replace(/,/g, " ");
    };

    return (
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6">
            {content.map(({ title, subtitle }, idx) => {
                // Determine which animation to use based on the title value
                let animatedValue = null;
                if (title === "25") {
                    animatedValue = airlinesValues;
                } else if (title === "100") {
                    animatedValue = hotelBrandsValues;
                }

                return (
                    <div
                        key={idx}
                        className="w-full border border-white/80 rounded-md px-10 py-5 h-40 text-center flex flex-col justify-center"
                    >
                        {title && (
                            <p className="text-[32px] font-bold leading-tight">
                                {animatedValue ? (
                                    <AnimatedCounter values={animatedValue} formatNumber={formatNumber} />
                                ) : (
                                    title
                                )}
                            </p>
                        )}
                        <h2
                            className={clsx(
                                "mt-1 text-[20px] leading-[28px] lg:text-[28px] lg:leading-[36px]",
                                title ? "font-semibold" : "font-bold"
                            )}
                        >
                            {subtitle}
                        </h2>
                    </div>
                );
            })}
        </div>
    );
};
