import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Register:', formData)
    }

    // Password strength
    const getPasswordStrength = () => {
        const { password } = formData
        if (!password) return { level: 0, label: '', color: '' }
        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++

        if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' }
        if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' }
        if (score === 3) return { level: 3, label: 'Good', color: 'bg-blue-500' }
        return { level: 4, label: 'Strong', color: 'bg-emerald-500' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen flex bg-background-light">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-primary" />

                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-accent-purple/15 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-accent-emerald/10 rounded-full blur-2xl" />

                    {/* Dot pattern */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }} />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="size-11 text-white bg-white/10 backdrop-blur-xl flex items-center justify-center rounded-xl border border-white/10">
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">ResearchHub</h2>
                    </div>

                    {/* Center content */}
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10">
                            <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Trusted by Researchers</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            Start fighting
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"> misinformation</span>
                        </h1>
                        <p className="text-slate-300 text-base leading-relaxed mb-10">
                            Join thousands of citizens, journalists, and researchers using Trust_Lens to verify government claims and protect democratic discourse.
                        </p>

                        {/* Feature list */}
                        <div className="flex flex-col gap-4">
                            {[
                                { icon: 'bolt', color: 'text-amber-400 bg-amber-400/10', text: 'Instant AI-powered fact-checking' },
                                { icon: 'verified', color: 'text-emerald-400 bg-emerald-400/10', text: 'Backed by official .gov.in sources' },
                                { icon: 'trending_up', color: 'text-blue-400 bg-blue-400/10', text: 'Real-time misinformation tracking' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`size-9 rounded-lg ${feature.color} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-lg">{feature.icon}</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom testimonial */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                        <p className="text-sm text-slate-300 italic leading-relaxed mb-3">
                            "Trust_Lens helped our newsroom verify 200+ claims during the last election cycle. It's become an indispensable tool for our fact-checking desk."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">PR</div>
                            <div>
                                <p className="text-sm font-semibold text-white">Priya Raghavan</p>
                                <p className="text-xs text-slate-400">Senior Editor, The Wire</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="size-11 text-white bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">ResearchHub</h2>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
                        <p className="text-slate-500 text-sm">Start verifying claims in under 2 minutes</p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow cursor-pointer active:scale-[0.98]">
                            <svg className="size-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow cursor-pointer active:scale-[0.98]">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs font-medium text-slate-400 uppercase">or continue with email</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-name">
                                Full name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </span>
                                <input
                                    id="register-name"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-email">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-password">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className="w-full pl-11 pr-12 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {formData.password && (
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${i <= passwordStrength.level ? passwordStrength.color : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-semibold ${passwordStrength.level <= 1 ? 'text-red-500' :
                                            passwordStrength.level === 2 ? 'text-amber-500' :
                                                passwordStrength.level === 3 ? 'text-blue-500' : 'text-emerald-500'
                                        }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-confirm-password">
                                Confirm password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-11 pr-12 h-11 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 transition-all shadow-sm focus:outline-none ${formData.confirmPassword && formData.confirmPassword !== formData.password
                                            ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                                            : formData.confirmPassword && formData.confirmPassword === formData.password
                                                ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
                                                : 'border-slate-200 focus:border-primary'
                                        }`}
                                    required
                                />
                                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                    <span className="absolute inset-y-0 right-3.5 flex items-center text-emerald-500">
                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    </span>
                                )}
                                {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                    <span className="absolute inset-y-0 right-3.5 flex items-center text-red-400">
                                        <span className="material-symbols-outlined text-[20px]">error</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2.5">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer mt-0.5"
                            />
                            <label htmlFor="agree-terms" className="text-sm text-slate-600 cursor-pointer select-none leading-relaxed">
                                I agree to the{' '}
                                <a href="#" className="font-semibold text-primary hover:text-primary-dark">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="font-semibold text-primary hover:text-primary-dark">Privacy Policy</a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!agreeTerms}
                            className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            Create account
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
