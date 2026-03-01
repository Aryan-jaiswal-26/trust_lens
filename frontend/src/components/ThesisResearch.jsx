const thesisItems = [
    {
        id: 1,
        title: 'Optimizing Database Queries for Large Scale Systems',
        journal: 'IEEE Transactions on Knowledge and Data Engineering',
        author: 'Wei Chen',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqssiOPidll1wQJTvDiN0wEBtLkDJb8LNJj-bJxDbp_ageWSynTpopIewoiUdKMGP79dh1hARJfPxHQdDNZUA0DlraWRQVtw22dhTneTlTl1LXsFS6VFY2UBbWMtxmuADREek1r9BarKS9jT0gGm0xa4nIT9yCGEuKgrt-PH-2mY-z-GwRRDWDAkzFzGW8-w3Yq_hBTaHCNGw1I1xjJ7IEh4aQLn1xWMphm8SmS898XDX4lS3TSQd44dFwfgggp0XTEQJzcklhwDA',
        tag: 'Databases',
        tagColor: 'text-indigo-600 bg-indigo-50',
        date: 'Oct 24, 2023',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgBbulJI33BJO3iAidmxj-JdoWhis39lxvaYIxb3pF7Er5AX1R1djNDb39YISvUEtFvopl_nxl0_8hvL0DRyNmBh5zfeJd6jk1f4xy4hwO_FWN_UHzWVI0ys4NIxzpzBoa1CowoU-UK6IaHYIN504WgycpQOzs-hY7lOOMz2spxNjaJzUobRjD4Anet7y_D9_Nya_LtcKv7htju8uw-ewKdbQnxom0ImsaL6r--vEnkfoYENHtFlgWYCRfgbyDn3aLzE-qepwmVp8',
    },
    {
        id: 2,
        title: 'A Comparative Analysis of NoSQL Databases',
        journal: 'Journal of Systems and Software',
        author: 'Linda Martinez',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR4G8u31G_ZqGrkx269s42rHMh0z_uCmfUmRBqE6nS8KouFBbYPP6_fAjyQwu_wxcCMWC3tXs4Yss2hIOJ31sfpDhEUSufNcD0Sgmh3KDBX3b08s9jMTKUYO9PDY_pVC1VHRxBvvMtbY1BuTvMjGQzrBlGJxCCsgAav6_JY3Be58XqosJKVPtWwddgd7r4jxga27w6eITjnmCBCITt_10cFv0_2Be6f8F5XVm2HmzgmQQrTc_apcyUos5gAgwniltQPzy1utpcK5I',
        tag: 'NoSQL',
        tagColor: 'text-emerald-600 bg-emerald-50',
        date: 'Sept 12, 2023',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQpQseG3u-UIwxHkifkwwAxT8zSq1P8ndaLOqfXhTRvuc28frvGfHugzP99G0-qA_qdpX_MKAqiUCOj6jVTBEr6ssZukgz6znT_S6M3f0bDcnCsHFCa0kY7GSalSZPrGaqgwU72Giv5O7F_hFMsu3_gHpsWG7Mpv0Xuz1Fb8hu5-C1DrNBkCrpikIkpgcZJukuqflvNiEify2SdCXeSB9JURwW0tvQcMPhMxV3DMAT4JLonJCLTGX7PwjHaepT02-WDvnRE91V5UQ',
    },
]

function ThesisItem({ item }) {
    return (
        <div className="group flex items-center bg-white p-2 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-soft transition-all cursor-pointer">
            {/* Thumbnail */}
            <div
                className="size-14 rounded-lg bg-slate-100 flex-shrink-0 bg-cover bg-center mr-4 shadow-inner"
                style={{ backgroundImage: `url('${item.thumbnail}')` }}
            />

            {/* Content Grid */}
            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                {/* Title + Journal */}
                <div className="col-span-12 md:col-span-5 pr-4">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.journal}</p>
                </div>

                {/* Author */}
                <div className="hidden md:flex col-span-3 items-center gap-2.5">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-6 ring-2 ring-white"
                        style={{ backgroundImage: `url("${item.authorAvatar}")` }}
                    />
                    <span className="text-xs font-semibold text-slate-600 truncate">{item.author}</span>
                </div>

                {/* Tag */}
                <div className="hidden md:flex col-span-2">
                    <span className={`px-2.5 py-1 ${item.tagColor} rounded-md text-[10px] font-bold uppercase tracking-wide`}>
                        {item.tag}
                    </span>
                </div>

                {/* Date */}
                <div className="hidden md:flex col-span-2 justify-end text-xs font-medium text-slate-400">
                    {item.date}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors cursor-pointer" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
        </div>
    )
}

export default function ThesisResearch() {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-indigo-500" />
                    <h3 className="text-lg font-bold text-slate-800">Thesis Research</h3>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 cursor-pointer">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {thesisItems.map((item) => (
                    <ThesisItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}
