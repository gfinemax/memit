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
            return Response.json({ error: 'AI Service configuration missing' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });
        const { prompt } = await context.request.json() as { prompt?: string };

        if (!prompt) {
            return Response.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a creative memory mnemonist. Return only JSON.' },
                { role: 'user', content: prompt }
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content generated');

        const parsed = JSON.parse(content);
        return Response.json(parsed);
    } catch (error: any) {
        console.error('Server Story Generation Error:', error);
        return Response.json({ error: error.message || 'Failed to generate story' }, { status: 500 });
    }
};
