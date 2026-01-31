import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, BlockControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Button, Placeholder, Modal, TextareaControl, ColorPicker, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			logos,
			title,
			subtitle,
			showTitle,
			showSubtitle,
			animationSpeed,
			logoHeight,
			logoGap,
			grayscale,
			pauseOnHover,
			enableShadow,
			backgroundColor,
			backgroundOpacity,
			grayscaleOpacity,
			forceTrueGap,
			slowdownOnHover,
			slowdownRatio
		} = attributes;

		// State for SVG paste modal and expandable logo controls
		const [isSvgModalOpen, setIsSvgModalOpen] = useState(false);
		const [svgCode, setSvgCode] = useState('');
		const [expandedLogo, setExpandedLogo] = useState(null);
		const [isLivePreview, setIsLivePreview] = useState(false);

		const addLogo = (media) => {
			const newLogos = [...logos, {
				id: media.id,
				url: media.url,
				alt: media.alt || '',
				height: null, // per-logo height override
				gap: null, // per-logo gap override
				invert: false // color inversion
			}];
			setAttributes({ logos: newLogos });
		};

		const removeLogo = (index) => {
			const newLogos = logos.filter((_, i) => i !== index);
			setAttributes({ logos: newLogos });
		};

		const updateLogoAlt = (index, alt) => {
			const newLogos = [...logos];
			newLogos[index].alt = alt;
			setAttributes({ logos: newLogos });
		};

		const updateLogoHeight = (index, height) => {
			const newLogos = [...logos];
			newLogos[index].height = height;
			setAttributes({ logos: newLogos });
		};

		const updateLogoGap = (index, gap) => {
			const newLogos = [...logos];
			newLogos[index].gap = gap;
			setAttributes({ logos: newLogos });
		};

		const moveLogo = (index, direction) => {
			const newLogos = [...logos];
			if (direction === 'left' && index > 0) {
				[newLogos[index - 1], newLogos[index]] = [newLogos[index], newLogos[index - 1]];
			} else if (direction === 'right' && index < newLogos.length - 1) {
				[newLogos[index + 1], newLogos[index]] = [newLogos[index], newLogos[index + 1]];
			}
			setAttributes({ logos: newLogos });
		};

		const toggleLogoInvert = (index) => {
			const newLogos = [...logos];
			newLogos[index].invert = !newLogos[index].invert;
			setAttributes({ logos: newLogos });
		};

		const addLogoFromSVG = () => {
			if (!svgCode || !svgCode.trim().toLowerCase().includes('<svg')) {
				alert(__('Please enter valid SVG code', 'infinite-logo-slider'));
				return;
			}

			try {
				// Convert SVG to data URL
				const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgCode.trim())))}`;
				const newLogo = {
					id: `svg-${Date.now()}`,
					url: svgDataUrl,
					alt: 'SVG Logo',
					height: null,
					gap: null,
					invert: false,
					isSvg: true
				};

				setAttributes({ logos: [...logos, newLogo] });
				setSvgCode('');
				setIsSvgModalOpen(false);
			} catch (error) {
				console.error('Failed to process SVG:', error);
				alert(__('Failed to process SVG code', 'infinite-logo-slider'));
			}
		};

		// Helper to convert hex to rgba
		const hexToRgba = (hex, alpha) => {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		};

		const sliderStyle = {
			'--animation-speed': `${animationSpeed}s`,
			'--logo-height': `${logoHeight}px`,
			'--logo-gap': `${logoGap}px`,
			'--grayscale-opacity': grayscaleOpacity
		};

		const containerStyle = {
			backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
			boxShadow: enableShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
		};

		const sliderClass = [
			'logo-slider',
			pauseOnHover && !slowdownOnHover && 'pause-on-hover', // Only pause if slowdown is NOT enabled
			slowdownOnHover && 'has-slowdown-hover',
			forceTrueGap && 'force-true-gap'
		].filter(Boolean).join(' ');

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="visibility"
							label={isLivePreview ? __('Edit Mode', 'infinite-logo-slider') : __('Live Preview', 'infinite-logo-slider')}
							onClick={() => setIsLivePreview(!isLivePreview)}
							isActive={isLivePreview}
						/>
					</ToolbarGroup>
				</BlockControls>

				<InspectorControls>
					<PanelBody title={__('Content Settings', 'infinite-logo-slider')}>
						<ToggleControl
							label={__('Show Title', 'infinite-logo-slider')}
							checked={showTitle}
							onChange={(value) => setAttributes({ showTitle: value })}
						/>
						<ToggleControl
							label={__('Show Subtitle', 'infinite-logo-slider')}
							checked={showSubtitle}
							onChange={(value) => setAttributes({ showSubtitle: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Animation Settings', 'infinite-logo-slider')}>
						<RangeControl
							label={__('Animation Speed (seconds)', 'infinite-logo-slider')}
							value={animationSpeed}
							onChange={(value) => setAttributes({ animationSpeed: value })}
							min={10}
							max={300}
							step={5}
						/>
						<ToggleControl
							label={__('Pause on Hover', 'infinite-logo-slider')}
							checked={pauseOnHover}
							onChange={(value) => {
								setAttributes({ pauseOnHover: value });
								if (value) setAttributes({ slowdownOnHover: false });
							}}
							disabled={slowdownOnHover}
							help={slowdownOnHover ? __('Disabled when Slowdown on Hover is active', 'infinite-logo-slider') : ''}
						/>
						<ToggleControl
							label={__('Slowdown on Hover', 'infinite-logo-slider')}
							checked={slowdownOnHover}
							onChange={(value) => {
								setAttributes({ slowdownOnHover: value });
								if (value) setAttributes({ pauseOnHover: false });
							}}
							help={__('Smoothly slow down animation on hover', 'infinite-logo-slider')}
						/>
						{slowdownOnHover && (
							<RangeControl
								label={__('Slowdown Ratio', 'infinite-logo-slider')}
								value={slowdownRatio}
								onChange={(value) => setAttributes({ slowdownRatio: value })}
								min={0.1}
								max={0.9}
								step={0.1}
								help={__('Lower value means slower speed', 'infinite-logo-slider')}
							/>
						)}
					</PanelBody>

					<PanelBody title={__('Style Settings', 'infinite-logo-slider')}>
						<RangeControl
							label={__('Default Logo Height (px)', 'infinite-logo-slider')}
							value={logoHeight}
							onChange={(value) => setAttributes({ logoHeight: value })}
							min={40}
							max={120}
							step={10}
						/>
						<RangeControl
							label={__('Default Logo Gap (px)', 'infinite-logo-slider')}
							value={logoGap}
							onChange={(value) => setAttributes({ logoGap: value })}
							min={40}
							max={150}
							step={10}
						/>
						<ToggleControl
							label={__('Grayscale Effect', 'infinite-logo-slider')}
							checked={grayscale}
							onChange={(value) => setAttributes({ grayscale: value })}
						/>
						{grayscale && (
							<RangeControl
								label={__('Grayscale Opacity', 'infinite-logo-slider')}
								value={grayscaleOpacity}
								onChange={(value) => setAttributes({ grayscaleOpacity: value })}
								min={0}
								max={1}
								step={0.1}
								help={__('Opacity of grayscaled logos', 'infinite-logo-slider')}
							/>
						)}
						<ToggleControl
							label={__('Force True Gap', 'infinite-logo-slider')}
							checked={forceTrueGap}
							onChange={(value) => setAttributes({ forceTrueGap: value })}
							help={__('Disable minimum width for logos to ensure even spacing', 'infinite-logo-slider')}
						/>
					</PanelBody>

					<PanelBody title={__('Container Settings', 'infinite-logo-slider')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Shadow', 'infinite-logo-slider')}
							checked={enableShadow}
							onChange={(value) => setAttributes({ enableShadow: value })}
							help={__('Add shadow to the container', 'infinite-logo-slider')}
						/>

						<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '500' }}>
							{__('Background Color', 'infinite-logo-slider')}
						</p>
						<ColorPicker
							color={backgroundColor}
							onChange={(value) => setAttributes({ backgroundColor: value })}
							enableAlpha={false}
						/>

						<RangeControl
							label={__('Background Opacity', 'infinite-logo-slider')}
							value={backgroundOpacity}
							onChange={(value) => setAttributes({ backgroundOpacity: value })}
							min={0}
							max={1}
							step={0.1}
						/>
					</PanelBody>
				</InspectorControls>

				<div className="infinite-logo-slider-wrapper">
					{showTitle && (
						<RichText
							tagName="h2"
							className="infinite-logo-slider-title"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Enter title...', 'infinite-logo-slider')}
						/>
					)}

					{showSubtitle && (
						<RichText
							tagName="p"
							className="infinite-logo-slider-subtitle"
							value={subtitle}
							onChange={(value) => setAttributes({ subtitle: value })}
							placeholder={__('Enter subtitle...', 'infinite-logo-slider')}
						/>
					)}

					<div className="infinite-logo-slider-container" style={isLivePreview ? { ...sliderStyle, ...containerStyle, padding: '0', overflow: 'hidden' } : {}}>
						{isLivePreview ? (
							<div
								className={sliderClass}
								style={{ width: 'fit-content', display: 'flex' }}
								data-slowdown-ratio={slowdownOnHover ? slowdownRatio : undefined}
							>
								<div className="logo-slide">
									{logos.map((logo, index) => {
										const logoClasses = [
											'logo-item',
											grayscale && 'grayscale',
											logo.invert && 'inverted'
										].filter(Boolean).join(' ');

										const logoStyle = {
											...(logo.height && { height: `${logo.height}px` })
										};

										const gapStyle = logo.gap !== null && logo.gap !== undefined
											? { marginRight: `${logo.gap}px` }
											: {};

										const combinedStyle = { ...logoStyle, ...gapStyle };

										return (
											<div key={logo.id} className={logoClasses} style={combinedStyle}>
												<img src={logo.url} alt={logo.alt} />
											</div>
										);
									})}
								</div>
								<div className="logo-slide" aria-hidden="true">
									{logos.map((logo, index) => {
										const logoClasses = [
											'logo-item',
											grayscale && 'grayscale',
											logo.invert && 'inverted'
										].filter(Boolean).join(' ');

										const logoStyle = {
											...(logo.height && { height: `${logo.height}px` })
										};

										const gapStyle = logo.gap !== null && logo.gap !== undefined
											? { marginRight: `${logo.gap}px` }
											: {};

										const combinedStyle = { ...logoStyle, ...gapStyle };

										return (
											<div key={`${logo.id}-duplicate`} className={logoClasses} style={combinedStyle}>
												<img src={logo.url} alt={logo.alt} />
											</div>
										);
									})}
								</div>
							</div>
						) : (
							logos.length === 0 ? (
								<Placeholder
									icon="images-alt2"
									label={__('Infinite Logo Slider', 'infinite-logo-slider')}
									instructions={__('Add logos to get started', 'infinite-logo-slider')}
								>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={addLogo}
											allowedTypes={['image']}
											multiple={false}
											render={({ open }) => (
												<Button variant="primary" onClick={open}>
													{__('Add Logo', 'infinite-logo-slider')}
												</Button>
											)}
										/>
									</MediaUploadCheck>
								</Placeholder>
							) : (
								<div className="infinite-logo-slider-editor">
									<div className="logo-grid">
										{logos.map((logo, index) => {
											const isExpanded = expandedLogo === index;
											const logoStyle = {
												height: `${logo.height || logoHeight}px`,
												filter: logo.invert ? 'invert(1)' : 'none'
											};
											const isFirst = index === 0;
											const isLast = index === logos.length - 1;

											return (
												<div key={logo.id} className={`logo-item-editor ${logo.isSvg ? 'is-svg' : ''}`}>
													<div className="logo-preview">
														<img
															src={logo.url}
															alt={logo.alt}
															style={logoStyle}
														/>
														{logo.isSvg && <span className="svg-badge">SVG</span>}
														{logo.invert && <span className="invert-badge">Inverted</span>}
													</div>

													<div className="logo-controls">
														<Button
															icon="arrow-left-alt2"
															isSmall
															onClick={() => moveLogo(index, 'left')}
															disabled={isFirst}
															label={__('Move Left', 'infinite-logo-slider')}
														/>
														<Button
															icon="arrow-right-alt2"
															isSmall
															onClick={() => moveLogo(index, 'right')}
															disabled={isLast}
															label={__('Move Right', 'infinite-logo-slider')}
														/>
													</div>
													<div className="logo-controls">
														<Button
															isSmall
															onClick={() => setExpandedLogo(isExpanded ? null : index)}
															className="expand-button"
														>
															{isExpanded ? __('Hide', 'infinite-logo-slider') : __('Edit', 'infinite-logo-slider')}
														</Button>
														<Button
															isDestructive
															isSmall
															onClick={() => removeLogo(index)}
															className="remove-logo-button"
														>
															{__('Remove', 'infinite-logo-slider')}
														</Button>
													</div>

													{isExpanded && (
														<div className="logo-settings-panel">
															<RangeControl
																label={__('Height Override (px)', 'infinite-logo-slider')}
																value={logo.height || logoHeight}
																onChange={(value) => updateLogoHeight(index, value)}
																min={20}
																max={200}
																step={5}
																help={__('Override default height for this logo', 'infinite-logo-slider')}
															/>
															<RangeControl
																label={__('Gap After Logo (px)', 'infinite-logo-slider')}
																value={logo.gap !== null ? logo.gap : logoGap}
																onChange={(value) => updateLogoGap(index, value)}
																min={0}
																max={300}
																step={10}
																help={__('Spacing after this logo', 'infinite-logo-slider')}
															/>
															<ToggleControl
																label={__('Invert Colors', 'infinite-logo-slider')}
																checked={logo.invert || false}
																onChange={() => toggleLogoInvert(index)}
																help={__('Invert logo colors (useful for dark backgrounds)', 'infinite-logo-slider')}
															/>
														</div>
													)}
												</div>
											);
										})}
									</div>

									<div className="add-logo-buttons">
										<MediaUploadCheck>
											<MediaUpload
												onSelect={addLogo}
												allowedTypes={['image']}
												multiple={false}
												render={({ open }) => (
													<Button
														variant="secondary"
														onClick={open}
														className="add-logo-button"
													>
														{__('+ Add Logo', 'infinite-logo-slider')}
													</Button>
												)}
											/>
										</MediaUploadCheck>

										<Button
											variant="secondary"
											onClick={() => setIsSvgModalOpen(true)}
											className="paste-svg-button"
										>
											{__('+ Paste SVG Code', 'infinite-logo-slider')}
										</Button>
									</div>
								</div>
							)
						)}
					</div>
				</div>

				{isSvgModalOpen && (
					<Modal
						title={__('Paste SVG Code', 'infinite-logo-slider')}
						onRequestClose={() => {
							setIsSvgModalOpen(false);
							setSvgCode('');
						}}
						className="svg-paste-modal"
					>
						<TextareaControl
							label={__('SVG Code', 'infinite-logo-slider')}
							value={svgCode}
							onChange={setSvgCode}
							placeholder={__('Paste your SVG code here...', 'infinite-logo-slider')}
							rows={10}
							help={__('Paste the complete SVG code, including the <svg> tags', 'infinite-logo-slider')}
						/>
						<div className="modal-buttons">
							<Button
								variant="primary"
								onClick={addLogoFromSVG}
								disabled={!svgCode.trim()}
							>
								{__('Add SVG Logo', 'infinite-logo-slider')}
							</Button>
							<Button
								variant="secondary"
								onClick={() => {
									setIsSvgModalOpen(false);
									setSvgCode('');
								}}
							>
								{__('Cancel', 'infinite-logo-slider')}
							</Button>
						</div>
					</Modal>
				)}
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			logos,
			title,
			subtitle,
			showTitle,
			showSubtitle,
			animationSpeed,
			logoHeight,
			logoGap,
			grayscale,
			pauseOnHover,
			enableShadow,
			backgroundColor,
			backgroundOpacity,
			grayscaleOpacity,
			forceTrueGap,
			slowdownOnHover,
			slowdownRatio
		} = attributes;

		if (logos.length === 0) {
			return null;
		}

		// Helper to convert hex to rgba
		const hexToRgba = (hex, alpha) => {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		};

		const sliderStyle = {
			'--animation-speed': `${animationSpeed}s`,
			'--logo-height': `${logoHeight}px`,
			'--logo-gap': `${logoGap}px`,
			'--grayscale-opacity': grayscaleOpacity
		};

		const containerStyle = {
			backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
			boxShadow: enableShadow ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
		};

		const sliderClass = [
			'logo-slider',
			pauseOnHover && !slowdownOnHover && 'pause-on-hover', // Only pause if slowdown is NOT enabled
			slowdownOnHover && 'has-slowdown-hover',
			forceTrueGap && 'force-true-gap'
		].filter(Boolean).join(' ');

		return (
			<div className="infinite-logo-slider-wrapper">
				{showTitle && title && (
					<RichText.Content tagName="h2" className="infinite-logo-slider-title" value={title} />
				)}

				{showSubtitle && subtitle && (
					<RichText.Content tagName="p" className="infinite-logo-slider-subtitle" value={subtitle} />
				)}

				<div className="logo-container" style={{ ...sliderStyle, ...containerStyle }}>
					<div
						className={sliderClass}
						data-slowdown-ratio={slowdownOnHover ? slowdownRatio : undefined}
					>
						<div className="logo-slide">
							{logos.map((logo, index) => {
								const logoClasses = [
									'logo-item',
									grayscale && 'grayscale',
									logo.invert && 'inverted'
								].filter(Boolean).join(' ');

								const logoStyle = {
									...(logo.height && { height: `${logo.height}px` })
								};

								const nextLogo = logos[index + 1];
								const gapStyle = logo.gap !== null && logo.gap !== undefined
									? { marginRight: `${logo.gap}px` }
									: {};

								const combinedStyle = { ...logoStyle, ...gapStyle };

								return (
									<div key={logo.id} className={logoClasses} style={combinedStyle}>
										<img src={logo.url} alt={logo.alt} />
									</div>
								);
							})}
						</div>
						<div className="logo-slide" aria-hidden="true">
							{logos.map((logo, index) => {
								const logoClasses = [
									'logo-item',
									grayscale && 'grayscale',
									logo.invert && 'inverted'
								].filter(Boolean).join(' ');

								const logoStyle = {
									...(logo.height && { height: `${logo.height}px` })
								};

								const gapStyle = logo.gap !== null && logo.gap !== undefined
									? { marginRight: `${logo.gap}px` }
									: {};

								const combinedStyle = { ...logoStyle, ...gapStyle };

								return (
									<div key={`${logo.id}-duplicate`} className={logoClasses} style={combinedStyle}>
										<img src={logo.url} alt={logo.alt} />
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
});
