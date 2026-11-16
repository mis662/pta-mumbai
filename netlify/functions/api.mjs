// Runs the PTA Mumbai Express API as a Netlify Function (all /api/* requests).
import serverless from 'serverless-http';
import app from '../../server/app.js';

export const handler = serverless(app);
