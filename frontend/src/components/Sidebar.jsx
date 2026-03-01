import { useState } from 'react'

const collections = [
    { name: 'Thesis Research', color: 'bg-indigo-500', glow: 'shadow-[0_0_8px_rgba(99,102,241,0.5)]', count: 24 },
    { name: 'Climate Change', color: 'bg-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]', count: 12 },
]

const menuItems = [
    { icon: 'label', label: 'Tags', hoverColor: 'group-hover:text-pink-500' },
    { icon: 'schedule', label: 'Recent', hoverColor: 'group-hover:text-amber-500' },
]

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('All Sources')
    const [collectionsOpen, setCollectionsOpen] = useState(true)

    return (
        <aside className="w-[280px] bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col hidden md:flex shrink-0 overflow-y-auto z-10">
            <div className="flex flex-col p-4 gap-6">
                {/* Library Info Card */}
                <div className="flex gap-4 items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 shadow-sm ring-1 ring-white/50"
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeVzztWJcd44ad4Rz9tjT1wYeRq44d6jDIWxeuQP9oL3NHsSgpMgqYmoa7DInNhyj-o9rCJne8n_wzrD0U7qysJ2UmIBDzv5xUEbwV36AEppHA8KMwgyqnQzpWpN-y2luwJ0jMmllAhhkTnzy3k78nReDb-Pv6G6Pgf9SLP5KQY_Ypb99bXvR1oKS-6gHTuyixj4YLhERUGwyUP7dGAU_WifXcsX0B-4a0BM1Fx8D3lC8WErT1edYtY9IptAFWzDVOnIRrxe7WxE0")`,
                        }}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 text-sm font-bold">My Library</h1>
                        <p className="text-slate-500 text-xs font-medium">1,248 references</p>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-1.5">
                    {/* All Sources - Active */}
                    <div
                        onClick={() => setActiveItem('All Sources')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-semibold relative overflow-hidden transition-all ${activeItem === 'All Sources'
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                    >
                        {activeItem === 'All Sources' && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        <span className="material-symbols-outlined text-[20px]">library_books</span>
                        <span className="text-sm">All Sources</span>
                    </div>

                    {/* Collections */}
                    <div className="group">
                        <div
                            onClick={() => setCollectionsOpen(!collectionsOpen)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-indigo-500 transition-colors">
                                    folder_open
                                </span>
                                <span className="text-sm font-medium group-hover:text-slate-900">Collections</span>
                            </div>
                            <span
                                className={`material-symbols-outlined text-sm text-slate-400 transition-transform ${collectionsOpen ? 'rotate-90' : ''
                                    }`}
                            >
                                chevron_right
                            </span>
                        </div>

                        {collectionsOpen && (
                            <div className="pl-4 mt-1 flex flex-col gap-1">
                                {collections.map((col) => (
                                    <button
                                        key={col.name}
                                        onClick={() => setActiveItem(col.name)}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm group/item cursor-pointer w-full text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${col.color} ${col.glow}`} />
                                            <span className="group-hover/item:text-slate-900 transition-colors">
                                                {col.name}
                                            </span>
                                        </div>
                                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                            {col.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags & Recent */}
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => setActiveItem(item.label)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer transition-all group"
                        >
                            <span className={`material-symbols-outlined text-[20px] ${item.hoverColor} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium group-hover:text-slate-900">{item.label}</span>
                        </div>
                    ))}

                    {/* Trash */}
                    <div
                        onClick={() => setActiveItem('Trash')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer transition-all group mt-auto"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:text-red-500 transition-colors">
                            delete
                        </span>
                        <span className="text-sm font-medium group-hover:text-slate-900">Trash</span>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-slate-200 mt-auto">
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Settings
                </button>
            </div>
        </aside>
    )
}
