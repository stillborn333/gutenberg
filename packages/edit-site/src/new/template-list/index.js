/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';

export default function TemplateList( {
	templateType = 'wp_template',
	onSelect = () => {},
} ) {
	const { records: templates, isResolving: isLoading } = useEntityRecords(
		'postType',
		templateType,
		{
			per_page: -1,
		}
	);
	const postType = useSelect(
		( select ) => select( coreStore ).getPostType( templateType ),
		[ templateType ]
	);

	if ( ! templates || isLoading ) {
		return null;
	}

	if ( ! templates.length ) {
		return (
			<div>
				{ sprintf(
					// translators: The template type name, should be either "templates" or "template parts".
					__( 'No %s found.' ),
					postType?.labels?.name?.toLowerCase()
				) }
			</div>
		);
	}

	return (
		<div className="edit-site-new__template-list">
			{ templates.map( ( template ) => (
				<Button
					key={ template.id }
					onClick={ () => onSelect( template ) }
				>
					{ decodeEntities(
						template.title?.rendered || template.slug
					) }
				</Button>
			) ) }
		</div>
	);
}
