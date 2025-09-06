import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Palette,
  School,
  Work,
  Star,
  Email,
  Instagram,
  Twitter,
  Language,
  Timeline,
  EmojiEvents,
  Brush,
  Computer
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import api from '../../services/authService';

const ArtistInfo = () => {
  const [resumeContent, setResumeContent] = useState('');
  const [artistInfo, setArtistInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalArtworks: 0,
    yearsExperience: 0,
    clientProjects: 0,
    awards: 0
  });

  useEffect(() => {
    fetchArtistInfo();
    fetchResumeContent();
    fetchStats();
  }, []);

  const fetchArtistInfo = async () => {
    try {
      const response = await api.get('/artist/info');
      setArtistInfo(response.data.artist || {});
    } catch (err) {
      console.error('Failed to fetch artist info:', err);
      // Use fallback data if API fails
      setArtistInfo({
        name: 'Digital Artist',
        title: 'Creative Professional',
        bio: 'Passionate about bringing imagination to life through digital art.',
        avatar: '/placeholder-avatar.jpg',
        location: 'Creative Studio',
        social: {
          email: 'contact@artist.com',
          website: 'https://artist.com',
          instagram: '@artist',
          twitter: '@artist'
        }
      });
    }
  };

  const fetchResumeContent = async () => {
    try {
      const response = await api.get('/artist/resume');
      setResumeContent(response.data.content || '');
      setError('');
    } catch (err) {
      setError('Unable to load artist resume');
      console.error('Failed to fetch resume:', err);
      // Fallback content
      setResumeContent(`# Professional Digital Artist

## About Me
I'm a passionate digital artist specializing in character design, concept art, and digital illustration. With years of experience in the creative industry, I bring stories to life through compelling visuals.

## Skills & Expertise
- **Digital Illustration** - Advanced proficiency in industry-standard software
- **Character Design** - Creating memorable and unique characters
- **Concept Art** - Environmental and prop design for games and media
- **3D Modeling** - Basic to intermediate 3D artwork
- **Animation** - 2D animation and motion graphics

## Services
- Custom character commissions
- Concept art for games and media
- Digital portraits and illustrations
- Logo and brand design
- Art consultation and direction

## Philosophy
Every piece of art tells a story. My goal is to create visuals that not only look beautiful but also convey emotion and meaning, connecting with viewers on a deeper level.

---
*Ready to bring your vision to life? Let's create something amazing together.*`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/artist/stats');
      setStats(response.data.stats || stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Use placeholder stats
      setStats({
        totalArtworks: 150,
        yearsExperience: 8,
        clientProjects: 45,
        awards: 12
      });
    }
  };

  const skills = [
    { name: 'Digital Painting', level: 95, icon: <Brush /> },
    { name: 'Character Design', level: 90, icon: <Palette /> },
    { name: 'Concept Art', level: 85, icon: <Timeline /> },
    { name: '3D Modeling', level: 70, icon: <Computer /> },
  ];

  const achievements = [
    { title: 'Featured Artist', description: 'Digital Arts Magazine 2023', icon: <Star /> },
    { title: 'Client Satisfaction', description: '98% positive feedback rate', icon: <EmojiEvents /> },
    { title: 'Industry Recognition', description: 'Multiple art awards and mentions', icon: <Star /> },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ p: 4, color: 'white', textAlign: 'center' }}>
          <Avatar
            src={artistInfo.avatar}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 16px auto',
              border: '4px solid white'
            }}
          >
            {artistInfo.name?.[0] || 'A'}
          </Avatar>
          
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {artistInfo.name || 'Digital Artist'}
          </Typography>
          
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            {artistInfo.title || 'Creative Professional'}
          </Typography>
          
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
            {artistInfo.bio || 'Passionate about bringing imagination to life through digital art.'}
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.totalArtworks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artworks Created
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h3" color="secondary" gutterBottom>
                {stats.yearsExperience}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Years Experience
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h3" color="success.main" gutterBottom>
                {stats.clientProjects}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Client Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h3" color="warning.main" gutterBottom>
                {stats.awards}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awards & Recognition
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About & Resume
              </Typography>
              
              {error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ 
                '& h1': { fontSize: '2rem', mb: 2, mt: 3 },
                '& h2': { fontSize: '1.5rem', mb: 2, mt: 2 },
                '& h3': { fontSize: '1.25rem', mb: 1, mt: 2 },
                '& p': { mb: 2, lineHeight: 1.7 },
                '& ul': { mb: 2, pl: 3 },
                '& li': { mb: 0.5 }
              }}>
                <ReactMarkdown>{resumeContent}</ReactMarkdown>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Contact Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Get in Touch
              </Typography>
              
              <List dense>
                {artistInfo.social?.email && (
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={artistInfo.social.email}
                      secondary="Professional inquiries"
                    />
                  </ListItem>
                )}
                
                {artistInfo.social?.website && (
                  <ListItem>
                    <ListItemIcon>
                      <Language color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Portfolio Website"
                      secondary={artistInfo.social.website}
                    />
                  </ListItem>
                )}
                
                {artistInfo.social?.instagram && (
                  <ListItem>
                    <ListItemIcon>
                      <Instagram color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Instagram"
                      secondary={artistInfo.social.instagram}
                    />
                  </ListItem>
                )}
              </List>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<Email />}
                  href={`mailto:${artistInfo.social?.email || 'contact@artist.com'}`}
                >
                  Send Message
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills & Expertise
              </Typography>
              
              {skills.map((skill, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    {skill.icon}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {skill.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        backgroundColor: 'grey.300',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${skill.level}%`,
                          height: '100%',
                          backgroundColor: 'primary.main',
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ ml: 1, minWidth: 35 }}>
                      {skill.level}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              
              {achievements.map((achievement, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {achievement.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement.title}
                      secondary={achievement.description}
                    />
                  </ListItem>
                  {index < achievements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Paper sx={{ mt: 4, p: 4, textAlign: 'center', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Ready to Bring Your Vision to Life?
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
          Let's collaborate on your next creative project. From concept to completion,
          I'll help you create something truly extraordinary.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            backgroundColor: 'white', 
            color: 'primary.main',
            '&:hover': { backgroundColor: 'grey.100' }
          }}
          href={`mailto:${artistInfo.social?.email || 'contact@artist.com'}`}
        >
          Start Your Project
        </Button>
      </Paper>
    </Container>
  );
};

export default ArtistInfo;