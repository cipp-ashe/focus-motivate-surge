
/**
 * Utility functions for markdown editing
 */

export interface TextInsertionConfig {
  type: string;
  selectedText: string;
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Format text with markdown syntax based on the given type
 */
export const formatMarkdownText = (type: string, selectedText: string = ''): { 
  newText: string;
  placeholderText: string;
} => {
  let newText = '';
  let placeholderText = '';
  
  switch(type) {
    case 'bold':
      newText = `**${selectedText}**`;
      break;
    case 'italic':
      newText = `*${selectedText}*`;
      break;
    case 'heading1':
      newText = `\n# ${selectedText}\n`;
      break;
    case 'heading2':
      newText = `\n## ${selectedText}\n`;
      break;
    case 'heading3':
      newText = `\n### ${selectedText}\n`;
      break;
    case 'link':
      newText = `[${selectedText}](url)`;
      break;
    case 'image':
      newText = `![${selectedText}](image-url)`;
      break;
    case 'bulletList':
      newText = `\n- ${selectedText}\n`;
      break;
    case 'numberedList':
      newText = `\n1. ${selectedText}\n`;
      break;
    case 'quote':
      newText = `\n> ${selectedText}\n`;
      break;
    case 'code':
      newText = `\`\`\`\n${selectedText}\n\`\`\``;
      break;
    case 'inlineCode':
      newText = `\`${selectedText}\``;
      break;
    case 'strikethrough':
      newText = `~~${selectedText}~~`;
      break;
    default:
      return { newText: selectedText, placeholderText: '' };
  }
  
  return { newText, placeholderText };
};

/**
 * Insert markdown-formatted text at the current position in a textarea
 */
export const insertMarkdownText = (config: TextInsertionConfig): { 
  newContent: string;
  newCursorPosition: { start: number; end: number } 
} => {
  const { type, selectedText, value, selectionStart, selectionEnd } = config;
  
  const { newText } = formatMarkdownText(type, selectedText);
  
  // Create the new content by replacing ONLY the selected text with formatted text
  const newContent = value.substring(0, selectionStart) + newText + value.substring(selectionEnd);
  
  // Calculate cursor positions
  const newSelectionStart = selectionStart + newText.length;
  const newSelectionEnd = newSelectionStart;
  
  return { 
    newContent, 
    newCursorPosition: { 
      start: newSelectionStart, 
      end: newSelectionEnd 
    } 
  };
};
