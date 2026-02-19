import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonWithCors(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return jsonWithCors({ error: 'AI Service unavailable' }, 500);
    }

    const openai = new OpenAI({ apiKey });
    const { theme, pinLength, existingDigits, existingWords } = await req.json();

    if (!theme || !pinLength) {
      return jsonWithCors({ error: 'theme and pinLength are required' }, 400);
    }

    const remainingLength = pinLength - (existingDigits?.length || 0);
    const isOdd = remainingLength % 2 !== 0;

    const systemPrompt = `당신은 메밋(Memit) 기억법 전문가입니다.
메밋 연상법은 한국어 초성을 숫자로 변환하는 체계입니다:

초성→숫자 매핑:
ㅇ=0, ㄱ/ㅋ=1, ㄴ/ㄹ=2, ㄷ/ㅌ=3, ㅁ/ㅂ=4, ㅅ=5, ㅈ=6, ㅊ=7, ㅍ=8, ㅎ=9

단어셋 규칙:
- 2글자 단어: 초성 2개 → 2자리 숫자 (예: "고래"→ㄱ(1)+ㄹ(2)="12", "사자"→ㅅ(5)+ㅈ(6)="56", "멍게"→ㅁ(4)+ㄱ(1)="41")
- 3글자 단어: 초성 3개 → 3자리 숫자 (예: "포도주"→ㅍ(8)+ㄷ(3)+ㅈ(6)="836", "아바타"→ㅇ(0)+ㅂ(4)+ㅌ(3)="043")
- 4글자 단어: 초성 4개 → 4자리 숫자 (예: "불고기"→ㅂ(4)+ㄹ(2)+ㄱ(1)+ㄱ(1)="4211", "슈퍼마리오"→ㅅ(5)+ㅍ(8)+ㅁ(4)+ㄹ(2)="5842")

기억법 전략:
1. 가급적 2글자 단어로만 채우지 말고, 테마와 관련된 3~4글자 고유명사나 캐릭터 이름을 적극적으로 활용하세요.
2. 단어들을 연결하는 재미있는 스토리를 만들어주세요.

${existingDigits
        ? `사용자가 이미 "${existingWords}" 단어로 "${existingDigits}" 숫자를 입력했습니다. 
정확히 ${remainingLength}자리를 더 생성하여 총 ${pinLength}자리가 되도록 완성해주세요.`
        : `${pinLength}자리 핀번호를 생성해주세요.`
      }

응답 규칙:
1. 테마와 관련된 재미있고 기억에 남는 한국어 단어들을 선택하세요.
2. 각 단어의 초성을 숫자로 변환하여 **정확히 총 ${existingDigits ? remainingLength : pinLength}자리**의 'digits' 문자열을 생성해야 합니다.
3. 'digits'의 길이는 반드시 ${existingDigits ? remainingLength : pinLength}자여야 합니다. 부족하거나 많으면 안 됩니다.
4. 반드시 아래 JSON 형식으로만 응답하세요.

JSON 형식:
{
  "words": ["추가단어1", "추가단어2"],
  "digits": "1234",
  "breakdown": [
    {"word": "추가단어1", "chosung": "ㄱㄴ", "number": "12"}
  ],
  "story": "전체 스토리를 한 문장으로 만들어주세요"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `테마: "${theme}"\n${existingDigits ? `이미 생성된 숫자: ${existingDigits}\n` : ''}${pinLength}자리 핀번호를 완성해주세요.` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message?.content || '{}';
    const result = JSON.parse(content);

    return jsonWithCors(result);
  } catch (error: unknown) {
    console.error('AI PIN Generation Error:', error);
    return jsonWithCors({ error: 'Failed to generate PIN' }, 500);
  }
}
