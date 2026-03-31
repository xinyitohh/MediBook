import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Edit2, X, Trash2, Plus, Check } from 'lucide-react';
import { getAllSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../services/specialtyService';

export default function EnhancedSpecialtyDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Edit mode states
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [newItemName, setNewItemName] = useState("");
  const [saving, setSaving] = useState(false);
  
  const dropdownRef = useRef(null);

  // Fetch specialties on mount
  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllSpecialties();
      setSpecialties(res.data || []);
    } catch (err) {
      setError("Failed to load specialties");
      console.error("Fetch specialties error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditMode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle edit mode and reset edit states
  const toggleEditMode = (e) => {
    e.stopPropagation();
    setIsEditMode(!isEditMode);
    setSelectedForDeletion([]);
    setNewItemName("");
    const initialEdits = {};
    specialties.forEach(s => { initialEdits[s.id] = s.name; });
    setEditValues(initialEdits);
  };

  // Handle individual item deletion selection
  const toggleDeleteSelection = (id) => {
    setSelectedForDeletion(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle saving all edits
  const handleSaveEdits = async (e) => {
    e.stopPropagation();
    setSaving(true);
    setError("");

    try {
      // 1. Process deletions (DELETE API calls)
      for (const id of selectedForDeletion) {
        try {
          await deleteSpecialty(id);
        } catch (err) {
          console.error(`Failed to delete specialty ${id}:`, err);
          throw new Error(`Failed to delete specialty`);
        }
      }

      // 2. Process text updates (PUT API calls for modified items)
      for (const specialty of specialties) {
        if (selectedForDeletion.includes(specialty.id)) continue; // Skip deleted items
        const newName = editValues[specialty.id];
        if (newName && newName !== specialty.name) {
          try {
            await updateSpecialty(specialty.id, { name: newName.trim() });
          } catch (err) {
            console.error(`Failed to update specialty ${specialty.id}:`, err);
            throw new Error(`Failed to update specialty`);
          }
        }
      }

      // 3. Process new item (POST API call)
      if (newItemName.trim()) {
        try {
          await createSpecialty({ name: newItemName.trim() });
        } catch (err) {
          console.error("Failed to create specialty:", err);
          throw new Error("Failed to create specialty");
        }
      }

      // Refresh the list from backend
      await fetchSpecialties();
      
      // Close edit mode
      setIsEditMode(false);
      setSelectedForDeletion([]);
      setNewItemName("");
    } catch (err) {
      setError(err.message || "Failed to save specialties");
      console.error("Save specialties error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* ── Standard Dropdown Trigger ── */}
      <div 
        onClick={() => !isEditMode && setIsOpen(!isOpen)}
        className={`input-field flex items-center justify-between cursor-pointer bg-white ${isOpen ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Select specialty..."}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {isEditMode ? "Manage Specialties" : "Specialties"}
            </span>
            
            {isEditMode ? (
              <div className="flex items-center gap-1">
                {selectedForDeletion.length > 0 && (
                  <button 
                    onClick={handleSaveEdits}
                    disabled={saving}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title={`Delete ${selectedForDeletion.length} items`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button 
                  onClick={handleSaveEdits}
                  disabled={saving}
                  className="p-1.5 text-mint-600 hover:bg-mint-50 rounded-md transition-colors disabled:opacity-50"
                  title="Save changes"
                >
                  {saving ? <div className="w-3 h-3 border border-mint-600 border-t-transparent rounded-full animate-spin" /> : <Check size={14} />}
                </button>
                <button 
                  onClick={toggleEditMode}
                  disabled={saving}
                  className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={toggleEditMode} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-md transition-colors" title="Edit list">
                <Edit2 size={13} />
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-3 py-2 bg-red-50 border-b border-red-100 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
            </div>
          )}

          {/* List Content */}
          {!loading && (
            <div className="max-h-60 overflow-y-auto p-1">
              {/* Prototype 1: View Mode */}
              {!isEditMode && specialties.map((specialty) => (
                <div
                  key={specialty.id}
                  onClick={() => {
                    onChange({ name: specialty.name, id: specialty.id });
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    value === specialty.name ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {specialty.name}
                </div>
              ))}

              {/* Prototype 2: Edit Mode */}
              {isEditMode && specialties.map((specialty) => (
                <div key={specialty.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg group">
                  <input 
                    type="checkbox" 
                    checked={selectedForDeletion.includes(specialty.id)}
                    onChange={() => toggleDeleteSelection(specialty.id)}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editValues[specialty.id] || ""}
                    onChange={(e) => setEditValues({...editValues, [specialty.id]: e.target.value})}
                    className={`flex-1 text-sm bg-transparent border border-transparent hover:border-gray-200 focus:border-brand-500 focus:bg-white focus:ring-0 rounded px-2 py-1 transition-all ${
                      selectedForDeletion.includes(specialty.id) ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                    disabled={selectedForDeletion.includes(specialty.id)}
                  />
                </div>
              ))}

              {/* Add New Item Row (Edit Mode Only) */}
              {isEditMode && (
                <div className="flex items-center gap-2 px-2 py-2 mt-2 border-t border-gray-100">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Plus size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Add New..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 text-sm bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white focus:ring-0 rounded px-2 py-1.5 transition-all text-gray-700 placeholder-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveEdits(e);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}