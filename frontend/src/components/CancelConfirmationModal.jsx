import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function CancelConfirmationModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
              <AlertCircle size={28} />
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-extrabold text-[#1A1C1E] mb-3">Cancel Appointment?</h3>
          <p className="text-[#6C7278] text-[15px] mb-8 leading-relaxed">
            Are you sure you want to cancel this appointment? This action cannot be undone. Please provide a reason for the cancellation.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#9BA1A7] uppercase tracking-[0.1em] mb-3 block">
                Reason for Cancellation
              </label>
              <textarea
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, etc."
                rows={4}
                className="w-full px-5 py-4 bg-[#F7F8F9] border border-transparent rounded-[20px] text-[15px] focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/5 transition-all resize-none outline-none placeholder:text-[#9BA1A7] text-[#1A1C1E]"
              />
              <div className="mt-2 flex justify-end">
                <span className={`text-[11px] font-bold tracking-wider uppercase ${reason.trim().length < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {reason.trim().length < 5 ? 'Min. 5 characters required' : 'Ready to cancel'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-2 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-[20px] text-[15px] font-bold text-[#4B5157] bg-white border border-[#E9EAEB] hover:bg-[#F7F8F9] hover:border-[#D1D3D4] transition-all"
          >
            Keep Appointment
          </button>
          <button 
            type="button"
            onClick={() => onConfirm(reason)}
            disabled={loading || reason.trim().length < 5}
            className="flex-1 px-6 py-4 rounded-[20px] text-[15px] font-bold text-white bg-[#FF3B30] hover:bg-[#E03128] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(255,59,48,0.25)] hover:shadow-none transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Cancelling...</span>
              </div>
            ) : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
