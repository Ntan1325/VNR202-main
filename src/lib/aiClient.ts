const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export type ChatRequestMessage = {
    role: "user" | "model";
    parts: { text: string }[];
};

export interface GeminiUsage {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
}

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
            role: string;
        };
        finishReason?: string;
    }>;
    usageMetadata?: GeminiUsage;
}

export async function callGeminiChat(options: {
    apiKey?: string;
    model: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature?: number;
}): Promise<{ content: string; usage?: GeminiUsage } | null> {
    const { apiKey, model, messages, temperature = 0.7 } = options;

    if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing. Skip calling Gemini API.");
        return null;
    }

    const systemMessage = messages.find(m => m.role === "system");
    const conversationMessages = messages.filter(m => m.role !== "system");

    const geminiMessages: ChatRequestMessage[] = conversationMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    const requestBody: any = {
        contents: geminiMessages,
        generationConfig: {
            temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        }
    };

    if (systemMessage) {
        requestBody.systemInstruction = {
            parts: [{ text: systemMessage.content }]
        };
    }

    const response = await fetch(
        `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("Gemini API error", response.status, errorText);
        return null;
    }

    const data: GeminiResponse = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) {
        return null;
    }

    const usage: GeminiUsage | undefined = data.usageMetadata ? {
        promptTokenCount: data.usageMetadata.promptTokenCount,
        candidatesTokenCount: data.usageMetadata.candidatesTokenCount,
        totalTokenCount: data.usageMetadata.totalTokenCount,
    } : undefined;

    return {
        content,
        usage,
    };
}
