/**
 * WordPress dependencies
 */
import {
	SlotFillProvider,
	__experimentalNavigatorProvider as NavigatorProvider,
} from '@wordpress/components';
import { UnsavedChangesWarning } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { Sidebar } from '../sidebar';
import Editor from '../../components/editor';
import { Routes } from '../../components/routes';

export default function Layout() {
	return (
		<NavigatorProvider
			className="edit-site-new__layout"
			initialPath="/navigation"
		>
			<Sidebar />
			<div className="edit-site-new__canvas-container">
				<div className="edit-site-new__canvas">
					<SlotFillProvider>
						<UnsavedChangesWarning />
						<Routes>{ () => <Editor /> }</Routes>
					</SlotFillProvider>
				</div>
			</div>
		</NavigatorProvider>
	);
}
