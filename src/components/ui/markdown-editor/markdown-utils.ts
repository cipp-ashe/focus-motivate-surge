
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
      placeholderText = 'bold text';
      newText = `**${selectedText || placeholderText}**`;
      break;
    case 'italic':
      placeholderText = 'italic text';
      newText = `*${selectedText || placeholderText}*`;
      break;
    case 'heading1':
      placeholderText = 'Heading 1';
      newText = `\n# ${selectedText || placeholderText}\n`;
      break;
    case 'heading2':
      placeholderText = 'Heading 2';
      newText = `\n## ${selectedText || placeholderText}\n`;
      break;
    case 'heading3':
      placeholderText = 'Heading 3';
      newText = `\n### ${selectedText || placeholderText}\n`;
      break;
    case 'link':
      placeholderText = 'link text';
      newText = `[${selectedText || placeholderText}](url)`;
      break;
    case 'image':
      placeholderText = 'alt text';
      newText = `![${selectedText || placeholderText}](image-url)`;
      break;
    case 'bulletList':
      placeholderText = 'List item';
      newText = `\n- ${selectedText || placeholderText}\n`;
      break;
    case 'numberedList':
      placeholderText = 'List item';
      newText = `\n1. ${selectedText || placeholderText}\n`;
      break;
    case 'quote':
      placeholderText = 'Quote';
      newText = `\n> ${selectedText || placeholderText}\n`;
      break;
    case 'code':
      placeholderText = 'code block';
      newText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : "```\ncode block\n```";
      break;
    case 'inlineCode':
      placeholderText = 'code';
      newText = `\`${selectedText || placeholderText}\``;
      break;
    case 'strikethrough':
      placeholderText = 'strikethrough text';
      newText = `~~${selectedText || placeholderText}~~`;
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
  
  const { newText, placeholderText } = formatMarkdownText(type, selectedText);
  
  // Create the new content by replacing the selected text with formatted text
  const newContent = value.substring(0, selectionStart) + newText + value.substring(selectionEnd);
  
  // Calculate cursor positions for selection or moving cursor
  let newSelectionStart = selectionStart;
  let newSelectionEnd = selectionStart + newText.length;
  
  // If there was no selected text and we inserted placeholder text, we want to
  // select the placeholder so the user can immediately type over it
  if (!selectedText && placeholderText) {
    const placeholderStart = newContent.indexOf(placeholderText, selectionStart);
    if (placeholderStart !== -1) {
      newSelectionStart = placeholderStart;
      newSelectionEnd = placeholderStart + placeholderText.length;
    }
  }
  
  return { 
    newContent, 
    newCursorPosition: { 
      start: newSelectionStart, 
      end: newSelectionEnd 
    } 
  };
};
