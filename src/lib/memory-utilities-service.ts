'use client';

import { supabaseMemoryService } from './supabase-memory-service';
import { openAIStoryService } from './openai-story-service';

export class MemoryUtilitiesService {
    async generateQuiz(): Promise<string> {
        try {
            // 1. Fetch recent memories
            const memories = await supabaseMemoryService.getMemories();
            if (!memories || memories.length < 5) {
                return "메모리 퀴즈를 생성하기엔 데이터가 조금 부족해요! (최소 5개 이상의 기억이 필요합니다)";
            }

            // 2. Prepare sample for AI
            const sample = memories.slice(0, 10).map(m => ({
                number: m.input_number,
                keywords: m.keywords,
                story: m.story
            }));

            // 3. Prompt OpenAI
            const prompt = `
            사용자의 최근 기억 데이터입니다:
            ${JSON.stringify(sample)}

            위 데이터를 바탕으로 사용자의 기억력을 테스트할 수 있는 재미있는 퀴즈를 하나 만들어주세요.
            - 형식: 질문 하나와 정답 확인용 내용을 포함하세요.
            - 스타일: 친근하고 격려하는 어조 (한국어).
            - 예: "XX라는 숫자로 만드셨던 스토리 기억나시나요? 정답은 'OOO'였습니다!"
            `;

            const response = await openAIStoryService.generateStoryResponse(prompt);
            return response.quiz || "퀴즈 생성 중 문제가 발생했습니다.";
        } catch (error) {
            console.error("Quiz Generation Error:", error);
            throw error;
        }
    }

    async generateReport(): Promise<string> {
        try {
            // 1. Fetch memories
            const memories = await supabaseMemoryService.getMemories();
            if (!memories || memories.length === 0) {
                return "아직 만들어진 기억이 없네요. 첫 번째 기억을 만들어보세요!";
            }

            // 2. Simple stats
            const total = memories.length;
            const recent = memories.filter(m => {
                const date = m.created_at ? new Date(m.created_at) : new Date(0);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date > weekAgo;
            }).length;

            // 3. Prompt OpenAI for analysis
            const prompt = `
            사용자의 기억 데이터 통계입니다:
            - 총 기억 개수: ${total}개
            - 이번 주 생성한 기억: ${recent}개
            - 최근 데이터 샘플: ${JSON.stringify(memories.slice(0, 5))}

            사용자의 학습 패턴을 분석하고 격려하는 'AI 요약 리포트'를 작성해주세요.
            - 형식: 요약된 인사이트 2~3줄.
            - 스타일: 동기부여를 주는 전문적인 메모리 코치 스타일 (한국어).
            - "당신은 최근 보안 관련 데이터를 많이 저장하고 있군요!" 같은 구체적인 언급이 있으면 좋습니다.
            `;

            const response = await openAIStoryService.generateStoryResponse(prompt);
            return response.report || response.analysis || "분석 리포트를 생성할 수 없습니다.";
        } catch (error) {
            console.error("Report Generation Error:", error);
            throw error;
        }
    }
}

export const memoryUtilitiesService = new MemoryUtilitiesService();
