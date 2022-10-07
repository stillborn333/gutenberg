/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalHStack as HStack,
	__unstableMotion as motion,
} from '@wordpress/components';
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
		<motion.div
			initial={ { opacity: 0, height: 0 } }
			animate={ { opacity: 1, height: 'auto' } }
			exit={ {
				height: 0,
				opacity: 0,
			} }
			transition={ { type: 'tween', duration: 1 } }
		>
			<HStack>
				<Button
					label={ __( 'Open Navigation Sidebar' ) }
					onClick={ () => __unstableSetCanvasMode( 'view' ) }
				>
					<SiteIconAndTitle showTitle={ false } />
				</Button>
				<EditorToolbars />
			</HStack>
		</motion.div>
	);
}
