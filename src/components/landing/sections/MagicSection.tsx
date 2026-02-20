'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowDown, Sparkles, Wand2 } from 'lucide-react';
import { convertNumberAction } from '@/app/actions_v2';

export default function MagicSection() {
    const [input, setInput] = useState('27');
    const [result, setResult] = useState<{ keywords: string[] } | null>({ keywords: ['기차'] }); // Default demo
    const [loading, setLoading] = useState(false);

    const handleConvert = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const res = await convertNumberAction(input);
            if (res.success && res.data) {
                setResult({ keywords: res.data });
            } else {
                setResult(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen py-24 flex items-center bg-gradient-to-b from-[#130c1a] to-background-dark overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 space-y-8">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold tracking-widest uppercase text-sm"
                    >
                        The Magic
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight"
                    >
                        숫자가 생생한<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">그림과 이야기</span>로<br />
                        태어납니다.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 leading-relaxed max-w-lg"
                    >
                        단순한 암기가 아닙니다. <br />
                        Memit AI는 당신의 기억을 위해 가장 강력한 이미지를 생성하고, 잊을 수 없는 스토리로 엮어냅니다.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="pt-4"
                    >
                        <button className="flex items-center gap-2 text-white border-b border-primary pb-1 hover:text-primary transition-colors group">
                            <span>체험해보기</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2 relative"
                >
                    {/* Transformation Card */}
                    <div className="glass-panel rounded-2xl p-10 lg:p-14 border border-primary/20 shadow-2xl relative overflow-hidden">
                        {/* Glow effect inside card */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[60px] rounded-full"></div>

                        <div className="flex flex-col items-center space-y-8 relative z-10 w-full">
                            {/* Input */}
                            <div className="flex flex-col items-center w-full">
                                <span className="text-sm text-gray-500 font-display uppercase tracking-widest mb-2">Input Number</span>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="text-6xl font-display font-bold text-white bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-center w-40 pb-2 transition-all"
                                        placeholder="00"
                                    />
                                    <button
                                        onClick={handleConvert}
                                        className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-primary/20 rounded-full hover:bg-primary/50 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? <Sparkles className="w-5 h-5 animate-spin text-white" /> : <ArrowRight className="w-5 h-5 text-white" />}
                                    </button>
                                </div>
                            </div>

                            {/* Morphing Arrows (Decor) */}
                            <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                            </div>

                            {/* Output Result */}
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="w-full bg-black/40 rounded-xl p-6 border border-white/10 flex flex-col items-center group cursor-pointer hover:bg-primary/10 transition-colors"
                                    >
                                        <span className="text-sm text-gray-500 font-display uppercase tracking-widest mb-4">Generated Memory</span>
                                        {/* Icon/Image Placeholder */}
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(140,43,238,0.4)] transform group-hover:scale-110 transition-transform duration-500">
                                            <Wand2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white">{result.keywords.join(', ')}</h3>
                                        <p className="text-sm text-gray-400 mt-2">Memit AI Conversion</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-gray-500 text-sm"
                                    >
                                        결과가 없습니다.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
