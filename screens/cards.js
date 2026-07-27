// =====================================
// screens/cards.js
// カード一覧画面
// =====================================

import { getSave } from "../system/storage.js";

export function showCards(screen) {

    const save = getSave();

    if (!save.cards || save.cards.length === 0) {

        screen.innerHTML = `
            <div class="card">
                <h2>🃏 カード</h2>
                <p>まだカードを持っていません。</p>
                <p>生き物を発見するとカードが増えます。</p>
            </div>
        `;

        return;
    }

    const cardList = save.cards.map(card => `
        <div class="card">
            <h3>${card.name}</h3>
            <p>No.${String(card.no).padStart(3, "0")}</p>
            <p>レア度：${card.rarity || "-"}</p>
            <p>カテゴリ：${card.category || "-"}</p>
            <p>保有枚数：${card.count || 1}</p>
            <p>発見者：${card.owner || "あなた"}</p>
        </div>
    `).join("");

    screen.innerHTML = `
        <div class="cardsScreen">
            <h2>🃏 カード</h2>
            ${cardList}
        </div>
    `;

}