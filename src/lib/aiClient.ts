const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export type ChatRequestMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

export interface GroqChatUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

interface GroqChatChoice {
    message: {
        role: "assistant";
        content: string;
    };
    finish_reason: string | null;
}

interface GroqChatResponse {
    choices: GroqChatChoice[];
    usage?: GroqChatUsage;
}

export async function callGroqChat(options: {
    apiKey?: string;
    model: string;
    messages: ChatRequestMessage[];
    temperature?: number;
}): Promise<{ content: string; usage?: GroqChatUsage } | null> {
    const { apiKey, model, messages, temperature = 0.7 } = options;

    if (!apiKey) {
        console.warn("GROQ_API_KEY is missing. Skip calling Groq API.");
        return null;
    }

    const response = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
            stream: false,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("Groq API error", response.status, errorText);
        return null;
    }

    const data: GroqChatResponse = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
        return null;
    }

    // TODO: Support streaming responses via ReadableStream once needed.
    // To switch to OpenRouter, update the GROQ_ENDPOINT and headers to match their API.

    return {
        content,
        usage: data.usage,
    };
}
