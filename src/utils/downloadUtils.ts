import { formatDate } from '@/lib/utils/formatters';

export function downloadAsJson<T>(data: T, filename: string): void {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename with date
    const now = new Date();
    const formattedDate = formatDate(now, 'yyyy-MM-dd');
    const timeStr = now.getHours().toString().padStart(2, '0') + '_' + 
                   now.getMinutes().toString().padStart(2, '0');
    const fullFilename = `${filename}_${formattedDate}_${timeStr}.json`;
    
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

export function downloadAsCSV(data: any[], filename: string): boolean {
  try {
    if (!data || data.length === 0) {
      console.warn('No data to download');
      return false;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        let value = row[header];
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          return `"${value}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate filename with date
    const now = new Date();
    const formattedDate = formatDate(now, 'yyyy-MM-dd');
    const timeStr = now.getHours().toString().padStart(2, '0') + '_' +
                   now.getMinutes().toString().padStart(2, '0');
    const fullFilename = `${filename}_${formattedDate}_${timeStr}.csv`;

    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error('Error downloading CSV file:', error);
    return false;
  }
}
