const recommendations = [
    {
        id: 1,
        tag: 'AI TRENDS',
        tagColor: 'text-indigo-600 bg-indigo-50',
        title: 'Future of Neural Networks',
        subtitle: 'Based on your recent tags',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcAsfbRmmo8iduJTiOf4oVM8ZvHfDSTvmcXdTFuxgd76Yyc-eZvpF608Jz7u_E3pV4hyoKQTuo7pelf8100zYDGSeQSq3Y-HKY01giW0E17wR-2CkFs34i5-ofZN2QldSQxn6uwb9-9r88NB6RlBWGvaY2Zx-yKeHRUUlCIH9seK_yFWDwhClvoHLdib7EcScZLKo72G1kOxnf3g2BBB33wF6uTtpVKK6qCcX_QiGds1vzSxXc5wtBpIqAPc1HCt8GA6FWkL6X-Ek',
    },
    {
        id: 2,
        tag: 'DESIGN',
        tagColor: 'text-emerald-600 bg-emerald-50',
        title: 'Visual Systems in 2024',
        subtitle: 'Popular in your network',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPclCauaCECukirv6xwTE-nZdXC2NaTA-QFlIaLalTv7EGkBTRTaT7cYfBw8XJp50go-RNPQgy3AbXu6SVHAtCTGTKjI5mqrgo52TosBlht0m4CrfIGkfxsw4GgMbcWcjjrhODvuwFiTb07v4N1-CvCuFKVeecRzZAPZknTjfWzkJBcZ8ok1rejRwHvGRR924h1_P8ad7fQjA1GpS_zFqaclj_bkElACQLF6bvQTEehnzSUV7Wfq38NkKrBqhJcMX9k1DI5rypyI0',
    },
    {
        id: 3,
        tag: 'ENERGY',
        tagColor: 'text-rose-600 bg-rose-50',
        title: 'Global Energy Summit',
        subtitle: 'Highly cited this week',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HSd3PxeJRkZcXLldZu0g9n_MKXmmtczZXKFOqeCGTbZtDm22EZ2ACUw4HBlqCGbERa4XEO80TOeLvmBnucfZSxH8O2cvDaEtC4OBt9JYzJIi2w6sinIdBYhmZrEFenFXXHxwD12eKbTcjXOL5J40cv9mh8jvf2bVZ0Xh1_ziX7Aklj29pY3rc6b_-3bqKBIRfC4XU2tBOfeAr9w060raacPmHT7XuII18LqMg_v0vuJnAH9CDBuOZICG-iejBAV46JE-Kq1WBa4',
    },
]

export default function RecommendedSection() {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-xl">bolt</span>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Recommended for you
                    </h3>
                </div>
                <div className="flex gap-2">
                    <button className="p-1 rounded-full hover:bg-slate-200 text-slate-400 cursor-pointer">
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="p-1 rounded-full hover:bg-slate-200 text-slate-400 cursor-pointer">
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-soft hover:border-primary/30 transition-all cursor-pointer"
                    >
                        <div
                            className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        >
                            <div className="w-full h-full bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                            <div className="flex gap-2 mb-1">
                                <span className={`text-[10px] font-bold ${item.tagColor} px-2 py-0.5 rounded-full`}>
                                    {item.tag}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1 truncate group-hover:text-primary transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                        </div>
                        <button className="absolute right-3 top-3 text-slate-300 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                            <span className="material-symbols-outlined text-lg">bookmark</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
