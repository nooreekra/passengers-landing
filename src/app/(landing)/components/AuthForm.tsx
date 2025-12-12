"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useSection } from "@/shared/lib/SectionContext";
import { SectionType } from "@/shared/types/landing";

import { login, getMe } from "@/shared/api/auth";
import { getCurrentBusiness } from "@/shared/api/business";

import { setTokens } from "@/store/slices/authSlice";
import { setBusiness } from "@/store/slices/businessSlice";
import { setUser } from "@/store/slices/userSlice";

import RegisterAgentModal from "@/app/(landing)/components/RegisterAgentModal";

const loginTitles: Record<SectionType, string> = {
    agent: "Travel Agent",
    agency: "Travel Agency",
    airline: "Airline",
};

interface APIErrorResponse {
    response?: {
        data?: {
            errors?: Record<string, string[]>;
            message?: string;
        };
    };
}

const roleToPath: Record<string, string> = {
    TravelAgent: "/dashboard/agent",
    TravelAgency: "/dashboard/agency",
    Airline: "/dashboard/airline",
    Partnership: "/dashboard/partnership",
    Passenger: "/passenger",
};

const AuthForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { activeSection } = useSection();
    const { t } = useTranslation();

    const loginTitle = loginTitles[activeSection as SectionType];

    const [openRegister, setOpenRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: false, password: false });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailEmpty = !email.trim();
        const passwordEmpty = !password.trim();
        setErrors({ email: emailEmpty, password: passwordEmpty });

        if (emailEmpty || passwordEmpty) {
            toast.error(t("auth.fillFields"));
            return;
        }

        try {
            setIsLoading(true);
            const { accessToken, refreshToken } = await login(email, password);
            dispatch(setTokens({ accessToken, refreshToken }));
            toast.success(t("auth.loginSuccess"));

            const user = await getMe();
            dispatch(setUser(user));

            // Пассажиры не имеют бизнеса, пропускаем запрос
            if (user.role.type !== "Passenger") {
                let business: any | null = null;
                try {
                    business = await getCurrentBusiness();
                } catch (_) {
                    if (user.role.type !== "TravelAgent") {
                        throw _;
                    }
                }
                if (business) dispatch(setBusiness(business));
            }

            await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, role: user.role.type }),
                credentials: "include",
            });

            const path = roleToPath[user.role.type] ?? "/";
            router.replace(path);
        } catch (err: unknown) {
            const apiError = err as APIErrorResponse;
            const firstMessage =
                apiError.response?.data?.errors
                    ? Object.values(apiError.response.data.errors)?.[0]?.[0]
                    : apiError.response?.data?.message;
            toast.error(firstMessage || t("auth.loginFail"));
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseClass =
        "w-full h-14 px-4 py-2 border rounded-2xl focus:outline-none";

    return (
        <div className="relative bg-white z-[100] text-black px-10 py-5 rounded-3xl shadow-md max-w-[300px] w-full">
            <p className="text-center body-L-semibold mb-8">
                {t(`auth.${loginTitle}`)}
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.username")}
                    autoComplete="username"
                    className={clsx(
                        inputBaseClass,
                        "mb-2",
                        errors.email ? "border-border-negative" : "border-border-default"
                    )}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.password")}
                    autoComplete="current-password"
                    className={clsx(
                        inputBaseClass,
                        "mb-5",
                        errors.password ? "border-border-negative" : "border-border-default"
                    )}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="hover:bg-action-primary-hovered cursor-pointer w-full h-12 py-2 bg-brand-blue text-white font-bold rounded-xl disabled:opacity-60"
                    disabled={isLoading}
                >
                    {isLoading ? t("auth.loading") : t("auth.login")}
                </button>
                <div className="flex justify-end mt-2 text-label-secondary">
                    {loginTitle !== "Airline" && activeSection === "agent" && (
                        <button
                            type="button"
                            onClick={() => setOpenRegister(true)}
                            className="body-M-regular underline"
                            disabled={isLoading}
                        >
                            {t("auth.register")}
                        </button>
                    )}
                </div>
            </form>
            <RegisterAgentModal
                isOpen={openRegister}
                onClose={() => setOpenRegister(false)}
            />
        </div>
    );
};

export default AuthForm;
