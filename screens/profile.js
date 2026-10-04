// =======================================
// screens/profile.js
// フレンド・プロフィール
// =======================================

import { getSave } from "../system/storage.js";



export function showProfile(screen) {

    const save = getSave();

    // =======================================
    // プレイヤー名
    // =======================================

    const playerName =
    String(save.playerName ?? "").trim() ||
    "なまえ未設定";


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
    // 現在のスピリア段階
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


    // =======================================
    // スピリア画像・名前
    // =======================================

    const spiriaImage =
        stageData?.image ??
        "./assets/spiria/spiria_base.png";

    // 「幼体」などの段階名より
    // スピリア本体の名前を優先
    const spiriaName =
        equippedSpiriaData?.name ??
        stageData?.title ??
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


            <!-- =========================
                 上段
            ========================== -->

            <div class="profile-top">


                <!-- 現在のスピリア -->

                <div class="profile-spiria">

                    <h3 class="profile-spiria-title">
                        ✨ 現在のスピリア ✨
                    </h3>

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

                    <h3>
                        自分のプロフィール
                    </h3>


                    <div class="profile-name">

                        <span>
                            なまえ
                        </span>

                        <strong id="profilePlayerName">
                            ${playerName}
                        </strong>

                    </div>


                    <div class="profile-stats">

                        <div>
                            <span>
                                発見したいきもの
                            </span>

                            <strong>
                                ${discoveryCount}
                            </strong>
                        </div>


                        <div>
                            <span>
                                フレンド
                            </span>

                            <strong>
                                0
                            </strong>
                        </div>

                    </div>


                    <button

                </div>

            </div>


            <!-- =========================
                 お気に入りカード
                 次に実装
            ========================== -->

            <section class="profile-favorites">

                <h3>
                    ⭐ お気に入りカード
                </h3>

                <div class="profile-favorites-empty">
                    まだ登録されていません
                </div>

            </section>


            <!-- =========================
                 フレンド
            ========================== -->

            <section class="profile-friends">

                <div class="profile-friends-header">

                    <h3>
                        👥 フレンド
                    </h3>

                    <button
                        id="friendListButton"
                        type="button"
                    >
                        すべて見る
                    </button>

                </div>


                <div class="profile-friend-buttons">

                    <button
                        id="friendAddButton"
                        type="button"
                    >
                        ＋ フレンド追加
                    </button>

                </div>

            </section>

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
