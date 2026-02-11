'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function BridgeSection() {
    return (
        <section className="relative py-32 flex items-center justify-center bg-background-dark overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-light to-white leading-relaxed py-2">
                        세상의 모든 숫자를 <br />
                        문장으로 바꾸는 마법
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100px" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mt-4"
                    />
                </motion.div>
            </div>
        </section>
    );
}
