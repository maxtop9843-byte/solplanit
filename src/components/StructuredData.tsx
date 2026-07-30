type StructuredDataProps = {
  graph: Record<string, unknown>[];
};

export default function StructuredData({ graph }: StructuredDataProps) {
  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}
