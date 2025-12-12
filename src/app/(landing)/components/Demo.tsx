"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { sendDemoRequest, DemoRequestPayload } from "@/shared/api/demo";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {useSection} from "@/shared/lib/SectionContext";
import { InfoTooltip } from "@/shared/ui";

interface Props { isOpen: boolean; onClose: () => void; }

const fields = [
    "companyName",
    "firstName",
    "lastName",
    "department",
    "jobTitle",
    "email",
] as const;
type Field = typeof fields[number];

export default function Demo({ isOpen, onClose }: Props) {
    const {activeSection} = useSection();
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // Функция для проверки латинских символов
    const isLatinOnly = (text: string): boolean => {
        // Разрешаем латинские буквы, цифры, пробелы и основные знаки препинания
        return /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/]*$/.test(text);
    };

    const handleChange = (field: Field, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const hasEmpty = fields.some((f) => !formData[f]?.trim());
        if (hasEmpty) { toast.error(t("demo.fillAllFields")); return; }

        // Проверка на латинские символы для всех полей кроме email
        const nonEmailFields = fields.filter(f => f !== "email");
        const hasNonLatin = nonEmailFields.some((f) => !isLatinOnly(formData[f]?.trim() || ""));
        if (hasNonLatin) { toast.error(t("demo.latinOnly")); return; }

        // Проверка email
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast.error(t("demo.emailInvalid")); return;
        }

        const payload: DemoRequestPayload = {
            companyName: formData.companyName.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            department: formData.department.trim(),
            jobTitle: formData.jobTitle.trim(),
            email: formData.email.trim(),
        };

        try {
            setLoading(true);
            await sendDemoRequest(payload);
            toast.success(t("demo.sent"));
            onClose();
        } catch (err: any) {
            const message = err?.response?.data?.message || t("demo.errorSend");
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const baseInput =
        "placeholder-label-additional text-label-primary w-full h-12 px-4 py-2 border rounded-xl focus:outline-none";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative mx-4" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-black" onClick={onClose}><X /></button>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <p className="body-L-semibold text-label-primary">{t("demo.title")}</p>
                    <InfoTooltip 
                        text={t("demo.validationTooltip")} 
                        position="top"
                        className="flex-shrink-0"
                    />
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {fields.map((field) => {
                        const isEmail = field === "email";
                        const hasValue = formData[field]?.trim();
                        const isInvalidEmpty = submitted && !hasValue;
                        const isInvalidLatin = submitted && hasValue && !isEmail && !isLatinOnly(formData[field]?.trim() || "");
                        const isInvalidEmail = submitted && hasValue && isEmail && !/^\S+@\S+\.\S+$/.test(formData.email);
                        
                        return (
                            <input
                                key={field}
                                type={isEmail ? "email" : "text"}
                                placeholder={field === 'department' ? activeSection === 'agency' ? t(`demo.team`) : t(`demo.department`) : t(`demo.${field}`)}
                                value={formData[field] || ""}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className={clsx(
                                    baseInput,
                                    (isInvalidEmpty || isInvalidLatin || isInvalidEmail) ? "border-red-500" : "border-border-default"
                                )}
                            />
                        );
                    })}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full hover:bg-action-primary-hovered bg-brand-blue text-white font-semibold h-12 rounded-xl disabled:opacity-60"
                    >
                        {loading ? t("demo.sending") : t("demo.send")}
                    </button>
                </form>
            </div>
        </div>
    );
}
