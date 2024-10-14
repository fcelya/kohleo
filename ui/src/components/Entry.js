import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PlayArrow } from '@mui/icons-material';

const Entry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, updateEntry } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [entryMessages, setEntryMessages] = useState([]);
  const [entryTitle, setEntryTitle] = useState('');

  useEffect(() => {
    const entry = entries.find(e => e.id === parseInt(id));
    if (entry) {
      setEntryMessages(JSON.parse(entry.content));
      setEntryTitle(entry.title);
    } else {
      navigate('/main');
    }
  }, [id, entries, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    updateEntry(parseInt(id), { content: JSON.stringify(entryMessages), title: entryTitle });
  };

  const handleAddContent = () => {
    navigate(`/content/${id}`);
  };

  const handleBack = () => {
    navigate('/main');
  };

  const handlePlayVoice = (base64Audio) => {
    const audioBlob = base64ToBlob(base64Audio);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
          {isEditing ? (
            <TextField
              fullWidth
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
            />
          ) : (
            entryTitle
          )}
        </Typography>
      </Box>
      {isEditing ? (
        <>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={JSON.stringify(entryMessages, null, 2)}
            onChange={(e) => setEntryMessages(JSON.parse(e.target.value))}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
            Save
          </Button>
        </>
      ) : (
        <>
          <List sx={{ mb: 2 }}>
            {entryMessages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText primary={message.type === 'text' ? message.content : 'Voice Note'} />
                {message.type === 'voice' && (
                  <IconButton onClick={() => handlePlayVoice(message.content)}>
                    <PlayArrow />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 1 }}>
            Edit
          </Button>
        </>
      )}
      <Button variant="contained" color="secondary" onClick={handleAddContent}>
        Add Content
      </Button>
    </Container>
  );
};

export default Entry;
