import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ShuffleSlot({ words, isSelecting = true }: { words: string[], isSelecting?: boolean }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!isSelecting) return;
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % words.length);
        }, 100);
        return () => clearInterval(interval);
    }, [words, isSelecting]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            className="inline-block min-w-[3ch] text-center"
        >
            {words[index]}
        </motion.span>
    );
}
