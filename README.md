# Infinite Logo Slider - Gutenberg Block Plugin

A professional Gutenberg block for creating infinite looping client logo carousels in WordPress.

## Features

✨ **Infinite Seamless Loop** - Smooth, continuous animation with no gaps or jumps
🎨 **Customizable Styling** - Control logo height, spacing, and grayscale effects
⚙️ **Animation Controls** - Adjustable speed and pause-on-hover functionality
📱 **Fully Responsive** - Works beautifully on all device sizes
🎯 **Easy to Use** - Simple interface for adding and managing logos
🔧 **WordPress Native** - Built with official WordPress components and best practices

## Installation

### Method 1: Upload to WordPress

1. Download or create a ZIP file of the `infinite-logo-slider` folder
2. Go to your WordPress admin panel → Plugins → Add New → Upload Plugin
3. Upload the ZIP file and click "Install Now"
4. Click "Activate Plugin"

### Method 2: Manual Installation

1. Upload the `infinite-logo-slider` folder to `/wp-content/plugins/`
2. Go to WordPress admin panel → Plugins
3. Find "Infinite Logo Slider" and click "Activate"

## Building the Plugin

Before using the plugin, you need to build it:

```bash
# Navigate to the plugin directory
cd infinite-logo-slider

# Install dependencies
npm install

# Build for production
npm run build

# OR run in development mode with hot reload
npm run start
```

## Usage

### Adding the Block

1. Edit any post or page
2. Click the (+) button to add a new block
3. Search for "Infinite Logo Slider"
4. Click to add the block

### Adding Logos

1. Click "Add Logo" button
2. Select an image from your media library or upload a new one
3. Repeat to add more logos
4. Logos will automatically loop infinitely

### Customization Options

#### Content Settings
- **Show Title** - Toggle the title on/off
- **Show Subtitle** - Toggle the subtitle on/off
- Edit title and subtitle text directly in the block

#### Animation Settings
- **Animation Speed** - Control how fast logos scroll (10-300 seconds)
- **Pause on Hover** - Enable/disable pause when hovering over logos
- **Slowdown on Hover** - Smoothly slow down animation on hover with adjustable ratio. *Mutually exclusive with Pause on Hover.*

#### Style Settings
- **Logo Height** - Adjust logo size (40-120px)
- **Logo Gap** - Control spacing between logos (40-150px)
- **Force True Gap** - Ensure exact spacing for narrow logos by removing minimum width constraints
- **Grayscale Effect** - Toggle grayscale filter (logos become colored on hover)
- **Container Shadow** - Optional shadow for the slider container
- **Background** - Customizable background color and opacity

### Live Preview
- Toggle between "Edit Mode" (grid view) and "Live Preview" (animated view) using the visibility icon in the block toolbar.
- Reorder logos using the "Move Left" and "Move Right" buttons in Edit Mode.

### Block Alignment

The block supports:
- Normal width
- Wide width
- Full width

Select these from the block toolbar.

## How It Works

The plugin creates a seamless infinite loop by:
1. Duplicating your logo set
2. Animating the container exactly 50% of its total width
3. When the animation completes, it seamlessly restarts from the beginning

This creates the illusion of an endless stream of logos.

## Customization for Developers

### CSS Custom Properties

The block uses CSS custom properties that you can override:

```css
.logo-container {
  --animation-speed: 30s;
  --logo-height: 60px;
  --logo-gap: 80px;
}
```

### Modifying Styles

You can add custom CSS in your theme to further customize:

```css
/* Change background color */
.logo-container {
  background: #f5f5f5;
}

/* Customize fade edges */
.logo-container::before,
.logo-container::after {
  width: 150px; /* Make fade wider */
}

/* Different hover effect */
.logo-item.grayscale:hover {
  filter: grayscale(0%) opacity(1) scale(1.1);
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- WordPress 6.1 or higher
- PHP 7.4 or higher
- Node.js 16+ (for building)

## File Structure

```
infinite-logo-slider/
├── src/
│   ├── block.json          # Block metadata
│   ├── index.js            # Block registration and logic
│   ├── view.js             # Frontend interaction logic (WAAPI)
│   ├── style.scss          # Frontend styles
│   └── editor.scss         # Editor styles
├── build/                  # Compiled files (generated)
├── infinite-logo-slider.php # Main plugin file
├── package.json           # npm dependencies
└── README.md             # This file
```

## Troubleshooting

### Logos not appearing
- Make sure you've built the plugin with `npm run build`
- Check that images are properly uploaded to the media library
- Verify the plugin is activated

### Animation not smooth
- Try adjusting the animation speed
- Ensure you have at least 4-6 logos for best effect
- Check browser compatibility

### Styling issues
- Clear your site cache
- Check for theme CSS conflicts
- Try rebuilding with `npm run build`

## Support

For issues, questions, or feature requests, please create an issue in the plugin repository.

## License

GPL-2.0-or-later

## Credits

Built with:
- WordPress Block Editor
- @wordpress/scripts
- React
