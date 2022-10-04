/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';
import { __, sprintf } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';
import { useState, useMemo, forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import RangeControl from '../range-control';
import { Flex, FlexItem } from '../flex';
import { default as UnitControl, useCustomUnits } from '../unit-control';
import CustomSelectControl from '../custom-select-control';
import { VisuallyHidden } from '../visually-hidden';
import {
	ToggleGroupControl,
	ToggleGroupControlOption,
} from '../toggle-group-control';
import {
	getFontSizeOptions,
	getSelectedOption,
	parseNumberAndUnitFromSize,
	isSimpleCssValue,
	CUSTOM_FONT_SIZE,
} from './utils';
import { HStack } from '../h-stack';
import type {
	FontSizePickerProps,
	FontSizeSelectOption,
	FontSizeToggleGroupOption,
} from './types';
import {
	Container,
	HeaderHint,
	HeaderLabel,
	Controls,
	ResetButton,
} from './styles';
import { Spacer } from '../spacer';

const UnforwardedFontSizePicker = (
	props: FontSizePickerProps,
	ref: ForwardedRef< any >
) => {
	const {
		/** Start opting into the new margin-free styles that will become the default in a future version. */
		__nextHasNoMarginBottom = false,
		fallbackFontSize,
		fontSizes = [],
		disableCustomFontSizes = false,
		onChange,
		size = 'default',
		value,
		withSlider = false,
		withReset = true,
	} = props;
	if ( ! __nextHasNoMarginBottom ) {
		deprecated( 'Bottom margin styles for wp.components.FontSizePicker', {
			since: '6.1',
			version: '6.4',
			hint: 'Set the `__nextHasNoMarginBottom` prop to true to start opting into the new styles, which will become the default in a future version.',
		} );
	}

	const units = useCustomUnits( {
		availableUnits: [ 'px', 'em', 'rem' ],
	} );

	/**
	 * The main font size UI displays a toggle group when the presets are less
	 * than six and a select control when they are more.
	 */
	const fontSizesContainComplexValues = fontSizes.some(
		( { size: sizeArg } ) => ! isSimpleCssValue( sizeArg )
	);
	const shouldUseSelectControl = fontSizes.length > 5;
	const options = useMemo(
		() =>
			getFontSizeOptions(
				shouldUseSelectControl,
				fontSizes,
				disableCustomFontSizes
			),
		[ shouldUseSelectControl, fontSizes, disableCustomFontSizes ]
	);
	const selectedOption = getSelectedOption( fontSizes, value );
	const isCustomValue = selectedOption.slug === CUSTOM_FONT_SIZE;
	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		! disableCustomFontSizes && isCustomValue
	);
	const headerHint = useMemo( () => {
		if ( showCustomValueControl ) {
			return `(${ __( 'Custom' ) })`;
		}

		// If we have a custom value that is not available in the font sizes,
		// show it as a hint as long as it's a simple CSS value.
		if ( isCustomValue ) {
			return (
				value !== undefined &&
				isSimpleCssValue( value ) &&
				`(${ value })`
			);
		}
		if ( shouldUseSelectControl ) {
			return (
				selectedOption?.size !== undefined &&
				isSimpleCssValue( selectedOption?.size ) &&
				`(${ selectedOption?.size })`
			);
		}

		// Calculate the `hint` for toggle group control.
		let hint = selectedOption.name;
		if (
			! fontSizesContainComplexValues &&
			typeof selectedOption.size === 'string'
		) {
			const [ , unit ] = parseNumberAndUnitFromSize(
				selectedOption.size
			);
			hint += `(${ unit })`;
		}
		return hint;
	}, [
		showCustomValueControl,
		selectedOption?.name,
		selectedOption?.size,
		value,
		isCustomValue,
		shouldUseSelectControl,
		fontSizesContainComplexValues,
	] );

	if ( ! options ) {
		return null;
	}

	// This is used for select control only. We need to add support
	// for ToggleGroupControl.
	const currentFontSizeSR = sprintf(
		// translators: %s: Currently selected font size.
		__( 'Currently selected font size: %s' ),
		selectedOption.name
	);

	const [ valueNumber, valueUnit ] = parseNumberAndUnitFromSize( value );
	const isValueUnitRelative =
		!! valueUnit && [ 'em', 'rem' ].includes( valueUnit );
	const [ , firstFontSizeUnit ] = parseNumberAndUnitFromSize(
		fontSizes[ 0 ]?.size
	);
	const hasUnits = !! valueUnit || !! firstFontSizeUnit;

	return (
		<Container ref={ ref } className="components-font-size-picker">
			<VisuallyHidden as="legend">{ __( 'Font size' ) }</VisuallyHidden>
			<Spacer>
				<HStack className="components-font-size-picker__header">
					<HeaderLabel>
						{ __( 'Size' ) }
						{ headerHint && (
							<HeaderHint className="components-font-size-picker__header__hint">
								{ headerHint }
							</HeaderHint>
						) }
					</HeaderLabel>
					{ ! disableCustomFontSizes && (
						<Button
							label={
								showCustomValueControl
									? __( 'Use size preset' )
									: __( 'Set custom size' )
							}
							icon={ settings }
							onClick={ () => {
								setShowCustomValueControl(
									! showCustomValueControl
								);
							} }
							isPressed={ showCustomValueControl }
							isSmall
						/>
					) }
				</HStack>
			</Spacer>
			<Controls
				className="components-font-size-picker__controls"
				__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
			>
				{ !! fontSizes.length &&
					shouldUseSelectControl &&
					! showCustomValueControl && (
						<CustomSelectControl
							__nextUnconstrainedWidth
							className="components-font-size-picker__select"
							label={ __( 'Font size' ) }
							hideLabelFromVision
							describedBy={ currentFontSizeSR }
							options={ options as FontSizeSelectOption[] }
							value={ ( options as FontSizeSelectOption[] ).find(
								( option ) => option.key === selectedOption.slug
							) }
							onChange={ ( {
								selectedItem,
							}: {
								selectedItem: FontSizeSelectOption;
							} ) => {
								if ( selectedItem.size === undefined ) {
									onChange?.( undefined );
								} else {
									onChange?.(
										hasUnits
											? selectedItem.size
											: Number( selectedItem.size )
									);
								}
								if ( selectedItem.key === CUSTOM_FONT_SIZE ) {
									setShowCustomValueControl( true );
								}
							} }
							size={ size }
						/>
					) }
				{ ! shouldUseSelectControl && ! showCustomValueControl && (
					<ToggleGroupControl
						__nextHasNoMarginBottom={ __nextHasNoMarginBottom }
						label={ __( 'Font size' ) }
						hideLabelFromVision
						value={ value }
						onChange={ ( newValue ) => {
							if ( newValue === undefined ) {
								onChange?.( undefined );
							} else {
								onChange?.(
									hasUnits ? newValue : Number( newValue )
								);
							}
						} }
						isBlock
						size={ size }
					>
						{ ( options as FontSizeToggleGroupOption[] ).map(
							( option ) => (
								<ToggleGroupControlOption
									key={ option.key }
									value={ option.value }
									label={ option.label }
									aria-label={ option.name }
									showTooltip={ true }
								/>
							)
						) }
					</ToggleGroupControl>
				) }
				{ ! disableCustomFontSizes && showCustomValueControl && (
					<Flex className="components-font-size-picker__custom-size-control">
						<FlexItem isBlock>
							<UnitControl
								label={ __( 'Custom' ) }
								labelPosition="top"
								hideLabelFromVision
								value={ value }
								onChange={ ( newValue ) => {
									if ( newValue === undefined ) {
										onChange?.( undefined );
									} else {
										onChange?.(
											hasUnits
												? newValue
												: parseFloat( newValue )
										);
									}
								} }
								size={ size }
								units={ hasUnits ? units : [] }
							/>
						</FlexItem>
						{ withSlider && (
							<FlexItem isBlock>
								<RangeControl
									__nextHasNoMarginBottom={
										__nextHasNoMarginBottom
									}
									className="components-font-size-picker__custom-input"
									label={ __( 'Custom Size' ) }
									hideLabelFromVision
									value={ valueNumber }
									initialPosition={ fallbackFontSize }
									withInputField={ false }
									onChange={ ( newValue ) => {
										if ( newValue === undefined ) {
											onChange?.( undefined );
										} else if ( hasUnits ) {
											onChange?.(
												newValue + ( valueUnit ?? 'px' )
											);
										} else {
											onChange?.( newValue );
										}
									} }
									min={ isValueUnitRelative ? 0.75 : 12 }
									max={ isValueUnitRelative ? 6.25 : 100 }
									step={ isValueUnitRelative ? 0.05 : 1 }
								/>
							</FlexItem>
						) }
						{ withReset && (
							<FlexItem>
								<ResetButton
									disabled={ value === undefined }
									onClick={ () => {
										onChange?.( undefined );
									} }
									isSmall
									variant="secondary"
									size={ size }
								>
									{ __( 'Reset' ) }
								</ResetButton>
							</FlexItem>
						) }
					</Flex>
				) }
			</Controls>
		</Container>
	);
};

export const FontSizePicker = forwardRef( UnforwardedFontSizePicker );

export default FontSizePicker;
