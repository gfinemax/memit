import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Ocr, TextDetections } from '@capacitor-community/image-to-text';
import { Capacitor } from '@capacitor/core';
import { openAIStoryService } from './openai-story-service';
import { getApiUrl } from './api-utils';

export const ocrService = {
    /**
     * Captures an image using the camera and detects text within it.
     */
    scanImage: async (): Promise<{ text: string; keywords?: string[] } | null> => {
        if (Capacitor.getPlatform() === 'web') {
            alert('카메라 기능은 모바일 기기에서만 지원됩니다.');
            return null;
        }

        try {
            // 1. Capture Image
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt, // Allows choosing Camera or Gallery
                promptLabelHeader: "이미지 스캔",
                promptLabelPhoto: "앨범에서 선택",
                promptLabelPicture: "사진 촬영"
            });

            if (!photo.path) return null;

            // 2. Detect Text
            const detections: TextDetections = await Ocr.detectText({ filename: photo.path });

            if (!detections.textDetections.length) {
                alert('텍스트를 인식하지 못했습니다. 다시 시도해 주세요.');
                return null;
            }

            // Combine all detected text blocks
            const fullText = detections.textDetections.map(d => d.text).join(' ');

            // 3. Extract Keywords (Optional but recommended for Memit)
            // We can use OpenAI to extract meaningful keywords from the raw OCR text
            const keywords = await ocrService.extractKeywordsFromText(fullText);

            return { text: fullText, keywords };
        } catch (e) {
            console.error('OCR scanning failed:', e);
            return null;
        }
    },

    /**
     * Uses AI to extract the most important 3-5 keywords from raw OCR text.
     */
    extractKeywordsFromText: async (text: string): Promise<string[]> => {
        try {
            const prompt = `Following is a raw text from an OCR scan. Please extract 3 to 5 most important keywords or key concepts that a user might want to memorize. Output ONLY the keywords separated by commas.
Text: ${text}`;

            // We can reuse openAIStoryService logic or create a dedicated simple call
            // For now, let's assume a simplified keyword extractor
            const response = await fetch(getApiUrl('/api/ai/extract-keywords'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            return data.keywords || text.split(/\s+/).slice(0, 5); // Fallback to first 5 words
        } catch (e) {
            console.error('AI Keyword extraction failed:', e);
            return text.split(/\s+/).slice(0, 5);
        }
    }
};
