# Image Upload Troubleshooting Guide

## Issue: 400 Bad Request on Image Load

If you see errors like:
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Cover image failed to load: https://cool-sparrow-448.convex.cloud/api/storage/...
```

### Root Cause
The storage ID in the database points to a file that doesn't exist or is corrupted in Convex storage.

### Fixes Applied

1. **Automatic Cleanup**: The app now automatically clears invalid storage IDs when images fail to load
2. **Better Validation**: Upload process now validates files before and after upload
3. **Error Handling**: Improved error messages and graceful fallbacks

### To Clear Current Invalid Images

#### Option 1: Through the UI (Recommended)
1. Go to your profile page
2. If you see the error toast, the invalid storage ID will be automatically cleared
3. Upload a new image

#### Option 2: Manual Database Cleanup
If the automatic cleanup doesn't work, you can manually clear the storage IDs:

1. Open Convex Dashboard: https://dashboard.convex.dev/
2. Navigate to your project: `pilisandara`
3. Go to "Data" tab
4. Find the `profiles` table
5. Locate your user profile (by userId)
6. Edit the document and remove/clear these fields:
   - `avatarFileId`
   - `coverFileId`
7. Save the changes

#### Option 3: Using Prisma Studio (if using Prisma)
```bash
npx prisma studio
```
Then find and update your profile record.

### Prevention

The following validations are now in place:
- ✅ File type validation (must be image/*)
- ✅ File size validation (max 5MB)
- ✅ Upload URL validation
- ✅ Storage ID validation after upload
- ✅ URL existence check before saving to database
- ✅ Automatic cleanup of invalid storage IDs on error

### Testing Your Fix

1. Try uploading a new avatar:
   - Should validate file type and size
   - Should show success message if upload works
   - Should show specific error if upload fails

2. Try uploading a new cover:
   - Same validations apply
   - Errors will be specific and actionable

3. If old invalid images exist:
   - They will be automatically cleared when Next.js tries to render them
   - You'll see a toast notification
   - You can then upload new images

### Common Issues

**Issue**: "File not found in storage"
- **Cause**: The upload partially succeeded but file wasn't saved in Convex
- **Fix**: Try uploading again with a different image

**Issue**: "Profile not found"
- **Cause**: Your user profile hasn't been created yet
- **Fix**: The app will automatically create it on next upload

**Issue**: Images still showing 400 errors
- **Cause**: Invalid storage IDs still in database
- **Fix**: Use Option 2 (Manual Database Cleanup) above

### Need More Help?

Check Convex logs:
1. Go to https://dashboard.convex.dev/
2. Select your project
3. Check the "Logs" tab for detailed error messages
