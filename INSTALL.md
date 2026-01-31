# Quick Installation Guide

## Step 1: Build the Plugin

Before installing, you must build the plugin files:

```bash
cd infinite-logo-slider
npm install
npm run build
```

This will create the `build/` folder with compiled files.

## Step 2: Install in WordPress

### Option A: ZIP Upload
1. Zip the entire `infinite-logo-slider` folder
2. WordPress Admin → Plugins → Add New → Upload Plugin
3. Upload ZIP and activate

### Option B: FTP/Manual
1. Upload `infinite-logo-slider` folder to `/wp-content/plugins/`
2. WordPress Admin → Plugins → Activate "Infinite Logo Slider"

## Step 3: Use the Block

1. Edit any page/post
2. Add block (+) → Search "Infinite Logo Slider"
3. Click "Add Logo" to upload images
4. Customize in the right sidebar settings

## Settings Available

**Content**
- Title and subtitle text
- Show/hide title and subtitle

**Animation**
- Speed (10-60 seconds)
- Pause on hover

**Style**
- Logo height (40-120px)
- Logo spacing (40-150px)
- Grayscale effect

## Troubleshooting

**Block not appearing?**
- Make sure you ran `npm run build`
- Check plugin is activated
- Clear WordPress cache

**Logos not showing?**
- Verify images are uploaded to media library
- Check browser console for errors
- Try different image formats (PNG, JPG, SVG)

**Need help?**
See README.md for full documentation
