/**
 * WordPress dependencies
 */
import { useEffect, useState, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover, Button } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	InterfaceSkeleton,
	ComplementaryArea,
	store as interfaceStore,
} from '@wordpress/interface';
import { EntitiesSavedStates } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { SidebarComplementaryAreaFills } from '../sidebar';
import WelcomeGuide from '../welcome-guide';
import { store as editSiteStore } from '../../store';

const interfaceLabels = {
	/* translators: accessibility text for the editor top bar landmark region. */
	header: __( 'Editor top bar' ),
	/* translators: accessibility text for the editor content landmark region. */
	body: __( 'Editor content' ),
	/* translators: accessibility text for the editor settings landmark region. */
	sidebar: __( 'Editor settings' ),
	/* translators: accessibility text for the editor publish landmark region. */
	actions: __( 'Editor publish' ),
	/* translators: accessibility text for the editor footer landmark region. */
	footer: __( 'Editor footer' ),
	/* translators: accessibility text for the navigation sidebar landmark region. */
	drawer: __( 'Navigation Sidebar' ),
};

function Editor() {
	const {
		isListViewOpen,
		sidebarIsOpened,
		settings,
		entityId,
		templateType,
		isNavigationOpen,
		previousShortcut,
		nextShortcut,
		showIconLabels,
	} = useSelect( ( select ) => {
		const {
			isInserterOpened,
			isListViewOpened,
			getSettings,
			getEditedPostType,
			getEditedPostId,
			isNavigationOpened,
			getEditorMode,
		} = select( editSiteStore );
		const { hasFinishedResolution, getEntityRecord } = select( coreStore );
		const { __unstableGetEditorMode } = select( blockEditorStore );
		const postType = getEditedPostType();
		const postId = getEditedPostId();

		// The currently selected entity to display. Typically template or template part.
		return {
			isInserterOpen: isInserterOpened(),
			isListViewOpen: isListViewOpened(),
			sidebarIsOpened: !! select(
				interfaceStore
			).getActiveComplementaryArea( editSiteStore.name ),
			settings: getSettings(),
			templateType: postType,
			template: postId
				? getEntityRecord( 'postType', postType, postId )
				: null,
			templateResolved: postId
				? hasFinishedResolution( 'getEntityRecord', [
						'postType',
						postType,
						postId,
				  ] )
				: false,
			entityId: postId,
			isNavigationOpen: isNavigationOpened(),
			previousShortcut: select(
				keyboardShortcutsStore
			).getAllShortcutKeyCombinations( 'core/edit-site/previous-region' ),
			nextShortcut: select(
				keyboardShortcutsStore
			).getAllShortcutKeyCombinations( 'core/edit-site/next-region' ),
			editorMode: getEditorMode(),
			showIconLabels: select( preferencesStore ).get(
				'core/edit-site',
				'showIconLabels'
			),
			blockEditorMode: __unstableGetEditorMode(),
		};
	}, [] );
	const { enableComplementaryArea } = useDispatch( interfaceStore );

	const [ isEntitiesSavedStatesOpen, setIsEntitiesSavedStatesOpen ] =
		useState( false );
	const openEntitiesSavedStates = useCallback(
		() => setIsEntitiesSavedStatesOpen( true ),
		[]
	);
	const closeEntitiesSavedStates = useCallback( () => {
		setIsEntitiesSavedStatesOpen( false );
	}, [] );

	useEffect( () => {
		if ( isNavigationOpen ) {
			document.body.classList.add( 'is-navigation-sidebar-open' );
		} else {
			document.body.classList.remove( 'is-navigation-sidebar-open' );
		}
	}, [ isNavigationOpen ] );

	useEffect(
		function openGlobalStylesOnLoad() {
			const searchParams = new URLSearchParams( window.location.search );
			if ( searchParams.get( 'styles' ) === 'open' ) {
				enableComplementaryArea(
					'core/edit-site',
					'edit-site/global-styles'
				);
			}
		},
		[ enableComplementaryArea ]
	);

	// Don't render the Editor until the settings are set and loaded.
	const isReady =
		settings?.siteUrl &&
		templateType !== undefined &&
		entityId !== undefined;

	const secondarySidebarLabel = isListViewOpen
		? __( 'List View' )
		: __( 'Block Library' );

	return (
		<>
			{ isReady && (
				<>
					<SidebarComplementaryAreaFills />
					<InterfaceSkeleton
						labels={ {
							...interfaceLabels,
							secondarySidebar: secondarySidebarLabel,
						} }
						className={ showIconLabels && 'show-icon-labels' }
						sidebar={
							sidebarIsOpened && (
								<ComplementaryArea.Slot scope="core/edit-site" />
							)
						}
						actions={
							<>
								{ isEntitiesSavedStatesOpen ? (
									<EntitiesSavedStates
										close={ closeEntitiesSavedStates }
									/>
								) : (
									<div className="edit-site-editor__toggle-save-panel">
										<Button
											variant="secondary"
											className="edit-site-editor__toggle-save-panel-button"
											onClick={ openEntitiesSavedStates }
											aria-expanded={ false }
										>
											{ __( 'Open save panel' ) }
										</Button>
									</div>
								) }
							</>
						}
						shortcuts={ {
							previous: previousShortcut,
							next: nextShortcut,
						} }
					/>
					<WelcomeGuide />
					<Popover.Slot />
				</>
			) }
		</>
	);
}
export default Editor;
