import OpenAI from 'openai';

interface Env {
    OPENAI_API_KEY: string;
}

type FunctionContext<TEnv> = {
    request: Request;
    env: TEnv;
};

export const onRequestPost = async (context: FunctionContext<Env>): Promise<Response> => {
    try {
        const apiKey = context.env.OPENAI_API_KEY;
        if (!apiKey) {
            return Response.json({ error: 'AI Service unavailable' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });
        const { text } = await context.request.json() as { text?: string };

        if (!text) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional keyword extractor for a memory application. Extract 3 to 5 most important keywords from the provided text. Return ONLY the keywords separated by commas, no other text."
                },
                {
                    role: "user",
                    content: `Extract keywords from: ${text}`
                }
            ],
            temperature: 0.3,
        });

        const keywordsText = response.choices[0].message?.content || "";
        const keywords = keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);

        return Response.json({ keywords });
    } catch (error: any) {
        console.error('AI Keyword Extraction Error:', error);
        return Response.json({ error: 'Failed to extract keywords' }, { status: 500 });
    }
};
