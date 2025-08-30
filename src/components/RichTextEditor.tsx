import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
  Box,
  Paper,
  IconButton,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Typography,
  Tooltip
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  FormatClear,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  EmojiEmotions,
  Article
} from '@mui/icons-material'
import NoticeTemplates, { NoticeTemplate } from './NoticeTemplates'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  label,
  helperText
}) => {
  const [emojiAnchor, setEmojiAnchor] = React.useState<HTMLElement | null>(null)
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)
  
  const commonEmojis = [
    '😊', '👍', '❤️', '🎉', '✨', '🙏', '💰', '📱', '✅', '⭐',
    '🏦', '💳', '💵', '📝', '📢', '⚠️', '✔️', '❗', '💼', '🔒',
    '📅', '⏰', '🚀', '💡', '🎯', '📊', '🤝', '👨‍💼', '👩‍💼', '📞'
  ]
  
  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiAnchor && !emojiAnchor.contains(event.target as Node)) {
        const emojiPanel = document.querySelector('.emoji-panel')
        if (!emojiPanel?.contains(event.target as Node)) {
          setEmojiAnchor(null)
        }
      }
    }
    
    if (emojiAnchor) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [emojiAnchor])
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure for better paragraph handling
        paragraph: {
          HTMLAttributes: {
            style: 'margin: 0; min-height: 1em;',
          },
        },
        hardBreak: {
          keepMarks: true,
          HTMLAttributes: {
            style: 'display: block; content: "";',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    // Add Tab key handling
    editorProps: {
      handleKeyDown(view, event) {
        if (event.key === 'Tab') {
          event.preventDefault()
          // Insert 4 spaces for indentation
          const { state, dispatch } = view
          const { tr } = state
          tr.insertText('    ')
          dispatch(tr)
          return true
        }
        return false
      },
      attributes: {
        style: 'white-space: pre-wrap; word-wrap: break-word;',
      },
    },
  })

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (!editor) return
    
    const currentContent = editor.getHTML()
    // Normalize empty values for comparison
    const normalizedValue = value || ''
    const normalizedCurrent = currentContent === '<p></p>' ? '' : currentContent
    
    // Only update if content is actually different to avoid cursor jump
    if (normalizedValue !== normalizedCurrent && normalizedValue !== currentContent) {
editor.commands.setContent(normalizedValue)
      // Trigger onChange to sync the state
      if (normalizedValue !== value) {
        onChange(normalizedValue)
      }
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const handleInsertEmoji = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run()
    setEmojiAnchor(null)
  }

  const handleTemplateSelect = (template: NoticeTemplate) => {
    if (editor) {
      // Check if editor has content
      const hasContent = editor.getText().trim().length > 0
      
      // Convert plain text newlines to HTML paragraphs
      const htmlContent = template.content
        .split('\n')
        .map(line => line.trim() ? `<p>${line}</p>` : '<p></p>')
        .join('')
      
      if (hasContent) {
        // If there's existing content, insert template at cursor with line break
        editor.chain()
          .focus()
          .insertContent('<br/><br/>')
          .insertContent(htmlContent)
          .run()
      } else {
        // If empty, just insert the template
        editor.chain()
          .focus()
          .insertContent(htmlContent)
          .run()
      }
    }
  }
  
  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'bullet':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'number':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'clear':
        editor.chain().focus().clearNodes().unsetAllMarks().run()
        break
      case 'left':
        editor.chain().focus().setTextAlign('left').run()
        break
      case 'center':
        editor.chain().focus().setTextAlign('center').run()
        break
      case 'right':
        editor.chain().focus().setTextAlign('right').run()
        break
    }
  }

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="bold"
                selected={editor.isActive('bold')}
                onClick={() => handleFormat('bold')}
                aria-label="굵게"
              >
                <FormatBold fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="italic"
                selected={editor.isActive('italic')}
                onClick={() => handleFormat('italic')}
                aria-label="기울임"
              >
                <FormatItalic fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            <ToggleButtonGroup size="small" exclusive>
              <ToggleButton
                value="left"
                selected={editor.isActive({ textAlign: 'left' })}
                onClick={() => handleFormat('left')}
                aria-label="左对齐"
              >
                <FormatAlignLeft fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="center"
                selected={editor.isActive({ textAlign: 'center' })}
                onClick={() => handleFormat('center')}
                aria-label="居中"
              >
                <FormatAlignCenter fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="right"
                selected={editor.isActive({ textAlign: 'right' })}
                onClick={() => handleFormat('right')}
                aria-label="右对齐"
              >
                <FormatAlignRight fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            <ToggleButtonGroup size="small">
              <ToggleButton
                value="bullet"
                selected={editor.isActive('bulletList')}
                onClick={() => handleFormat('bullet')}
                aria-label="글머리 기호"
              >
                <FormatListBulleted fontSize="small" />
              </ToggleButton>
              <ToggleButton
                value="number"
                selected={editor.isActive('orderedList')}
                onClick={() => handleFormat('number')}
                aria-label="번호 매기기"
              >
                <FormatListNumbered fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            <IconButton
              size="small"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              aria-label="실행 취소"
            >
              <Undo fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              aria-label="다시 실행"
            >
              <Redo fontSize="small" />
            </IconButton>

            <Divider orientation="vertical" flexItem />
            
            <Box sx={{ position: 'relative' }}>
              <IconButton
                size="small"
                onClick={(e) => setEmojiAnchor(emojiAnchor ? null : e.currentTarget)}
                aria-label="插入表情"
              >
                <EmojiEmotions fontSize="small" />
              </IconButton>
              {emojiAnchor && (
                <Paper
                  className="emoji-panel"
                  elevation={3}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    mt: 1,
                    p: 1,
                    zIndex: 1000,
                    maxWidth: 320,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: 0.5
                  }}
                >
                  {commonEmojis.map((emoji) => (
                    <IconButton
                      key={emoji}
                      size="small"
                      onClick={() => handleInsertEmoji(emoji)}
                      sx={{ 
                        fontSize: '1.2rem',
                        minWidth: 28,
                        width: 28,
                        height: 28,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Paper>
              )}
            </Box>

            <Divider orientation="vertical" flexItem />
            
            <Tooltip title="选择公告模板">
              <IconButton
                size="small"
                onClick={() => setTemplateDialogOpen(true)}
                aria-label="选择模板"
                color="primary"
              >
                <Article fontSize="small" />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            <IconButton
              size="small"
              onClick={() => handleFormat('clear')}
              aria-label="서식 지우기"
            >
              <FormatClear fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        
        <Box
          sx={{
            p: 2,
            minHeight: 100,
            '& .ProseMirror': {
              outline: 'none',
              minHeight: 80,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              '& p': {
                margin: 0,
                minHeight: '1.2em',
                '&:empty::before': {
                  content: '""',
                  display: 'inline-block',
                },
              },
              '& p.is-editor-empty:first-of-type::before': {
                color: 'text.disabled',
                content: 'attr(data-placeholder)',
                float: 'left',
                height: 0,
                pointerEvents: 'none',
              },
              '& ul, & ol': {
                paddingLeft: 20,
                margin: '0.5em 0',
              },
              '& li': {
                marginBottom: 4,
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
      {helperText && (
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
          {helperText}
        </Typography>
      )}
      
      <NoticeTemplates
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </Box>
  )
}

export default RichTextEditor