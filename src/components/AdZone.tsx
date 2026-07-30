import styles from "./AdZone.module.css";

type AdZoneProps = {
  placement: string;
  format?: "wide" | "content";
  className?: string;
};

export default function AdZone({ placement, format = "wide", className }: AdZoneProps) {
  const classes = [styles.zone, styles[format], className].filter(Boolean).join(" ");

  return (
    <aside
      className={classes}
      aria-label="광고 영역"
      data-ad-zone="reserved"
      data-ad-placement={placement}
      data-ad-format={format}
    >
      <span className={styles.label}>광고</span>
      <div className={styles.canvas} aria-hidden="true" />
    </aside>
  );
}
