// =====================================
// screens/home.js
// ホーム画面
// =====================================

import { getSave } from "../system/storage.js";

export function showHome(screen) {

    const save = getSave();

    const discovered = save.discovered.length;
    const cards = save.cards.length;
    const emblems = save.emblems.length;
    const spiria = save.spiria.length;

    screen.innerHTML = `

        <div class="card">

            <h2>🌿 ようこそ！</h2>

            <p>
                今日も新しい生き物を探そう！
            </p>

        </div>

        <div class="card">

            <h2>✨ 精霊</h2>

            <h3>${save.spirit.title}</h3>

            <p>Lv.${save.spirit.level}</p>

            <progress
                value="${save.spirit.exp}"
                max="100">
            </progress>

            <p>${save.spirit.exp} / 100 EXP</p>

        </div>

        <div class="card">

            <h2>📊 コレクション</h2>

            <p>📖 発見数：${discovered} / 500</p>

            <p>🃏 カード：${cards}</p>

            <p>🏅 エンブレム：${emblems}</p>

            <p>💎 スピリア：${spiria}</p>

        </div>

        <div class="card">

            <h2>🎯 今日のミッション</h2>

            <ul>
                <li>□ 生き物を1種類発見する</li>
                <li>□ AI判定を3回使う</li>
                <li>□ 図鑑を1ページ開く</li>
            </ul>

        </div>

        <div class="card">

            <h2>📰 お知らせ</h2>

            <p>
                いきものマスター Ver2 開発中！
            </p>

            <p>
                新しい生き物をどんどん追加予定！
            </p>

        </div>

    `;

}