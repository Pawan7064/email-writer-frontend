
// import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
// import './App.css'
// import { useState } from 'react'

// function App() {
//   const [emailContent, setEmailContent] = useState('');
//   const [tone, setTone] = useState('');
//     const [loading, setLoading] = useState(false);
//   const handleSubmit= async () => {

//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }} >
//       <Typography variant='h3' component="h1" gutterBottom>
//         Email Repy Generator
//       </Typography>

//       <Box sx={{ mx: 3 }}>
//         <TextField
//           fullWidth
//           multiline
//           rows={6}
//           variant='outlined'
//           label="original Email Content"
//           value={emailContent || ''}
//           onChange={(e) => setEmailConent(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         {/* DROPDOWN TONE */}
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel  >Tone(Optional)</InputLabel>
//           <Select

//             value={tone || ''}
//             label="Tone (Optional)"
//             onChange={(e) => setTone(e.target.value)}

//           >
//             <MenuItem value="None">None</MenuItem>

//             <MenuItem value="Professional">Professional</MenuItem>
//             <MenuItem value="Casual">Casual</MenuItem>
//             <MenuItem value="friendly">Friendly</MenuItem>

//           </Select>
//         </FormControl>

         
//         <Button variant="contained"
//         onClick={handleSubmit}
//           disabled={!emailContent || loading}>
//          {loading ? <CircularProgress size={24}/>:"Generate Reply"}
//         </Button>
//       </Box>
//     </Container>
//   )
// }

// export default App

import { 
  Box, CircularProgress, Container, FormControl, 
  InputLabel, MenuItem, Select, TextField, Typography, Button 
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from "react";

function App() {

  // 🌙 DARK MODE STATE
  const [darkMode, setDarkMode] = useState(false);

  // 📩 EMAIL STATES
  const [emailContent, setEmailContent] = useState('');
  const [tone , setTone]=useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // 🌙 Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // 🎨 CUSTOM THEME (BLACK DARK MODE 🔥)
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode && {
        background: {
          default: "#000000",   // pure black
          paper: "#121212"
        }
      })
    }
  });

  // 🚀 API CALL
  const handleSubmit = async () => {
    setLoading(true);
    try{
      const response = await axios.post(
        "http://localhost:8080/api/email/generate", // ⚠️ change after deploy
        { emailContent, tone }
      );

      setGeneratedReply(
        typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data)
      );

    } catch(error){
      console.error(error);
    } finally{
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh'
        }}
      >

        {/* 🌙 TOGGLE BUTTON */}
        <Button 
          variant="outlined"
          onClick={toggleTheme} 
          sx={{ mb: 2 }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>

        <Typography variant='h3' gutterBottom>
          Email Reply Generator
        </Typography>

        {/* INPUT BOX */}
        <Box 
          sx={{ 
            mx: 3, 
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 2 
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!emailContent || loading}
          >
            {loading ? <CircularProgress size={24}/> : "Generate Reply"}
          </Button>
        </Box>

        {/* OUTPUT BOX */}
        <Box 
          sx={{ 
            mx: 3, 
            mt: 3,
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 2 
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={6}
            value={generatedReply || ''}
            inputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <Button 
            variant='outlined'
            fullWidth
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>
        </Box>

      </Container>
    </ThemeProvider>
  );
}

export default App;