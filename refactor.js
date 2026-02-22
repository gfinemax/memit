// Refactor: Extract tab content into render functions
// This eliminates the massive 1037-line ternary that SWC can't parse.
//
// Strategy:
// 1. Extract L641-L1041 (memory tab div) as renderMemoryTab() body
// 2. Extract L1043-L1676 (password tab div) as renderPasswordTab() body
// 3. Replace L640-L1677 with:
//    {activeTab === 'memory' ? renderMemoryTab() : renderPasswordTab()}
// 4. Add the two functions before the return statement

const fs = require('fs');
const lines = fs.readFileSync('test_jsx.tsx', 'utf8').split('\n');

// Find where to insert the render functions - right before "return ("
// The return statement is at L596
const insertPoint = 595; // 0-indexed, before "return ("

// Extract memory tab: L641-L1041 (0-indexed: 640-1040)
const memoryTabLines = lines.slice(640, 1041);

// Extract password tab: L1043-L1676 (0-indexed: 1042-1675)
const passwordTabLines = lines.slice(1042, 1676);

// Build the render functions with proper indentation
// The tab content is already indented. We need to wrap it in a function.
// Let's de-indent by the amount of the outermost wrapper.
// Memory tab starts at indent 24 (the <div> at L641)
// Password tab starts at indent 28 (the <div> at L1043)

const renderMemoryFn = [
    '',
    '    const renderMemoryTab = () => (',
    ...memoryTabLines,
    '    );',
    '',
];

const renderPasswordFn = [
    '    const renderPasswordTab = () => (',
    ...passwordTabLines,
    '    );',
    '',
];

// Build the replacement for L640-L1677
const ternaryReplacement = [
    '                    {activeTab === \'memory\' ? renderMemoryTab() : renderPasswordTab()}\r',
];

// Construct the new file:
// 1. Lines 1-595 (before return)
const part1 = lines.slice(0, insertPoint);

// 2. Render functions
// 3. Lines 596-639 (return + wrapper opening)
const part2 = lines.slice(insertPoint, 639);

// 4. The simplified ternary (replaces L640-L1677)
// 5. Lines 1678+ (wrapper closing + createPortal + rest)
const part3 = lines.slice(1677);

const newLines = [
    ...part1,
    ...renderMemoryFn,
    ...renderPasswordFn,
    ...part2,
    ...ternaryReplacement,
    ...part3,
];

// Ensure consistent CRLF line endings
const content = newLines.join('\n').replace(/\r?\n/g, '\r\n');
fs.writeFileSync('src/components/dashboard/MemoryGenerator.tsx', content);

console.log('Refactored! Memory tab: ' + memoryTabLines.length + ' lines, Password tab: ' + passwordTabLines.length + ' lines');
console.log('Total new lines: ~' + newLines.length);
