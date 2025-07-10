// sample.json のデータをJavaScriptファイルとして出力
const SAMPLE_DATA = {
    "sessions": [
        {
            "id": 1,
            "title": "最初の会話",
            "created_at": "2025-07-10 10:00:00.000000",
            "updated_at": "2025-07-10 10:05:00.000000"
        },
        {
            "id": 2,
            "title": "プロジェクト相談",
            "created_at": "2025-07-10 11:00:00.000000",
            "updated_at": "2025-07-10 11:12:00.000000"
        }
    ],
    "messages": [
        {
            "id": 1,
            "session_id": 1,
            "role": "user",
            "content": "こんにちは。",
            "timestamp": "2025-07-10 10:00:05.000000"
        },
        {
            "id": 2,
            "session_id": 1,
            "role": "assistant",
            "content": "こんにちは。今日は何をしましょうか？",
            "timestamp": "2025-07-10 10:00:06.000000"
        },
        {
            "id": 3,
            "session_id": 1,
            "role": "user",
            "content": "自己紹介してください。",
            "timestamp": "2025-07-10 10:01:00.000000"
        },
        {
            "id": 4,
            "session_id": 1,
            "role": "assistant",
            "content": "私はOpenAIが開発したAIアシスタントです。",
            "timestamp": "2025-07-10 10:01:01.000000"
        },
        {
            "id": 5,
            "session_id": 2,
            "role": "user",
            "content": "ReactでチャットUIを作りたいんだけど",
            "timestamp": "2025-07-10 11:00:00.000000"
        },
        {
            "id": 6,
            "session_id": 2,
            "role": "assistant",
            "content": "もちろん。どういった構成を考えていますか？",
            "timestamp": "2025-07-10 11:00:02.000000"
        },
        {
            "id": 7,
            "session_id": 2,
            "role": "user",
            "content": "OpenAI APIと連携して、会話を保存したい",
            "timestamp": "2025-07-10 11:10:00.000000"
        },
        {
            "id": 8,
            "session_id": 2,
            "role": "assistant",
            "content": "SQLiteでセッションとメッセージを管理する構成が良いでしょう。",
            "timestamp": "2025-07-10 11:12:00.000000"
        }
    ],
    "settings": [
        {
            "id": 1,
            "session_id": 1,
            "model": "gpt-3.5-turbo",
            "temperature": 1.0,
            "top_p": 1.0
        },
        {
            "id": 2,
            "session_id": 2,
            "model": "gpt-4",
            "temperature": 0.7,
            "top_p": 1.0
        }
    ]
};

// グローバルスコープでアクセス可能にする
window.SAMPLE_DATA = SAMPLE_DATA;
