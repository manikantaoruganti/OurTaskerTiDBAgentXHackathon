import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (*),
        comments (*),
        task_tags (*)
      `)
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }

    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
router.post('/', [
  body('title').trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('priority').isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'inprogress', 'done'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status = 'todo', dueDate, tags } = req.body;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          priority,
          status,
          due_date: dueDate,
          user_id: req.user.userId,
          assignee: req.user.email
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create task' });
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagData = tags.map(tag => ({
        task_id: task.id,
        tag: tag.toLowerCase().trim()
      }));

      await supabase.from('task_tags').insert(tagData);
    }

    // Log activity
    await supabase.from('activities').insert([
      {
        type: 'task_created',
        description: `Created task "${title}"`,
        user_id: req.user.userId,
        task_id: task.id
      }
    ]);

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'inprogress', 'done'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const { data: task, error } = await supabase
      .from('tasks')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update task' });
    }

    // Log activity
    await supabase.from('activities').insert([
      {
        type: 'task_updated',
        description: `Updated task "${task.title}"`,
        user_id: req.user.userId,
        task_id: task.id
      }
    ]);

    res.json({ success: true, task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Add comment to task
router.post('/:id/comments', [
  body('text').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { text, mentions = [] } = req.body;

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([
        {
          task_id: id,
          text,
          author_id: req.user.userId,
          mentions: mentions
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to add comment' });
    }

    // Log activity
    await supabase.from('activities').insert([
      {
        type: 'comment_added',
        description: `Added comment to task`,
        user_id: req.user.userId,
        task_id: id
      }
    ]);

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Search tasks
router.get('/search', async (req, res) => {
  try {
    const { q, status, priority, assignee } = req.query;
    
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.userId);

    // Apply filters
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }
    if (assignee && assignee !== 'all') {
      query = query.eq('assignee', assignee);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to search tasks' });
    }

    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search tasks' });
  }
});

export default router;