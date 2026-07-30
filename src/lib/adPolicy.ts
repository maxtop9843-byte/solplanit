export const ADSENSE_POLICY_APPROVAL = "confirmed";

export type AdPolicyState =
  | "missing-client"
  | "policy-review-required"
  | "ready";

type PublicAdEnvironment = {
  NEXT_PUBLIC_ADSENSE_CLIENT?: string;
  NEXT_PUBLIC_ADSENSE_POLICY_APPROVED?: string;
};

export function getAdPolicyConfig(
  environment: PublicAdEnvironment = process.env,
) {
  const clientId = environment.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const policyApproved =
    environment.NEXT_PUBLIC_ADSENSE_POLICY_APPROVED?.trim() ===
    ADSENSE_POLICY_APPROVAL;

  const state: AdPolicyState = !clientId
    ? "missing-client"
    : !policyApproved
      ? "policy-review-required"
      : "ready";

  return {
    clientId,
    policyApproved,
    advertisingConfigured: state === "ready",
    state,
  } as const;
}
