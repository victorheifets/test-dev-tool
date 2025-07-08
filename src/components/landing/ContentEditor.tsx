import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  Add,
  Delete,
  DragIndicator,
  Edit,
} from '@mui/icons-material';
import type { ContentEditorProps, FeatureItem } from '../../types/landing';

interface EditorToolbarProps {
  editor: any;
  templateColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

function EditorToolbar({ editor, templateColors }: EditorToolbarProps) {
  const theme = useTheme();

  if (!editor) return null;

  const toolbarButtons = [
    {
      icon: FormatBold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: FormatItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: FormatListBulleted,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: FormatListNumbered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Numbered List',
    },
  ];

  const colorOptions = [
    { color: templateColors.primary, label: 'Primary' },
    { color: templateColors.secondary, label: 'Secondary' },
    { color: templateColors.accent, label: 'Accent' },
    { color: '#e74c3c', label: 'Red' },
    { color: '#2ecc71', label: 'Green' },
    { color: '#333333', label: 'Dark' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        borderRadius: '12px 12px 0 0',
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderBottom: 'none',
      }}
    >
      {/* Format Buttons */}
      <Stack direction="row" spacing={0.5}>
        {toolbarButtons.map(({ icon: Icon, action, isActive, tooltip }) => (
          <IconButton
            key={tooltip}
            size="small"
            onClick={action}
            sx={{
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
            title={tooltip}
          >
            <Icon fontSize="small" />
          </IconButton>
        ))}
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Color Options */}
      <Stack direction="row" spacing={0.5}>
        {colorOptions.map(({ color, label }) => (
          <IconButton
            key={color}
            size="small"
            onClick={() => editor.chain().focus().setColor(color).run()}
            sx={{
              width: 28,
              height: 28,
              backgroundColor: color,
              borderRadius: 1,
              border: `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
              boxShadow: `0 2px 4px ${alpha(color, 0.3)}`,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 4px 8px ${alpha(color, 0.4)}`,
              },
            }}
            title={`${label} Color`}
          />
        ))}
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Undo/Redo */}
      <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          sx={{ borderRadius: 1.5 }}
          title="Undo"
        >
          <Undo fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          sx={{ borderRadius: 1.5 }}
          title="Redo"
        >
          <Redo fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  templateColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  readonly?: boolean;
}

