
function validateChunks(input, chunks) {
    const cleanInput = input.replace(/[^0-9]/g, '');
    const chunkSum = chunks.reduce((sum, c) => sum + c.length, 0);
    return cleanInput.length === chunkSum;
}

function chunkNumberLogic(number) {
    const cleanInput = number.replace(/[^0-9]/g, '');
    if (cleanInput.length <= 1) return [cleanInput];

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
        } else if (remaining.length === 2 || remaining.length === 4) {
            chunks.push(remaining.substring(0, 2));
            remaining = remaining.substring(2);
        } else if (remaining.length === 3) {
            chunks.push(remaining);
            remaining = "";
        } else if (remaining.length === 5) {
            chunks.push(remaining.substring(0, 3));
            chunks.push(remaining.substring(3, 5));
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

const testInput = "12345678"; // 8 digits
const result = chunkNumberLogic(testInput);
const isValid = validateChunks(testInput, result);

console.log("--- 8-Digit Consistency Test ---");
console.log(`Input: ${testInput} (Length: ${testInput.length})`);
console.log(`Chunks: [${result.join(", ")}]`);
console.log(`Chunk Total Length: ${result.join("").length}`);
console.log(`Is Valid: ${isValid}`);

if (!isValid) {
    console.error("FAIL: Length mismatch detected!");
} else {
    console.log("PASS: Length consistency maintained.");
}
