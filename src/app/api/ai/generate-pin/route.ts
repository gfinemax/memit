import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return NextResponse.json({ error: 'AI Service unavailable' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });
        const { theme, pinLength } = await req.json();

        if (!theme || !pinLength) {
            return NextResponse.json({ error: 'theme and pinLength are required' }, { status: 400 });
        }

        const isOdd = pinLength % 2 !== 0;

        const systemPrompt = `당신은 메밋(Memit) 기억법 전문가입니다.
메밋 연상법은 한국어 초성을 숫자로 변환하는 체계입니다:

초성→숫자 매핑:
ㅇ=0, ㄱ/ㅋ=1, ㄴ/ㄹ=2, ㄷ/ㅌ=3, ㅁ/ㅂ=4, ㅅ=5, ㅈ=6, ㅊ=7, ㅍ=8, ㅎ=9

단어셋 규칙:
- 2자리 단어: 초성 2개 → 2자리 숫자 (예: "감"→ㄱ=1, 받침무시 → "1"... 아니, 2글자 단어 기준)
  예: "고래"→ ㄱ(1)+ㄹ(2) = "12", "사자"→ ㅅ(5)+ㅈ(6) = "56"
- 3자리 단어: 초성 3개 → 3자리 숫자 (예: "토끼발"→ ㅌ(3)+ㄲ(1)+ㅂ(4) = "314")
  예: "나비꽃"→ ㄴ(2)+ㅂ(4)+ㄲ(1) = "241"

${pinLength}자리 핀번호를 만들기 위한 단어 조합 전략:
${isOdd
                ? `홀수(${pinLength}자리): 3글자 단어 1개 + 2글자 단어 ${Math.floor((pinLength - 3) / 2)}개 조합\n  예: 5자리 = 3글자(3자리) + 2글자(2자리), 7자리 = 3글자(3자리) + 2글자(2자리) + 2글자(2자리)`
                : `짝수(${pinLength}자리): 2글자 단어 ${pinLength / 2}개 조합\n  예: 4자리 = 2글자 + 2글자, 6자리 = 2글자 + 2글자 + 2글자`
            }

응답 규칙:
1. 테마와 관련된 재미있고 기억에 남는 한국어 단어들을 선택하세요
2. 각 단어의 초성을 숫자로 변환하여 정확히 ${pinLength}자리가 되어야 합니다
3. 단어들을 연결하는 재미있는 스토리를 만들어주세요
4. 반드시 아래 JSON 형식으로만 응답하세요

JSON 형식:
{
  "words": ["단어1", "단어2"],
  "digits": "${'0'.repeat(pinLength)}",
  "breakdown": [
    {"word": "단어1", "chosung": "ㅇㅇ", "number": "00"},
    {"word": "단어2", "chosung": "ㅇㅇ", "number": "00"}
  ],
  "story": "기억하기 쉬운 재미있는 문장"
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `테마: "${theme}"\n${pinLength}자리 핀번호를 만들어주세요.` }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message?.content || '{}';
        const result = JSON.parse(content);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('AI PIN Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate PIN' }, { status: 500 });
    }
}
