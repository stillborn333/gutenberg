/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress } from '@wordpress/icons';
import { store as coreDataStore } from '@wordpress/core-data';

function SiteIconAndTitle( { showIcon = true, showTitle = true } ) {
	const { isRequestingSite, siteIconUrl, siteTitle } = useSelect(
		( select ) => {
			const { getEntityRecord, isResolving } = select( coreDataStore );
			const siteData =
				getEntityRecord( 'root', '__unstableBase', undefined ) || {};

			return {
				isRequestingSite: isResolving( 'core', 'getEntityRecord', [
					'root',
					'__unstableBase',
					undefined,
				] ),
				siteIconUrl: siteData.site_icon_url,
				siteTitle: siteData.name,
			};
		},
		[]
	);

	if ( isRequestingSite && ! siteIconUrl ) {
		return null;
	}

	const icon = siteIconUrl ? (
		<img
			className="edit-site-new__site-icon-and-title-image"
			alt={ __( 'Site Icon' ) }
			src={ siteIconUrl }
		/>
	) : (
		<Icon
			className="edit-site-new__site-icon-and-title-icon"
			size="36px"
			icon={ wordpress }
		/>
	);

	return (
		<div className="edit-site-new__site-icon-and-title">
			{ showIcon && icon }
			{ showTitle && siteTitle }
		</div>
	);
}

export default SiteIconAndTitle;
