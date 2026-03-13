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

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
}

function FloatingOrb({ className, duration = 6 }) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -30, 0, 20, 0],
                x: [0, 15, -10, 5, 0],
                scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        />
    )
}

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise((r) => setTimeout(r, 1500))
        setIsSubmitting(false)
        console.log('Login:', { email, password, rememberMe })
    }

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

                {/* Animated floating orbs */}
                <FloatingOrb
                    className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                    duration={8}
                />
                <FloatingOrb
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"
                    duration={10}
                />
                <FloatingOrb
                    className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-purple/10 rounded-full blur-2xl"
                    duration={7}
                />

                {/* Animated grid pattern */}
                <motion.div
                    className="absolute inset-0 opacity-[0.03]"
                    animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 0.8,
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
                            whileHover={{ scale: 1.1, rotate: 5 }}
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
                                className="material-symbols-outlined text-amber-400 text-sm"
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                bolt
                            </motion.span>
                            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                                AI-Powered Fact Checking
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-4xl font-bold text-white leading-tight mb-4"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                        >
                            Verify claims with
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300"
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                style={{ backgroundSize: '200% 200%' }}
                            >
                                {' '}official sources
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-300 text-base leading-relaxed mb-10"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                        >
                            Trust_Lens uses RAG technology to ground every verdict in verified government documents. No guesswork, no hallucinations — just truth.
                        </motion.p>

                        {/* Stats with counting animation */}
                        <motion.div
                            className="flex gap-8"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={4}
                        >
                            {[
                                { value: '10K+', label: 'Claims verified' },
                                { value: '99.2%', label: 'Accuracy rate' },
                                { value: '<5s', label: 'Avg response' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.15, type: 'spring', stiffness: 200 }}
                                >
                                    {i > 0 && <div className="hidden" />}
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom social proof */}
                    <motion.div
                        className="flex items-center gap-3 text-sm text-slate-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        <div className="flex -space-x-2">
                            {[
                                { letter: 'C', bg: 'bg-blue-500' },
                                { letter: 'F', bg: 'bg-emerald-500' },
                                { letter: 'I', bg: 'bg-purple-500' },
                                { letter: 'L', bg: 'bg-amber-500' },
                            ].map((avatar, i) => (
                                <motion.div
                                    key={avatar.letter}
                                    className={`size-8 rounded-full ring-2 ring-slate-900 ${avatar.bg} flex items-center justify-center`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.3 + i * 0.1, type: 'spring' }}
                                    whileHover={{ y: -4 }}
                                >
                                    <span className="text-white text-xs font-bold">{avatar.letter}</span>
                                </motion.div>
                            ))}
                        </div>
                        <span>Join 2,400+ researchers already using Trust_Lens</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Panel — Login Form */}
            <motion.div
                className="flex-1 flex items-center justify-center p-6 sm:p-12"
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
                        transition={{ duration: 0.5 }}
                    >
                        <div className="size-11 text-white bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">ResearchHub</h2>
                    </motion.div>

                    <motion.div className="mb-8" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
                        <p className="text-slate-500 text-sm">Enter your credentials to access your account</p>
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
                        <motion.div
                            className="flex-1 h-px bg-slate-200"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            style={{ originX: 1 }}
                        />
                        <span className="text-xs font-medium text-slate-400 uppercase">or continue with email</span>
                        <motion.div
                            className="flex-1 h-px bg-slate-200"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            style={{ originX: 0 }}
                        />
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <motion.div
                            className="flex flex-col gap-2"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                        >
                            <label className="text-sm font-semibold text-slate-700" htmlFor="login-email">
                                Email address
                            </label>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'email' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm focus:shadow-lg focus:shadow-primary/5 focus:outline-none"
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            className="flex flex-col gap-2"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={4}
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="login-password">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <motion.div
                                className="relative"
                                animate={focusedField === 'password' ? { scale: 1.01 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <span className={`absolute inset-y-0 left-3.5 flex items-center transition-colors duration-300 ${focusedField === 'password' ? 'text-primary' : 'text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
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
                        </motion.div>

                        {/* Remember Me */}
                        <motion.div
                            className="flex items-center gap-2.5"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={5}
                        >
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="text-sm text-slate-600 cursor-pointer select-none">
                                Remember me for 30 days
                            </label>
                        </motion.div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={6}
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(15,23,42,0.2)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            />
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
                                        Signing in...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="text"
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        Sign in
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
                        custom={7}
                    >
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                            Create an account
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    )
}
