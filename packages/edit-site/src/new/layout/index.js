/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __unstableMotion as motion } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Sidebar } from '../sidebar';
import Canvas from '../canvas';
import { store as editSiteStore } from '../../store';

export default function Layout() {
	const { canvasMode } = useSelect(
		( select ) => ( {
			canvasMode: select( editSiteStore ).__unstableGetCanvasMode(),
		} ),
		[]
	);

	return (
		<div
			className={ classnames( 'edit-site-new__layout', {
				'is-full-canvas': canvasMode === 'edit',
			} ) }
		>
			<div className="edit-site-new__sidebar">
				<Sidebar />
			</div>
			<div className="edit-site-new__canvas-container">
				{ /* todo: support reduced motion */ }
				<motion.div className="edit-site-new__canvas" layout>
					<Canvas />
				</motion.div>
			</div>
		</div>
	);
}
