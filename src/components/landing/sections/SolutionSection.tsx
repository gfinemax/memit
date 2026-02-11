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
                        Memit Logic
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        기억의 변환 법칙
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg"
                    >
                        숫자는 자음이 되고, 자음은 단어가 되어 생명력을 얻습니다.
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
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background-dark text-primary px-4 py-1 rounded-full border border-primary/30 text-xs font-bold uppercase">Step 01</div>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">1</span>
                            <ArrowRight className="mx-4 text-gray-600 w-8 h-8" />
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">ㄱ</span>
                        </div>
                        <p className="text-center text-gray-400 font-light">숫자 1은 자음 'ㄱ'과 매핑됩니다.<br />형태적 유사성을 기반으로 합니다.</p>
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
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background-dark text-primary px-4 py-1 rounded-full border border-primary/30 text-xs font-bold uppercase">Step 02</div>
                        <div className="h-32 flex items-center justify-center mb-6">
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">0</span>
                            <ArrowRight className="mx-4 text-gray-600 w-8 h-8" />
                            <span className="font-display text-7xl font-bold text-white group-hover:text-primary transition-colors">ㅇ</span>
                        </div>
                        <p className="text-center text-gray-400 font-light">숫자 0은 자음 'ㅇ'과 매핑됩니다.<br />직관적인 연상 작용을 돕습니다.</p>
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
                        <span>Memit은 0부터 9까지 모든 숫자에 고유한 자음을 부여합니다.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
