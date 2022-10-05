/**
 * WordPress dependencies
 */
import {
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import NavigationInspector from '../../components/sidebar/navigation-menu-sidebar/navigation-inspector';

export default function SidebarNavigation() {
	return (
		<VStack>
			{ /* Heading colors should automatticaly adapt to their context (dark background) */ }
			<Heading level={ 3 } style={ { color: 'white' } }>
				{ __( 'Navigation' ) }
			</Heading>
			<NavigationInspector />
		</VStack>
	);
}
