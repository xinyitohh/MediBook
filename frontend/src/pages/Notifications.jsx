import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import PageHeader from "../components/PageHeader";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services";

const FILTERS = ["All", "Unread", "Read"];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
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

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch { /* silent */ }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* silent */ }
  }

  async function handleDelete(id) {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch { /* silent */ }
  }

  async function handleDeleteAll() {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch { /* silent */ }
    setConfirmClearAll(false);
  }

  const filtered = notifications.filter((n) => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "Read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date with your health activity"
      >
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-outline flex items-center gap-2 text-sm py-2"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="btn-danger-outline flex items-center gap-1.5 py-2"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          )}
        </div>
      </PageHeader>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              filter === f
                ? "bg-brand-500 text-white shadow-[0_4px_12px_rgba(15,111,255,0.25)]"
                : "bg-white border border-gray-200 text-gray-500 hover:border-brand-200 hover:text-brand-500"
            }`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="card p-8 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm">Loading notifications…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Bell size={28} className="opacity-40" />
          </div>
          <p className="font-semibold text-gray-500">
            {filter === "Unread" ? "No unread notifications" : "No notifications"}
          </p>
          <p className="text-sm text-gray-400">
            {filter === "Unread"
              ? "You're all caught up!"
              : "Notifications will appear here when there's activity on your account."}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100 overflow-hidden">
          {filtered.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Confirm clear all modal ── */}
      {confirmClearAll && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-heading mb-1">Clear all notifications?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently delete all {notifications.length} notification{notifications.length !== 1 ? "s" : ""}. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="btn-outline flex-1 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Single notification row ── */
function NotificationRow({ notification: n, onMarkRead, onDelete }) {
  const timeAgo = formatTimeAgo(n.createdAt);

  return (
    <div
      className={`group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
        !n.isRead ? "bg-brand-50/30" : ""
      }`}
    >
      {/* Unread dot */}
      <div className="pt-1.5 shrink-0">
        <span
          className={`block w-2 h-2 rounded-full transition-colors ${
            !n.isRead ? "bg-brand-500" : "bg-transparent"
          }`}
        />
      </div>

      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          !n.isRead ? "bg-brand-100 text-brand-500" : "bg-gray-100 text-gray-400"
        }`}
      >
        <Bell size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {n.title && (
          <p className={`text-base font-bold leading-snug ${!n.isRead ? "text-gray-900" : "text-gray-800"}`}>
            {n.title}
          </p>
        )}
        {n.message && (
          <p className={`text-sm leading-snug mt-1.5 ${!n.isRead ? "text-gray-700" : "text-gray-600"}`}>
            {n.message}
          </p>
        )}
        {n.description && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{n.description}</p>
        )}
        <p className="text-[11px] text-gray-400 mt-1">{timeAgo}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!n.isRead && (
          <button
            onClick={() => onMarkRead(n.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
            title="Mark as read"
          >
            <Check size={15} />
          </button>
        )}
        <button
          onClick={() => onDelete(n.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 size={15} />
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
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
