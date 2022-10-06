/**
 * WordPress dependencies
 */
import { InterfaceSkeleton } from '@wordpress/interface';
import { EditorNotices, EditorSnackbars } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { BlockStyles } from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { store as coreStore, EntityProvider } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import Header from '../header';
import BlockEditor from '../../components/block-editor';
import CodeEditor from '../../components/code-editor';
import KeyboardShortcuts from '../../components/keyboard-shortcuts';
import useInitEditedEntityFromURL from '../../components/use-init-edited-entity-from-url';

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
	} = useSelect( ( select ) => {
		const { getEditedPostType, getEditedPostId, getEditorMode } =
			select( editSiteStore );
		const { hasFinishedResolution, getEntityRecord } = select( coreStore );
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
			canvasMode: select( editSiteStore ).__unstableGetCanvasMode(),
		};
	}, [] );

	const isViewMode = canvasMode === 'view';
	const isEditMode = canvasMode === 'edit';
	const showVisualEditor = isViewMode || editorMode === 'visual';

	return (
		<InterfaceSkeleton
			header={ <Header /> }
			notices={ isEditMode && <EditorSnackbars /> }
			content={
				<EntityProvider kind="root" type="site">
					<EntityProvider
						kind="postType"
						type={ editedPostType }
						id={ editedPostId }
					>
						<div
							// TODO: this only works in chrome right now
							inert={ isViewMode ? 'true' : 'false' }
							style={ { height: '100%' } }
						>
							<EditorNotices />
							{ /* todo: check what this component is fore */ }
							<BlockStyles.Slot scope="core/block-inspector" />
							{ showVisualEditor && editedPost && (
								<BlockEditor
									setIsInserterOpen={ () =>
										console.log( 'todo: open inserter' )
									}
								/>
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
							<KeyboardShortcuts
								openEntitiesSavedStates={ () =>
									console.log( 'todo: what is this for' )
								}
							/>
						</div>
					</EntityProvider>
				</EntityProvider>
			}
		/>
	);
}
