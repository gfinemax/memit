'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background-dark via-[#1e1329] to-background-dark">
            {/* Starry Background Effect */}
            <div className="absolute inset-0 starry-bg opacity-30 animate-pulse-slow pointer-events-none"></div>

            {/* Gradient Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white mb-6"
                >
                    당신은 무엇을 <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">잊고 사나요?</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
                >
                    스쳐가는 숫자들, 흐릿해지는 얼굴들.<br />
                    우리의 소중한 기억이 어둠 속으로 사라지고 있습니다.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pt-10"
                >
                    <div className="inline-flex flex-col items-center animate-bounce text-primary/50 text-sm font-display tracking-widest uppercase">
                        <span>Scroll to remember</span>
                        <ChevronDown className="mt-2 w-6 h-6" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
