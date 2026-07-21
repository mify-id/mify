import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Briefcase, 
    Plus, 
    PencilSimple, 
    Trash, 
    Check, 
    X, 
    Star, 
    Link as LinkIcon, 
    UploadSimple, 
    MagnifyingGlass,
    Eye,
    Globe,
    FolderSimple
} from '@phosphor-icons/react';

export default function PortfoliosIndex({ portfolios = [], categories = [] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [deleteConfirmPortfolio, setDeleteConfirmPortfolio] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: 'Web System',
        description: '',
        image: null,
        image_url_input: '',
        project_url: '',
        tech_stack: 'Laravel 13, React 19, Inertia.js',
        is_featured: true,
        order: 0,
    });

    const openCreateModal = () => {
        setEditingPortfolio(null);
        reset();
        clearErrors();
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (portfolio) => {
        setEditingPortfolio(portfolio);
        clearErrors();
        setData({
            title: portfolio.title || '',
            category: portfolio.category || 'Web System',
            description: portfolio.description || '',
            image: null,
            image_url_input: portfolio.image_path || '',
            project_url: portfolio.project_url || '',
            tech_stack: Array.isArray(portfolio.tech_stack) 
                ? portfolio.tech_stack.join(', ') 
                : (portfolio.tech_stack || ''),
            is_featured: portfolio.is_featured ?? true,
            order: portfolio.order || 0,
        });
        setImagePreview(portfolio.image_url);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert tech_stack string to array
        const techArray = typeof data.tech_stack === 'string'
            ? data.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
            : data.tech_stack;

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }
        if (data.image_url_input) {
            formData.append('image_url_input', data.image_url_input);
        }
        if (data.project_url) {
            formData.append('project_url', data.project_url);
        }
        techArray.forEach((tech, index) => {
            formData.append(`tech_stack[${index}]`, tech);
        });
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('order', data.order);

        if (editingPortfolio) {
            router.post(route('portfolios.update', editingPortfolio.id), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                forceFormData: true,
            });
        } else {
            router.post(route('portfolios.store'), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                forceFormData: true,
            });
        }
    };

    const handleDelete = () => {
        if (!deleteConfirmPortfolio) return;
        router.delete(route('portfolios.destroy', deleteConfirmPortfolio.id), {
            onSuccess: () => {
                setDeleteConfirmPortfolio(null);
            }
        });
    };

    const handleToggleFeatured = (portfolio) => {
        const formData = new FormData();
        formData.append('title', portfolio.title);
        formData.append('category', portfolio.category);
        formData.append('description', portfolio.description);
        formData.append('is_featured', portfolio.is_featured ? '0' : '1');

        router.post(route('portfolios.update', portfolio.id), formData, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Filtering logic
    const filteredPortfolios = portfolios.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                              p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryList = ['All', ...new Set([...categories, ...portfolios.map(p => p.category)])];

    return (
        <AdminLayout activeTab="portfolios" title="Portfolio Manager — MiFy Admin">
            <Head title="Portfolio Manager | MiFy Admin" />

            <div className="space-y-8">
                {/* Header Title Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-lime text-xs font-mono tracking-wider uppercase mb-1">
                            <Briefcase size={16} weight="duotone" />
                            <span>Landing Page CMS</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Manager</h1>
                        <p className="text-sm text-white/60 mt-1">
                            Manage showcase projects displayed on the MiFy landing page. Upload custom covers, update tech stacks, and toggle feature status.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-lime/10 self-start md:self-auto"
                    >
                        <Plus size={16} weight="bold" />
                        <span>Add Project</span>
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                        {categoryList.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat 
                                        ? 'bg-brand-blue text-white shadow-md' 
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-brand-dark/60 border border-white/15 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-lime transition-colors"
                        />
                    </div>
                </div>

                {/* Portfolio Grid */}
                {filteredPortfolios.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <FolderSimple size={48} className="mx-auto text-white/20 mb-3" weight="duotone" />
                        <h3 className="text-base font-bold text-white mb-1">No Portfolio Projects Found</h3>
                        <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                            {search || selectedCategory !== 'All' 
                                ? 'No projects match your current search criteria.' 
                                : 'Get started by creating your first portfolio showcase project.'}
                        </p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-lg font-bold text-xs uppercase"
                        >
                            <Plus size={14} weight="bold" />
                            <span>Add New Project</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPortfolios.map((portfolio) => (
                            <div 
                                key={portfolio.id}
                                className="group bg-white/5 border border-white/10 hover:border-brand-blue/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-brand-dark/80">
                                    <img 
                                        src={portfolio.image_url} 
                                        alt={portfolio.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
                                    
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 bg-brand-lime text-brand-dark font-extrabold text-[10px] uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
                                        {portfolio.category}
                                    </span>

                                    {/* Featured Toggle Button */}
                                    <button
                                        onClick={() => handleToggleFeatured(portfolio)}
                                        title={portfolio.is_featured ? 'Featured on Landing Page' : 'Hidden from Featured'}
                                        className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all ${
                                            portfolio.is_featured 
                                                ? 'bg-amber-400 text-brand-dark shadow-lg' 
                                                : 'bg-brand-dark/60 text-white/40 hover:text-white'
                                        }`}
                                    >
                                        <Star size={16} weight={portfolio.is_featured ? 'fill' : 'bold'} />
                                    </button>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-base font-bold text-white group-hover:text-brand-lime transition-colors line-clamp-1">
                                            {portfolio.title}
                                        </h3>
                                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                                            {portfolio.description}
                                        </p>
                                    </div>

                                    {/* Tech Stack Pills */}
                                    {Array.isArray(portfolio.tech_stack) && portfolio.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {portfolio.tech_stack.map((tech, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="bg-white/5 border border-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded font-mono"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Card Footer Actions */}
                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                        {portfolio.project_url ? (
                                            <a 
                                                href={portfolio.project_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-brand-lime hover:underline font-medium"
                                            >
                                                <Globe size={13} />
                                                <span>Live Demo</span>
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-white/30 italic">No external link</span>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(portfolio)}
                                                className="p-1.5 rounded bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                                title="Edit Project"
                                            >
                                                <PencilSimple size={15} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmPortfolio(portfolio)}
                                                className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                title="Delete Project"
                                            >
                                                <Trash size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form: Add / Edit Portfolio */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {editingPortfolio ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
                                </h3>
                                <p className="text-xs text-white/50 mt-0.5">
                                    Fill in the project details below. Images will be rendered on the public landing page.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title & Category Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Retail POS Cashier System"
                                        className="w-full bg-brand-dark border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                                    />
                                    {errors.title && <p className="text-rose-400 text-[11px]">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        Category *
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full bg-brand-dark border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                                    >
                                        <option value="Web System">Web System</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="AI Automation">AI Automation</option>
                                        <option value="Marketing System">Marketing System</option>
                                        <option value="E-Commerce">E-Commerce</option>
                                    </select>
                                    {errors.category && <p className="text-rose-400 text-[11px]">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                    Project Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Explain key features, architecture, and business benefits..."
                                    className="w-full bg-brand-dark border border-white/15 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-lime resize-none"
                                />
                                {errors.description && <p className="text-rose-400 text-[11px]">{errors.description}</p>}
                            </div>

                            {/* Image Input Selection: File Upload OR Image URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                    Project Cover Image
                                </label>

                                {imagePreview && (
                                    <div className="relative h-32 rounded-lg overflow-hidden border border-white/15 bg-black/40">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setData('image', null);
                                                setData('image_url_input', '');
                                            }}
                                            className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Upload File */}
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-white/5 hover:bg-white/10 border border-white/15 border-dashed rounded-lg p-3 text-center transition-colors group"
                                        >
                                            <UploadSimple size={20} className="mx-auto text-brand-lime mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-medium text-white/80 block">Upload Local Image</span>
                                            <span className="text-[10px] text-white/40 block">PNG, JPG, WebP (Max 5MB)</span>
                                        </button>
                                    </div>

                                    {/* Image URL Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            value={data.image_url_input}
                                            onChange={(e) => {
                                                setData('image_url_input', e.target.value);
                                                setImagePreview(e.target.value);
                                            }}
                                            placeholder="Or paste Image URL..."
                                            className="w-full bg-brand-dark border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                                        />
                                        <span className="text-[10px] text-white/40 block">e.g. Unsplash URL or CDN link</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack & Live Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        Tech Stack (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tech_stack}
                                        onChange={(e) => setData('tech_stack', e.target.value)}
                                        placeholder="Laravel 13, React 19, Inertia"
                                        className="w-full bg-brand-dark border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                        Live Project URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.project_url}
                                        onChange={(e) => setData('project_url', e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full bg-brand-dark border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                                    />
                                </div>
                            </div>

                            {/* Options: Featured & Order */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded bg-brand-dark border-white/30 text-brand-lime focus:ring-brand-lime"
                                    />
                                    <span className="text-xs text-white font-medium">Show on Landing Page Featured Showcase</span>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-5 py-2 rounded-lg font-bold text-xs uppercase hover:bg-brand-lime/90 transition-all disabled:opacity-50"
                                >
                                    <Check size={14} weight="bold" />
                                    <span>{editingPortfolio ? 'Update Project' : 'Save Project'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmation: Delete */}
            {deleteConfirmPortfolio && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-400">
                            <Trash size={24} />
                            <h3 className="text-base font-bold text-white">Delete Portfolio Project?</h3>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-white">"{deleteConfirmPortfolio.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteConfirmPortfolio(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
