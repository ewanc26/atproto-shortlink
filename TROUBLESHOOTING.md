# Troubleshooting Guide

## Common Issues and Solutions

### 1. "ATPROTO_DID not configured" Error

**Symptoms:**

- Homepage shows a red error message
- Service won't start or shows configuration error

**Solution:**

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your DID: `ATPROTO_DID=did:plc:your-did-here`
3. Find your DID at [pdsls.dev](https://pdsls.dev/)
4. Run `npm run test:config` to verify
5. Restart the server with `npm run dev`

### 2. "Failed to fetch Linkat data" Error

**Symptoms:**

- Service starts but shows 0 links
- Error in console about failed fetch

**Possible Causes & Solutions:**

**A. No Linkat Board**

- Visit [linkat.blue](https://linkat.blue)
- Create a board
- Add some links
- Wait a few seconds for data to propagate

**B. PDS Connection Issues**

- Check your internet connection
- Verify your DID is correct with `npm run test:config`
- Try again in a few minutes (PDS might be temporarily down)

**C. Invalid DID Format**

- DID must start with `did:plc:` or `did:web:`
- No spaces or special characters
- Run `npm run test:config` to validate

### 3. Short Links Not Working (404)

**Symptoms:**

- Homepage shows links but accessing them gives 404
- Shortcode appears but doesn't redirect

**Possible Causes:**

**A. Cache Issue**

- Links are cached for 5 minutes
- If you just added/changed links, wait 5 minutes
- Or restart the server to clear cache

**B. Shortcode Conflict**

- Two links can't have the same first word
- Example: "blog My Blog" and "blog Tech Blog" will conflict
- Make first words unique: "blog" and "tech"

**C. Special Characters**

- Shortcodes are lowercase only
- Access `/github` not `/GitHub`
- Spaces and special chars are removed

### 4. Slow Redirects

**Symptoms:**

- First redirect after server start is slow
- Subsequent redirects are fast

**Explanation:**

- First request fetches from AT Protocol (takes ~1-2 seconds)
- Data is then cached for 5 minutes
- This is normal behavior

**To Improve:**

- Consider pre-warming cache on server start
- Use a CDN or edge function for faster global access

### 5. Port Already in Use

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:**

1. Find what's using port 5173: `lsof -i :5173` (Mac/Linux) or `netstat -ano | findstr :5173` (Windows)
2. Kill that process
3. Or change the port: `npm run dev -- --port 3000`

### 6. Module Not Found Errors

**Symptoms:**

```
Cannot find module '@atproto/api'
```

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 7. TypeScript Errors

**Symptoms:**

- Red squiggly lines in VS Code
- Type errors when running `npm run check`

**Solution:**

```bash
# Sync SvelteKit types
npx svelte-kit sync

# Or run the full check
npm run check
```

## Debugging Tips

### Enable Verbose Logging

The service logs important events. Check your terminal for:

- `[Linkat]` - Data fetching operations
- `[Redirect]` - Redirect attempts
- `[API]` - API endpoint calls

### Test Your Configuration

Always run this first when having issues:

```bash
npm run test:config
```

This will tell you exactly what's wrong!

### Check the API

Visit `http://localhost:5173/api/links` to see the JSON response:

- Check if links are being fetched
- Verify shortcodes are correct
- See what data is available

### Verify Your Linkat Board

1. Visit [linkat.blue](https://linkat.blue)
2. Check your board has links
3. Verify link titles are formatted correctly
4. First word before space = shortcode

### Common Link Title Mistakes

❌ **Wrong:**

- `MyGitHub` (no space, shortcode will be "mygithub")
- `"GitHub"` (will be "github" but might want just "gh")
- `` (empty title)

✅ **Right:**

- `"gh GitHub Profile"` (shortcode: "gh")
- `"blog My Blog"` (shortcode: "blog")
- `"cv Resume"` (shortcode: "cv")

## Still Having Issues?

1. **Check the README**: Most setup instructions are there
2. **Run test:config**: `npm run test:config`
3. **Check Console Logs**: Look for error messages
4. **Verify Linkat Board**: Visit linkat.blue and check your board
5. **Try the API Directly**: `curl http://localhost:5173/api/links`

## Getting Help

If you're still stuck:

1. Make sure you're using Node.js 18 or higher: `node --version`
2. Try the test config: `npm run test:config`
3. Check if your DID works at [pdsls.dev](https://pdsls.dev/)
4. Verify your Linkat board at [linkat.blue](https://linkat.blue)

## Quick Reference

```bash
# Test configuration
npm run test:config

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check types
npm run check

# Format code
npm run format
```
