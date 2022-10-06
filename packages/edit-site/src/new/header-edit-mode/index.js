/**
 * WordPress dependencies
 */
import { Button, __experimentalHStack as HStack } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EditorToolbars from '../../components/header';
import { store as editSiteStore } from '../../store';
import SiteIconAndTitle from '../site-icon-and-title';

export default function HeaderEditMode() {
	const { __unstableSetCanvasMode } = useDispatch( editSiteStore );

	return (
		<HStack>
			<Button
				label={ __( 'Open Navigation Sidebar' ) }
				onClick={ () => __unstableSetCanvasMode( 'view' ) }
			>
				<SiteIconAndTitle showTitle={ false } />
			</Button>
			<EditorToolbars
				openEntitiesSavedStates={ () =>
					console.log( 'todo: open entities panel' )
				}
			/>
		</HStack>
	);
}
