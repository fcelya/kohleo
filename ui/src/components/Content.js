import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { Mic, Send, PlayArrow, Delete, Stop, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const Content = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  const { addEntry, updateEntry, entries } = useAppContext();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (id) {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setMessages(entry.content ? JSON.parse(entry.content) : []);
      }
    }
  }, [id, entries]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { type: 'text', content: inputText.trim() }]);
      setInputText('');
    }
  };

  const handleRecordVoice = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const base64 = await blobToBase64(audioBlob);
          setMessages([...messages, { type: 'voice', content: base64 }]);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
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

  const handlePlayVoice = (base64Audio) => {
    const audioBlob = base64ToBlob(base64Audio);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleDeleteMessage = (index) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages);
  };

  const handleComposeEntry = () => {
    const composedContent = JSON.stringify(messages);
    if (id) {
      updateEntry(id, { content: composedContent });
      navigate('/main');
    } else {
      const newEntry = {
        id: Date.now().toString(),
        title: `Entry ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        content: composedContent
      };
      addEntry(newEntry);
      navigate('/main');
    }
  };

  const handleBack = () => {
    navigate('/main');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
          {id ? 'Edit Entry' : 'New Entry'}
        </Typography>
      </Box>
      <List sx={{ mb: 2, maxHeight: 400, overflow: 'auto' }}>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText primary={message.type === 'text' ? message.content : 'Voice Note'} />
            {message.type === 'voice' && (
              <IconButton onClick={() => handlePlayVoice(message.content)}>
                <PlayArrow />
              </IconButton>
            )}
            <IconButton onClick={() => handleDeleteMessage(index)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type a message"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        startIcon={<Send />}
        sx={{ mr: 1 }}
      >
        Send
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleRecordVoice}
        startIcon={isRecording ? <Stop /> : <Mic />}
        sx={{ mr: 1 }}
      >
        {isRecording ? 'Stop Recording' : 'Record'}
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleComposeEntry}
      >
        {id ? 'Update Entry' : 'Compose Entry'}
      </Button>
    </Container>
  );
};

export default Content;
