"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, Plus, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import InfoTooltip from "@/shared/ui/InfoTooltip";
import Loader from "@/shared/ui/Loader";
import { getWallet, getWishlists, getWalletTransactions, type Wishlist as WishlistType, type WalletTransaction } from "@/shared/api/passenger";

interface WishlistItem {
    id: string;
    name: string;
    destination: string;
    target: number;
    progress: number;
}

// Circular progress component for wishlist (like monthly activity in My Account)
const CircularProgress = ({ 
    value, 
    target, 
    size = 70 
}: { 
    value: number; 
    target: number; 
    size?: number;
}) => {
    const percentage = Math.min((value / target) * 100, 100);
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#0062E4"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs font-semibold text-gray-800 text-center leading-tight px-1">
                    {target.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const WalletPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"accounts" | "history">("accounts");
    const [wallet, setWallet] = useState<{ id: string; allTimeBalance: number; availableBalance: number; pendingBalance: number } | null>(null);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const accountsTabRef = useRef<HTMLButtonElement>(null);
    const historyTabRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const walletData = await getWallet();
                setWallet({
                    id: walletData.id,
                    allTimeBalance: walletData.allTimeBalance,
                    availableBalance: walletData.availableBalance,
                    pendingBalance: walletData.pendingBalance,
                });

                const wishlists = await getWishlists(walletData.id);
                setWishlistItems(
                    wishlists.map((w) => ({
                        id: w.id,
                        name: w.title,
                        destination: w.destination,
                        target: w.targetAmount,
                        progress: w.currentAmount,
                    }))
                );
            } catch (error) {
                console.error("Failed to load wallet data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Загрузка транзакций при переключении на вкладку history
    useEffect(() => {
        const loadTransactions = async () => {
            if (activeTab === "history" && wallet?.id) {
                try {
                    setLoadingTransactions(true);
                    const transactionsData = await getWalletTransactions(wallet.id);
                    setTransactions(transactionsData);
                } catch (error) {
                    console.error("Failed to load transactions:", error);
                    setTransactions([]);
                } finally {
                    setLoadingTransactions(false);
                }
            }
        };

        loadTransactions();
    }, [activeTab, wallet?.id]);

    const allTimeMiles = wallet?.allTimeBalance ?? 0;
    const availableToRedeem = wallet?.availableBalance ?? 0;
    const pending = wallet?.pendingBalance ?? 0;

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header с логотипом */}
            <header className="bg-background-dark px-4 pt-3 pb-3">
                <div className="flex justify-between items-center">
                    <Link href="/passenger" className="flex items-center gap-2 cursor-pointer">
                        <Image
                            src="/images/logo.png"
                            alt="IMS Savvy"
                            width={135}
                            height={30}
                            priority
                        />
                    </Link>
                </div>
            </header>

            {/* Tabs - на уровне хедера */}
            <div className="bg-background-dark px-4 py-2">
                <div className="relative flex justify-center gap-4">
                    <button
                        ref={accountsTabRef}
                        onClick={() => setActiveTab("accounts")}
                        className={`flex-1 text-center text-sm font-medium pb-1 ${
                            activeTab === "accounts"
                                ? "text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        {t("passenger.wallet.accounts")}
                    </button>
                    <button
                        ref={historyTabRef}
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 text-center text-sm font-medium pb-1 ${
                            activeTab === "history"
                                ? "text-blue-600"
                                : "text-gray-500"
                        }`}
                    >
                        {t("passenger.wallet.history")}
                    </button>
                    {/* Анимированный индикатор */}
                    <motion.div
                        className="absolute bottom-0 h-0.5 bg-blue-600"
                        initial={false}
                        animate={{
                            left: activeTab === "accounts" 
                                ? accountsTabRef.current?.offsetLeft || 0 
                                : historyTabRef.current?.offsetLeft || 0,
                            width: activeTab === "accounts"
                                ? accountsTabRef.current?.offsetWidth || 0
                                : historyTabRef.current?.offsetWidth || 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
            </div>

            {/* Фоновое изображение */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/images/passengersbg.png"
                    alt="Background"
                    fill
                    className="object-cover blur-[2px]"
                    priority
                />
                {/* Затемняющий overlay для читаемости */}
                <div className="absolute inset-0 bg-black/45" />
            </div>

            <div className="relative px-4 pt-6 pb-6">
                <div className="max-w-[600px] mx-auto">
                    <div className="space-y-4">
                        {/* Accounts Tab Content */}
                        {activeTab === "accounts" && (
                            <>
                                {loading ? (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/30">
                                        <Loader text={t("passenger.wallet.loading") || "Loading..."} />
                                    </div>
                                ) : (
                                    <>
                                        {/* Miles Accounts Section */}
                                        <div className="space-y-4">
                                            {/* All time Miles, Available to redeem and Pending */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* All time Miles - полная ширина, сверху */}
                                                <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm text-gray-600">{t("passenger.wallet.allTimeMiles")}</p>
                                                        <InfoTooltip 
                                                            text={t("passenger.wallet.allTimeMilesTooltip")}
                                                            position="top"
                                                        />
                                                    </div>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {allTimeMiles.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Available to redeem - снизу, первая колонка */}
                                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 justify-between flex flex-col gap-2">
                                                    <p className="text-sm text-gray-600">{t("passenger.wallet.availableToRedeem")}</p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {availableToRedeem.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Pending - снизу, вторая колонка */}
                                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 justify-between flex flex-col gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm text-gray-600">{t("passenger.wallet.pending")}</p>
                                                        <InfoTooltip 
                                                            text={t("passenger.wallet.pendingTooltip")}
                                                            position="top"
                                                        />
                                                    </div>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {pending.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Transfer Button */}
                                            <button
                                                onClick={() => router.push("/passenger/wallet/transfer")}
                                                className="bg-brand-blue text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#0056C0] transition-all flex items-center justify-center gap-2 w-fit mx-auto"
                                            >
                                                <ArrowRightLeft className="h-5 w-5" />
                                                {t("passenger.wallet.transfer")}
                                            </button>
                                        </div>

                                        {/* Wishlist Section */}
                                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/30">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold">{t("passenger.wallet.wishlist")}</h3>
                                                <button
                                                    onClick={() => router.push("/passenger/wallet/wishlist/new")}
                                                    className="bg-brand-blue text-white rounded-full p-2 hover:bg-[#0056C0] transition-all"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                            
                                            {wishlistItems.length > 0 ? (
                                                <div className="space-y-3">
                                                    {wishlistItems.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            onClick={() => router.push(`/passenger/wallet/wishlist/${item.id}`)}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                                                        >
                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-sm">{item.name}</p>
                                                                <p className="text-xs text-gray-500 underline">{item.destination}</p>
                                                            </div>
                                                            
                                                            {/* Circular Progress on the right */}
                                                            <CircularProgress 
                                                                value={item.progress}
                                                                target={item.target}
                                                                size={70}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm text-center py-4">
                                                    {t("passenger.wallet.noWishlistItems")}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* History Tab Content */}
                        {activeTab === "history" && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/30">
                                {loadingTransactions ? (
                                    <div className="py-8">
                                        <Loader text={t("passenger.wallet.loading") || "Loading..."} />
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-8">
                                        {t("passenger.wallet.noTransactions")}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm text-gray-900">
                                                            {transaction.description || transaction.category}
                                                        </p>
                                                        {transaction.category && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {transaction.category}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold text-sm ${
                                                            transaction.type === "Credit" 
                                                                ? "text-green-600" 
                                                                : "text-red-600"
                                                        }`}>
                                                            {transaction.type === "Credit" ? "+" : "-"}
                                                            {Math.abs(transaction.amount).toLocaleString()}
                                                        </p>
                                                        <p className={`text-xs mt-1 ${
                                                            transaction.status === "Confirmed"
                                                                ? "text-green-600"
                                                                : "text-yellow-600"
                                                        }`}>
                                                            {transaction.status}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(transaction.createdAt).toLocaleDateString("ru-RU", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;



