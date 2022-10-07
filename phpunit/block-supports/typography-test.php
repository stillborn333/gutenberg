<?php
/**
 * Tests the typography block supports.
 *
 * @package Gutenberg
 */
class WP_Block_Supports_Typography_Test extends WP_UnitTestCase {
	/**
	 * Stores the current test block name.
	 *
	 * @var string|null
	 */
	private $test_block_name;

	/**
	 * Stores the current test theme root.
	 *
	 * @var string|null
	 */
	private $theme_root;

	/**
	 * Caches the original theme directory global value in order
	 * to restore it in tear down.
	 *
	 * @var string|null
	 */
	private $orig_theme_dir;

	/**
	 * Sets up tests.
	 */
	public function set_up() {
		parent::set_up();

		$this->test_block_name = null;

		// Sets up the `wp-content/themes/` directory to ensure consistency when running tests.
		$this->theme_root                = realpath( __DIR__ . '/../data/themedir1' );
		$this->orig_theme_dir            = $GLOBALS['wp_theme_directories'];
		$GLOBALS['wp_theme_directories'] = array( WP_CONTENT_DIR . '/themes', $this->theme_root );

		$theme_root_callback = function () {
			return $this->theme_root;
		};
		add_filter( 'theme_root', $theme_root_callback );
		add_filter( 'stylesheet_root', $theme_root_callback );
		add_filter( 'template_root', $theme_root_callback );

		// Clear caches.
		wp_clean_themes_cache();
		unset( $GLOBALS['wp_themes'] );
	}

	/**
	 * Tears down tests.
	 */
	public function tear_down() {
		// Restores the original theme directory setup.
		$GLOBALS['wp_theme_directories'] = $this->orig_theme_dir;
		wp_clean_themes_cache();
		unset( $GLOBALS['wp_themes'] );

		// Resets test block name.
		unregister_block_type( $this->test_block_name );
		$this->test_block_name = null;

		parent::tear_down();
	}

	/**
	 * Tests whether slugs with numbers are kebab cased.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_kebab_case_font_size_slug_with_numbers() {
		$this->test_block_name = 'test/font-size-slug-with-numbers';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'fontSize' => array(
						'type' => 'string',
					),
				),
				'supports'    => array(
					'typography' => array(
						'fontSize' => true,
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );

		$block_atts = array( 'fontSize' => 'h1' );

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array( 'class' => 'has-h-1-font-size' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests legacy inline styles for font family.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_generate_font_family_with_legacy_inline_styles_using_a_value() {
		$this->test_block_name = 'test/font-family-with-inline-styles-using-value';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'typography' => array(
						'__experimentalFontFamily' => true,
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array( 'style' => array( 'typography' => array( 'fontFamily' => 'serif' ) ) );

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array( 'style' => 'font-family:serif;' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests skipping serialization.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_skip_serialization_for_typography_block_supports() {
		$this->test_block_name = 'test/typography-with-skipped-serialization-block-supports';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'typography' => array(
						'fontSize'                        => true,
						'lineHeight'                      => true,
						'__experimentalFontFamily'        => true,
						'__experimentalLetterSpacing'     => true,
						'__experimentalSkipSerialization' => true,
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array(
			'style' => array(
				'typography' => array(
					'fontSize'      => 'serif',
					'lineHeight'    => 'serif',
					'fontFamily'    => '22px',
					'letterSpacing' => '22px',
				),
			),
		);

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array();

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests skipping serialization of individual block supports properties.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_skip_serialization_for_letter_spacing_block_supports() {
		$this->test_block_name = 'test/letter-spacing-with-individual-skipped-serialization-block-supports';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'typography' => array(
						'__experimentalLetterSpacing'     => true,
						'__experimentalSkipSerialization' => array(
							'letterSpacing',
						),
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array( 'style' => array( 'typography' => array( 'letterSpacing' => '22px' ) ) );

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array();

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests legacy css var inline styles for font family.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_generate_css_var_for_font_family_with_legacy_inline_styles() {
		$this->test_block_name = 'test/font-family-with-inline-styles-using-css-var';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'typography' => array(
						'__experimentalFontFamily' => true,
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array( 'style' => array( 'typography' => array( 'fontFamily' => 'var:preset|font-family|h1' ) ) );

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array( 'style' => 'font-family:var(--wp--preset--font-family--h-1);' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests that a classname is generated for font family.
	 *
	 * @covers ::wp_apply_typography_support
	 */
	public function test_should_generate_classname_for_font_family() {
		$this->test_block_name = 'test/font-family-with-class';
		register_block_type(
			$this->test_block_name,
			array(
				'api_version' => 2,
				'attributes'  => array(
					'style' => array(
						'type' => 'object',
					),
				),
				'supports'    => array(
					'typography' => array(
						'__experimentalFontFamily' => true,
					),
				),
			)
		);
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $this->test_block_name );
		$block_atts = array( 'fontFamily' => 'h1' );

