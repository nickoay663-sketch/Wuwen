import EngineBase from "./EngineBase.js";

const RUNTIME_VERIFICATION_AUTHORITY =
    new WeakSet();

export function createRuntimeVerificationAuthority() {

    const authority = {};

    RUNTIME_VERIFICATION_AUTHORITY.add(
        authority
    );

    return authority;
}


class RuntimeVerificationEngine extends EngineBase {

    constructor(context = {}) {

        super(
            "RuntimeVerificationEngine",
            "10.7",
            "Runtime Verification Authority"
        );

        this.context =
            context || {};

        this.runtimeVerificationAuthority = context.runtimeVerificationAuthority || null;

        this.setNextRuntimeState("CorrespondenceEngine");
    }


    hasRuntimeVerificationAuthority() {

        return (
            this.runtimeVerificationAuthority !== null &&
            RUNTIME_VERIFICATION_AUTHORITY.has(
                this.runtimeVerificationAuthority
            )
        );
    }


    execute() {

        const evidences =
            Array.isArray(this.context.evidences)
                ? this.context.evidences
                : [];

        const authorized =
            this.hasRuntimeVerificationAuthority();

        const verifiedEvidences =
            evidences.map(
                evidence =>
                    this.verifyEvidence(
                        evidence,
                        authorized
                    )
            );

        const verifiedCount =
            verifiedEvidences.filter(
                evidence =>
                    evidence &&
                    evidence.runtimeVerificationRecord === true &&
                    evidence.verificationStatus === "VERIFIED" &&
                    evidence.epistemicState === "VERIFIED"
            ).length;

        const verificationAction = {

            action:
                "runtime-evidence-verification",

            method:
                "runtime-evidence-condition-check",

            executed:
                true,

            runtimeOwned:
                true,

            verificationResult:
                verifiedCount > 0
                    ? "VERIFIED"
                    : "UNVERIFIED",

            inputCount:
                evidences.length,

            verifiedCount,

            runtimeVerificationAuthorized:
                authorized
        };

        return this.result({

            evidences:
                verifiedEvidences,

            verificationAction,

            verificationStatus:
                verifiedCount > 0
                    ? "VERIFIED"
                    : "UNVERIFIED",

            epistemicState:
                verifiedCount > 0
                    ? "VERIFIED"
                    : evidences.length > 0
                        ? "UNVERIFIED"
                        : "UNKNOWN",

            runtimeVerificationRecordCount:
                verifiedCount,

            verificationBoundary: {

                runtimeVerificationAllowed:
                    authorized,

                runtimeVerificationAuthorized:
                    authorized,

                runtimeVerificationRecordCreated:
                    verifiedCount > 0
            }
        });
    }


    verifyEvidence(
        evidence,
        authorized = this.hasRuntimeVerificationAuthority()
    ) {

        if (
            !evidence ||
            typeof evidence !== "object"
        ) {
            return evidence;
        }


        /*
         * 没有 Runtime Authority：
         * 永远不能 VERIFIED。
         */

        if (!authorized) {

            return this.unverifiedEvidence(
                evidence,
                "runtime-authority-not-granted"
            );
        }


        /*
         * 外部伪造字段不能成为 Runtime 验证。
         *
         * 但 runtimeVerification=true
         * 是进入 Runtime Verification Action 的请求。
         */

        if (
            evidence.externalVerificationClaim === true ||
            evidence.verified === true ||
            evidence.verificationStatus === "VERIFIED" ||
            evidence.epistemicState === "VERIFIED" ||
            evidence.runtimeVerificationRecord === true
        ) {

            return this.unverifiedEvidence(
                evidence,
                "forged-runtime-verification-input"
            );
        }


        /*
         * 普通证据不进入 Runtime Verification。
         */

        if (
            evidence.runtimeVerification !== true
        ) {

            return this.unverifiedEvidence(
                evidence,
                "runtime-verification-not-requested"
            );
        }


        const source =
            evidence.source ||
            evidence.url ||
            "";

        const content =
            evidence.content ||
            "";


        /*
         * Runtime 自己执行验证条件检查。
         *
         * 注意：
         * 这里完全不读取输入中的
         * verificationStatus / verified /
         * runtimeVerificationRecord。
         */

        const verificationPassed =
            !!source &&
            !!content;


        if (!verificationPassed) {

            return this.unverifiedEvidence(
                evidence,
                "runtime-evidence-condition-check-failed"
            );
        }


        const verificationAction = {

            action:
                "runtime-verification-action",

            method:
                "runtime-record-created",

            executed:
                true,

            runtimeOwned:
                true,

            result:
                "VERIFIED",

            runtimeVerificationRecord:
                true,

            verificationBasis:
                "runtime-verification-action",

            executedAt:
                new Date().toISOString()
        };


        return {

            ...evidence,

            verified:
                true,

            verificationStatus:
                "VERIFIED",

            epistemicState:
                "VERIFIED",

            verificationBasis:
                "runtime-verification-action",

            runtimeVerification:
                true,

            runtimeVerificationRecord:
                true,

            verificationAction
        };
    }


    unverifiedEvidence(
        evidence,
        method
    ) {

        return {

            ...evidence,

            verified:
                false,

            verificationStatus:
                "UNVERIFIED",

            epistemicState:
                evidence.epistemicState === "DISCOVERED" ||
                evidence.state === "DISCOVERED"
                    ? "DISCOVERED"
                    : "UNVERIFIED",

            verificationBasis:
                null,

            runtimeVerificationRecord:
                false,

            verificationAction: {

                action:
                    "runtime-verification-action",

                method,

                executed:
                    true,

                runtimeOwned:
                    true,

                result:
                    "UNVERIFIED",

                runtimeVerificationRecord:
                    false,

                executedAt:
                    new Date().toISOString()
            }
        };
    }
}


export default RuntimeVerificationEngine;




