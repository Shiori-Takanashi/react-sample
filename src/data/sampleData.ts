import type { ChatData } from '../types';

export const SAMPLE_DATA: ChatData = {
    sessions: [
        {
            id: 1,
            title: "最初の会話",
            created_at: "2025-07-10 10:00:00.000000",
            updated_at: "2025-07-10 10:05:00.000000"
        },
        {
            id: 2,
            title: "プロジェクト相談",
            created_at: "2025-07-10 11:00:00.000000",
            updated_at: "2025-07-10 11:12:00.000000"
        }
    ],
    messages: [
        {
            id: 1,
            session_id: 1,
            role: "user",
            content: "こんにちは。",
            timestamp: "2025-07-10 10:00:05.000000"
        },
        {
            id: 2,
            session_id: 1,
            role: "assistant",
            content: "こんにちは。今日は何をしましょうか？",
            timestamp: "2025-07-10 10:00:06.000000"
        },
        {
            id: 3,
            session_id: 1,
            role: "user",
            content: "自己紹介してください。",
            timestamp: "2025-07-10 10:01:00.000000"
        },
        {
            id: 4,
            session_id: 1,
            role: "assistant",
            content: "私はOpenAIが開発したAIアシスタントです。",
            timestamp: "2025-07-10 10:01:01.000000"
        },
        {
            id: 5,
            session_id: 2,
            role: "user",
            content: "ReactでチャットUIを作りたいんだけど",
            timestamp: "2025-07-10 11:00:05.000000"
        },
        {
            id: 6,
            session_id: 2,
            role: "assistant",
            content: "ReactでチャットUIを作るのは素晴らしいアイデアです！",
            timestamp: "2025-07-10 11:00:06.000000"
        }
    ]
};
