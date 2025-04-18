const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

// ⚠️ CORS vorübergehend komplett offen (für Testzwecke)
app.use(cors());

app.use(express.json());

// 💬 POST-Route für Chat-Anfrage
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Nachricht fehlt im Request.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('❌ Fehler bei OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Serverfehler bei OpenAI-Anfrage.' });
  }
});

// 🟢 Test-Route für GET /
app.get('/', (req, res) => {
  res.send('✅ Backend läuft erfolgreich auf Render.');
});

// ✅ Server starten
app.listen(port, () => {
  console.log(`✅ Backend läuft auf http://localhost:${port}`);
});