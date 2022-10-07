/**
 * WordPress dependencies
 */
import {
	store as interfaceStore,
	InterfaceSkeleton,
	ComplementaryArea,
} from '@wordpress/interface';
import {
	EditorNotices,
	EditorSnackbars,
	EntitiesSavedStates,
} from '@wordpress/editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
	BlockStyles,
	BlockBreadcrumb,
} from '@wordpress/block-editor';
import { Notice, Button } from '@wordpress/components';
import { store as coreStore, EntityProvider } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import Header from '../header';
import BlockEditor from '../../components/block-editor';
import CodeEditor from '../../components/code-editor';
import KeyboardShortcuts from '../../components/keyboard-shortcuts';
import useInitEditedEntityFromURL from '../../components/use-init-edited-entity-from-url';
import GlobalStylesRenderer from '../../components/global-styles-renderer';
import { GlobalStylesProvider } from '../../components/global-styles/global-styles-provider';
import ListViewSidebar from '../../components/secondary-sidebar/list-view-sidebar';
import InserterSidebar from '../../components/secondary-sidebar/inserter-sidebar';
import { SidebarComplementaryAreaFills } from '../../components/sidebar';

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
};

export default function Canvas() {
	// This ensures the edited entity id and type are initialized properly.
	useInitEditedEntityFromURL();

	const {
		editedPostId,
		editedPostType,
		editedPost,
		hasLoadedPost,
		editorMode,
		canvasMode,
		blockEditorMode,
		isRightSidebarOpen,
		isInserterOpen,
		isListViewOpen,
		isSaveViewOpen,
		previousShortcut,
		nextShortcut,
	} = useSelect( ( select ) => {
		const {
			getEditedPostType,
			getEditedPostId,
			getEditorMode,
			__unstableGetCanvasMode,
			isInserterOpened,
			isListViewOpened,
			isSaveViewOpened,
		} = select( editSiteStore );
		const { hasFinishedResolution, getEntityRecord } = select( coreStore );
		const { __unstableGetEditorMode } = select( blockEditorStore );
		const { getAllShortcutKeyCombinations } = select(
			keyboardShortcutsStore
		);
		const { getActiveComplementaryArea } = select( interfaceStore );
		const postType = getEditedPostType();
		const postId = getEditedPostId();

		// The currently selected entity to display.
		// Typically template or template part in the site editor.
		return {
			editedPostId: postId,
			editedPostType: postType,
			editedPost: postId
				? getEntityRecord( 'postType', postType, postId )
				: null,
			hasLoadedPost: postId
				? hasFinishedResolution( 'getEntityRecord', [
						'postType',
						postType,
						postId,
				  ] )
				: false,
			editorMode: getEditorMode(),
			canvasMode: __unstableGetCanvasMode(),
			blockEditorMode: __unstableGetEditorMode(),
			isInserterOpen: isInserterOpened(),
			isListViewOpen: isListViewOpened(),
			isSaveViewOpen: isSaveViewOpened(),
			isRightSidebarOpen: getActiveComplementaryArea(
				editSiteStore.name
			),
			previousShortcut: getAllShortcutKeyCombinations(
				'core/edit-site/previous-region'
			),
			nextShortcut: getAllShortcutKeyCombinations(
				'core/edit-site/next-region'
			),
		};
	}, [] );
	const { setIsSaveViewOpened } = useDispatch( editSiteStore );
	const { enableComplementaryArea } = useDispatch( interfaceStore );

	// Todo: Check whether this behavior is still relevant
	// If yes, potentially move it into a hook or into the initFromURL hook.
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

	const isViewMode = canvasMode === 'view';
	const isEditMode = canvasMode === 'edit';
	const showVisualEditor = isViewMode || editorMode === 'visual';
	const showBlockBreakcrumb =
		isEditMode && showVisualEditor && blockEditorMode !== 'zoom-out';
	const shouldShowInserter = isEditMode && showVisualEditor && isInserterOpen;
	const shouldShowListView = isEditMode && showVisualEditor && isListViewOpen;
	const secondarySidebarLabel = isListViewOpen
		? __( 'List View' )
		: __( 'Block Library' );
	const isReady = editedPostType !== undefined && editedPostId !== undefined;

	if ( ! isReady ) {
		return null;
	}

	return (
		<>
			{ /* Check if the edit-site shortcuts still make sense and where we should register them
			 A hook might also make more sense */ }
			<KeyboardShortcuts.Register />
			<SidebarComplementaryAreaFills />
			<InterfaceSkeleton
				header={ <Header /> }
				notices={ isEditMode && <EditorSnackbars /> }
				/* Some of these providers are probably better inside `BlockEditor` */
				content={
					<GlobalStylesProvider>
						{ /* A hook might make more sense for this component */ }
						<GlobalStylesRenderer />
						<EntityProvider kind="root" type="site">
							<EntityProvider
								kind="postType"
								type={ editedPostType }
								id={ editedPostId }
							>
								<div
									// TODO: this only works in chrome right now
									inert={ isViewMode ? 'true' : undefined }
									style={ { height: '100%' } }
								>
									<EditorNotices />
									{ /* todo: check what this component is fore */ }
									<BlockStyles.Slot scope="core/block-inspector" />
									{ showVisualEditor && editedPost && (
										<BlockEditor />
									) }
									{ editorMode === 'text' && editedPost && (
										<CodeEditor />
									) }
									{ hasLoadedPost && ! editedPost && (
										<Notice
											status="warning"
											isDismissible={ false }
										>
											{ __(
												"You attempted to edit an item that doesn't exist. Perhaps it was deleted?"
											) }
										</Notice>
									) }
									<KeyboardShortcuts />
								</div>
							</EntityProvider>
						</EntityProvider>
					</GlobalStylesProvider>
				}
				secondarySidebar={
					( shouldShowInserter && <InserterSidebar /> ) ||
					( shouldShowListView && <ListViewSidebar /> )
				}
				sidebar={
					isRightSidebarOpen && (
						<ComplementaryArea.Slot scope="core/edit-site" />
					)
				}
				actions={
					<>
						{ isSaveViewOpen ? (
							<EntitiesSavedStates
								close={ () => setIsSaveViewOpened( false ) }
							/>
						) : (
							<div className="edit-site-editor__toggle-save-panel">
								<Button
									variant="secondary"
									className="edit-site-editor__toggle-save-panel-button"
									onClick={ () =>
										setIsSaveViewOpened( true )
									}
									aria-expanded={ false }
								>
									{ __( 'Open save panel' ) }
								</Button>
							</div>
						) }
					</>
				}
				footer={
					showBlockBreakcrumb && (
						<BlockBreadcrumb rootLabelText={ __( 'Template' ) } />
					)
				}
				shortcuts={ {
					previous: previousShortcut,
					next: nextShortcut,
				} }
				labels={ {
					...interfaceLabels,
					secondarySidebar: secondarySidebarLabel,
				} }
			/>
		</>
	);
}
