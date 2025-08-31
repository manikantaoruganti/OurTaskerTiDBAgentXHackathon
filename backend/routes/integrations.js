import express from 'express';
import axios from 'axios';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Send Slack notification
router.post('/slack/notify', async (req, res) => {
  try {
    const { webhook, message, taskTitle } = req.body;

    if (!webhook) {
      return res.status(400).json({ error: 'Slack webhook URL required' });
    }

    const slackMessage = {
      text: `🎯 OurTasker Update`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Task Update:* ${taskTitle}\n${message}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `From: ${req.user.email} | Time: ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    await axios.post(webhook, slackMessage);

    res.json({ success: true, message: 'Slack notification sent' });
  } catch (error) {
    console.error('Slack integration error:', error);
    res.status(500).json({ error: 'Failed to send Slack notification' });
  }
});

// Google Sheets integration
router.post('/sheets/log-task', async (req, res) => {
  try {
    const { sheetId, task } = req.body;

    if (!sheetId) {
      return res.status(400).json({ error: 'Google Sheets ID required' });
    }

    // Mock Google Sheets API call
    // In real implementation, use Google Sheets API with proper authentication
    const mockResponse = {
      spreadsheetId: sheetId,
      updates: {
        updatedRows: 1,
        updatedColumns: 5,
        updatedCells: 5
      }
    };

    res.json({ 
      success: true, 
      message: 'Task logged to Google Sheets',
      data: mockResponse 
    });
  } catch (error) {
    console.error('Google Sheets integration error:', error);
    res.status(500).json({ error: 'Failed to log task to Google Sheets' });
  }
});

// Test integration endpoint
router.post('/test/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const { config } = req.body;

    switch (service) {
      case 'slack':
        if (!config.webhook) {
          return res.status(400).json({ error: 'Webhook URL required' });
        }

        const testMessage = {
          text: '🎯 OurTasker Integration Test',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Integration Test Successful!*\nYour OurTasker notifications are now connected to this Slack channel.'
              }
            }
          ]
        };

        await axios.post(config.webhook, testMessage);
        break;

      case 'sheets':
        // Mock Google Sheets test
        if (!config.sheetId) {
          return res.status(400).json({ error: 'Sheet ID required' });
        }
        break;

      default:
        return res.status(400).json({ error: 'Unknown service' });
    }

    res.json({ 
      success: true, 
      message: `${service} integration test successful` 
    });
  } catch (error) {
    console.error(`${req.params.service} test error:`, error);
    res.status(500).json({ error: `Failed to test ${req.params.service} integration` });
  }
});

export default router;