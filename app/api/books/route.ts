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
    const books = data.docs.map((item: any) => {
      // 著者名の配列を安全に結合する処理
      let author = "著者不明";
      if (Array.isArray(item.author_name) && item.author_name.length > 0) {
        author = item.author_name.join(", ");
      }

      return {
        id:
          item.key ||
          (item.cover_i ? item.cover_i.toString() : Math.random().toString()),
        title: item.title || "",
        author: author,
        thumbnail: item.cover_i
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
          : null,
      };
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Open Libraryからの書籍検索に失敗しました:", error);
    return NextResponse.json([], { status: 500 });
  }
}
