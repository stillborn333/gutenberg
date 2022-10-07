/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __experimentalListView as ListView } from '@wordpress/block-editor';
import { Button, __experimentalText as Text } from '@wordpress/components';
import {
	useFocusOnMount,
	useFocusReturn,
	useInstanceId,
	useMergeRefs,
} from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';
import { ESCAPE } from '@wordpress/keycodes';
import { useState } from '@wordpress/element';
import {
	DocumentOutline,
	WordCount,
	TimeToRead,
	CharacterCount,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

export default function ListViewSidebar() {
	const { setIsListViewOpened } = useDispatch( editPostStore );

	const focusOnMountRef = useFocusOnMount( 'firstElement' );
	const headerFocusReturnRef = useFocusReturn();
	const contentFocusReturnRef = useFocusReturn();
	function closeOnEscape( event ) {
		if ( event.keyCode === ESCAPE && ! event.defaultPrevented ) {
			event.preventDefault();
			setIsListViewOpened( false );
		}
	}

	const instanceId = useInstanceId( ListViewSidebar );
	const labelId = `edit-post-editor__list-view-panel-label-${ instanceId }`;

	const [ tab, setTab ] = useState( 'list-view' );

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			aria-labelledby={ labelId }
			className="edit-post-editor__list-view-panel"
			onKeyDown={ closeOnEscape }
		>
			<div
				className="edit-post-editor__list-view-panel-header components-panel__header edit-post-sidebar__panel-tabs"
				ref={ headerFocusReturnRef }
			>
				<ul>
					<li>
						<Button
							onClick={ () => {
								setTab( 'list-view' );
							} }
							className={ classnames(
								'edit-post-sidebar__panel-tab',
								{ 'is-active': tab === 'list-view' }
							) }
							data-label={ __( 'List View' ) }
							aria-label={
								tab === 'list-view'
									? __( 'List View (selected)' )
									: __( 'List View' )
							}
						>
							{ __( 'List View' ) }
						</Button>
					</li>
					<li>
						<Button
							onClick={ () => {
								setTab( 'outline' );
							} }
							className={ classnames(
								'edit-post-sidebar__panel-tab',
								{ 'is-active': tab === 'outline' }
							) }
							data-label={ __( 'Outline' ) }
							aria-label={
								tab === 'outline'
									? __( 'Outline (selected)' )
									: __( 'Outline' )
							}
						>
							{ __( 'Outline' ) }
						</Button>
					</li>
				</ul>
				<Button
					icon={ closeSmall }
					label={ __( 'Close List View Sidebar' ) }
					onClick={ () => setIsListViewOpened( false ) }
				/>
			</div>
			<div
				className="edit-post-editor__list-view-panel-content"
				ref={ useMergeRefs( [
					contentFocusReturnRef,
					focusOnMountRef,
				] ) }
			>
				{ tab === 'list-view' && <ListView /> }
				{ tab === 'outline' && <DocumentOutline /> }
				<div className="edit-post-editor__list-view-overview">
					<div>
						<Text>{ __( 'Characters:' ) }</Text>
						<Text>
							<CharacterCount />
						</Text>
					</div>
					<div>
						<Text>{ __( 'Words:' ) }</Text>
						<WordCount />
					</div>
					<div>
						<Text>{ __( 'Time to read:' ) }</Text>
						<TimeToRead />
					</div>
				</div>
			</div>
		</div>
	);
}
