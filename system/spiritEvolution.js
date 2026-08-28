// =======================================
// system/spiritEvolution.js
// 属性別の精霊進化判定
// =======================================


// =======================================
// 属性別の発見種類数
// =======================================

export function getAttributeDiscoveryCount(
    save,
    attribute
) {

    const discoveredNumbers =
        getDiscoveredNumbers(save);

    const encyclopedia =
        Array.isArray(
            window.MASTER?.encyclopedia
        )
            ? window.MASTER.encyclopedia
            : [];

    return encyclopedia.filter(item => {

        const number =
            Number(item?.no);

return (
    discoveredNumbers.has(number) &&
    (
        attribute === "all" ||
        item?.attribute === attribute
    )
);
    }).length;
}


// =======================================
// 現在の進化段階
// =======================================

export function getSpiritEvolutionStage(
    save,
    attribute
) {

    const discoveryCount =
        getAttributeDiscoveryCount(
            save,
            attribute
        );

    const stages =
        Array.isArray(
            window.MASTER
                ?.spiritEvolutionStages
        )
            ? [
                ...window.MASTER
                    .spiritEvolutionStages
              ]
            : [];

    stages.sort(
        (a, b) =>
            Number(
                b.requiredDiscoveries
            ) -
            Number(
                a.requiredDiscoveries
            )
    );

    const currentStage =
        stages.find(
            stage =>
                discoveryCount >=
                Number(
                    stage.requiredDiscoveries
                )
        ) ?? {
            stage: 0,
            id: "egg",
            name: "卵",
            requiredDiscoveries: 0
        };

    return {
        ...currentStage,
        discoveryCount
    };
}


// =======================================
// 発見済み番号
// =======================================

function getDiscoveredNumbers(save) {

    const numbers = [];

    if (
        Array.isArray(
            save?.discovered
        )
    ) {

        numbers.push(
            ...save.discovered
        );
    }

    if (
        Array.isArray(
            save?.discoveredCards
        )
    ) {

        numbers.push(
            ...save.discoveredCards.map(
                card => card?.no
            )
        );
    }

    return new Set(
        numbers
            .map(Number)
            .filter(Number.isFinite)
    );
}