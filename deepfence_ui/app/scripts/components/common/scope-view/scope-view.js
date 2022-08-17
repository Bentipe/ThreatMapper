import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Navigation} from '../navigation';
import { Nodes } from '../../nodes';
import ViewModeSelector from '../../view-mode-selector';
import {
  isTableViewModeSelector,
  isGraphViewModeSelector,
} from '../../../selectors/topology';
import DonutDetailsModal from '../../topology-view/donut-details-modal/donut-details-modal';

import {
  ADMIN_SIDE_NAV_MENU_COLLECTION,
  USER_SIDE_NAV_MENU_COLLECTION,
} from '../../../constants/menu-collection';
import { getUserRole } from '../../../helpers/auth-helper';
import { NodeDetailSliding } from '../../node-detail-sliding';
import NodeFiltersPanel from '../../node-filter-panel';
import './styles.scss';
import { getWebsocketUrl } from '../../../utils/web-api-utils';
import { showTopologyPanel } from '../../../actions';

export const ScopeView = (props) => {
  const dispatch = useDispatch();

  const wsURL = `${getWebsocketUrl()}/topology-api`;

  const sideNavMenuCollection =
    getUserRole() === 'admin'
      ? ADMIN_SIDE_NAV_MENU_COLLECTION
      : USER_SIDE_NAV_MENU_COLLECTION;

  const [activeMenu] = useState(sideNavMenuCollection[0]);

  const sidePanelOpen = useSelector(state => state.get('showTopologyPanel'));
  const toggleSidePanel = useCallback(() => {
    dispatch(showTopologyPanel(!sidePanelOpen));
  }, [sidePanelOpen]);

  const isTableViewMode = useSelector(state => isTableViewModeSelector(state));
  const isGraphViewMode = useSelector(state => isGraphViewModeSelector(state));
  const apiKey = useSelector(state => state.get('userProfile')?.api_key);
  const isDonutDetailsModalVisible = useSelector(state =>
    state.get('isDonutDetailsModalVisible')
  );
  const isIntegrityMonitoringModalVisible = useSelector(state =>
    state.get('isIntegrityMonitoringModalVisible')
  );
  const isSideNavCollapsed = useSelector(state =>
    state.get('isSideNavCollapsed')
  );

  return (
    <div>
      <Navigation/>

      <div
        className={`scope-ui-wrapper ${
          isSideNavCollapsed ? 'collapse-side-nav' : 'expand-side-nav'
        }`}
      >
        <div className="deepfence-topology">
          <div className="modals-wrapper">
            {(isGraphViewMode || isTableViewMode) && (
              <NodeDetailSliding isOpen={sidePanelOpen} />
            )}
            {isDonutDetailsModalVisible && <DonutDetailsModal />}
          </div>

          {apiKey &&
            <NodeFiltersPanel
              apiKey={apiKey}
              apiUrl={wsURL}
            />
          }
          <div className="multi-cloud-view-selector">
            <ViewModeSelector />
            <i className="fa fa-bars hamburger-icon" onClick={toggleSidePanel} />
          </div>
          <Nodes />
        </div>
      </div>
    </div>
  );
};
