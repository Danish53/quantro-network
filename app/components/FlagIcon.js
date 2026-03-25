/**
 * Renders a country flag image (flagcdn.com) so flags display consistently on Windows desktop
 * where regional-indicator emoji pairs often render as letters instead of flags.
 */
export default function FlagIcon({ countryCode, className = "", width = 20 }) {
  const code = (countryCode || "xx").toLowerCase();
  const h = Math.round(width * 0.75);
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w20/${code}.png 20w, https://flagcdn.com/w40/${code}.png 40w`}
      width={width}
      height={h}
      alt=""
      className={`inline-block shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-black/10 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
