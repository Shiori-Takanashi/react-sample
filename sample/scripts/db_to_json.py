import sqlite3
import json
from pathlib import Path

# ✅ 定数：ファイルパス（同一ディレクトリを想定）
DB_PATH = Path(__file__).parent.parent / "data" / "sample.db"
JSON_PATH = Path(__file__).parent.parent / "data" / "sample.json"


def export_all_tables_to_json(db_path: Path, json_path: Path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # dict風に取り出す
    cursor = conn.cursor()

    # 全テーブル名を取得（sqlite_sequence等は除外）
    cursor.execute(
        """
        SELECT name FROM sqlite_master
        WHERE type='table' AND name NOT LIKE 'sqlite_%';
    """
    )
    tables = [row["name"] for row in cursor.fetchall()]

    result = {}
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        rows = [dict(row) for row in cursor.fetchall()]
        result[table] = rows

    conn.close()

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    export_all_tables_to_json(DB_PATH, JSON_PATH)
