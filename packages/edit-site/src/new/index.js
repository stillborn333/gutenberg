/**
 * WordPress dependencies
 */
import { SlotFillProvider, Popover } from '@wordpress/components';
import { UnsavedChangesWarning } from '@wordpress/editor';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { Routes } from '../components/routes';
import Layout from './layout';

export default function App() {
	return (
		<ShortcutProvider style={ { height: '100%' } }>
			<SlotFillProvider>
				<Popover.Slot />
				<UnsavedChangesWarning />
				{
					//TODO: maybe we shouldn't require the "Routes" context
					// and just use the URL directly in useInitEditedEntityFromURL
				 }
				<Routes>{ () => <Layout /> }</Routes>
			</SlotFillProvider>
		</ShortcutProvider>
	);
}