function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  templateColors,
  readonly = false,
}: RichTextEditorProps) {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        'data-placeholder': placeholder,
      },
    },
  });

  return (
    <Box>
      {!readonly && <EditorToolbar editor={editor} templateColors={templateColors} />}
      <Paper
        elevation={0}
        sx={{
          minHeight: 200,
          borderRadius: readonly ? 2 : '0 0 12px 12px',
          border: readonly ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderTop: readonly ? undefined : 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2.5,
            minHeight: 180,
            '& .tiptap-editor': {
              outline: 'none',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              '&:before': {
                content: 'attr(data-placeholder)',
                float: 'left',
                color: theme.palette.text.disabled,
                pointerEvents: 'none',
                height: 0,
              },
              '& h1': {
                fontSize: '2rem',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 0 1rem 0',
                color: templateColors.primary,
              },
              '& h2': {
                fontSize: '1.5rem',
                fontWeight: 600,
                lineHeight: 1.3,
                margin: '1.5rem 0 1rem 0',
                color: templateColors.secondary,
              },
              '& h3': {
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1.4,
                margin: '1rem 0 0.5rem 0',
                color: templateColors.accent,
              },
              '& p': {
                margin: '0 0 1rem 0',
                lineHeight: 1.6,
              },
              '& ul, & ol': {
                margin: '0 0 1rem 0',
                paddingLeft: '1.5rem',
              },
              '& li': {
                margin: '0.25rem 0',
                lineHeight: 1.5,
              },
              '& strong': {
                fontWeight: 600,
                color: templateColors.primary,
              },
              '& em': {
                fontStyle: 'italic',
                color: templateColors.secondary,
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
    </Box>
  );
}

export default function ContentEditor({
  content,
  template,
  onChange,
  section,
  readonly = false,
}: ContentEditorProps) {
  const theme = useTheme();
  const [features, setFeatures] = useState<FeatureItem[]>(content.features?.items || []);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  const templateColors = {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
  };

  const handleContentChange = useCallback(
    (field: string, value: any) => {
      const updatedContent = {
        ...content,
        [section]: {
          ...content[section],
          [field]: value,
        },
      };
      onChange(updatedContent);
    },
    [content, section, onChange]
  );

  const handleFeatureAdd = () => {
    if (newFeature.title.trim() && newFeature.description.trim()) {
      const newFeatureItem: FeatureItem = {
        id: `feature-${Date.now()}`,
        title: newFeature.title,
        description: newFeature.description,
        order: features.length,
      };
      const updatedFeatures = [...features, newFeatureItem];
      setFeatures(updatedFeatures);
      handleContentChange('items', updatedFeatures);
      setNewFeature({ title: '', description: '' });
    }
  };

  const handleFeatureDelete = (featureId: string) => {
    const updatedFeatures = features.filter(f => f.id !== featureId);
    setFeatures(updatedFeatures);
    handleContentChange('items', updatedFeatures);
  };

  const renderSectionEditor = () => {
    switch (section) {
      case 'hero':
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Main Title"
              value={content.hero?.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleContentChange('subtitle', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Description
              </Typography>
              <RichTextEditor
                content={content.hero?.description || ''}
                onChange={(value) => handleContentChange('description', value)}
                placeholder="Enter your course description..."
                templateColors={templateColors}
                readonly={readonly}
              />
            </Box>
            <TextField
              fullWidth
              label="Call-to-Action Button Text"
              value={content.hero?.buttonText || ''}
              onChange={(e) => handleContentChange('buttonText', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Stack>
        );

      case 'features':
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Section Title"
              value={content.features?.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Section Subtitle"
              value={content.features?.subtitle || ''}
              onChange={(e) => handleContentChange('subtitle', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Feature Items */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Course Features
              </Typography>
              
              {features.length > 0 && (
                <List sx={{ mb: 2 }}>
                  {features.map((feature, index) => (
                    <ListItem
                      key={feature.id}
                      sx={{
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      }}
                    >
                      <DragIndicator sx={{ mr: 1, color: 'text.secondary', cursor: 'grab' }} />
                      <ListItemText
                        primary={feature.title}
                        secondary={feature.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      {!readonly && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleFeatureDelete(feature.id)}
                            size="small"
                            sx={{ color: 'error.main' }}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}

              {!readonly && (
                <Card variant="outlined" sx={{ borderRadius: 2, borderStyle: 'dashed' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Feature Title"
                          value={newFeature.title}
                          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                          placeholder="e.g., Expert Instruction"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Feature Description"
                          value={newFeature.description}
                          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                          placeholder="e.g., Learn from industry professionals..."
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleFeatureAdd}
                          disabled={!newFeature.title.trim() || !newFeature.description.trim()}
                          sx={{ height: '40px', borderRadius: 2 }}
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Stack>
        );

      case 'instructor':
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Section Title"
              value={content.instructor?.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instructor Name"
                  value={content.instructor?.name || ''}
                  onChange={(e) => handleContentChange('name', e.target.value)}
                  variant="outlined"
                  inputProps={{ readOnly: readonly }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Credentials"
                  value={content.instructor?.credentials || ''}
                  onChange={(e) => handleContentChange('credentials', e.target.value)}
                  variant="outlined"
                  inputProps={{ readOnly: readonly }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Instructor Bio
              </Typography>
              <RichTextEditor
                content={content.instructor?.bio || ''}
                onChange={(value) => handleContentChange('bio', value)}
                placeholder="Tell students about the instructor's background and expertise..."
                templateColors={templateColors}
                readonly={readonly}
              />
            </Box>
          </Stack>
        );

      case 'pricing':
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Section Title"
              value={content.pricing?.title || ''}
              onChange={(e) => handleContentChange('title', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Section Subtitle"
              value={content.pricing?.subtitle || ''}
              onChange={(e) => handleContentChange('subtitle', e.target.value)}
              variant="outlined"
              inputProps={{ readOnly: readonly }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price"
                  value={content.pricing?.price || ''}
                  onChange={(e) => handleContentChange('price', e.target.value)}
                  variant="outlined"
                  inputProps={{ readOnly: readonly }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Original Price (Optional)"
                  value={content.pricing?.originalPrice || ''}
                  onChange={(e) => handleContentChange('originalPrice', e.target.value)}
                  variant="outlined"
                  inputProps={{ readOnly: readonly }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Enrollment Button Text"
                  value={content.pricing?.buttonText || ''}
                  onChange={(e) => handleContentChange('buttonText', e.target.value)}
                  variant="outlined"
                  inputProps={{ readOnly: readonly }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        );

      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Content editor for {section} section
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: templateColors.primary,
            textTransform: 'capitalize',
          }}
        >
          {section.replace(/([A-Z])/g, ' $1').trim()} Section
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize the content for your {section} section
        </Typography>
      </Box>
      
      {renderSectionEditor()}
    </Box>
  );
}