'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon, Info } from 'lucide-react';

export default function SolutionSection() {
    return (
        <section className="relative py-24 bg-background-light dark:bg-[#130c1a]" id="solution">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-2 block"
                    >
                        THE LOGIC
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        마스터키 생성 원리
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        숫자가 문자로 치환되는 순간, 당신의 두뇌는 <strong className="text-primary">'암호 생성기'</strong>가 됩니다.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-8 rounded-2xl border border-white/5 relative group hover:border-primary/50 transition-all duration-300"
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background-dark text-primary px-4 py-1 rounded-full border border-primary/30 text-xs font-bold uppercase">The Key</div>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">1</span>
                            <ArrowRight className="mx-4 text-gray-600 w-8 h-8" />
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">ㄱ</span>
                        </div>
                        <p className="text-center text-gray-400 font-light">단 10개의 치환 규칙만 익히세요.<br />이것이 당신의 '보안 키'가 됩니다.</p>
                    </motion.div>

                    {/* Connector */}
                    <div className="hidden md:flex justify-center text-primary/30">
                        <LinkIcon className="w-10 h-10" />
                    </div>

                    {/* Step 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-8 rounded-2xl border border-white/5 relative group hover:border-primary/50 transition-all duration-300"
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background-dark text-primary px-4 py-1 rounded-full border border-primary/30 text-xs font-bold uppercase">The Protocol</div>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">0</span>
                            <ArrowRight className="mx-4 text-gray-600 w-8 h-8" />
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">ㅇ</span>
                        </div>
                        <p className="text-center text-gray-400 font-light">직관적인 규칙으로 2분이면 마스터합니다.<br />평생 쓸 암호의 기초입니다.</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary-light font-display">
                        <Info className="w-5 h-5" />
                        <span>이 논리를 장착하는 순간, 세상의 모든 숫자가 당신만의 비밀번호 재료가 됩니다.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
