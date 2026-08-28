export async function loadMaster() {

    const files = [
        "attribute",
        "category",
        "type",
        "rarity",
        "emblem",
        "spirit",
        "spiria",
        "encyclopedia"
    ];

    const raw = {};

    for (const file of files) {

        const response =
            await fetch(`./master/${file}.json`);

        if (!response.ok) {
            throw new Error(
                `${file}.json が読み込めません`
            );
        }

        const text =
            await response.text();

        if (!text.trim()) {
            throw new Error(
                `${file}.json が空です`
            );
        }

        try {
            raw[file] = JSON.parse(text);
        } catch {
            throw new Error(
                `${file}.json の書き方にエラーがあります`
            );
        }

    }

    window.MASTER = {
        attribute: raw.attribute.attributes ?? [],
        category: raw.category.categories ?? [],
        type: raw.type.types ?? [],
        rarity: raw.rarity.rarity ?? [],
        emblem: raw.emblem.emblems ?? [],
        spirit: raw.spirit.spirits ?? [],
        spiritEvolutionStages:
        raw.spirit.evolutionStages ?? [],
        spiria: raw.spiria.spiria ?? [],
        encyclopedia: raw.encyclopedia.encyclopedia ?? []
    };

}
