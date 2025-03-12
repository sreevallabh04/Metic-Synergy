# Metic Synergy - Deployment Guide

This guide provides instructions for deploying both the frontend and backend components of the Metic Synergy application to production environments.

## Project Structure

The project consists of two main components:

- **Frontend**: React/TypeScript application built with Vite
- **Backend**: Express.js API with MongoDB integration

## Prerequisites

- Node.js (v16+)
- MongoDB account/instance
- Hosting environment for frontend and backend (e.g., Vercel, Netlify, Heroku, AWS, etc.)

## Environment Configuration

### Frontend Configuration

1. Create a production environment file:

```bash
cd frontend
cp .env.example .env.production
```

2. Edit `.env.production` with your production values:

```
VITE_API_URL=https://your-production-api-url.com
VITE_BASE_URL=/  # Use '/' for root path or '/app-name' if deployed to a subfolder
```

### Backend Configuration

1. Create a production environment file:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your production values:

```
PORT=5000  # Or any port your host supports
MONGODB_URI=your-production-mongodb-connection-string
CORS_ORIGINS=https://your-production-frontend-url.com
```

## Building for Production

### Frontend Build

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` directory with optimized production assets.

### Backend Preparation

```bash
cd backend
npm install
```

## Deployment Options

### Frontend Deployment

#### Option 1: Vercel/Netlify

1. Connect your GitHub repository
2. Set the build command to: `cd frontend && npm install && npm run build`
3. Set the publish directory to: `frontend/dist`
4. Configure environment variables in the hosting platform's dashboard

#### Option 2: Traditional Hosting

1. Upload the contents of `frontend/dist` to your web server
2. Configure your web server to serve the application correctly:
   - Serve `index.html` for all routes (for SPA routing)
   - Set appropriate cache headers for static assets

### Backend Deployment

#### Option 1: Heroku

1. Create a `Procfile` in the `backend` directory:
   ```
   web: node index.js
   ```
2. Deploy using the Heroku CLI or GitHub integration
3. Set environment variables in Heroku dashboard

#### Option 2: Digital Ocean/AWS/Other VPS

1. Set up a Node.js environment
2. Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start index.js --name "metic-api"
   ```
3. Configure Nginx as a reverse proxy (recommended)

## Post-Deployment Verification

1. Visit your frontend URL and ensure the UI loads correctly
2. Test the booking functionality to verify backend communication
3. Check server logs for any errors or issues

## Continuous Deployment

For automated deployments:

1. Set up CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
2. Configure build and deployment steps
3. Include environment variable handling
4. Add automated tests to verify deployments

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGINS` in backend includes the exact frontend URL
2. **API Connection Failures**: Verify `VITE_API_URL` is correct and backend is running
3. **MongoDB Connection Issues**: Check network access rules for your MongoDB instance

### Logs

- Frontend: Check browser console for client-side errors
- Backend: Check server logs via your hosting platform or PM2 logs

## Maintenance

1. Regularly update dependencies for security
2. Monitor server resources and scale as needed
3. Back up MongoDB data regularly

---

For additional support or questions, please contact the development team.