const fs = require('fs');

const path = './src/components/mobile/MobileHome.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `            // Step 1: Keywords
            const res = await convertNumberAction(input);
            if (res.success && res.data && res.candidates) {
                // Map to structured KeywordItem
                const structuredResult: KeywordItem[] = res.candidates.map(candidate => ({
                    word: candidate.words[0], // Default to first word
                    code: candidate.chunk,
                    candidates: candidate.words
                }));
                setResult(structuredResult);

                // Step 2: Story (Auto-generate for mobile simple flow)
                const storyRes = await openAIStoryService.generateStory(input, {
                    manualKeywords: res.data
                });
                setStory(storyRes.story);

                // Step 3: Image (Advanced UX starts here)
                setGeneratingImage(true);
                const url = await openAIStoryService.generateImage(storyRes.story, "Mobile App Memory", useFourCut, res.data);
                setImageUrl(url);
                setGenerationProgress(100);
            }
        } catch (error) {
            console.error("Mobile conversion failed:", error);
            alert(\`처리 중 오류가 발생했습니다.\\n\${getErrorMessage(error)}\`);`;

const replacement = `            // Step 1: Keywords via API (Required for static export/mobile)
            const keywordUrl = getApiUrl('/api/ai/convert-number');
            let res;
            try {
                const response = await fetch(keywordUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
                    body: JSON.stringify({ number: input })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Fetch failed' }));
                    throw new Error(errorData?.error || \`HTTP \${response.status}\`);
                }
                res = await response.json();
            } catch (apiError: any) {
                console.warn("API conversion failed, attempting client-side fallback:", apiError);
                // Dynamically load fallback logic to avoid top-level await issues on mobile side if possible
                const { generateKeywordsFromNumber } = await import('@/lib/keyword-generator');
                const clientKeywords = await generateKeywordsFromNumber(input);
                if (clientKeywords && clientKeywords.length > 0) {
                    res = {
                        success: true,
                        data: clientKeywords.map((k: any) => k.word),
                        candidates: clientKeywords.map((k: any) => ({
                            chunk: k.code,
                            words: k.candidates
                        }))
                    };
                } else {
                    throw apiError;
                }
            }

            if (res.success && res.data && res.candidates) {
                const structuredResult: KeywordItem[] = res.candidates.map((candidate: any) => ({
                    word: candidate.words[0],
                    code: candidate.chunk,
                    candidates: candidate.words
                }));
                setResult(structuredResult);
                setGenerationProgress(20);

                // Step 2 & 3: Story & Image
                try {
                    const storyRes = await openAIStoryService.generateStory(input, { manualKeywords: res.data });
                    setStory(storyRes.story);
                    setGenerationProgress(50);

                    setGeneratingImage(true);
                    const url = await openAIStoryService.generateImage(storyRes.story, "Mobile App Memory", useFourCut, res.data);
                    setImageUrl(url);
                    setGenerationProgress(100);
                } catch (aiError: any) {
                    console.error("AI Generation inner error:", aiError);
                    const storyUrl = getApiUrl('/api/ai/generate-story');
                    throw new Error(\`AI 단계 실패: \${aiError.message || '네트워크 오류'}\\n\\nURL: \${storyUrl}\`);
                }
            }
        } catch (error: any) {
            console.error("Mobile conversion failed:", error);
            const msg = error?.message || '알 수 없는 오류';
            alert(\`처리 중 오류가 발생했습니다.\\n\${msg}\\n\\n(안내: PC의 방화벽에서 3000포트가 허용되어 있는지, 터널링 연결 오류가 아닌지 꼭 확인해 주세요.)\`);`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("SUCCESS: MobileHome.tsx patched!");
} else {
    // Maybe we are in a state where the target is partially missing.
    console.error("FAILURE: Target string not found in MobileHome.tsx. Checking if it's already modified...");
}