		$actual   = gutenberg_apply_typography_support( $block_type, $block_atts );
		$expected = array( 'class' => 'has-h-1-font-family' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests generating font size values, including fluid formulae, from fontSizes preset.
	 *
	 * @covers ::wp_get_typography_font_size_value
	 * @covers ::wp_get_typography_value_and_unit
	 * @covers ::wp_get_computed_fluid_typography_value
	 *
	 * @dataProvider data_generate_font_size_preset_fixtures
	 *
	 * @param array  $font_size_preset                     {
	 *      Required. fontSizes preset value as seen in theme.json.
	 *
	 *     @type string $name Name of the font size preset.
	 *     @type string $slug Kebab-case unique identifier for the font size preset.
	 *     @type string $size CSS font-size value, including units where applicable.
	 * }
	 * @param bool   $should_use_fluid_typography An override to switch fluid typography "on". Can be used for unit testing.
	 * @param string $expected_output Expected output of gutenberg_get_typography_font_size_value().
	 */
	public function test_gutenberg_get_typography_font_size_value( $font_size_preset, $should_use_fluid_typography, $expected_output ) {
		$actual = gutenberg_get_typography_font_size_value( $font_size_preset, $should_use_fluid_typography );

		$this->assertSame( $expected_output, $actual );
	}

	/**
	 * Data provider for test_wp_get_typography_font_size_value.
	 *
	 * @return array
	 */
	public function data_generate_font_size_preset_fixtures() {
		return array(
			'default_return_value'                        => array(
				'font_size_preset'            => array(
					'size' => '28px',
				),
				'should_use_fluid_typography' => false,
				'expected_output'             => '28px',
			),

			'default_return_value_when_fluid_is_false'    => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => false,
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => '28px',
			),

			'return_fluid_value'                          => array(
				'font_size_preset'            => array(
					'size' => '1.75rem',
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(1.3125rem, 1.3125rem + ((1vw - 0.48rem) * 2.524), 2.625rem)',
			),

			'return_default_fluid_values_with_empty_fluid_array' => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => array(),
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(21px, 1.3125rem + ((1vw - 7.68px) * 2.524), 42px)',
			),

			'return_default_fluid_values_with_null_value' => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => null,
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(21px, 1.3125rem + ((1vw - 7.68px) * 2.524), 42px)',
			),

			'return_size_with_invalid_fluid_units'        => array(
				'font_size_preset'            => array(
					'size'  => '10em',
					'fluid' => array(
						'min' => '20vw',
						'max' => '50%',
					),
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => '10em',
			),

			'return_fluid_clamp_value'                    => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => array(
						'min' => '20px',
						'max' => '50rem',
					),
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(20px, 1.25rem + ((1vw - 7.68px) * 93.75), 50rem)',
			),

			'return_clamp_value_with_default_fluid_max_value' => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => array(
						'min' => '2.6rem',
					),
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(2.6rem, 2.6rem + ((1vw - 0.48rem) * 0.048), 42px)',
			),

