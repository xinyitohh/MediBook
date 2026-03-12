import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, X, ChevronRight } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* ── Fetch unread count on mount & periodically ── */
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, []);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function fetchUnreadCount() {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data?.count ?? res.data ?? 0);
    } catch {
      /* silent */
    }
  }

  async function openDropdown() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id, e) {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* silent */ }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    const notif = notifications.find((n) => n.id === id);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* silent */ }
  }

  function handleViewAll() {
    setOpen(false);
    navigate("/notifications");
  }

  const displayed = notifications.slice(0, 8);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell button ── */}
      <button
        onClick={openDropdown}
        className="relative w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50 transition-all duration-150 shadow-sm"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-heading">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-500 text-[11px] font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={13} />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
                <span className="text-xs">Loading…</span>
              </div>
            ) : displayed.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
                <Bell size={28} className="opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              displayed.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                View all notifications
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Single notification row ── */
function NotificationItem({ notification: n, onMarkRead, onDelete }) {
  const timeAgo = formatTimeAgo(n.createdAt);

  return (
    <div
      className={`group relative flex gap-3 px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50 ${
        !n.isRead ? "bg-brand-50/40" : ""
      }`}
    >
      {/* Unread dot */}
      {!n.isRead && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
      )}

      <div className="flex-1 min-w-0 pl-1">
        <p className={`text-sm leading-snug ${!n.isRead ? "font-semibold text-gray-800" : "text-gray-600"}`}>
          {n.message ?? n.title ?? n.content ?? "Notification"}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo}</p>
      </div>

      {/* Actions (show on hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!n.isRead && (
          <button
            onClick={(e) => onMarkRead(n.id, e)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
            title="Mark as read"
          >
            <Check size={13} />
          </button>
        )}
        <button
          onClick={(e) => onDelete(n.id, e)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
