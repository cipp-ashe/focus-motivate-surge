// CORS headers for edge function responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export interface Note {
  id: string;
  content: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export interface NotesSummary {
  notes: Note[];
  tags: string[];
  totalNotes: number;
}

export interface DailySummary {
  averageEfficiency: number;
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  completedTasks: { taskName: string }[];
  unfinishedTasks: { taskName: string }[];
  notes?: NotesSummary;
}

// Helper function to format minutes into hours and minutes
const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours === 0) {
    return `${minutes} minutes`;
  }
  if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

const formatNotesSection = (notes?: NotesSummary): string => {
  if (!notes || notes.notes.length === 0) return '';

  const notesHtml = notes.notes.map(note => `
    <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; color: #2563eb;">${note.title}</h3>
      ${note.tags.length > 0 ? `
        <div style="margin-bottom: 10px;">
          ${note.tags.map(tag => `
            <span style="display: inline-block; padding: 4px 8px; margin: 0 4px 4px 0; background: #e2e8f0; border-radius: 4px; font-size: 12px;">
              ${tag}
            </span>
          `).join('')}
        </div>
      ` : ''}
      <div style="white-space: pre-wrap;">${note.content}</div>
    </div>
  `).join('');

  return `
    <div style="margin-top: 30px;">
      <h2>Your Notes</h2>
      <p>Total Notes: <span class="highlight">${notes.totalNotes}</span></p>
      ${notes.tags.length > 0 ? `
        <p>Tags Used: <span class="highlight">${notes.tags.join(', ')}</span></p>
      ` : ''}
      <div class="notes-container">
        ${notesHtml}
      </div>
    </div>
  `;
};

// Helper function to format task summary email
export const formatTaskSummaryEmail = (data: DailySummary): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2563eb; }
          ul { list-style-type: none; padding-left: 0; }
          li { margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px; }
          .highlight { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Your Daily Task Summary</h1>
        <p>Here's a summary of your tasks and productivity today:</p>
        <ul>
          <li>Completed Tasks: <span class="highlight">${data.completedTasks.length}</span></li>
          <li>Average Efficiency: <span class="highlight">${data.averageEfficiency.toFixed(1)}%</span></li>
          <li>Total Time Spent: <span class="highlight">${formatMinutes(data.totalTimeSpent / 60)}</span></li>
          <li>Unfinished Tasks: <span class="highlight">${data.unfinishedTasks.length}</span></li>
          <li>Total Pauses: <span class="highlight">${data.totalPauses}</span></li>
        </ul>
        <p>Keep up the great work! 💪</p>
      </body>
    </html>
  `;
};

// Helper function to format notes summary email
export const formatNotesSummaryEmail = (notes: NotesSummary): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2563eb; }
          .highlight { color: #2563eb; font-weight: bold; }
          .notes-container { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Your Notes Summary</h1>
        <p>Here's a collection of your notes:</p>
        <p>Total Notes: <span class="highlight">${notes.totalNotes}</span></p>
        ${notes.tags.length > 0 ? `
          <p>Tags Used: <span class="highlight">${notes.tags.join(', ')}</span></p>
        ` : ''}
        <div class="notes-container">
          ${notes.notes.map(note => `
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #2563eb;">${note.title}</h3>
              ${note.tags.length > 0 ? `
                <div style="margin-bottom: 10px;">
                  ${note.tags.map(tag => `
                    <span style="display: inline-block; padding: 4px 8px; margin: 0 4px 4px 0; background: #e2e8f0; border-radius: 4px; font-size: 12px;">
                      ${tag}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
              <div style="white-space: pre-wrap;">${note.content}</div>
            </div>
          `).join('')}
        </div>
        <p>Happy note-taking! 📝</p>
      </body>
    </html>
  `;
};
