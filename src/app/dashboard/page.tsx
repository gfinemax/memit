import React from 'react';
import MemoryGenerator from '@/components/dashboard/MemoryGenerator';
import FeatureCards from '@/components/dashboard/FeatureCards';
import RecentMemories from '@/components/dashboard/RecentMemories';
import BrainTraining from '@/components/dashboard/BrainTraining';
import DailyMission from '@/components/dashboard/DailyMission';
import MobileHome from '@/components/mobile/MobileHome';

export default function DashboardPage() {
    return (
        <>
            {/* Desktop Dashboard View */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="grid grid-cols-12 gap-8 pb-10">
                    <div className="col-span-12 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-12 xl:col-span-12">
                                <MemoryGenerator />
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
            </div>

            {/* Mobile Dashboard View */}
            <div className="block md:hidden">
                <MobileHome />
            </div>
        </>
    );
}
