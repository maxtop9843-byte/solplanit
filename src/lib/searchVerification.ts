export type SearchVerificationEnvironment = {
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  NEXT_PUBLIC_NAVER_SITE_VERIFICATION?: string;
};

function cleanToken(value?: string) {
  const token = value?.trim();
  return token || undefined;
}

export function getSearchVerificationConfig(
  environment?: SearchVerificationEnvironment,
) {
  const source = environment ?? {
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    NEXT_PUBLIC_NAVER_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
  };

  const google = cleanToken(source.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
  const naver = cleanToken(source.NEXT_PUBLIC_NAVER_SITE_VERIFICATION);

  return {
    google,
    naver,
    configured: Boolean(google || naver),
  } as const;
}
