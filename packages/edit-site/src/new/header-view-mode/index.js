/**
 * WordPress dependencies
 */
import { Button, __unstableMotion as motion } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';

export default function HeaderViewMode() {
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
			<Button onClick={ () => __unstableSetCanvasMode( 'edit' ) }>
				Edit
			</Button>
		</motion.div>
	);
}
