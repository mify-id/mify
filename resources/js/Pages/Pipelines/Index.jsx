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
    Lightning, 
    Plus, 
    Trash, 
    Gear, 
    Sparkle, 
    ArrowRight, 
    EnvelopeSimple, 
    Check, 
    X, 
    Cpu, 
    Clock, 
    ShieldCheck
} from '@phosphor-icons/react';

export default function Index({ pipelines = [], approvedBriefs = [] }) {
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedBrief, setSelectedBrief] = useState(null);

    const phaseOptions = [
        { value: 'discovery', label: 'Discovery & Spec' },
        { value: 'database_setup', label: 'Database & API Sync' },
        { value: 'core_features', label: 'Core Features Build' },
        { value: 'deployment', label: 'Final Audit & Deploy' }
    ];

    const healthOptions = [
        { value: 'nominal', label: 'Nominal (Green)' },
        { value: 'warning', label: 'Warning (Yellow)' },
        { value: 'critical', label: 'Critical (Red)' }
    ];

    // Initializing forms
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        project_name: '',
        client_name: '',
        client_email: '',
        tech_stack: [],
        budget: '',
        phase: 'discovery',
        health: 'nominal',
        repo_commit: '',
        system_architecture: {
            frontend: '',
            backend: '',
            database: '',
            hosting: ''
        },
        deadline: '',
        brief_id: null
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('pipelines.store'), {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
                setSelectedBrief(null);
            }
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        patch(route('pipelines.update', selectedPipeline.id), {
            onSuccess: () => {
                setSelectedPipeline(null);
            }
        });
    };

    const [deletePipelineId, setDeletePipelineId] = useState(null);

    const handleDelete = (id) => {
        setDeletePipelineId(id);
    };

    const confirmDeletePipeline = () => {
        if (deletePipelineId) {
            router.delete(route('pipelines.destroy', deletePipelineId), {
                onFinish: () => setDeletePipelineId(null)
            });
        }
    };

    // Auto-populate form from Approved Client Brief (Convert Flow)
    const handleConvertBrief = (brief) => {
        setSelectedBrief(brief);
        setIsCreateOpen(true);
        
        const bp = brief.ai_blueprint || {};
        const arch = bp.architecture || {};
        
        setData({
            project_name: brief.company ? `${brief.company} System` : `${brief.name}'s System`,
            client_name: brief.name,
            client_email: brief.email,
            tech_stack: brief.tech_stack || [],
            budget: brief.budget || '',
            phase: 'discovery',
            health: 'nominal',
            repo_commit: '',
            system_architecture: {
                frontend: arch.frontend || 'React 19, Tailwind CSS v4',
                backend: arch.backend || 'Laravel 13 Monolith',
                database: arch.database || 'SQLite 3.x',
                hosting: arch.hosting || 'Fly.io'
            },
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days default
            brief_id: brief.id
        });
    };

    // Get progress percentage based on phase
    const getProgress = (phase) => {
        const phases = {
            discovery: 25,
            database_setup: 50,
            core_features: 75,
            deployment: 100
        };
        return phases[phase] || 0;
    };

    const getPhaseLabel = (phase) => {
        const labels = {
            discovery: 'Discovery & Spec',
            database_setup: 'Database & API Sync',
            core_features: 'Core Features build',
            deployment: 'Final Audit & Deploy'
        };
        return labels[phase] || phase;
    };

    return (
        <>
            <AdminLayout activeTab="pipelines" title={<>Project <span className="font-serif italic font-normal text-brand-lime">Pipelines</span></>}>
                <Head title="Active Pipelines" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main List Section (8/12) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Header stats & Actions */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5 select-none">
                            <Lightning className="w-4 h-4" /> Live Engine Tracker ({pipelines.length})
                        </span>
                        
                        <BrandButton 
                            onClick={() => {
                                reset();
                                setSelectedBrief(null);
                                setIsCreateOpen(true);
                            }}
                            variant="primary"
                            className="h-8 py-0! px-4!"
                        >
                            <Plus className="w-3.5 h-3.5" weight="bold" /> New Pipeline
                        </BrandButton>
                    </div>

                    {/* Pipelines Cards Grid */}
                    <div className="flex flex-col gap-5">
                        {pipelines.length === 0 ? (
                            <div className="border border-dashed border-white/10 rounded-[24px] p-12 text-center flex flex-col items-center gap-4 bg-white/[0.01]">
                                <Lightning className="w-12 h-12 text-white/20" />
                                <h4 className="text-base font-bold text-white/80">No Active Pipelines</h4>
                                <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                    No live builds are registered in the tracking engine. Create one manually or convert an approved client brief from the sidebar panel.
                                </p>
                            </div>
                        ) : (
                            pipelines.map((pipe) => {
                                const progress = getProgress(pipe.phase);
                                return (
                                    <BrandCard 
                                        key={pipe.id}
                                        glowColor={pipe.health === 'critical' ? 'none' : 'blue'}
                                        className={pipe.health === 'critical' ? 'border-red-500/20 hover:border-red-500/30' : ''}
                                    >
                                        <div className="flex flex-col gap-4">
                                            {/* Top info */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-bold text-white group-hover:text-brand-lime transition-colors truncate">
                                                            {pipe.project_name}
                                                        </h4>
                                                        {/* Pulsing health indicator dot */}
                                                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                                                            pipe.health === 'nominal' ? 'bg-brand-lime shadow-[0_0_8px_#b5ff00]' :
                                                            pipe.health === 'warning' ? 'bg-yellow-400 shadow-[0_0_8px_#fbbf24]' :
                                                            'bg-red-500 shadow-[0_0_8px_#ef4444]'
                                                        }`} />
                                                    </div>
                                                    <span className="text-xs text-white/50 truncate">
                                                        Client: {pipe.client_name} ({pipe.client_email})
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <BrandBadge variant="neutral">{pipe.budget}</BrandBadge>
                                                    <BrandBadge 
                                                        variant={
                                                            pipe.health === 'nominal' ? 'lime' :
                                                            pipe.health === 'warning' ? 'neutral' : 'danger'
                                                        }
                                                    >
                                                        {pipe.health}
                                                    </BrandBadge>
                                                </div>
                                            </div>

                                            {/* Phase progress visual */}
                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex justify-between items-center text-[10px] font-mono">
                                                    <span className="text-white/40">Build Stage: <span className="text-white/80 font-bold">{getPhaseLabel(pipe.phase)}</span></span>
                                                    <span className="text-brand-lime font-black">{progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <div 
                                                        className={`h-full transition-all duration-500 rounded-full ${
                                                            pipe.health === 'critical' ? 'bg-red-500' : 'bg-brand-blue'
                                                        }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tech Stack pills */}
                                            <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-4 mt-2">
                                                <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                                                    {Array.isArray(pipe.tech_stack) && pipe.tech_stack.map((tech, idx) => (
                                                        <span key={idx} className="text-[9px] font-mono text-brand-lime/80 bg-brand-lime/5 px-2 py-0.5 rounded border border-brand-lime/10">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Meta & actions */}
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className="flex items-center gap-1 text-[10px] text-white/30 font-mono">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Due: {pipe.deadline}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                                        {pipe.repo_commit && (
                                                            <span className="font-mono text-[9px] text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded" title="Active Commit">
                                                                git: {pipe.repo_commit}
                                                            </span>
                                                        )}
                                                        <button 
                                                            onClick={() => setSelectedPipeline(pipe)}
                                                            className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white border border-transparent transition-all"
                                                            title="Configure Pipeline"
                                                        >
                                                            <Gear className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(pipe.id)}
                                                            className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 border border-transparent transition-all"
                                                            title="Delete Project"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </BrandCard>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side Column (4/12) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Convert approved briefs block */}
                    <div className="brand-panel flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5 select-none">
                            <Sparkle className="w-4 h-4" weight="fill" /> Convert Brief to Project
                        </span>
                        
                        <div className="flex flex-col gap-3">
                            {approvedBriefs.length === 0 ? (
                                <p className="text-[10px] text-white/40 italic pl-1 leading-relaxed">
                                    No approved briefs waiting for conversion. Go to Overview and approve inbound client briefs first.
                                </p>
                            ) : (
                                approvedBriefs.map((brief) => (
                                    <div key={brief.id} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-bold text-white group-hover:text-brand-lime transition-colors truncate">
                                                    {brief.company || 'Personal Project'}
                                                </span>
                                                <span className="text-[9px] text-white/40 truncate">{brief.name} // {brief.budget}</span>
                                            </div>
                                            <button
                                                onClick={() => handleConvertBrief(brief)}
                                                className="px-2 py-1 rounded bg-brand-lime text-brand-dark hover:scale-105 active:scale-95 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-0.5"
                                            >
                                                Convert <ArrowRight className="w-2.5 h-2.5" weight="bold" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Build Engine Specs (Static / Informational) */}
                    <div className="brand-panel flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5 select-none">
                            <Cpu className="w-4 h-4" /> Build Pipeline Specs
                        </span>
                        <div className="flex flex-col gap-3 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-white/5">
                                <span className="text-white/40">Active Build Nodes</span>
                                <span className="font-mono text-brand-lime">Fly.io / AWS Fargate</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-white/5">
                                <span className="text-white/40">Continuous Integration</span>
                                <span className="font-mono text-white/70">GitHub Actions</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-white/40">SSL Verification</span>
                                <span className="font-mono text-brand-lime flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" weight="bold" /> Strict CSP
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>

        {/* CREATE PIPELINE MODAL */}
        {isCreateOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-brand-dark/95 border border-white/10 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime/5 blur-[100px] pointer-events-none" />
                        
                        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-brand-dark/50 z-10">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1">
                                    <Sparkle weight="fill" className="w-3 h-3 text-brand-lime" /> Pipeline Engine
                                </span>
                                <h3 className="text-lg font-black tracking-tight text-white">
                                    {selectedBrief ? `Convert ${selectedBrief.company || 'Brief'} to Pipeline` : 'Create New Pipeline'}
                                </h3>
                            </div>
                            <button 
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setSelectedBrief(null);
                                    reset();
                                }}
                                className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" weight="bold" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 z-10 flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <BrandInput 
                                    label="Project / System Name" 
                                    value={data.project_name} 
                                    onChange={e => setData('project_name', e.target.value)} 
                                    error={errors.project_name}
                                    placeholder="e.g. Nusantara Retail E-Commerce"
                                    required 
                                />
                                <BrandInput 
                                    label="Client Responsible Name" 
                                    value={data.client_name} 
                                    onChange={e => setData('client_name', e.target.value)} 
                                    error={errors.client_name}
                                    placeholder="e.g. Hendra Wijaya"
                                    required 
                                />
                                <BrandInput 
                                    label="Client Email" 
                                    type="email"
                                    value={data.client_email} 
                                    onChange={e => setData('client_email', e.target.value)} 
                                    error={errors.client_email}
                                    placeholder="e.g. hendra@domain.com"
                                    required 
                                />
                                <BrandInput 
                                    label="Budget Value" 
                                    value={data.budget} 
                                    onChange={e => setData('budget', e.target.value)} 
                                    error={errors.budget}
                                    placeholder="e.g. IDR 350M"
                                    required 
                                />
                                 <BrandSelect 
                                    label="Development Stage"
                                    value={data.phase}
                                    options={phaseOptions}
                                    onChange={val => setData('phase', val)}
                                />
                                <BrandSelect 
                                    label="Pipeline Health Status"
                                    value={data.health}
                                    options={healthOptions}
                                    onChange={val => setData('health', val)}
                                />
                                <BrandInput 
                                    label="Git Repository Commit SHA" 
                                    value={data.repo_commit} 
                                    onChange={e => setData('repo_commit', e.target.value)} 
                                    error={errors.repo_commit}
                                    placeholder="e.g. f83b1a2 (optional)"
                                />
                                <BrandInput 
                                    label="Target Launch Deadline" 
                                    type="date"
                                    value={data.deadline} 
                                    onChange={e => setData('deadline', e.target.value)} 
                                    error={errors.deadline}
                                    required 
                                />
                            </div>

                            {/* Tech Stack Tags Input Wrapper */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">Technologies (comma separated)</label>
                                <input 
                                    type="text" 
                                    value={data.tech_stack.join(', ')} 
                                    onChange={e => setData('tech_stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                    className="brand-input"
                                    placeholder="Laravel, React, SQLite, Tailwind"
                                    required
                                />
                            </div>

                            {/* Architectural Specifications Section */}
                            <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue pl-1">Architectural Details</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <BrandInput 
                                        label="Frontend Interface Stack" 
                                        value={data.system_architecture.frontend} 
                                        onChange={e => setData('system_architecture', { ...data.system_architecture, frontend: e.target.value })} 
                                        placeholder="React 19, Tailwind CSS v4, Framer Motion"
                                        required 
                                    />
                                    <BrandInput 
                                        label="Backend Architecture Engine" 
                                        value={data.system_architecture.backend} 
                                        onChange={e => setData('system_architecture', { ...data.system_architecture, backend: e.target.value })} 
                                        placeholder="Laravel 13 Monolith (PHP 8.3)"
                                        required 
                                    />
                                    <BrandInput 
                                        label="Database & Caching Engine" 
                                        value={data.system_architecture.database} 
                                        onChange={e => setData('system_architecture', { ...data.system_architecture, database: e.target.value })} 
                                        placeholder="PostgreSQL (RDS Multi-AZ), Redis Caching"
                                        required 
                                    />
                                    <BrandInput 
                                        label="Deployment & Cloud Hosting" 
                                        value={data.system_architecture.hosting} 
                                        onChange={e => setData('system_architecture', { ...data.system_architecture, hosting: e.target.value })} 
                                        placeholder="AWS ECS Fargate, Vercel Edge Hosting"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-end gap-3 mt-4">
                                <BrandButton 
                                    variant="secondary"
                                    onClick={() => {
                                        setIsCreateOpen(false);
                                        setSelectedBrief(null);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </BrandButton>
                                <BrandButton 
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    isLoading={processing}
                                >
                                    Deploy Pipeline
                                </BrandButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PIPELINE DETAILS MODAL */}
            {selectedPipeline && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-brand-dark/95 border border-white/10 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 blur-[100px] pointer-events-none" />
                        
                        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-brand-dark/50 z-10">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1">
                                    <Gear className="w-3.5 h-3.5" /> Pipeline Settings
                                </span>
                                <h3 className="text-lg font-black tracking-tight text-white">
                                    Configure {selectedPipeline.project_name}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedPipeline(null)}
                                className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" weight="bold" />
                            </button>
                        </div>

                        {/* Edit Form */}
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.patch(route('pipelines.update', selectedPipeline.id), selectedPipeline, {
                                    onSuccess: () => setSelectedPipeline(null)
                                });
                            }} 
                            className="flex-1 overflow-y-auto p-6 z-10 flex flex-col gap-5"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <BrandInput 
                                    label="Project Name" 
                                    value={selectedPipeline.project_name} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, project_name: e.target.value })} 
                                    required 
                                />
                                <BrandInput 
                                    label="Client Responsible Name" 
                                    value={selectedPipeline.client_name} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, client_name: e.target.value })} 
                                    required 
                                />
                                <BrandInput 
                                    label="Client Email" 
                                    type="email"
                                    value={selectedPipeline.client_email} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, client_email: e.target.value })} 
                                    required 
                                />
                                <BrandInput 
                                    label="Budget Value" 
                                    value={selectedPipeline.budget} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, budget: e.target.value })} 
                                    required 
                                />
                                 <BrandSelect 
                                    label="Development Stage"
                                    value={selectedPipeline.phase}
                                    options={phaseOptions}
                                    onChange={val => setSelectedPipeline({ ...selectedPipeline, phase: val })}
                                />
                                <BrandSelect 
                                    label="Pipeline Health Status"
                                    value={selectedPipeline.health}
                                    options={healthOptions}
                                    onChange={val => setSelectedPipeline({ ...selectedPipeline, health: val })}
                                />
                                <BrandInput 
                                    label="Git Repository Commit SHA" 
                                    value={selectedPipeline.repo_commit || ''} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, repo_commit: e.target.value })} 
                                    placeholder="e.g. 5e91c7a"
                                />
                                <BrandInput 
                                    label="Target Launch Deadline" 
                                    type="date"
                                    value={selectedPipeline.deadline} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, deadline: e.target.value })} 
                                    required 
                                />
                            </div>

                            {/* Tech Stack Tags Input Wrapper */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">Technologies (comma separated)</label>
                                <input 
                                    type="text" 
                                    value={Array.isArray(selectedPipeline.tech_stack) ? selectedPipeline.tech_stack.join(', ') : ''} 
                                    onChange={e => setSelectedPipeline({ ...selectedPipeline, tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    className="brand-input"
                                    placeholder="Laravel, React, SQLite, Tailwind"
                                    required
                                />
                            </div>

                            {/* Architectural Specifications Section */}
                            <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue pl-1">Architectural Details</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <BrandInput 
                                        label="Frontend Interface Stack" 
                                        value={selectedPipeline.system_architecture?.frontend || ''} 
                                        onChange={e => setSelectedPipeline({ ...selectedPipeline, system_architecture: { ...selectedPipeline.system_architecture, frontend: e.target.value } })} 
                                        required 
                                    />
                                    <BrandInput 
                                        label="Backend Architecture Engine" 
                                        value={selectedPipeline.system_architecture?.backend || ''} 
                                        onChange={e => setSelectedPipeline({ ...selectedPipeline, system_architecture: { ...selectedPipeline.system_architecture, backend: e.target.value } })} 
                                        required 
                                    />
                                    <BrandInput 
                                        label="Database & Caching Engine" 
                                        value={selectedPipeline.system_architecture?.database || ''} 
                                        onChange={e => setSelectedPipeline({ ...selectedPipeline, system_architecture: { ...selectedPipeline.system_architecture, database: e.target.value } })} 
                                        required 
                                    />
                                    <BrandInput 
                                        label="Deployment & Cloud Hosting" 
                                        value={selectedPipeline.system_architecture?.hosting || ''} 
                                        onChange={e => setSelectedPipeline({ ...selectedPipeline, system_architecture: { ...selectedPipeline.system_architecture, hosting: e.target.value } })} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-end gap-3 mt-4">
                                <BrandButton 
                                    variant="secondary"
                                    onClick={() => setSelectedPipeline(null)}
                                >
                                    Cancel
                                </BrandButton>
                                <BrandButton 
                                    type="submit"
                                    variant="primary"
                                >
                                    Apply Changes
                                </BrandButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            <BrandConfirmModal
                isOpen={deletePipelineId !== null}
                title="De-Authorize Pipeline Engine"
                message="Are you sure you want to permanently delete this active project pipeline? This action will halt all monitoring nodes and completely wipe the record."
                confirmLabel="Purge Project"
                cancelLabel="Abort"
                onConfirm={confirmDeletePipeline}
                onCancel={() => setDeletePipelineId(null)}
                variant="danger"
            />
        </>
    );
}