			'default_return_clamp_value_with_default_fluid_min_value' => array(
				'font_size_preset'            => array(
					'size'  => '28px',
					'fluid' => array(
						'max' => '80px',
					),
				),
				'should_use_fluid_typography' => true,
				'expected_output'             => 'clamp(21px, 1.3125rem + ((1vw - 7.68px) * 7.091), 80px)',
			),
		);
	}

	/**
	 * Tests that custom font sizes are converted to fluid values
	 * in inline block supports styles,
	 * when "settings.typography.fluid" is set to `true`.
	 *
	 * @covers ::gutenberg_render_typography_support
	 *
	 * @dataProvider data_generate_replace_inline_font_styles_with_fluid_values_fixtures
	 *
	 * @param string $block_content               HTML block content.
	 * @param string $font_size_value             The block supports custom font size value.
	 * @param bool   $should_use_fluid_typography An override to switch fluid typography "on". Can be used for unit testing.
	 * @param string $expected_output             Expected value of style property from gutenberg_apply_typography_support().
	 */
	public function test_should_replace_inline_font_styles_with_fluid_values( $block_content, $font_size_value, $should_use_fluid_typography, $expected_output ) {
		if ( $should_use_fluid_typography ) {
			switch_theme( 'block-theme-child-with-fluid-typography' );
		} else {
			switch_theme( 'default' );
		}

		$block  = array(
			'blockName' => 'core/image',
			'attrs'     => array(
				'style' => array(
					'typography' => array(
						'fontSize' => $font_size_value,
					),
				),
			),
		);
		$actual = gutenberg_render_typography_support( $block_content, $block );

		$this->assertSame( $expected_output, $actual );
	}

	/**
	 * Data provider for test_should_replace_inline_font_styles_with_fluid_values.
	 *
	 * @return array
	 */
	public function data_generate_replace_inline_font_styles_with_fluid_values_fixtures() {
		return array(
			'default_return_content'                       => array(
				'block_content'               => '<h2 class="has-vivid-red-background-color has-background has-link-color" style="margin-top:var(--wp--preset--spacing--60);font-size:4rem;font-style:normal;font-weight:600;letter-spacing:29px;text-decoration:underline;text-transform:capitalize">This is a heading</h2>',
				'font_size_value'             => '4rem',
				'should_use_fluid_typography' => false,
				'expected_output'             => '<h2 class="has-vivid-red-background-color has-background has-link-color" style="margin-top:var(--wp--preset--spacing--60);font-size:4rem;font-style:normal;font-weight:600;letter-spacing:29px;text-decoration:underline;text-transform:capitalize">This is a heading</h2>',
			),
			'return_content_with_replaced_fluid_font_size_inline_style' => array(
				'block_content'               => '<h2 class="has-vivid-red-background-color has-background has-link-color" style="margin-top:var(--wp--preset--spacing--60);font-size:4rem;font-style:normal;font-weight:600;letter-spacing:29px;text-decoration:underline;text-transform:capitalize">This is a heading</h2>',
				'font_size_value'             => '4rem',
				'should_use_fluid_typography' => true,
				'expected_output'             => '<h2 class="has-vivid-red-background-color has-background has-link-color" style="margin-top:var(--wp--preset--spacing--60);font-size:clamp(3rem, 3rem + ((1vw - 0.48rem) * 5.769), 6rem);font-style:normal;font-weight:600;letter-spacing:29px;text-decoration:underline;text-transform:capitalize">This is a heading</h2>',
			),
			'return_content_if_no_inline_font_size_found'  => array(
				'block_content'               => '<p class="has-medium-font-size" style="font-style:normal;font-weight:600;letter-spacing:29px;">A paragraph inside a group</p>',
				'font_size_value'             => '20px',
				'should_use_fluid_typography' => true,
				'expected_output'             => '<p class="has-medium-font-size" style="font-style:normal;font-weight:600;letter-spacing:29px;">A paragraph inside a group</p>',
			),
			'return_content_css_var'                       => array(
				'block_content'               => '<p class="has-medium-font-size" style="font-size:var(--wp--preset--font-size--x-large);">A paragraph inside a group</p>',
				'font_size_value'             => 'var:preset|font-size|x-large',
				'should_use_fluid_typography' => true,
				'expected_output'             => '<p class="has-medium-font-size" style="font-size:var(--wp--preset--font-size--x-large);">A paragraph inside a group</p>',
			),
			'return_content_with_spaces'                   => array(
				'block_content'               => '<p class="has-medium-font-size" style="    font-size:   20px   ;    ">A paragraph inside a group</p>',
				'font_size_value'             => '20px',
				'should_use_fluid_typography' => true,
				'expected_output'             => '<p class="has-medium-font-size" style="    font-size:clamp(15px, 0.9375rem + ((1vw - 7.68px) * 1.803), 30px);    ">A paragraph inside a group</p>',
			),
			'return_content_with_first_match_replace_only' => array(
				'block_content'               => "<div class=\"wp-block-group\" style=\"font-size:1em\"> \n \n<p style=\"font-size:1em\">A paragraph inside a group</p></div>",
				'font_size_value'             => '1em',
				'should_use_fluid_typography' => true,
				'expected_output'             => "<div class=\"wp-block-group\" style=\"font-size:clamp(0.75em, 0.75em + ((1vw - 0.48em) * 1.442), 1.5em);\"> \n \n<p style=\"font-size:1em\">A paragraph inside a group</p></div>",
			),
		);
	}
}
