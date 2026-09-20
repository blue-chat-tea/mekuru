import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json([]);
  }

  try {
    // Open Libraryの検索用エンドポイント
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query,
    )}&limit=5`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json([]);
    }

    // Open Libraryのレスポンス構造を、アプリで使いやすい形に変換
    const books = data.docs.map((item: Record<string, unknown>) => {
      // 著者名の配列を安全に結合する処理
      let author = "著者不明";
      const authorName = item.author_name;
      if (Array.isArray(authorName) && authorName.length > 0) {
        author = authorName.map(String).join(", ");
      }

      const coverI = item.cover_i;
      const title = typeof item.title === "string" ? item.title : "";
      const key = typeof item.key === "string" ? item.key : undefined;

      return {
        id:
          key ||
          (typeof coverI === "number"
            ? coverI.toString()
            : Math.random().toString()),
        title: title,
        author: author,
        thumbnail:
          typeof coverI === "number"
            ? `https://covers.openlibrary.org/b/id/${coverI}-M.jpg`
            : null,
      };
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Open Libraryからの書籍検索に失敗しました:", error);
    return NextResponse.json([], { status: 500 });
  }
}
