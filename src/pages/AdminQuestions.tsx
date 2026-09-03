import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Trash2,
  Save,
  ChevronDown,
  Building2,
  Tag,
  FileText,
  ArrowLeft,
  ShieldCheck,
  Search,
  Edit3,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminQuestion {
  id: string;
  company: string;
  category: 'technical' | 'behavioral' | 'system-design';
  role: string;
  text: string;
  followUp: string;
  evaluationCriteria: string[];
}

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Zoho', 'Meta', 'Custom'];
const CATEGORIES = ['technical', 'behavioral', 'system-design'] as const;

const ADMIN_PASSWORD = 'talentsim2024'; // Simple gate; replace with real auth later

// ─── Persist/Load from localStorage ──────────────────────────────────────────
const STORAGE_KEY = 'talentsim_admin_questions';

function loadQuestions(): AdminQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQuestions(qs: AdminQuestion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
}

// ─── Empty Form Template ──────────────────────────────────────────────────────
const emptyForm = (): Omit<AdminQuestion, 'id'> => ({
  company: 'Google',
  category: 'technical',
  role: '',
  text: '',
  followUp: '',
  evaluationCriteria: [''],
});

// ─── Admin Login Gate ─────────────────────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="neural-orb-1 top-[-100px] left-[-100px]" />
        <div className="neural-orb-2 bottom-[-80px] right-[-80px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Logo size="md" />
          <div className="flex items-center justify-center gap-2 mt-4">
            <ShieldCheck className="w-5 h-5 text-[#5B5FEF]" />
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
          </div>
          <p className="text-sm text-[#94A3B8]">TalentSim Question Bank Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel border border-[#263248] rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Admin Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full bg-[#0A0F1C] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#4A5568] outline-none transition-all ${
                error
                  ? 'border-rose-500 ring-1 ring-rose-500/30'
                  : 'border-[#263248] focus:border-[#5B5FEF] focus:ring-1 focus:ring-[#5B5FEF]/30'
              }`}
            />
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <X className="w-3 h-3" /> Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5B5FEF] to-[#9D4EDD] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
          >
            Enter Admin Panel
          </button>
        </form>

        <p className="text-center text-xs text-[#4A5568]">
          Default password: <code className="text-[#94A3B8]">talentsim2024</code>
        </p>
      </div>
    </div>
  );
};

// ─── Question Form Modal ──────────────────────────────────────────────────────
const QuestionFormModal: React.FC<{
  initial?: AdminQuestion;
  onSave: (q: AdminQuestion) => void;
  onClose: () => void;
}> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<Omit<AdminQuestion, 'id'>>(
    initial
      ? {
          company: initial.company,
          category: initial.category,
          role: initial.role,
          text: initial.text,
          followUp: initial.followUp,
          evaluationCriteria: initial.evaluationCriteria,
        }
      : emptyForm()
  );
  const [saved, setSaved] = useState(false);

  const updateCriteria = (i: number, val: string) => {
    const updated = [...form.evaluationCriteria];
    updated[i] = val;
    setForm((f) => ({ ...f, evaluationCriteria: updated }));
  };

  const addCriteria = () =>
    setForm((f) => ({ ...f, evaluationCriteria: [...f.evaluationCriteria, ''] }));

  const removeCriteria = (i: number) =>
    setForm((f) => ({
      ...f,
      evaluationCriteria: f.evaluationCriteria.filter((_, idx) => idx !== i),
    }));

  const handleSave = () => {
    if (!form.text.trim() || !form.role.trim()) return;
    onSave({
      ...form,
      id: initial?.id || `q-${Date.now()}`,
      evaluationCriteria: form.evaluationCriteria.filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#131B2E] border border-[#263248] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#263248]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5B5FEF]" />
            <h2 className="text-sm font-bold text-white">
              {initial ? 'Edit Question' : 'Add New Question'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#263248] text-[#94A3B8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Company + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Company
              </label>
              <div className="relative">
                <select
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full appearance-none bg-[#0A0F1C] border border-[#263248] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B5FEF] transition-all pr-8"
                >
                  {COMPANIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as typeof CATEGORIES[number] }))
                  }
                  className="w-full appearance-none bg-[#0A0F1C] border border-[#263248] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B5FEF] transition-all pr-8"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Target Role
            </label>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-[#0A0F1C] border border-[#263248] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4A5568] outline-none focus:border-[#5B5FEF] transition-all"
            />
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Interview Question *
            </label>
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Enter the interview question..."
              rows={3}
              className="w-full bg-[#0A0F1C] border border-[#263248] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4A5568] outline-none focus:border-[#5B5FEF] transition-all resize-none"
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Follow-up Probe
            </label>
            <textarea
              value={form.followUp}
              onChange={(e) => setForm((f) => ({ ...f, followUp: e.target.value }))}
              placeholder="Follow-up question to dig deeper..."
              rows={2}
              className="w-full bg-[#0A0F1C] border border-[#263248] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4A5568] outline-none focus:border-[#5B5FEF] transition-all resize-none"
            />
          </div>

          {/* Evaluation Criteria */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Evaluation Criteria
            </label>
            {form.evaluationCriteria.map((criterion, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={criterion}
                  onChange={(e) => updateCriteria(i, e.target.value)}
                  placeholder={`Criteria ${i + 1} (e.g. STAR Format)`}
                  className="flex-1 bg-[#0A0F1C] border border-[#263248] rounded-xl px-4 py-2 text-sm text-white placeholder:text-[#4A5568] outline-none focus:border-[#5B5FEF] transition-all"
                />
                <button
                  onClick={() => removeCriteria(i)}
                  className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={addCriteria}
              className="flex items-center gap-1.5 text-xs text-[#5B5FEF] hover:text-[#9D4EDD] transition-colors py-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Criteria
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#263248]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-white hover:bg-[#263248] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.text.trim() || !form.role.trim()}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-[#22C55E] text-white'
                : !form.text.trim() || !form.role.trim()
                ? 'bg-[#263248] text-[#4A5568] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#5B5FEF] to-[#9D4EDD] text-white hover:opacity-90'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Question
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Category Badge Colors ────────────────────────────────────────────────────
const categoryColor = (cat: string) => {
  switch (cat) {
    case 'technical':
      return 'bg-[#5B5FEF]/20 text-[#5B5FEF] border-[#5B5FEF]/30';
    case 'behavioral':
      return 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30';
    case 'system-design':
      return 'bg-[#9D4EDD]/20 text-[#9D4EDD] border-[#9D4EDD]/30';
    default:
      return 'bg-[#263248] text-[#94A3B8]';
  }
};

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export const AdminQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [questions, setQuestions] = useState<AdminQuestion[]>(loadQuestions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminQuestion | undefined>();
  const [filterCompany, setFilterCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const handleSave = (q: AdminQuestion) => {
    setQuestions((prev) => {
      const exists = prev.findIndex((p) => p.id === q.id);
      const updated = exists >= 0 ? prev.map((p) => (p.id === q.id ? q : p)) : [...prev, q];
      saveQuestions(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      saveQuestions(updated);
      return updated;
    });
    setDeleteConfirm(null);
  };

  const openEdit = (q: AdminQuestion) => {
    setEditTarget(q);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditTarget(undefined);
    setModalOpen(true);
  };

  const filtered = questions.filter((q) => {
    const matchCompany = filterCompany === 'All' || q.company === filterCompany;
    const matchSearch =
      !searchQuery ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCompany && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#263248] px-6 py-4 flex items-center justify-between bg-[#131B2E]/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-5 w-px bg-[#263248]" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5B5FEF]" />
            <span className="text-sm font-bold text-white">Admin — Question Bank</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5B5FEF] to-[#9D4EDD] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Question
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-white hover:bg-[#263248] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {['All', ...COMPANIES].map((c) => {
            const count = c === 'All' ? questions.length : questions.filter((q) => q.company === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilterCompany(c)}
                className={`rounded-xl p-3 text-center border transition-all ${
                  filterCompany === c
                    ? 'bg-[#5B5FEF]/20 border-[#5B5FEF]/50 text-[#5B5FEF]'
                    : 'bg-[#131B2E] border-[#263248] text-[#94A3B8] hover:border-[#5B5FEF]/30'
                }`}
              >
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-[10px] font-medium truncate">{c}</div>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or roles..."
            className="w-full bg-[#131B2E] border border-[#263248] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#4A5568] outline-none focus:border-[#5B5FEF] transition-all"
          />
        </div>

        {/* Question List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <FileText className="w-12 h-12 text-[#263248] mx-auto" />
            <p className="text-[#4A5568] text-sm">No questions yet. Click "Add Question" to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="bg-[#131B2E] border border-[#263248] rounded-2xl p-5 hover:border-[#5B5FEF]/40 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-white px-2 py-0.5 bg-[#263248] rounded-lg">
                        {q.company}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${categoryColor(q.category)}`}
                      >
                        {q.category.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-[#94A3B8]">{q.role}</span>
                    </div>

                    {/* Question text */}
                    <p className="text-sm text-white leading-relaxed">{q.text}</p>

                    {/* Follow-up */}
                    {q.followUp && (
                      <p className="text-xs text-[#94A3B8] italic">
                        ↳ Follow-up: {q.followUp}
                      </p>
                    )}

                    {/* Criteria chips */}
                    {q.evaluationCriteria.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {q.evaluationCriteria.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] px-2 py-0.5 bg-[#0A0F1C] border border-[#263248] rounded-full text-[#94A3B8]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(q)}
                      className="p-2 rounded-xl hover:bg-[#5B5FEF]/20 text-[#5B5FEF] transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deleteConfirm === q.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="text-xs px-2 py-1.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-all"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-1.5 rounded-lg hover:bg-[#263248] text-[#94A3B8] transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(q.id)}
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {modalOpen && (
        <QuestionFormModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}
    </div>
  );
};
