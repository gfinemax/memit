'use client';

import { motion } from 'framer-motion';

export default function PalaceSection() {
    return (
        <section className="relative py-32 bg-background-dark overflow-hidden" id="palace">
            {/* Background Image with overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Futuristic digital data vault"
                    className="w-full h-full object-cover opacity-30"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCbtumwZKnkB1fRP_0lvGcyndnYtwR72eTc9yUPD_fKAoQyQwKJO85IA3b5Mj0LMEJJDq7_MVBE-Sk896OMXvh_hCnnZsfFxi7xQ8UL1jVh7OhlmR4ETE31d0T62ooBnQbT20xS-oF4JTkmYDPCcnwk8tm9RSJQyH961JoGBNh39ZkL9KWDfAAbiHxFjX9HMBAyAXKAZkc2MOwfpc5kbpPP0EB59_AHJZh_8BvovpCHoxCOiaYhSNU0CkfZ_uo7bgzjO0LYxL6MtPC"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-transparent to-background-dark"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-4xl md:text-6xl font-bold text-white mb-6 text-glow"
                >
                    당신의 궁전은 <br />영원히 잊지 않습니다.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 font-light"
                >
                    생성된 이미지와 스토리는 당신만의 '디지털 기억의 궁전'에 안전하게 보관됩니다. <br />
                    언제든, 어디서든 꺼내어 볼 수 있는 무한한 저장소를 경험하세요.
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {[
                        { icon: '∞', label: '무제한 저장' },
                        { icon: '0.1s', label: '빠른 검색' },
                        { icon: 'AI', label: '자동 이미지화' },
                        { icon: '24/7', label: '상시 접근' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg text-center hover:bg-white/10 transition-colors"
                        >
                            <span className="block text-2xl font-bold text-primary mb-1">{item.icon}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
