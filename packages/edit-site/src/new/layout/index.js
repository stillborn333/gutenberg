/**
 * WordPress dependencies
 */
import { __experimentalNavigatorProvider as NavigatorProvider } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Sidebar } from '../sidebar';

export default function Layout() {
	return (
		<NavigatorProvider
			className="edit-site-new__layout"
			initialPath="/templates"
		>
			<Sidebar />
			<div className="edit-site-new__canvas-container">
				<div className="edit-site-new__canvas">Canvas</div>
			</div>
		</NavigatorProvider>
	);
}
