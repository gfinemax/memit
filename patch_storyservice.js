const fs = require('fs');
const path = './src/lib/openai-story-service.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `    private async postJsonWithFallback(path: string, body: Record<string, unknown>): Promise<any> {
        const urls = getApiCandidateUrls(path);
        let lastError: unknown = null;

        for (const url of urls) {
            const raw = await response.text();
            let parsed: any = {};
            try {
                parsed = raw ? JSON.parse(raw) : {};
            } catch {
                parsed = { raw };
            }`;

const replacement = `    private async postJsonWithFallback(path: string, body: Record<string, unknown>): Promise<any> {
        const urls = getApiCandidateUrls(path);
        let lastError: unknown = null;

        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
                    body: JSON.stringify(body)
                });

                const raw = await response.text();
                let parsed: any = {};
                try {
                    parsed = raw ? JSON.parse(raw) : {};
                } catch {
                    parsed = { raw };
                }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("SUCCESS: openai-story-service.ts patched!");
} else {
    // try a fuzzy replace
    console.error("FAILURE: Target string not found. Trying fuzzy patch.");
}
