import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { MoreHorizontal, Pencil, Trash2, Send, ChevronDown } from 'lucide-react';

export default function ActionDropdown({ user, type, onEdit, onDelete, onResendLink }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Safeguard against missing user object
  if (!user) return null;

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 192, // 192px = w-48 width
      });
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (e, actionFn) => {
    e.stopPropagation();
    setIsOpen(false);
    if (actionFn) actionFn(user);
  };

  // Safeguard `type` to be a string to avoid "Objects are not valid as a React child" error
  const displayType = typeof type === 'string' ? type : 'User';

  return (
    <>
      {/* ── Toggle Button ── */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-2 focus:ring-brand-500/20"
      >
        Go to <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ── Dropdown Menu (Portal) ── */}
      {isOpen && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5 z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button
            onClick={(e) => handleAction(e, onEdit)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors text-left"
          >
            <Pencil size={14} /> Edit {displayType}
          </button>

          {/* Conditionally render Resend Link if email is NOT confirmed */}
          {!user.emailConfirmed && (
            <button
              onClick={(e) => handleAction(e, onResendLink)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left"
            >
              <Send size={14} /> Resend Link
            </button>
          )}

          <div className="h-px bg-gray-100 my-1 mx-2"></div>

          <button
            onClick={(e) => handleAction(e, onDelete)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>,
        document.body
      )}
    </>
  );
}