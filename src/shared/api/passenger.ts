import axiosInstance from './axiosInstance';

export interface StoryImage {
    url: string;
    isMobile: boolean;
}

export enum BusinessType {
    Airline = 'Airline',
    Gym = 'Gym',
    CoffeeShop = 'CoffeeShop',
    Restaurant = 'Restaurant',
    Hotel = 'Hotel',
    Bank = 'Bank'
}

export interface Story {
    id: string;
    name: string;
    description: string;
    images: StoryImage[];
    startDate: string;
    endDate: string;
    businessType: BusinessType;
    businessLogo?: string;
}

export interface Tier {
    id: string;
    code: string;
    name: string;
    color: string;
    discountPercent: number;
    levelOrder: number;
}

export interface TierHistory {
    id: string;
    userId: string;
    tier: Tier;
    validFrom: string;
    validTo: string;
}

/**
 * История уровней лояльности
 */
export async function getTierHistories(months: number = 3): Promise<TierHistory[]> {
    const { data } = await axiosInstance.get('/api/tiers/me/histories', {
        params: { months }
    });
    return data;
}

export interface Activity {
    name: string;
    metric: string;
    completed: number;
    required: number;
}

export interface TransactionsSummary {
    tripsCompleted: number;
    tripsRequired: number;
    monthlyActivityCompleted: number;
    monthlyActivityRequired: number;
    activities: Activity[];
}

/**
 * Сводка по транзакциям пользователя
 */
export async function getTransactionsSummary(from?: string, to?: string): Promise<TransactionsSummary> {
    const params: { from?: string; to?: string } = {};
    if (from) params.from = from;
    if (to) params.to = to;
    
    const { data } = await axiosInstance.get('/api/transactions/me/summary', { params });
    return data;
}

/**
 * История операции с милями
 */
export async function getMilesTransactions(): Promise<any> {
    const { data } = await axiosInstance.get('/api/miles/me/transactions');
    return data;
}

export interface MilesSummary {
    userId: string;
    totalMiles: number;
    confirmed: number;
    unconfirmed: number;
}

/**
 * Сводка по милям пользователя
 */
export async function getMilesSummary(): Promise<MilesSummary> {
    const { data } = await axiosInstance.get('/api/miles/me/summary');
    return data;
}

export interface PromoCountry {
    code: string;
    name: string;
}

/**
 * Получение списка стран для промо-сторис
 */
export async function getPromoCountries(): Promise<PromoCountry[]> {
    const { data } = await axiosInstance.get<PromoCountry[]>('/api/promos/countries');
    return data;
}

/**
 * Получение stories для пассажира
 */
export async function getStories(countryCode?: string): Promise<Story[]> {
    const params: { countryCode?: string } = {};
    if (countryCode) {
        params.countryCode = countryCode;
    }
    const { data } = await axiosInstance.get('/api/promos/stories', { params });
    return data;
}

export interface TransactionItem {
    id: string;
    userId: string;
    transactionId: string;
    category: string;
    description: string;
    miles: number;
    type: "Earn" | "Spend";
    status: "Confirmed" | "Pending";
    createdAt: string;
}

export interface TransactionsResponse {
    items: TransactionItem[];
    total: number;
    offset: number;
    limit: number;
}

/**
 * Получение транзакций пользователя
 */
export async function getTransactions(offset = 0, limit = 100): Promise<TransactionsResponse> {
    const { data } = await axiosInstance.get('/api/miles/me/transactions', {
        params: { offset, limit }
    });
    return data;
}

/**
 * Получение списка всех тиров лояльности
 */
export async function getTiers(): Promise<Tier[]> {
    const { data } = await axiosInstance.get<Tier[]>('/api/tiers');
    return data;
}

export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    reservedBalance: number;
    pendingBalance: number;
    availableBalance: number;
    allTimeBalance: number;
}

/**
 * Получение кошелька текущего пользователя
 */
export async function getWallet(): Promise<Wallet> {
    const { data } = await axiosInstance.get<Wallet>('/api/wallets/me');
    return data;
}

export interface Wishlist {
    id: string;
    walletId: string;
    userId: string;
    title: string;
    destination: string;
    targetAmount: number;
    currentAmount: number;
    rule: string;
    rulePercent: number;
}

/**
 * Получение списка wishlists для кошелька
 */
export async function getWishlists(walletId: string): Promise<Wishlist[]> {
    const { data } = await axiosInstance.get<Wishlist[]>(`/api/wallets/${walletId}/wishlists`);
    return data;
}

/**
 * Получение конкретного wishlist
 */
export async function getWishlist(walletId: string, wishlistId: string): Promise<Wishlist> {
    const { data } = await axiosInstance.get<Wishlist>(`/api/wallets/${walletId}/wishlists/${wishlistId}`);
    return data;
}

export interface CreateWishlistPayload {
    title: string;
    destination: string;
    targetAmount: number;
    rule?: string;
    rulePercent?: number;
}

/**
 * Создание нового wishlist
 */
export async function createWishlist(walletId: string, payload: CreateWishlistPayload): Promise<Wishlist> {
    const { data } = await axiosInstance.post<Wishlist>(`/api/wallets/${walletId}/wishlists`, payload);
    return data;
}

export interface UpdateWishlistPayload {
    title?: string;
    description?: string;
    destination?: string;
    targetAmount?: number;
    rule?: string;
    rulePercent?: number;
}

/**
 * Обновление wishlist
 */
export async function updateWishlist(walletId: string, wishlistId: string, payload: UpdateWishlistPayload): Promise<Wishlist> {
    const { data } = await axiosInstance.patch<Wishlist>(`/api/wallets/${walletId}/wishlists/${wishlistId}`, payload);
    return data;
}

/**
 * Удаление wishlist
 */
export async function deleteWishlist(walletId: string, wishlistId: string): Promise<void> {
    await axiosInstance.delete(`/api/wallets/${walletId}/wishlists/${wishlistId}`);
}

export interface ReserveFundsPayload {
    amount: number;
}

/**
 * Резервирование средств для wishlist
 */
export async function reserveFunds(walletId: string, wishlistId: string, payload: ReserveFundsPayload): Promise<void> {
    await axiosInstance.post(`/api/wallets/${walletId}/wishlists/${wishlistId}/reserve`, payload);
}

/**
 * Освобождение средств из wishlist
 */
export async function releaseFunds(walletId: string, wishlistId: string, payload: ReserveFundsPayload): Promise<void> {
    await axiosInstance.post(`/api/wallets/${walletId}/wishlists/${wishlistId}/release`, payload);
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    userId: string;
    type: "Debit" | "Credit";
    status: "Pending" | "Confirmed";
    amount: number;
    wishlistId?: string;
    category: string;
    description: string;
    sourceType: string;
    sourceId: string;
    createdAt: string;
}

/**
 * Получение транзакций кошелька
 */
export async function getWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
    const { data } = await axiosInstance.get<WalletTransaction[]>(`/api/wallets/${walletId}/transactions`);
    return data;
}


