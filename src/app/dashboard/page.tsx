'use client';

import React from 'react';
import MemoryGenerator from '@/components/dashboard/MemoryGenerator';
import MnemonicKey from '@/components/dashboard/MnemonicKey';
import FeatureCards from '@/components/dashboard/FeatureCards';
import RecentMemories from '@/components/dashboard/RecentMemories';
import BrainTraining from '@/components/dashboard/BrainTraining';
import DailyMission from '@/components/dashboard/DailyMission';

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-12 gap-8 pb-10">
            <div className="col-span-12 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <MemoryGenerator />
                    </div>

                    {/* Side Panel (Mnemonic Key) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <MnemonicKey />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Major Features & Recent Memories */}
                    <div className="xl:col-span-8 space-y-8">
                        <FeatureCards />
                        <RecentMemories />
                    </div>

                    {/* Right Sidebar Widgets */}
                    <div className="xl:col-span-4 space-y-6">
                        <BrainTraining />
                        <DailyMission />
                    </div>
                </div>
            </div>
        </div>
    );
}
