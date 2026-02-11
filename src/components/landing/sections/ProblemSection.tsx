'use client';

import { motion } from 'framer-motion';

export default function ProblemSection() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-background-dark overflow-hidden py-24" id="problem">
            {/* Floating Numbers Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <motion.span
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-1/4 text-6xl text-gray-800 font-display font-bold opacity-10 blur-sm"
                >
                    0412
                </motion.span>
                <motion.span
                    animate={{ y: [15, -15, 15] }}
                    transition={{ duration: 7, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-3/4 left-1/3 text-4xl text-gray-700 font-display font-bold opacity-20 blur-[2px]"
                >
                    9871
                </motion.span>
                <motion.span
                    animate={{ y: [-25, 25, -25] }}
                    transition={{ duration: 8, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/3 right-1/4 text-8xl text-gray-800 font-display font-bold opacity-5 blur-md"
                >
                    PIN
                </motion.span>
                <motion.span
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-1/4 right-1/3 text-5xl text-gray-800 font-display font-bold opacity-10"
                >
                    PW?
                </motion.span>
                <motion.span
                    animate={{ y: [-15, 15, -15] }}
                    transition={{ duration: 6.5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-10 text-3xl text-gray-700 font-display font-bold opacity-15"
                >
                    1998
                </motion.span>
                <motion.span
                    animate={{ y: [20, -20, 20] }}
                    transition={{ duration: 7.5, delay: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 right-20 text-7xl text-gray-800 font-display font-bold opacity-5"
                >
                    ID
                </motion.span>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-display text-4xl md:text-5xl font-bold text-white mb-8"
                >
                    중요한 순간마다 <br />
                    <span className="text-gray-500">작아지는 우리.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xl text-gray-400 leading-relaxed font-light"
                >
                    카드 비밀번호가 기억나지 않아 당황했던 적이 있나요?<br />
                    소중한 사람의 기념일을 놓쳐 미안했던 적은요?<br />
                    단순한 건망증이 아닙니다. 당신의 뇌가 과부하 걸린 것입니다.
                </motion.p>
            </div>
        </section>
    );
}
