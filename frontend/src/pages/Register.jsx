import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
}

function FloatingOrb({ className, duration = 6 }) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -25, 0, 18, 0],
                x: [0, 12, -8, 5, 0],
                scale: [1, 1.08, 0.96, 1.04, 1],
            }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        />
    )
}

const features = [
    { icon: 'bolt', color: 'text-amber-400 bg-amber-400/10', text: 'Instant AI-powered fact-checking' },
    { icon: 'verified', color: 'text-emerald-400 bg-emerald-400/10', text: 'Backed by official .gov.in sources' },
    { icon: 'trending_up', color: 'text-blue-400 bg-blue-400/10', text: 'Real-time misinformation tracking' },
]

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise((r) => setTimeout(r, 1500))
        setIsSubmitting(false)
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
    const passwordsMatch = formData.confirmPassword && formData.confirmPassword === formData.password
    const passwordsMismatch = formData.confirmPassword && formData.confirmPassword !== formData.password

    return (
        <div className="min-h-screen flex bg-background-light overflow-hidden">
            {/* Left Panel — Branding */}
            <motion.div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-primary" />

                {/* Floating orbs */}
                <FloatingOrb className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-accent-purple/15 rounded-full blur-3xl" duration={10} />
                <FloatingOrb className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" duration={8} />
                <FloatingOrb className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-accent-emerald/10 rounded-full blur-2xl" duration={9} />

                {/* Animated dot pattern */}
                <motion.div
                    className="absolute inset-0 opacity-[0.04]"
                    animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                    }}
                />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 2 + (i % 3) * 2,
                            height: 2 + (i % 3) * 2,
                            left: `${10 + i * 10}%`,
                            top: `${15 + (i * 8) % 60}%`,
                            background: `rgba(255,255,255,${0.15 + (i % 3) * 0.1})`,
                        }}
                        animate={{
                            y: [0, -(60 + i * 15), 0],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 5 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.div
                            className="size-11 text-white bg-white/10 backdrop-blur-xl flex items-center justify-center rounded-xl border border-white/10"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </motion.div>
                        <h2 className="text-xl font-bold text-white tracking-tight">ResearchHub</h2>
                    </motion.div>

                    {/* Center content */}
                    <div className="max-w-md">
                        <motion.div
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                        >
                            <motion.span
                                className="material-symbols-outlined text-emerald-400 text-sm"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                verified
                            </motion.span>
                            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Trusted by Researchers</span>
                        </motion.div>

                        <motion.h1
                            className="text-4xl font-bold text-white leading-tight mb-4"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                        >
                            Start fighting
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                style={{ backgroundSize: '200% 200%' }}
                            >
                                {' '}misinformation
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-300 text-base leading-relaxed mb-10"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                        >
                            Join thousands of citizens, journalists, and researchers using Trust_Lens to verify government claims and protect democratic discourse.
                        </motion.p>

                        {/* Feature list */}
                        <div className="flex flex-col gap-4">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <motion.div
                                        className={`size-9 rounded-lg ${feature.color} flex items-center justify-center`}
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        <span className="material-symbols-outlined text-lg">{feature.icon}</span>
                                    </motion.div>
                                    <span className="text-sm font-medium text-slate-200">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom testimonial */}
                    <motion.div
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        whileHover={{ borderColor: 'rgba(255,255,255,0.2)', y: -2 }}
                    >
                        <p className="text-sm text-slate-300 italic leading-relaxed mb-3">
                            "Trust_Lens helped our newsroom verify 200+ claims during the last election cycle. It's become an indispensable tool for our fact-checking desk."
                        </p>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="size-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                                whileHover={{ scale: 1.1 }}
                            >
                                PR
                            </motion.div>
                            <div>
                                <p className="text-sm font-semibold text-white">Priya Raghavan</p>
                                <p className="text-xs text-slate-400">Senior Editor, The Wire</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Panel — Register Form */}
            <motion.div
                className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <motion.div
                        className="lg:hidden flex items-center gap-3 mb-10 justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="size-11 text-white bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">ResearchHub</h2>
                    </motion.div>

                    <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
                        <p className="text-slate-500 text-sm">Start verifying claims in under 2 minutes</p>
                    </motion.div>

                    {/* Social Login Buttons */}
                    <motion.div className="flex gap-3 mb-6" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                        <motion.button
                            className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                            whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="size-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </motion.button>
                        <motion.button
                            className="flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
                            whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </motion.button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="flex items-center gap-4 mb-6"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        <motion.div className="flex-1 h-px bg-slate-200" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }} style={{ originX: 1 }} />
                        <span className="text-xs font-medium text-slate-400 uppercase">or continue with email</span>
                        <motion.div className="flex-1 h-px bg-slate-200" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }} style={{ originX: 0 }} />
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Full Name */}
                        <motion.div className="flex flex-col gap-2" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-name">Full name</label>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'fullName' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'fullName' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </span>
                                <input
                                    id="register-name"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('fullName')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:shadow-lg focus:shadow-primary/5 focus:outline-none"
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        {/* Email */}
                        <motion.div className="flex flex-col gap-2" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-email">Email address</label>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'email' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:shadow-lg focus:shadow-primary/5 focus:outline-none"
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        {/* Password */}
                        <motion.div className="flex flex-col gap-2" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-password">Password</label>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'password' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'password' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Create a strong password"
                                    className="w-full pl-11 pr-12 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:shadow-lg focus:shadow-primary/5 focus:outline-none"
                                    required
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={showPassword ? 'hide' : 'show'}
                                            className="material-symbols-outlined text-[20px]"
                                            initial={{ rotateY: 90, opacity: 0 }}
                                            animate={{ rotateY: 0, opacity: 1 }}
                                            exit={{ rotateY: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.button>
                            </motion.div>

                            {/* Password Strength Meter — Animated */}
                            <AnimatePresence>
                                {formData.password && (
                                    <motion.div
                                        className="flex items-center gap-3 mt-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength.level ? passwordStrength.color : 'bg-slate-200'
                                                        }`}
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' }}
                                                    style={{ originX: 0 }}
                                                />
                                            ))}
                                        </div>
                                        <motion.span
                                            className={`text-xs font-semibold ${passwordStrength.level <= 1 ? 'text-red-500' :
                                                    passwordStrength.level === 2 ? 'text-amber-500' :
                                                        passwordStrength.level === 3 ? 'text-blue-500' : 'text-emerald-500'
                                                }`}
                                            key={passwordStrength.label}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {passwordStrength.label}
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div className="flex flex-col gap-2" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
                            <label className="text-sm font-semibold text-slate-700" htmlFor="register-confirm-password">Confirm password</label>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'confirmPassword' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-11 pr-12 h-11 bg-white border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 transition-all shadow-sm focus:shadow-lg focus:outline-none ${passwordsMismatch
                                            ? 'border-red-300 focus:border-red-400 focus:ring-red-200 focus:shadow-red-500/5'
                                            : passwordsMatch
                                                ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200 focus:shadow-emerald-500/5'
                                                : 'border-slate-200 focus:border-primary focus:ring-primary/30 focus:shadow-primary/5'
                                        }`}
                                    required
                                />
                                <AnimatePresence>
                                    {passwordsMatch && (
                                        <motion.span
                                            className="absolute inset-y-0 right-3.5 flex items-center text-emerald-500"
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                        </motion.span>
                                    )}
                                    {passwordsMismatch && (
                                        <motion.span
                                            className="absolute inset-y-0 right-3.5 flex items-center text-red-400"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                        >
                                            <motion.span
                                                className="material-symbols-outlined text-[20px]"
                                                animate={{ x: [0, -3, 3, -2, 2, 0] }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                error
                                            </motion.span>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        {/* Terms */}
                        <motion.div className="flex items-start gap-2.5" variants={fadeUp} initial="hidden" animate="visible" custom={7}>
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
                        </motion.div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={!agreeTerms || isSubmitting}
                            className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={8}
                            whileHover={agreeTerms ? { scale: 1.02, boxShadow: '0 8px 30px rgba(15,23,42,0.2)' } : {}}
                            whileTap={agreeTerms ? { scale: 0.98 } : {}}
                        >
                            {/* Shimmer */}
                            {agreeTerms && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                                    animate={{ x: ['-200%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                />
                            )}
                            <AnimatePresence mode="wait">
                                {isSubmitting ? (
                                    <motion.div
                                        key="loading"
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <motion.div
                                            className="size-4 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Creating account...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="text"
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        Create account
                                        <motion.span
                                            className="material-symbols-outlined text-[18px]"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                        >
                                            arrow_forward
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <motion.p
                        className="text-center text-sm text-slate-500 mt-8"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={9}
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                            Sign in
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    )
}
