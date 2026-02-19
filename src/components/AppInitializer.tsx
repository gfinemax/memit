'use client';

import { useEffect, useState } from 'react';
import { AppService } from '@/lib/app-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function AppInitializer() {
    const [updateInfo, setUpdateInfo] = useState<{ updateAvailable: boolean; latestVersion?: string }>({ updateAvailable: false });

    useEffect(() => {
        const initialize = async () => {
            // 1. Check for updates
            const res = await AppService.checkForUpdates();
            if (res && res.updateAvailable) {
                setUpdateInfo({
                    updateAvailable: true,
                    latestVersion: res.latestVersion?.toString()
                });
            }

            // 2. Request review if milestones met
            if (AppService.shouldRequestReview()) {
                await AppService.requestReview();
                AppService.markReviewPrompted();
            }
        };

        initialize();
    }, []);

    return (
        <AnimatePresence>
            {updateInfo.updateAvailable && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-4 right-4 z-[100] bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Download className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">새로운 업데이트 발견! (v{updateInfo.latestVersion})</h4>
                            <p className="text-xs text-white/80">더 나은 기능을 위해 업데이트 해주세요.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.memit.app', '_blank')}
                            className="px-4 py-2 bg-white text-primary rounded-lg text-xs font-bold"
                        >
                            업데이트
                        </button>
                        <button onClick={() => setUpdateInfo({ updateAvailable: false })} className="p-1 hover:bg-white/10 rounded">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
