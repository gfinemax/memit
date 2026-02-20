
const testCases = [
    "123",       // Expect: ["123"]
    "1234",      // Expect: ["12", "34"]
    "12345",     // Expect: ["12", "345"] (or ["123", "45"])
    "123456",    // Expect: ["12", "34", "56"] (or ["123", "456"])
    "1234567",   // Expect: ["12", "34", "567"] (or others without '1')
    "1",         // Expect: ["1"] (No choice if only 1 digit)
    "12"         // Expect: ["12"]
];

function chunkNumberInternal(input) {
    const cleanInput = input.replace(/[^0-9]/g, '');
    const chunks = [];
    let remaining = cleanInput;

    while (remaining.length > 0) {
        if (remaining.length === 1) {
            if (chunks.length > 0) {
                const last = chunks.pop();
                chunks.push(last + remaining);
            } else {
                chunks.push(remaining);
            }
            remaining = "";
        } else if (remaining.length === 3) {
            chunks.push(remaining);
            remaining = "";
        } else if (remaining.length % 2 !== 0) {
            chunks.push(remaining.substring(0, 3));
            remaining = remaining.substring(3);
        } else {
            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        }
    }
    return chunks;
}

console.log("--- Chunking Logic Test ---");
testCases.forEach(tc => {
    const result = chunkNumberInternal(tc);
    console.log(`Input: ${tc} => [${result.join(", ")}] (valid: ${!result.some(r => r.length === 1 && tc.length > 1)})`);
});
