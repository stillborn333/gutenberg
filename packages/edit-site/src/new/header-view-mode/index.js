/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';

export default function HeaderViewMode() {
	const { __unstableSetCanvasMode } = useDispatch( editSiteStore );

	return (
		<>
			<Button onClick={ () => __unstableSetCanvasMode( 'edit' ) }>
				Edit
			</Button>
		</>
	);
}
