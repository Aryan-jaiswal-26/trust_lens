import RecommendedSection from './RecommendedSection'
import RecentlyAdded from './RecentlyAdded'
import ThesisResearch from './ThesisResearch'
import LibraryHeader from './LibraryHeader'

export default function MainContent() {
    return (
        <main className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden relative">
            {/* Background gradient */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />

            {/* Top section (non-scrollable) */}
            <div className="px-8 py-6 shrink-0 z-10">
                <LibraryHeader />
                <RecommendedSection />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar z-10">
                <RecentlyAdded />
                <ThesisResearch />
            </div>
        </main>
    )
}
