import { chromium } from '@playwright/test';
import { AuthHelper } from '../src/helpers/auth';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setupAuth() {
  const username = process.env.userName || 'chessTester1122';
  const password = process.env.password || 'Pass1234!';
  const storageStatePath = path.resolve(__dirname, '../auth-state.json');

  console.log('Setting up authentication state...');
  console.log(`Username: ${username}`);
  console.log(`Storage state will be saved to: ${storageStatePath}`);

  const browser = await chromium.launch({ headless: false }); // Use headless: false to see the process
  const context = await browser.newContext({
    baseURL: process.env.baseUrl || 'https://www.chess.com'
  });
  const page = await context.newPage();
  
  const authHelper = new AuthHelper(page);
  
  try {
    await authHelper.loginAndSaveState(username, password, storageStatePath);
    console.log('✅ Authentication state setup complete!');
  } catch (error) {
    console.error('❌ Failed to setup authentication state:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

setupAuth();
