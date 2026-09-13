export type HeaderNotificationStatus = "active" | "triggered";

export type HeaderNotificationItem = {
  id: string;
  title: string;
  tags: string[];
  time: string;
  iconSrc: string;
  status: HeaderNotificationStatus;
  isUnread?: boolean;
};

export type HeaderNotificationsDropdownProps = {
  notifications?: HeaderNotificationItem[];
  onNotificationClick?: (notificationId: string) => void;
  className?: string;
};
