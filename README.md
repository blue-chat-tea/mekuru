# アプリ名:めくる

このアプリは、心に残った言葉や本を記録・管理するためのWebアプリケーションです。

## 主な機能

- **言葉の記録**: 心に残った言葉や読んだ本の情報をカード形式で登録・編集・削除
- **書籍検索**: Open Library APIを利用した書籍の検索とタイトルの自動取得
- **言葉の閲覧**: 自分自身や他のユーザーの記録を閲覧する
- **タイトルからECサイトへ誘導**: 本のタイトルをクリックするとECサイト(Amazon)に誘導する
- **ユーザー認証**: ログイン・新規登録機能
- **ユーザー情報の更新**: ユーザー名とパスワードの更新、削除

## 使用技術

- **Frontend / Backend**: Next.js (App Router), React, Tailwind CSS
- **Database / ORM**: PostgreSQL, Prisma
- **Authentication**: Auth.js (NextAuth.js)

## 起動方法（Getting Started）

ローカル環境で実行する場合の手順です。

1. リポジトリをクローンまたはダウンロードします。

2. 依存パッケージをインストールします。
   ```bash
   npm install
   ```

3.環境変数（.env）を設定します（DATABASE_URL や AUTH_SECRET の記述が必要）。

4.開発サーバーを起動します。

```bash
npm run dev
```

5. ブラウザで [http://localhost:3000/login](http://localhost:3000/login) を開き、ログイン画面から動作を確認します。
