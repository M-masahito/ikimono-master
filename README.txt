いきものマスター Ver3.0「精霊の誕生」

GitHubへ入れるファイル
- index.html
- config.js
- manifest.webmanifest
- sw.js

Cloudflare Workerへ入れるファイル
- worker.js

AI接続
1. Cloudflare Workerを公開
2. 公開URLをconfig.jsのAI_WORKER_URLへ貼る
3. GitHubへ更新を反映

主な更新
- 卵からスタート
- 1種類で光る、2種類でヒビ、3種類で羽化
- 羽化後に精霊へ名前を付ける
- カメラ／写真／AI判定
- 図鑑に保有枚数
- 同じ生きものは保有枚数が増える
- カード表示は名前・レア度・イラスト・発見者のみ
- 精霊ページで称号と姿を確認・変更
- お気に入りカード
- フレンド最大10人の準備版
- 基本設定・バックアップ
