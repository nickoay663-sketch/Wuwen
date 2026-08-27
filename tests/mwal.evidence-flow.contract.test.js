import RuntimeContract from "../runtime/RuntimeContract.js";


const contract =
    RuntimeContract.mwalEvidenceFlowContract;


console.log(
    JSON.stringify(
        {
            runtimeContractVersion:
                RuntimeContract.version,

            mwalEvidenceFlowContract:
                contract
        },
        null,
        2
    )
);


if (!contract) {

    throw new Error(
        "MWAL Evidence Flow Contract missing."
    );

}


if (contract.required !== true) {

    throw new Error(
        "MWAL Evidence Flow Contract is not required."
    );

}


const flow =
    contract.flow || [];


const hasEvidenceEngine =
    flow.some(
        item =>
            item.from === "EvidenceEngine"
    );


const hasCorrespondenceEngine =
    flow.some(
        item =>
            item.to === "CorrespondenceEngine"
    );


if (!hasEvidenceEngine) {

    throw new Error(
        "EvidenceEngine flow missing."
    );

}


if (!hasCorrespondenceEngine) {

    throw new Error(
        "CorrespondenceEngine flow missing."
    );

}


if (
    contract.rules
        ?.evidenceCannotDisappearBeforeCorrespondence
        !== true
) {

    throw new Error(
        "Evidence disappearance protection missing."
    );

}


console.log(
    "MWAL EVIDENCE FLOW CONTRACT TEST PASSED"
);
