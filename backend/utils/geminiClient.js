import { create } from 'axios';
require('dotenv').config();

const geminiClient = create({
   baseURL: 'https://api.gemini.example.com',
   headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` }
});

export default geminiClient;
