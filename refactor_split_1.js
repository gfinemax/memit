const fs = require('fs');
const path = require('path');

const sourcePath = 'src/components/dashboard/MemoryGenerator.tsx';
const content = fs.readFileSync(sourcePath, 'utf8');
const lines = content.split(/\r?\n/);

// We need to extract ShuffleSlot
const shuffleSlotStart = lines.findIndex(l => l.includes('function ShuffleSlot'));
const shuffleSlotContent = lines.slice(shuffleSlotStart).join('\n');

const shuffleSlotSrc = `import React, { useState, useEffect } from 'react';

${shuffleSlotContent}
`;
fs.writeFileSync('src/components/dashboard/ShuffleSlot.tsx', shuffleSlotSrc);
console.log('Created ShuffleSlot.tsx');
