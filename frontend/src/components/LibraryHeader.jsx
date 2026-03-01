import { useState } from 'react'

export default function LibraryHeader() {
    const [viewMode, setViewMode] = useState('grid')

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Library</h1>
                <p className="text-slate-500 text-sm">Manage and organize your research materials.</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                {/* Filter Input */}
                <div className="relative flex-1 md:w-64">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm focus:outline-none"
                        placeholder="Filter current view..."
                    />
                </div>

                {/* Filter Button */}
                <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors shadow-sm cursor-pointer">
                    <span className="material-symbols-outlined">tune</span>
                </button>

                {/* View Toggle */}
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">view_list</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
