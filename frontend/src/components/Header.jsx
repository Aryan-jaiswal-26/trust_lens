import { useState } from 'react'

const navItems = ['Library', 'Notebook', 'Citations']

export default function Header() {
    const [activeNav, setActiveNav] = useState('Library')

    return (
        <header className="flex items-center justify-between whitespace-nowrap bg-white px-6 py-4 shrink-0 shadow-sm z-20 sticky top-0">
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3 text-slate-900 group cursor-pointer">
                    <div className="size-10 text-white bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">science</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">ResearchHub</h2>
                </div>

                {/* Search Bar */}
                <label className="hidden md:flex flex-col min-w-80 !h-11">
                    <div className="flex w-full flex-1 items-center rounded-xl h-full bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <div className="text-slate-400 pl-4 pr-2">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 h-full"
                            placeholder="Search across libraries..."
                        />
                        <div className="pr-3 text-xs text-slate-400 font-semibold border border-slate-200 rounded px-1.5 py-0.5 mx-2">
                            ⌘K
                        </div>
                    </div>
                </label>
            </div>

            <div className="flex items-center gap-5">
                {/* Navigation Tabs */}
                <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveNav(item)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeNav === item
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                {/* New Source Button */}
                <button className="flex items-center justify-center gap-2 rounded-xl h-10 px-5 bg-slate-900 hover:bg-slate-800 transition-all text-white text-sm font-bold shadow-lg shadow-slate-900/10 active:scale-95 cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>New Source</span>
                </button>

                {/* User Avatar */}
                <div className="relative group">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white shadow-md cursor-pointer transition-transform hover:scale-105"
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOui1pJLVO_53TmcldHtLAG-FLXjuEEdhFAGDgwTzao_EkiwacUV_E2KW6FG4jH3yrNzkmZSsP-brmEiEEcOTYHjXVY47HZCcYVPupfBlkWLcmlxo9gHo8Qp9tHSlyg41GGySgvmuT-XIq4ajArzCkqZ9vKafOckvp_a4zdJFeLkA0h9KnOeKKHHplDRFTDNZmjhhdepAoJ6IawMJ2d9vcASiWbe5nzJ5gZazeL3eZjDF9gLzLVW1hy_nPur3Jbx1khHsEWirpgTE")`,
                        }}
                    />
                    <div className="absolute top-0 right-0 size-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
            </div>
        </header>
    )
}
