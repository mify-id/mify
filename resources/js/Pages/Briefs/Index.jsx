import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BrandButton from '@/Components/Brand/BrandButton';
import BrandCard from '@/Components/Brand/BrandCard';
import BrandIconBox from '@/Components/Brand/BrandIconBox';
import BrandBadge from '@/Components/Brand/BrandBadge';
import BrandInput from '@/Components/Brand/BrandInput';
import BrandSelect from '@/Components/Brand/BrandSelect';
import BrandConfirmModal from '@/Components/Brand/BrandConfirmModal';
import { 
    EnvelopeSimple,
    Cpu,
    CalendarBlank,
    Warning,
    User,
    Sparkle,
    ArrowRight,
    Trash,
    Check,
    Note,
    SlidersHorizontal,
    FolderSimplePlus,
    X,
    Eye
} from '@phosphor-icons/react';

export default function Index({ briefs = [] }) {
    const [selectedBrief, setSelectedBrief] = useState(briefs[0] || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [deleteBriefId, setDeleteBriefId] = useState(null);

    // Form for notes & priority
    const { data, setData, patch, processing, reset } = useForm({
        priority: selectedBrief?.priority || 'medium',
        notes: selectedBrief?.notes || ''
    });

    // Update form when selected brief changes
    const selectBrief = (brief) => {
        setSelectedBrief(brief);
        setData({
            priority: brief.priority || 'medium',
            notes: brief.notes || ''
        });
    };

    const handleSaveAdmin = (e) => {
        e.preventDefault();
        patch(route('briefs.update-notes-priority', selectedBrief.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Refresh the active selected brief with updated data
                const updated = page.props.briefs.find(b => b.id === selectedBrief.id);
                if (updated) {
                    setSelectedBrief(updated);
                }
            }
        });
    };

    const handleUpdateStatus = (id, newStatus) => {
        router.patch(route('briefs.update-status', id), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updated = page.props.briefs.find(b => b.id === selectedBrief.id);
                if (updated) {
                    setSelectedBrief(updated);
                }
            }
        });
    };

    const confirmDeleteBrief = () => {
        if (deleteBriefId) {
            router.delete(route('briefs.destroy', deleteBriefId), {
                onSuccess: () => {
                    const nextSelect = briefs.find(b => b.id !== deleteBriefId) || null;
                    setSelectedBrief(nextSelect);
                    setDeleteBriefId(null);
                }
            });
        }
    };

    const handleConvertToPipeline = (brief) => {
        // Redirect to pipelines with brief_id to auto-populate
        router.get(route('pipelines.index'), {}, {
            onFinish: () => {
                // We'll set a timeout to trigger the conversion on the pipelines index page
                setTimeout(() => {
                    const convertBtn = document.querySelector(`[data-convert-brief="${brief.id}"]`);
                    if (convertBtn) convertBtn.click();
                }, 100);
            }
        });
    };

    // Filter briefs based on search, status, and priority
    const filteredBriefs = briefs.filter(brief => {
        const matchesSearch = 
            brief.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (brief.company && brief.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
            brief.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brief.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || brief.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || brief.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Formatting date
    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Count metrics
    const totalCount = briefs.length;
    const pendingCount = briefs.filter(b => b.status === 'pending').length;
    const approvedCount = briefs.filter(b => b.status === 'approved').length;

    return (
        <>
            <AdminLayout activeTab="briefs" title={<>Client <span className="font-serif italic font-normal text-brand-lime">Briefs Inbox</span></>}>
                <Head title="Client Briefs Inbox" />

                {/* Sub-Header Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 select-none">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Submissions</span>
                        <span className="text-xl font-black text-white">{totalCount}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Action Required</span>
                        <span className="text-xl font-black text-yellow-400">{pendingCount}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime">System Approved</span>
                        <span className="text-xl font-black text-brand-lime">{approvedCount}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Operational Conversion</span>
                        <span className="text-xl font-black text-brand-blue">
                            {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%
                        </span>
                    </div>
                </div>

                {/* Control Panel Filters */}
                <div className="bg-white/3 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end mb-6 z-20 relative">
                    <div className="flex-1 w-full">
                        <BrandInput 
                            label="Search Message / Company Name"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="e.g. Astra FinTech, Rian Pramana..."
                            className="h-9 py-1.5!"
                        />
                    </div>
                    <div className="w-full md:w-44">
                        <BrandSelect 
                            label="Filter Status"
                            value={statusFilter}
                            options={[
                                { value: 'all', label: 'All States' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'discussion', label: 'Discussion' },
                                { value: 'approved', label: 'Approved' }
                            ]}
                            onChange={val => setStatusFilter(val)}
                            className="h-9 py-1.5!"
                        />
                    </div>
                    <div className="w-full md:w-44">
                        <BrandSelect 
                            label="Filter Priority"
                            value={priorityFilter}
                            options={[
                                { value: 'all', label: 'All Urgencies' },
                                { value: 'high', label: 'High Priority' },
                                { value: 'medium', label: 'Medium Priority' },
                                { value: 'low', label: 'Low Priority' }
                            ]}
                            onChange={val => setPriorityFilter(val)}
                            className="h-9 py-1.5!"
                        />
                    </div>
                </div>

                {/* Split Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Brief cards list (7/12) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        {filteredBriefs.length === 0 ? (
                            <div className="border border-dashed border-white/10 rounded-[24px] p-12 text-center flex flex-col items-center gap-4 bg-white/[0.01]">
                                <EnvelopeSimple className="w-10 h-10 text-white/20" />
                                <h4 className="text-sm font-bold text-white/80">No matching briefs</h4>
                                <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                    No records found matching query parameters. Readjust your search string or filter options.
                                </p>
                            </div>
                        ) : (
                            filteredBriefs.map((brief) => {
                                const isSelected = selectedBrief && selectedBrief.id === brief.id;
                                return (
                                    <div 
                                        key={brief.id}
                                        onClick={() => selectBrief(brief)}
                                        className={`rounded-2xl p-5 border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col gap-3.5 group ${
                                            isSelected 
                                                ? 'bg-white/10 border-brand-lime/30 shadow-[0_4px_25px_rgba(181,255,0,0.04)]' 
                                                : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]'
                                        }`}
                                    >
                                        <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-brand-blue/5 blur-xl group-hover:bg-brand-blue/10 pointer-events-none" />
                                        
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex flex-col min-w-0">
                                                <h4 className="text-base font-bold text-white group-hover:text-brand-lime transition-colors truncate">
                                                    {brief.company || 'Personal Client'}
                                                </h4>
                                                <span className="text-[11px] text-white/50 truncate">
                                                    By {brief.name} // {brief.email}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                    brief.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    brief.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-white/5 text-white/40 border-white/10'
                                                }`}>
                                                    {brief.priority || 'medium'}
                                                </span>
                                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                    brief.status === 'approved' ? 'bg-brand-lime/10 text-brand-lime border-brand-lime/20' :
                                                    brief.status === 'discussion' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' :
                                                    'bg-white/5 text-white/50 border-white/10'
                                                }`}>
                                                    {brief.status}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                                            {brief.message}
                                        </p>

                                        <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[10px] text-white/30 font-mono">
                                            <span>Budget: {brief.budget || 'N/A'}</span>
                                            <span>Received: {formatDate(brief.created_at)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Right Column: Detailed Control Panel (5/12) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {!selectedBrief ? (
                            <div className="border border-dashed border-white/5 rounded-[24px] p-12 text-center text-xs text-white/30 italic">
                                Select a brief from the inbox to display dynamic control specifications.
                            </div>
                        ) : (
                            <div className="brand-panel flex flex-col gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-brand-blue/5 blur-[80px] pointer-events-none" />
                                
                                {/* Info Head */}
                                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-lime">Intake Detail</span>
                                        <h3 className="text-lg font-black text-white truncate">{selectedBrief.company || 'Personal Project'}</h3>
                                        <span className="text-xs text-white/50 truncate flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedBrief.name} ({selectedBrief.email})</span>
                                    </div>
                                    <button 
                                        onClick={() => setDeleteBriefId(selectedBrief.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 border border-transparent transition-all"
                                        title="Purge Brief Node"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Body Message */}
                                <div className="flex flex-col gap-2 bg-black/15 border border-white/5 p-4 rounded-xl">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 select-none">Client Raw Message</span>
                                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                                        {selectedBrief.message}
                                    </p>
                                </div>

                                {/* Dynamic Details */}
                                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                    <div className="flex flex-col gap-0.5 bg-white/3 p-3 rounded-lg border border-white/5">
                                        <span className="text-[9px] text-white/40 uppercase">Budget Bracket</span>
                                        <span className="text-white font-bold">{selectedBrief.budget || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5 bg-white/3 p-3 rounded-lg border border-white/5">
                                        <span className="text-[9px] text-white/40 uppercase">Date Received</span>
                                        <span className="text-white font-bold">{formatDate(selectedBrief.created_at)}</span>
                                    </div>
                                </div>

                                {/* Tech Stack Tags */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 select-none">Detected Stack Keywords</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Array.isArray(selectedBrief.tech_stack) && selectedBrief.tech_stack.length > 0 ? (
                                            selectedBrief.tech_stack.map((tech, idx) => (
                                                <span key={idx} className="text-[9px] font-mono text-brand-lime/80 bg-brand-lime/5 px-2 py-0.5 rounded border border-brand-lime/10">
                                                    {tech}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-white/30 italic">No keywords matched</span>
                                        )}
                                    </div>
                                </div>

                                {/* AI Blueprint Module Preview */}
                                <div className="border-t border-white/5 pt-4 mt-1 flex flex-col gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1 select-none">
                                        <Cpu className="w-3.5 h-3.5" /> AI Architecture Blueprint
                                    </span>
                                    
                                    {selectedBrief.ai_blueprint ? (
                                        <div className="bg-white/3 border border-white/5 rounded-xl p-3.5 flex justify-between items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-white flex items-center gap-1">
                                                    <Sparkle weight="fill" className="text-brand-lime w-3 h-3" /> System Architectured
                                                </span>
                                                <span className="text-[9px] text-white/40 font-mono uppercase mt-0.5">Focus: {selectedBrief.ai_blueprint.focus}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.get(route('dashboard'), {}, {
                                                        onFinish: () => {
                                                            setTimeout(() => {
                                                                const btn = document.querySelector(`[data-brief-id="${selectedBrief.id}"]`);
                                                                if (btn) btn.click();
                                                            }, 100);
                                                        }
                                                    })}
                                                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" /> View Console
                                                </button>
                                                {selectedBrief.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleConvertToPipeline(selectedBrief)}
                                                        className="px-2.5 py-1 rounded bg-brand-lime text-brand-dark hover:scale-105 active:scale-95 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                                                    >
                                                        <FolderSimplePlus className="w-3 h-3" weight="bold" /> Deploy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white/3 border border-dashed border-white/10 rounded-xl p-4 text-center flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-white/40 italic">No blueprint mapped to brief.</span>
                                            <button
                                                onClick={() => router.get(route('dashboard'), {}, {
                                                    onFinish: () => {
                                                        setTimeout(() => {
                                                            const btn = document.querySelector(`[data-brief-id="${selectedBrief.id}"]`);
                                                            if (btn) btn.click();
                                                        }, 100);
                                                    }
                                                })}
                                                className="px-3 py-1 rounded bg-brand-lime text-brand-dark hover:scale-105 active:scale-95 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 mt-1"
                                            >
                                                <Cpu className="w-3.5 h-3.5" /> Initialize AI Architect
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Admin Settings Form */}
                                <form onSubmit={handleSaveAdmin} className="border-t border-white/5 pt-4 flex flex-col gap-4">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 select-none">Admin Workspace Control</span>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">State Actions</span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateStatus(selectedBrief.id, 'discussion')}
                                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                                                        selectedBrief.status === 'discussion'
                                                            ? 'bg-brand-blue text-white border-brand-blue'
                                                            : 'bg-white/3 text-white/40 border-white/5 hover:border-white/10'
                                                    }`}
                                                >
                                                    Discussion
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateStatus(selectedBrief.id, 'approved')}
                                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                                                        selectedBrief.status === 'approved'
                                                            ? 'bg-brand-lime text-brand-dark border-brand-lime'
                                                            : 'bg-white/3 text-white/40 border-white/5 hover:border-white/10'
                                                    }`}
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </div>

                                        <BrandSelect 
                                            label="Priority Tier"
                                            value={data.priority}
                                            options={[
                                                { value: 'high', label: 'High Priority' },
                                                { value: 'medium', label: 'Medium Priority' },
                                                { value: 'low', label: 'Low Priority' }
                                            ]}
                                            onChange={val => setData('priority', val)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">Discovery Call Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            className="brand-input min-h-[90px] text-xs font-sans leading-relaxed py-2.5!"
                                            placeholder="Write internal team notes, requirements sync comments, or client feedback from calls..."
                                        />
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <BrandButton
                                            type="submit"
                                            variant="primary"
                                            disabled={processing}
                                            isLoading={processing}
                                            className="py-2! px-5!"
                                        >
                                            Save Node Changes
                                        </BrandButton>
                                    </div>
                                </form>

                            </div>
                        )}
                    </div>

                </div>

            </AdminLayout>

            {/* Custom Confirmation Modal */}
            <BrandConfirmModal
                isOpen={deleteBriefId !== null}
                title="Purge System Brief Node"
                message="Are you sure you want to permanently delete this client brief? This action will completely wipe the entry and all AI-calculated blueprint designs from the operations database."
                confirmLabel="Purge Brief"
                cancelLabel="Abort"
                onConfirm={confirmDeleteBrief}
                onCancel={() => setDeleteBriefId(null)}
                variant="danger"
            />
        </>
    );
}
