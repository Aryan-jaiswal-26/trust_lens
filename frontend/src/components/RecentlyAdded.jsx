const recentItems = [
    {
        id: 1,
        title: 'The Impact of Neural Networks on Modern Cryptography',
        author: 'Dr. Sarah Jensen, et al.',
        time: '2h ago',
        format: 'PDF',
        type: 'Journal',
        typeColor: 'bg-blue-500 shadow-blue-500/30',
        hoverColor: 'group-hover:text-primary',
        actionHover: 'hover:text-primary',
        hasImage: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcAsfbRmmo8iduJTiOf4oVM8ZvHfDSTvmcXdTFuxgd76Yyc-eZvpF608Jz7u_E3pV4hyoKQTuo7pelf8100zYDGSeQSq3Y-HKY01giW0E17wR-2CkFs34i5-ofZN2QldSQxn6uwb9-9r88NB6RlBWGvaY2Zx-yKeHRUUlCIH9seK_yFWDwhClvoHLdib7EcScZLKo72G1kOxnf3g2BBB33wF6uTtpVKK6qCcX_QiGds1vzSxXc5wtBpIqAPc1HCt8GA6FWkL6X-Ek',
    },
    {
        id: 2,
        title: 'Sustainable Energy Solutions for 2050',
        author: 'Robert K. Smith',
        time: 'Yesterday',
        format: 'EPUB',
        type: 'Book',
        typeColor: 'bg-emerald-500 shadow-emerald-500/30',
        hoverColor: 'group-hover:text-emerald-600',
        actionHover: 'hover:text-emerald-500',
        hasImage: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HSd3PxeJRkZcXLldZu0g9n_MKXmmtczZXKFOqeCGTbZtDm22EZ2ACUw4HBlqCGbERa4XEO80TOeLvmBnucfZSxH8O2cvDaEtC4OBt9JYzJIi2w6sinIdBYhmZrEFenFXXHxwD12eKbTcjXOL5J40cv9mh8jvf2bVZ0Xh1_ziX7Aklj29pY3rc6b_-3bqKBIRfC4XU2tBOfeAr9w060raacPmHT7XuII18LqMg_v0vuJnAH9CDBuOZICG-iejBAV46JE-Kq1WBa4',
    },
    {
        id: 3,
        title: 'Preliminary Study on User Interface Trends',
        author: 'Self',
        time: '3 days ago',
        format: 'DOCX',
        type: 'Draft',
        typeColor: 'bg-purple-500 shadow-purple-500/30',
        hoverColor: 'group-hover:text-purple-600',
        actionHover: 'hover:text-purple-500',
        hasImage: false,
    },
    {
        id: 4,
        title: 'Generative AI in Graphic Design: A Review',
        author: 'DesignWeekly.com',
        time: 'Last week',
        format: 'WEB',
        type: 'Web Page',
        typeColor: 'bg-orange-500 shadow-orange-500/30',
        hoverColor: 'group-hover:text-orange-600',
        actionHover: 'hover:text-orange-500',
        hasImage: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPclCauaCECukirv6xwTE-nZdXC2NaTA-QFlIaLalTv7EGkBTRTaT7cYfBw8XJp50go-RNPQgy3AbXu6SVHAtCTGTKjI5mqrgo52TosBlht0m4CrfIGkfxsw4GgMbcWcjjrhODvuwFiTb07v4N1-CvCuFKVeecRzZAPZknTjfWzkJBcZ8ok1rejRwHvGRR924h1_P8ad7fQjA1GpS_zFqaclj_bkElACQLF6bvQTEehnzSUV7Wfq38NkKrBqhJcMX9k1DI5rypyI0',
    },
]

function SourceCard({ item }) {
    return (
        <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer relative">
            {/* Image / Placeholder */}
            <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                {item.hasImage ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                                Quick View
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                        <div className="text-center transform group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-6xl text-purple-300 mb-2">
                                description
                            </span>
                            <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest">
                                Preview N/A
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                                Quick View
                            </button>
                        </div>
                    </div>
                )}

                {/* Format Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm border border-white/20">
                    {item.format}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 relative">
                <div className="absolute -top-3 left-4">
                    <span className={`px-3 py-1 rounded-full ${item.typeColor} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                        {item.type}
                    </span>
                </div>
                <h3 className={`text-lg font-bold text-slate-900 mb-1 mt-2 line-clamp-2 leading-tight ${item.hoverColor} transition-colors`}>
                    {item.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{item.author}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                    <div className="flex gap-2">
                        <button className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">star</span>
                        </button>
                        <button className={`text-slate-300 ${item.actionHover} transition-colors cursor-pointer`}>
                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function RecentlyAdded() {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-800">Recently Added</h3>
                <button className="text-sm text-primary font-semibold hover:underline cursor-pointer">
                    View All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentItems.map((item) => (
                    <SourceCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}
