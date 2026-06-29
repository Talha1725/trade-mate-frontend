import { MARKET_WATCH_ICON_IMAGES } from "@/lib/mock-data/market-watch-card";
import type { HeaderNotificationItem } from "@/types/header-notifications";

export const mockHeaderNotifications: HeaderNotificationItem[] = [
  {
    id: "notification-1",
    title: "BTCUSD cross 70,000",
    tags: ["Price Alert", "BTCUSD"],
    time: "10 min ago",
    iconSrc: MARKET_WATCH_ICON_IMAGES.bitcoin,
    status: "active",
    isUnread: true,
  },
  {
    id: "notification-2",
    title: "SOLUSD position size above 80% recommended",
    tags: ["Risk Alert", "SOLUSD"],
    time: "25 min ago",
    iconSrc: MARKET_WATCH_ICON_IMAGES.solana,
    status: "triggered",
    isUnread: true,
  },
  {
    id: "notification-3",
    title: "ETHUSD liquidation zone approaching",
    tags: ["Liquidation Alert", "ETHUSD"],
    time: "1h ago",
    iconSrc: MARKET_WATCH_ICON_IMAGES.ethereum,
    status: "active",
    isUnread: true,
  },
];
