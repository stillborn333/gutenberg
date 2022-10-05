/**
 * WordPress dependencies
 */
import {
	__experimentalNavigatorScreen as NavigatorScreen,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import SiteIconAndTitle from '../site-icon-and-title';
import SidebarNavigation from '../sidebar-navigation';

export function Sidebar() {
	return (
		<VStack
			className="edit-site-new__sidebar"
			alignment="top"
			// Seems like spacing={ 8 } doesn't work in Safari
			// Probably breaks a lot of other spacing configs.
			spacing="20px"
		>
			<SiteIconAndTitle />

			<NavigatorScreen path="/navigation">
				<SidebarNavigation />
			</NavigatorScreen>
		</VStack>
	);
}
