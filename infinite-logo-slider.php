<?php
/**
 * Plugin Name:       Infinite Logo Slider
 * Description:       A Gutenberg block for creating an infinite looping client logo row
 * Version:           1.0.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            Your Name
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       infinite-logo-slider
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register the block
 */
function infinite_logo_slider_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'infinite_logo_slider_block_init' );
