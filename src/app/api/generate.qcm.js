import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { pdfPath, prompt } = req.body;

    // Define the path to the Python script
    const scriptPath = path.resolve('./scripts/generate_qcm.py');

    // Spawn a child process to run the Python script
    const python = spawn('python', [scriptPath, pdfPath, prompt]);

    let result = '';
    let error = '';

    // Capture output from the script
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture errors from the script
    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle the script's close event
    python.on('close', (code) => {
      if (code === 0) {
        try {
          // Send JSON response back to the client
          res.status(200).json(JSON.parse(result));
        } catch (err) {
          res.status(500).json({ error: 'Invalid JSON output from Python script.' });
        }
      } else {
        res.status(500).json({ error: error || 'Python script execution failed.' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
