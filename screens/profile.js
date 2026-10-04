// =======================================
// screens/profile.js
// フレンド
// =======================================

import { getSave } from "../system/storage.js";

export function showProfile(screen) {

    const save = getSave();

    // =======================================
    // 発見数
    // =======================================

    const discoveryCount =
        new Set(
            [
                ...(Array.isArray(save.discovered)
                    ? save.discovered
                    : []),

                ...(Array.isArray(save.discoveredCards)
                    ? save.discoveredCards.map(
                        card => card?.no
                    )
                    : [])
            ]
                .map(Number)
                .filter(Number.isFinite)
        ).size;


    // =======================================
    // 現在装備しているスピリア
    // =======================================

    const equippedSpiriaId =
        save.spirit?.equippedSpiria ?? "base";

    const spiriaMaster =
        Array.isArray(window.MASTER?.spiria)
            ? window.MASTER.spiria
            : [];

    const equippedSpiriaData =
        spiriaMaster.find(
            item => item.id === equippedSpiriaId
        ) ??
        spiriaMaster.find(
            item => item.id === "base"
        );


    // =======================================
    // 現在の段階
    // =======================================

    const stageNumber =
        Number(save.spirit?.stage) || 1;

    const stageData =
        equippedSpiriaData
            ?.stages
            ?.find(
                stage =>
                    Number(stage.stage) === stageNumber
            ) ??
        equippedSpiriaData?.stages?.[0];


    const spiriaImage =
        stageData?.image ??
        "./assets/spiria/spiria_base.png";

    const spiriaName =
        stageData?.title ??
        equippedSpiriaData?.name ??
        "ふしぎなスピリア";


    // =======================================
    // 画面
    // =======================================

    screen.innerHTML = `
        <section class="profile-screen">

            <header class="profile-header">

                <button
                    id="profileBackButton"
                    class="profile-back-button"
                    type="button"
                >
                    ← 戻る
                </button>

                <h2>🐾 フレンド</h2>

            </header>


            <!-- 現在のスピリア -->
            <div class="profile-spiria">

                <h3>✨ 現在のスピリア ✨</h3>

                <img
                    class="profile-spiria-image"
                    src="${spiriaImage}"
                    alt="${spiriaName}"
                >

                <strong class="profile-spiria-name">
                    ${spiriaName}
                </strong>

            </div>


            <!-- 自分のプロフィール -->
            <div class="profile-content">

                <h3>自分のプロフィール</h3>

                <div class="profile-name">
                    <span>なまえ</span>
                    <strong>いきものマスター</strong>
                </div>

                <div class="profile-stats">

                    <div>
                        <span>発見したいきもの</span>
                        <strong>${discoveryCount}</strong>
                    </div>

                    <div>
                        <span>フレンド</span>
                        <strong>0</strong>
                    </div>

                </div>


                <div class="profile-friend-buttons">

                    <button
                        id="friendListButton"
                        type="button"
                    >
                        👥 フレンド一覧
                    </button>

                    <button
                        id="friendAddButton"
                        type="button"
                    >
                        ＋ フレンド追加
                    </button>

                </div>

            </div>

        </section>
    `;


    // =======================================
    // 戻る
    // =======================================

    const backButton =
        screen.querySelector("#profileBackButton");

    backButton?.addEventListener(
        "click",
        () => {
            history.back();
        }
    );
}