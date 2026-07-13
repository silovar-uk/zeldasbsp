# ZELDA LAB

スマブラSP（Super Smash Bros. Ultimate）のゼルダについて、全技のフレーム・ダメージ・用途・避けたい使い方・追撃導線と、キャラクター基礎性能をまとめた静的Webアプリです。

## 主な機能

- 全技カード／一覧表の切り替え
- 技名・用途・状況からの全文検索
- 地上技、空中技、必殺技、投げ、防御行動などのカテゴリ絞り込み
- 撃墜、対空、崖、ガーキャン、復帰阻止などの状況別逆引き
- 発生、最大ダメージ、リスクによる並び替え
- 技のお気に入り保存（LocalStorage）
- ライト／ダーク表示
- PWA対応・オフラインキャッシュ
- レスポンシブ対応

## データ基準

- 対象バージョン：13.0.1
- ダメージ：原則1on1補正前の基礎値
- フレーム主要出典：[Ultimate Frame Data — Zelda](https://ultimateframedata.com/zelda)
- 技説明・キャラ性能主要出典：[SmashWiki — Zelda (SSBU)](https://www.ssbwiki.com/Zelda_(SSBU))
- 最終確認：2026-07-13

撃墜％やコンボは、ステージ、位置、相手の体重、ベクトル変更、ほかほか補正で変化します。サイト内の数値は代表的な目安として扱ってください。

## 公開

GitHub Pagesで `main` ブランチのルートを公開元に設定すれば、そのまま配信できます。ビルド工程はありません。

## ファイル構成

```text
.
├── index.html
├── styles.css
├── data.js
├── app.js
├── sw.js
├── manifest.webmanifest
├── icon.svg
└── .nojekyll
```

## 権利表記

非公式ファンメイドです。Nintendo、Sora Ltd.、Bandai Namco Studiosおよび各権利者とは関係ありません。
