import { Translate } from '@google-cloud/translate';
import textToSpeech from '@google-cloud/text-to-speech';
import { Readable } from 'stream';
import Lesson from '../models/Lesson.js';

// Initialize Google Cloud clients
const translate = new Translate();
const ttsClient = new textToSpeech.TextToSpeechClient();

// Function to translate text using Google Cloud Translation API
async function translateTextWithGoogle(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;  // Return translated text
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

// Function to generate audio using Google Cloud Text-to-Speech API
async function getAudioFromText(text, languageCode = 'en-US') {
  try {
    const request = {
      input: { text },
      voice: { languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioBuffer = response.audioContent;

    // Convert audio buffer to a base64 URL format for inline usage (or upload to cloud storage)
    const audioUrl = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;
    return audioUrl;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error(`Audio generation failed: ${error.message}`);
  }
}

// Fetch lessons and translate options as needed
export async function getLessons(req, res) {
  const { language, stage } = req.query;

  try {
    // Fetch lessons based on the stage (consider adding language as well)
    const lessons = await Lesson.find({ stage: stage });

    if (!lessons || lessons.length === 0) {
      return res.status(404).json({ message: 'No lessons found for the provided stage' });
    }

    // Translate options for each lesson and add audio URL for correct answers
    for (let lesson of lessons) {
      for (let question of lesson.questions) {
        // Translate options if the language is not English
        if (language !== 'en') {
          const translatedOptions = await Promise.all(
            question.options.map(option => translateTextWithGoogle(option, language))
          );
          question.options = translatedOptions;
        }

        if (!question.audioUrl) {
          // Generate an audio URL for the correct answer (using Google TTS)
          const audioUrl = await getAudioFromText(question.correctAnswer, language);
          question.audioUrl = audioUrl;
        }
      }
    }

    // Return lessons after translation and audio URL generation
    return res.status(200).json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}

// Create a new lesson
export async function createLesson(req, res) {
  const { title, description, language, stage, content, questions } = req.body;

  try {
    if (!title || !questions || !stage) {
      return res.status(400).json({ message: 'Title, questions, and stage are required' });
    }

    const newLesson = new Lesson({
      title,
      description,
      language,
      stage,
      content,
      questions,
    });

    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: `Failed to create lesson: ${error.message}` });
  }
}

// Fetch a lesson by ID
export async function getLessonById(req, res) {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    return res.status(200).json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}
