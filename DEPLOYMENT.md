# 🚀 OurTasker Deployment Guide

This guide will help you deploy OurTasker to production environments.

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] Node.js 18+ installed
- [ ] Git repository set up
- [ ] Supabase project created
- [ ] AI API keys (OpenAI/Anthropic/Llama)
- [ ] Domain name (optional, for custom domains)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Wait for the project to be ready (usually 2-3 minutes)

### 2. Run Database Migrations
1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/create_initial_schema.sql`
3. Run the migration to create all tables and policies
4. Verify the tables were created in the Table Editor

### 3. Configure Authentication
1. Go to Authentication > Settings
2. Disable email confirmation for development (enable for production)
3. Configure your site URL and redirect URLs
4. Save your Supabase URL and anon key for environment variables

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and import your GitHub repository
   - Framework preset will be automatically detected as "Vite"
   - Add environment variables (see below)
   - Deploy!

3. **Environment Variables (Vercel)**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_key
   ```

### Option 2: Netlify

1. **Build Command:** `npm run build`
2. **Publish Directory:** `dist`
3. **Environment Variables:** Same as Vercel above

## ⚙️ Backend Deployment

### Option 1: Render (Recommended)

1. **Create Web Service**
   - Connect your GitHub repository
   - Choose "Node" environment
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

2. **Environment Variables (Render)**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_secure_jwt_secret
   OPENAI_API_KEY=your_openai_key
   ```

### Option 2: Railway

1. **Deploy from GitHub**
   - Connect repository
   - Railway will auto-detect Node.js
   - Add the same environment variables as above

## 🔑 Environment Variables Guide

### Frontend Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | ✅ |
| `VITE_SLACK_WEBHOOK_URL` | Slack integration webhook | ❌ |

### Backend Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (not anon key!) | ✅ |
| `JWT_SECRET` | Secret for JWT token signing | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `FRONTEND_URL` | Your frontend domain for CORS | ✅ |
| `NODE_ENV` | Set to "production" | ✅ |

## 🔒 Security Checklist

### Database Security
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] Service role key is used only on backend
- [ ] Anon key is used only on frontend
- [ ] API keys are not exposed to frontend

### API Security
- [ ] JWT secrets are secure and unique
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Input validation is implemented

### Frontend Security
- [ ] Environment variables use VITE_ prefix
- [ ] No sensitive data in localStorage
- [ ] HTTPS is enforced in production
- [ ] Content Security Policy headers set

## 📊 Monitoring & Analytics

### Recommended Monitoring Setup
1. **Supabase Dashboard** - Monitor database performance and usage
2. **Vercel Analytics** - Track frontend performance and user behavior
3. **Render Logs** - Monitor backend API performance and errors
4. **Sentry** (optional) - Error tracking and performance monitoring

### Health Checks
- Frontend: Automatic via hosting platform
- Backend: `GET /health` endpoint
- Database: Built into Supabase dashboard

## 🔧 Custom Domain Setup

### Frontend (Vercel)
1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS records as shown
4. SSL certificate will be automatically provisioned

### Backend (Render)
1. Custom domains available on paid plans
2. Update CORS configuration with new domain
3. Update frontend API URLs

## 🐛 Troubleshooting

### Common Issues

**"Cannot read properties of undefined"**
- Check that all environment variables are set correctly
- Verify Supabase connection is working

**CORS Errors**
- Ensure backend FRONTEND_URL matches your deployed frontend URL
- Check that credentials are included in requests

**Authentication Errors**
- Verify JWT_SECRET is the same across all backend instances
- Check that Supabase RLS policies are correctly configured

**AI Features Not Working**
- Confirm AI API keys are valid and have sufficient credits
- Check API rate limits and quotas

### Performance Optimization

**Frontend:**
- Enable gzip compression in hosting settings
- Configure proper caching headers
- Optimize images and use WebP format where possible

**Backend:**
- Enable connection pooling for database
- Implement proper caching strategies
- Use CDN for static assets

**Database:**
- Monitor query performance in Supabase dashboard
- Add indexes for frequently queried columns
- Optimize RLS policies for performance

## 📈 Scaling Considerations

### Database Scaling
- Supabase automatically handles scaling
- Monitor connection limits and upgrade plan if needed
- Consider read replicas for high-read workloads

### API Scaling
- Both Render and Railway provide auto-scaling
- Configure horizontal scaling rules
- Implement proper error handling and circuit breakers

### Cost Optimization
- Monitor usage in each service dashboard
- Set up billing alerts
- Optimize API calls to reduce costs

## 🎉 Post-Deployment

After successful deployment:

1. **Test All Features**
   - [ ] User registration and login
   - [ ] Task creation and management
   - [ ] AI assistant functionality
   - [ ] Search and filtering
   - [ ] Responsive design on mobile

2. **Update Documentation**
   - [ ] Update README with live demo links
   - [ ] Document any deployment-specific configurations
   - [ ] Create user guide if needed

3. **Share Your Project**
   - [ ] Update GitHub repository with deployment URLs
   - [ ] Add screenshots and demo GIFs
   - [ ] Share on social media or hackathon platforms

## 🔗 Quick Links

- **Frontend Demo:** https://your-app.vercel.app
- **Backend API:** https://your-api.render.com/health
- **Database:** https://your-project.supabase.co
- **GitHub Repo:** https://github.com/username/ourtasker

---

**Congratulations! 🎉 Your OurTasker deployment is complete!**

For support or questions, please open an issue on GitHub or contact the development team.