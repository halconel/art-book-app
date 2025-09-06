import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  Toolbar,
} from '@mui/material';
import {
  Save,
  Preview,
  Edit,
  Refresh,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Code,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import api from '../../services/authService';

const ResumeEditor = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Edit, 1: Preview, 2: Split
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/resume');
      setContent(response.data.content || '');
      setLastSaved(response.data.updated_at);
      setError('');
    } catch (err) {
      setError('Failed to fetch resume');
      console.error('Failed to fetch resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put('/admin/resume', {
        resume: { content },
      });

      setLastSaved(response.data.updated_at);
      setSuccess('Resume saved successfully');
      setTimeout(() => setSuccess(''), 3000);
      setError('');
    } catch (err) {
      setError('Failed to save resume');
      console.error('Failed to save resume:', err);
    } finally {
      setSaving(false);
    }
  };

  const insertMarkdown = (before, after = '') => {
    const textarea = document.getElementById('resume-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  const formatButtons = [
    {
      icon: <FormatBold />,
      action: () => insertMarkdown('**', '**'),
      tooltip: 'Bold',
    },
    {
      icon: <FormatItalic />,
      action: () => insertMarkdown('*', '*'),
      tooltip: 'Italic',
    },
    {
      icon: <FormatListBulleted />,
      action: () => insertMarkdown('\n- ', ''),
      tooltip: 'Bullet List',
    },
    {
      icon: <FormatListNumbered />,
      action: () => insertMarkdown('\n1. ', ''),
      tooltip: 'Numbered List',
    },
    {
      icon: <Link />,
      action: () => insertMarkdown('[', '](url)'),
      tooltip: 'Link',
    },
    {
      icon: <Image />,
      action: () => insertMarkdown('![alt text](', ')'),
      tooltip: 'Image',
    },
    { icon: <Code />, action: () => insertMarkdown('`', '`'), tooltip: 'Code' },
  ];

  const defaultContent = `# John Doe - Digital Artist

## About Me
Welcome to my creative world! I'm a passionate digital artist specializing in...

## Skills
- **Digital Painting** - Advanced proficiency in Photoshop and Procreate
- **3D Modeling** - Experience with Blender and Maya
- **Character Design** - Creating unique characters for games and stories
- **Concept Art** - Environmental and prop design

## Experience

### Senior Digital Artist | Creative Studio (2020-Present)
- Led creative projects for major gaming companies
- Developed concept art and character designs
- Mentored junior artists and interns

### Freelance Artist | Self-Employed (2018-2020)
- Worked with indie game developers and publishers
- Created artwork for mobile games and applications
- Built strong client relationships and repeat business

## Education
**Bachelor of Fine Arts in Digital Media** - Art University (2014-2018)

## Contact
Feel free to reach out for commissions or collaborations!

---
*Last updated: ${new Date().toLocaleDateString()}*`;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Artist Resume Editor</Typography>

        <Box display="flex" gap={2}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchResume}
            disabled={saving}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {lastSaved && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Last saved: {new Date(lastSaved).toLocaleString()}
        </Typography>
      )}

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          variant="fullWidth"
        >
          <Tab label="Edit" icon={<Edit />} />
          <Tab label="Preview" icon={<Preview />} />
          <Tab label="Split View" />
        </Tabs>
      </Paper>

      {/* Toolbar */}
      {(activeTab === 0 || activeTab === 2) && (
        <Paper sx={{ mb: 1 }}>
          <Toolbar variant="dense">
            <Typography variant="body2" sx={{ mr: 2 }}>
              Format:
            </Typography>
            {formatButtons.map((button, index) => (
              <IconButton
                key={index}
                onClick={button.action}
                size="small"
                title={button.tooltip}
              >
                {button.icon}
              </IconButton>
            ))}

            <Button
              size="small"
              onClick={() => setContent(content || defaultContent)}
              sx={{ ml: 'auto' }}
              disabled={content.trim() !== ''}
            >
              Load Template
            </Button>
          </Toolbar>
        </Paper>
      )}

      {/* Content Area */}
      <Grid container spacing={2}>
        {/* Edit Mode */}
        {activeTab === 0 && (
          <Grid item xs={12}>
            <TextField
              id="resume-editor"
              fullWidth
              multiline
              rows={20}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Start writing your resume in Markdown..."
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                },
              }}
            />
          </Grid>
        )}

        {/* Preview Mode */}
        {activeTab === 1 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {content ? (
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <Typography variant="h3" component="h1" gutterBottom>
                          {children}
                        </Typography>
                      ),
                      h2: ({ children }) => (
                        <Typography
                          variant="h4"
                          component="h2"
                          gutterBottom
                          sx={{ mt: 3 }}
                        >
                          {children}
                        </Typography>
                      ),
                      h3: ({ children }) => (
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{ mt: 2 }}
                        >
                          {children}
                        </Typography>
                      ),
                      p: ({ children }) => (
                        <Typography variant="body1" paragraph>
                          {children}
                        </Typography>
                      ),
                      ul: ({ children }) => (
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          {children}
                        </Box>
                      ),
                      ol: ({ children }) => (
                        <Box component="ol" sx={{ pl: 3, mb: 2 }}>
                          {children}
                        </Box>
                      ),
                      li: ({ children }) => (
                        <Typography
                          component="li"
                          variant="body1"
                          sx={{ mb: 0.5 }}
                        >
                          {children}
                        </Typography>
                      ),
                      strong: ({ children }) => (
                        <Typography
                          component="strong"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {children}
                        </Typography>
                      ),
                      em: ({ children }) => (
                        <Typography component="em" sx={{ fontStyle: 'italic' }}>
                          {children}
                        </Typography>
                      ),
                      code: ({ children }) => (
                        <Typography
                          component="code"
                          sx={{
                            backgroundColor: 'grey.100',
                            padding: '2px 4px',
                            borderRadius: 1,
                            fontFamily: 'Monaco, Consolas, monospace',
                            fontSize: '0.875rem',
                          }}
                        >
                          {children}
                        </Typography>
                      ),
                      hr: () => (
                        <Box
                          sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            my: 3,
                          }}
                        />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ py: 8 }}
                  >
                    No content to preview. Start writing in the editor!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Split View */}
        {activeTab === 2 && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Editor
              </Typography>
              <TextField
                id="resume-editor-split"
                fullWidth
                multiline
                rows={18}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing your resume in Markdown..."
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Card sx={{ height: '500px', overflow: 'auto' }}>
                <CardContent>
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <Typography
                      color="text.secondary"
                      align="center"
                      sx={{ py: 4 }}
                    >
                      Preview will appear here...
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Keyboard Shortcuts Help */}
      <Paper sx={{ mt: 2, p: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Markdown Guide:</strong>
          **bold**, *italic*, # Heading, - List item, [Link](url),
          ![Image](url), `code`
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResumeEditor;
