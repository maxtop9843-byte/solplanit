export const ADSENSE_POLICY_APPROVAL = "confirmed";

export type AdPolicyState =
  | "missing-client"
  | "policy-review-required"
  | "ready";

type PublicAdEnvironment = {
  NEXT_PUBLIC_ADSENSE_CLIENT?: string;
  NEXT_PUBLIC_ADSENSE_POLICY_APPROVED?: string;
};

export function getAdPolicyConfig(environment?: PublicAdEnvironment) {
  const source = environment ?? {
    NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    NEXT_PUBLIC_ADSENSE_POLICY_APPROVED:
      process.env.NEXT_PUBLIC_ADSENSE_POLICY_APPROVED,
  };
  const clientId = source.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const policyApproved =
    source.NEXT_PUBLIC_ADSENSE_POLICY_APPROVED?.trim() ===
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
