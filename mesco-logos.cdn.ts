const RAW_GITHACK_BASE = "https://raw.githack.com/moo3tazali/cdn/main";

const buildCdnUrl = (filePath: string) => `${RAW_GITHACK_BASE}/${filePath}`;

export const MESCO_LOGOS_CDN = {
  altun: buildCdnUrl("mesco-logos/Altun.png"),
  euroShipping: buildCdnUrl("mesco-logos/Euro-Shipping.png"),
  globelink: buildCdnUrl("mesco-logos/Globelink.png"),
  mils: buildCdnUrl("mesco-logos/MILS.png"),
  merghem: buildCdnUrl("mesco-logos/Merghem.png"),
  mesco: buildCdnUrl("mesco-logos/Mesco.png"),
  saco: buildCdnUrl("mesco-logos/Saco.png"),
  wecLogo: buildCdnUrl("mesco-logos/wec-logo.png"),
} as const;
