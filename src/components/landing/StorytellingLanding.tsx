'use client';

import React from 'react';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import BridgeSection from './sections/BridgeSection';
import SolutionSection from './sections/SolutionSection';
import MagicSection from './sections/MagicSection';
import PalaceSection from './sections/PalaceSection';
import { ServiceSection, CallToAction, Footer } from './sections/FooterAndServices';

export default function StorytellingLanding() {
    return (
        <div className="w-full bg-background-dark text-white relative z-0">
            <HeroSection />
            <ProblemSection />
            <BridgeSection />
            <SolutionSection />
            <MagicSection />
            <PalaceSection />
            <ServiceSection />
            <CallToAction />
            <Footer />
        </div>
    );
}
