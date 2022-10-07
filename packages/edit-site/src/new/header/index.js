/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __unstableAnimatePresence as AnimatePresence } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import HeaderEditMode from '../header-edit-mode';
import HeaderViewMode from '../header-view-mode';

export default function Header() {
	const { canvasMode } = useSelect(
		( select ) => ( {
			canvasMode: select( editSiteStore ).__unstableGetCanvasMode(),
		} ),
		[]
	);

	return (
		<AnimatePresence exitBeforeEnter={ true }>
			{ canvasMode === 'view' ? (
				<HeaderViewMode key="view" />
			) : (
				<HeaderEditMode key="edit" />
			) }
		</AnimatePresence>
	);
}
