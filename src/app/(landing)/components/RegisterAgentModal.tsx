"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "@/shared/i18n";

import { registerAgent } from "@/shared/api/auth";
import { getCountries, getCitiesByCountry, getAgencies, getCitiesByBusiness } from "@/shared/api/locations";

import { AgentRegisterPayload } from "@/entities/auth/types";
import { getBranches, getBranchesByCity } from "@/shared/api/branches";
import { getRoles } from "@/shared/api/roles";
import { getStructures } from "@/shared/api/structures";

interface APIErrorResponse {
    response?: {
        data?: {
            errors?: Record<string, string[]>;
            message?: string;
        };
    };
}

type Props = { isOpen: boolean; onClose: () => void };

const reqFields = ["email", "firstName", "lastName", "phoneNumber", "businessId", "branchId", "roleId", "structureId"] as const;
type ReqField = typeof reqFields[number];

type Option = { id: string; name: string };

export default function RegisterAgentModal({ isOpen, onClose }: Props) {
    const { t } = useTranslation();

    const [data, setData] = useState<AgentRegisterPayload>({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        businessId: "",
        branchId: "",
        roleId: "",
        structureId: "",
        comment: "",
    });

    const [countries, setCountries] = useState<Option[]>([]);
    const [cities, setCities] = useState<Option[]>([]);
    const [agencies, setAgencies] = useState<Option[]>([]);
    const [branches, setBranches] = useState<Option[]>([]);
    const [roles, setRoles] = useState<Option[]>([]);
    const [structures, setStructures] = useState<Option[]>([]);

    const [countryId, setCountryId] = useState("");
    const [cityId, setCityId] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingAgencies, setLoadingAgencies] = useState(false);
    const [loadingBizDeps, setLoadingBizDeps] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const baseInput =
        "placeholder-label-additional text-label-primary w-full h-10 px-3 py-2 border rounded-lg focus:outline-none text-sm";

    const baseSelect =
        "w-full h-10 px-3 py-2 border rounded-lg focus:outline-none text-sm bg-white";

    const change = (k: keyof AgentRegisterPayload, v: string) =>
        setData((s) => ({ ...s, [k]: v }));

    useEffect(() => {
        if (!isOpen) return;
        const load = async () => {
            try {
                setLoadingCountries(true);
                const cs = await getCountries();
                setCountries(cs);
            } catch (e) {
                toast.error(t("common.loadFail") || "Не удалось загрузить страны");
            } finally {
                setLoadingCountries(false);
            }
        };
        load();
    }, [isOpen, t, i18n.language]);

    useEffect(() => {
        if (!countryId) {
            setCities([]);
            setAgencies([]);
            setCityId("");
            return;
        }

        const loadAgencies = async () => {
            try {
                setLoadingAgencies(true);
                const res = await getAgencies([countryId], []);
                const normalized: Option[] = (res || []).map((x: any) => ({
                    id: x.id,
                    name: x.value ?? x.name ?? "",
                }));
                setAgencies(normalized);
            } catch {
                setAgencies([]);
                toast.error(t("common.loadFail") || "Не удалось загрузить агентства");
            } finally {
                setLoadingAgencies(false);
            }
        };

        setCityId("");
        setData((s) => ({
            ...s,
            businessId: "",
            branchId: "",
            roleId: "",
            structureId: "",
        }));
        setBranches([]);
        setRoles([]);
        setStructures([]);

        loadAgencies();
    }, [countryId, t]);

    useEffect(() => {
        if (!data.businessId) {
            setCities([]);
            setCityId("");
            return;
        }

        const loadCities = async () => {
            try {
                setLoadingCities(true);
                const ct = await getCitiesByBusiness(data.businessId);
                const normalized: Option[] = (ct || []).map((x: any) => ({
                    id: x.id,
                    name: x.name ?? "",
                }));
                setCities(normalized);
            } catch (error) {
                setCities([]);
                toast.error(t("common.loadFail") || "Не удалось загрузить города");
            } finally {
                setLoadingCities(false);
            }
        };
        loadCities();
    }, [data.businessId, t]);

    useEffect(() => {
        if (!data.businessId) {
            setBranches([]);
            setRoles([]);
            setStructures([]);
            change("branchId", "");
            change("roleId", "");
            change("structureId", "");
            return;
        }

        const loadBusinessDeps = async () => {
            try {
                setLoadingBizDeps(true);
                const [rl, st] = await Promise.all([
                    getRoles(data.businessId),
                    getStructures(data.businessId),
                ]);

                const nr: Option[] = (rl || []).map((x: any) => ({
                    id: x.id,
                    name: x.name ?? x.value ?? "",
                }));
                const ns: Option[] = (st || []).map((x: any) => ({
                    id: x.id,
                    name: x.name ?? x.value ?? "",
                }));

                setRoles(nr);
                setStructures(ns);
            } catch {
                setRoles([]);
                setStructures([]);
                toast.error(t("common.loadFail") || "Не удалось загрузить данные бизнеса");
            } finally {
                setLoadingBizDeps(false);
            }
        };

        change("roleId", "");
        change("structureId", "");

        loadBusinessDeps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.businessId, t]);

    useEffect(() => {
        if (!data.businessId || !cityId) {
            setBranches([]);
            change("branchId", "");
            return;
        }

        const loadBranches = async () => {
            try {
                setLoadingBizDeps(true);
                const br = await getBranchesByCity(data.businessId, cityId);

                const nb: Option[] = (br || []).map((x: any) => ({
                    id: x.id,
                    name: x.name ?? x.value ?? "",
                }));

                setBranches(nb);
            } catch {
                setBranches([]);
                toast.error(t("common.loadFail") || "Не удалось загрузить филиалы");
            } finally {
                setLoadingBizDeps(false);
            }
        };

        change("branchId", "");
        loadBranches();
    }, [data.businessId, cityId, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const hasEmpty = reqFields.some((f: ReqField) => !String(data[f] || "").trim());
        if (hasEmpty) return toast.error(t("auth.fillFields"));
        if (!cityId) return toast.error(t("auth.fillFields"));
        if (!/^\S+@\S+\.\S+$/.test(data.email)) return toast.error(t("demo.emailInvalid"));

        const payload: Record<string, any> = {
            email: data.email.trim(),
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            phoneNumber: data.phoneNumber?.trim() || "",
            businessId: data.businessId,
            branchId: data.branchId,
            roleId: data.roleId,
            structureId: data.structureId,
        };
        if (data.comment && data.comment.trim()) payload.comment = data.comment.trim();

        try {
            setLoading(true);
            await registerAgent(payload as any);
            toast.success(t("auth.registerSuccess"));

            onClose();
        } catch (error: unknown) {
            const apiError = error as APIErrorResponse;
            const firstMessage = apiError.response?.data?.errors
                ? Object.values(apiError.response.data.errors)?.[0]?.[0]
                : apiError.response?.data?.message;

            toast.error(firstMessage || t("auth.registerFail"));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="mt-12 bg-white rounded-2xl shadow-xl w-full max-w-[420px] p-4 md:p-5 relative mx-4
                   max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-3 right-3 text-black" onClick={onClose}>
                    <X />
                </button>

                <p className="text-center mb-4 md:mb-5 body-L-semibold text-label-primary text-base md:text-lg">
                    {t("auth.registerAgentTitle")}
                </p>

                <form className="space-y-2.5" onSubmit={handleSubmit}>
                    {/* Страна */}
                    <select
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                        className={clsx(baseSelect, loadingCountries ? "opacity-70" : "border-border-default")}
                        disabled={loadingCountries}
                    >
                        <option value="">{t("common.selectCountry") || "Выберите страну"}</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Агентство */}
                    <select
                        value={data.businessId}
                        onChange={(e) => change("businessId", e.target.value)}
                        className={clsx(baseSelect, loadingAgencies ? "opacity-70" : submitted && !data.businessId ? "border-red-500" : "border-border-default")}
                        disabled={!countryId || loadingAgencies}
                    >
                        <option value="">{t("common.selectAgency") || "Выберите агентство"}</option>
                        {agencies.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>

                    {/* Город */}
                    <select
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        className={clsx(baseSelect, loadingCities ? "opacity-70" : submitted && !cityId ? "border-red-500" : "border-border-default")}
                        disabled={!data.businessId || loadingCities}
                    >
                        <option value="">{t("common.selectCity") || "Выберите город"}</option>
                        {cities?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Филиал */}
                    <select
                        value={data.branchId}
                        onChange={(e) => change("branchId", e.target.value)}
                        className={clsx(baseSelect, loadingBizDeps ? "opacity-70" : submitted && !data.branchId ? "border-red-500" : "border-border-default")}
                        disabled={!data.businessId || !cityId || loadingBizDeps}
                    >
                        <option value="">{t("common.selectBranch") || "Выберите филиал"}</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    {/* Отдел */}
                    <select
                        value={data.structureId}
                        onChange={(e) => change("structureId", e.target.value)}
                        className={clsx(baseSelect, loadingBizDeps ? "opacity-70" : submitted && !data.structureId ? "border-red-500" : "border-border-default")}
                        disabled={!data.businessId || loadingBizDeps}
                    >
                        <option value="">{t("common.selectDepartment") || "Выберите отдел"}</option>
                        {structures.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {/* Должность */}
                    <select
                        value={data.roleId}
                        onChange={(e) => change("roleId", e.target.value)}
                        className={clsx(baseSelect, loadingBizDeps ? "opacity-70" : submitted && !data.roleId ? "border-red-500" : "border-border-default")}
                        disabled={!data.businessId || loadingBizDeps}
                    >
                        <option value="">{t("common.selectRole") || "Выберите должность"}</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>

                     {/* Имя */}
                    <input
                        type="text"
                        placeholder={t("auth.firstName")}
                        value={data.firstName}
                        onChange={(e) => change("firstName", e.target.value)}
                        className={clsx(baseInput, submitted && !data.firstName ? "border-red-500" : "border-border-default")}
                    />
                    
                    {/* Фамилия */}
                    <input
                        type="text"
                        placeholder={t("auth.lastName")}
                        value={data.lastName}
                        onChange={(e) => change("lastName", e.target.value)}
                        className={clsx(baseInput, submitted && !data.lastName ? "border-red-500" : "border-border-default")}
                    />
                    <input
                        type="tel"
                        placeholder={t("auth.phone")}
                        value={data.phoneNumber}
                        onChange={(e) => change("phoneNumber", e.target.value)}
                        className={clsx(baseInput, submitted && !data.phoneNumber ? "border-red-500" : "border-border-default")}
                    />

                    {/* Электронная почта */}
                    <input
                        type="email"
                        placeholder={t("auth.email")}
                        value={data.email}
                        onChange={(e) => change("email", e.target.value)}
                        className={clsx(baseInput, submitted && !data.email ? "border-red-500" : "border-border-default")}
                    />

                    {/* Комментарий */}
                    <input
                        type="text"
                        placeholder={t("auth.commentOptional")}
                        value={data.comment ?? ""}
                        onChange={(e) => change("comment", e.target.value)}
                        className={clsx(baseInput, "border-border-default")}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full hover:bg-action-primary-hovered bg-brand-blue text-white font-semibold h-11 rounded-lg disabled:opacity-60 text-sm md:text-base"
                    >
                        {loading ? t("auth.loading") : t("auth.register")}
                    </button>
                </form>
            </div>
        </div>
    );
}
