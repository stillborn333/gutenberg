/**
 * WordPress dependencies
 */
import { __experimentalNavigatorScreen as NavigatorScreen } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SiteIconAndTitle from '../site-icon-and-title';
import TemplateList from '../template-list';

export function Sidebar() {
	return (
		<div className="edit-site-new__sidebar">
			<SiteIconAndTitle />

			<NavigatorScreen path="/templates">
				<TemplateList />
			</NavigatorScreen>
		</div>
	);
}
