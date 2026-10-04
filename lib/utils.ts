export { cn } from "cn"

export function getImageUrl(idOrUrl?: string | null, size: string = 'w800'): string {
  if (!idOrUrl) return '';
  
  // If it's a direct URL (starts with http or https), return as is
  if (/^https?:\/\//.test(idOrUrl)) {
    return idOrUrl;
  }
  
  // Otherwise, assume it's a Google Drive ID
  return `https://drive.google.com/thumbnail?id=${idOrUrl}&sz=${size}`;
}

export function getMediaLink(idOrUrl?: string | null): string {
  if (!idOrUrl) return '#';
  if (/^https?:\/\//.test(idOrUrl)) return idOrUrl;
  return `https://drive.google.com/file/d/${idOrUrl}/view`;
}
