"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setTokens, clearTokens } from "@/store/slices/authSlice";
import { setBusiness } from "@/store/slices/businessSlice";
import { setUser } from "@/store/slices/userSlice";
import { getMe } from "@/shared/api/auth";
import { getCurrentBusiness } from "@/shared/api/business";

const roleToPath: Record<string, string> = {
    TravelAgent: "/dashboard/agent",
    TravelAgency: "/dashboard/agency",
    Airline: "/dashboard/airline",
    Partnership: "/dashboard/partnership",
    Passenger: "/passenger",
};

// Функция для декодирования JWT токена
const decodeJWT = (token: string): any => {
    try {
        const [, payload] = token.split(".");
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

const AutoAuth = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!searchParams) return;
        
        const token = searchParams.get("token");
        const role = searchParams.get("role");
        const autoAuth = searchParams.get("autoAuth");

        // Проверяем, нужно ли выполнить автоматическую авторизацию
        if (autoAuth === "true" && token) {
            // Если роль не предоставлена в URL, пытаемся декодировать из токена
            let decodedRole = role;
            if (!decodedRole && token) {
                const decoded = decodeJWT(token);
                decodedRole = decoded?.role?.type || decoded?.role;
            }
            
            if (decodedRole) {
                handleAutoAuth(token, decodedRole);
            } else {
                // Если не удалось получить роль, все равно пытаемся авторизоваться
                // Роль будет получена из getMe()
                handleAutoAuth(token, "");
            }
        }
    }, [searchParams]);

    const handleAutoAuth = async (token: string, roleFromUrl: string) => {
        if (isProcessing) return;
        
        try {
            setIsProcessing(true);

            // Сохраняем токен в Redux store
            // Для автоматической авторизации refreshToken может быть не предоставлен
            // Используем null, так как тип в authSlice - string | null
            dispatch(setTokens({ 
                accessToken: token, 
                refreshToken: null // Внешний сайт может не предоставлять refreshToken
            }));

            // Получаем данные пользователя (это также проверит валидность токена)
            const user = await getMe();
            dispatch(setUser(user));

            // Используем роль из данных пользователя, если она была получена
            const finalRole = user.role.type || roleFromUrl;

            // Сохраняем токен в cookies через API
            await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: token, role: finalRole }),
                credentials: "include",
            });

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

            // Перенаправляем на соответствующий дашборд
            const path = roleToPath[user.role.type] ?? roleToPath[roleFromUrl] ?? "/";
            
            // Очищаем URL от параметров авторизации
            router.replace(path);
            
            toast.success(t("auth.loginSuccess"));
        } catch (err: unknown) {
            console.error("Auto auth error:", err);
            toast.error(t("auth.loginFail"));
            
            // Очищаем токены при ошибке
            dispatch(clearTokens());
            
            // Перенаправляем на главную страницу без параметров
            router.replace("/");
        } finally {
            setIsProcessing(false);
        }
    };

    return null; // Компонент не рендерит UI
};

export default AutoAuth;

