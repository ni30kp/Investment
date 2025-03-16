# Troubleshooting Guide for InvestWelth

This guide addresses common issues you might encounter when setting up or running the InvestWelth application.

## Setup Issues

### Database Connection Issues

**Problem**: Unable to connect to the database or errors related to database connection.

**Solutions**:
1. Check that your Supabase credentials in the `.env` files are correct.
2. Ensure your Supabase project is running and accessible.
3. Verify that your IP address is allowed in Supabase's access control settings.
4. Try running the following command to test the connection:
   ```
   cd Invest-backend
   node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY); console.log('Connection successful');"
   ```

### Port Conflicts

**Problem**: The backend or frontend server fails to start due to port conflicts.

**Solutions**:
1. Check if another process is using port 5001 (backend) or 3000 (frontend):
   ```
   lsof -i :5001
   lsof -i :3000
   ```
2. Stop the conflicting process or change the port in the `.env` file:
   - For backend: Update `PORT=5001` in `Invest-backend/.env`
   - For frontend: Create a `.env.local` file in `Invest-frontend/` with `PORT=3001`

### Dependency Installation Failures

**Problem**: `npm install` fails with errors.

**Solutions**:
1. Clear npm cache and try again:
   ```
   npm cache clean --force
   npm install
   ```
2. Check your Node.js version (should be v18 or higher):
   ```
   node -v
   ```
3. Try using a specific Node.js version with nvm:
   ```
   nvm use 18
   npm install
   ```

## Runtime Issues

### API Endpoint Not Found

**Problem**: Frontend shows "API endpoint not found" or similar errors.

**Solutions**:
1. Ensure the backend server is running.
2. Check that the `NEXT_PUBLIC_API_URL` in `Invest-frontend/.env` points to the correct backend URL.
3. Verify the API endpoint exists in the backend routes.
4. Check the browser console for CORS errors.

### Authentication Issues

**Problem**: Unable to authenticate or access protected routes.

**Solutions**:
1. Check that your Supabase credentials are correct.
2. Ensure the user exists in your Supabase database.
3. Clear browser cookies and local storage, then try again.
4. Check if your Supabase JWT token is valid and not expired.

### Data Not Loading

**Problem**: Charts or data tables are empty or not loading.

**Solutions**:
1. Check the browser console for errors.
2. Verify that the database has been initialized with sample data.
3. Run the database initialization script again:
   ```
   cd Invest-backend
   ./scripts/run-db-init.sh
   ```
4. Check the API responses using a tool like Postman or curl:
   ```
   curl http://localhost:5001/api/portfolio
   ```

## Database Issues

### Missing Tables or Data

**Problem**: Database tables are missing or contain no data.

**Solutions**:
1. Run the database initialization script:
   ```
   cd Invest-backend
   ./scripts/run-db-init.sh
   ```
2. Alternatively, manually run the SQL scripts in the Supabase SQL Editor:
   - `scripts/schema.sql`
   - `scripts/sample-data.sql`
   - `scripts/monthly-performance-data.sql`
   - `scripts/daily-performance-data.sql`

### Database Schema Errors

**Problem**: Errors related to database schema or constraints.

**Solutions**:
1. Check if your database schema matches the expected schema.
2. Run the schema creation script again:
   ```
   cd Invest-backend
   psql -U your_username -d your_database -f scripts/schema.sql
   ```
   Or use the Supabase SQL Editor to run the script.

## Frontend Issues

### Styling Issues

**Problem**: UI elements appear unstyled or incorrectly styled.

**Solutions**:
1. Make sure Tailwind CSS is properly installed and configured.
2. Check if the build process is generating the CSS correctly.
3. Try rebuilding the frontend:
   ```
   cd Invest-frontend
   npm run build
   npm run dev
   ```

### Chart Rendering Issues

**Problem**: Charts are not rendering correctly.

**Solutions**:
1. Check if Chart.js and react-chartjs-2 are properly installed.
2. Verify that the data format matches what the chart components expect.
3. Check the browser console for errors related to chart rendering.
4. Try using a simpler dataset to isolate the issue.

## Backend Issues

### API Performance Issues

**Problem**: API endpoints are slow to respond.

**Solutions**:
1. Check your database query performance.
2. Consider adding indexes to frequently queried columns.
3. Implement caching for frequently accessed data.
4. Check for memory leaks or high CPU usage in the backend process.

### Server Crashes

**Problem**: Backend server crashes unexpectedly.

**Solutions**:
1. Check the server logs for error messages.
2. Increase the Node.js memory limit if needed:
   ```
   NODE_OPTIONS=--max_old_space_size=4096 npm start
   ```
3. Implement proper error handling in your API routes.
4. Consider using a process manager like PM2 for production deployments.

## Getting Additional Help

If you're still experiencing issues after trying these solutions, please:

1. Check the GitHub issues to see if your problem has been reported.
2. Create a new issue with detailed information about your problem, including:
   - Error messages
   - Steps to reproduce
   - Environment details (OS, Node.js version, etc.)
   - Logs (if available)

For urgent issues or questions, contact the maintainers directly at support@investwelth.com. 