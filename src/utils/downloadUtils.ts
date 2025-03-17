
import { formatDate } from "@/lib/utils/dateUtils";

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const generateFileName = (prefix: string, extension: string) => {
  const date = formatDate(new Date(), 'yyyy-MM-dd_HH:mm');
  return `${prefix}_${date}.${extension}`;
};
