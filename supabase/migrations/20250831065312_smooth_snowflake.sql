/*
  #  OurTasker Database Schema

  1. New Tables
    - `users` - User profiles and authentication
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `password_hash` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tasks` - Main task entities
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `status` (enum: todo, inprogress, done)
      - `priority` (enum: low, medium, high)
      - `due_date` (timestamptz, optional)
      - `assignee` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `subtasks` - Task breakdown and progress tracking
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `title` (text)
      - `completed` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `comments` - Team collaboration and communication
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `text` (text)
      - `mentions` (text array, optional)
      - `created_at` (timestamptz)
    
    - `task_tags` - Task categorization and filtering
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `tag` (text)
      - `created_at` (timestamptz)
    
    - `activities` - Audit trail and activity logging
      - `id` (uuid, primary key)
      - `type` (text)
      - `description` (text)
      - `user_id` (uuid, foreign key)
      - `task_id` (uuid, foreign key, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure data isolation between users

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for search and filtering operations
*/

-- Create custom types
CREATE TYPE task_status AS ENUM ('todo', 'inprogress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE activity_type AS ENUM ('task_created', 'task_updated', 'task_completed', 'comment_added', 'ai_suggestion');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  due_date timestamptz,
  assignee text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text text NOT NULL,
  mentions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Task tags table
CREATE TABLE IF NOT EXISTS task_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, tag)
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type activity_type NOT NULL,
  description text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for subtasks
CREATE POLICY "Users can manage subtasks of own tasks"
  ON subtasks
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = subtasks.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- RLS Policies for comments
CREATE POLICY "Users can manage comments on own tasks"
  ON comments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = comments.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- RLS Policies for task_tags
CREATE POLICY "Users can manage tags on own tasks"
  ON task_tags
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = task_tags.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- RLS Policies for activities
CREATE POLICY "Users can read own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data for demonstration
INSERT INTO users (id, email, name, password_hash, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'demo@ourtasker.com', 'Demo User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeYHAOz4N7r1Pz1K2', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo@ourtasker.com'),
  ('550e8400-e29b-41d4-a716-446655440001', 'john@ourtasker.com', 'John Doe', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeYHAOz4N7r1Pz1K2', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john@ourtasker.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, due_date, assignee, user_id) VALUES
  ('450e8400-e29b-41d4-a716-446655440000', 'Design landing page mockups', 'Create wireframes and high-fidelity designs for the homepage', 'inprogress', 'high', '2025-01-25', 'John Doe', '550e8400-e29b-41d4-a716-446655440000'),
  ('450e8400-e29b-41d4-a716-446655440001', 'Set up database schema', 'Configure database tables for users, tasks, and comments', 'todo', 'medium', '2025-01-26', 'Demo User', '550e8400-e29b-41d4-a716-446655440000'),
  ('450e8400-e29b-41d4-a716-446655440002', 'Implement AI task suggestions', 'Integrate with AI API to provide intelligent task recommendations', 'done', 'high', NULL, 'Sarah Wilson', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert sample subtasks
INSERT INTO subtasks (task_id, title, completed) VALUES
  ('450e8400-e29b-41d4-a716-446655440000', 'Create wireframes', true),
  ('450e8400-e29b-41d4-a716-446655440000', 'Design hero section', false),
  ('450e8400-e29b-41d4-a716-446655440002', 'Research AI APIs', true),
  ('450e8400-e29b-41d4-a716-446655440002', 'Build prompt templates', true)
ON CONFLICT DO NOTHING;

-- Insert sample task tags
INSERT INTO task_tags (task_id, tag) VALUES
  ('450e8400-e29b-41d4-a716-446655440000', 'design'),
  ('450e8400-e29b-41d4-a716-446655440000', 'frontend'),
  ('450e8400-e29b-41d4-a716-446655440000', 'urgent'),
  ('450e8400-e29b-41d4-a716-446655440001', 'backend'),
  ('450e8400-e29b-41d4-a716-446655440001', 'database'),
  ('450e8400-e29b-41d4-a716-446655440002', 'ai'),
  ('450e8400-e29b-41d4-a716-446655440002', 'backend'),
  ('450e8400-e29b-41d4-a716-446655440002', 'feature')
ON CONFLICT (task_id, tag) DO NOTHING;
