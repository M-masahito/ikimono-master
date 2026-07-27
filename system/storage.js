// =======================================
// system/storage.js
// セーブデータ管理
// =======================================

const SAVE_KEY = "ikimonoSave";

const DEFAULT_SAVE = {
    discovered: [],
    cards: [],
    spirit: {
        level: 1,
        exp: 0,
        form: 0,
        title: "たまご"
    },
    emblems: [],
    spiria: [],
    settings: {
        sound: true,
        vibration: true
    }
};

// セーブデータ取得
export function getSave() {

    const json = localStorage.getItem(SAVE_KEY);

    if (!json) {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(DEFAULT_SAVE)
        );

        return structuredClone(DEFAULT_SAVE);
    }

    try {

        const save = JSON.parse(json);

        // 新しい項目が追加されても壊れないよう補完
        return {
            ...structuredClone(DEFAULT_SAVE),
            ...save,
            spirit: {
                ...structuredClone(DEFAULT_SAVE.spirit),
                ...(save.spirit || {})
            },
            settings: {
                ...structuredClone(DEFAULT_SAVE.settings),
                ...(save.settings || {})
            }
        };

    } catch (e) {

        console.error("セーブデータ破損", e);

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(DEFAULT_SAVE)
        );

        return structuredClone(DEFAULT_SAVE);

    }

}

// セーブ
export function save(data) {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );

}

// 初期化
export function resetSave() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(DEFAULT_SAVE)
    );

}

// 更新
export function update(callback) {

    const save = getSave();

    callback(save);

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(save)
    );

}