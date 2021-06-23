import $ from "jquery";
import '../stylesheets/application.css';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';

import '../stylesheets/responsive.css';

import Rails from '@rails/ujs';
Rails.start();

export {
    sanitizeHTML
  , checkAll
  , toggleCheckboxesBySelector
  , showAndScrollTo
  , toggleRowGroup
  , collapseAllRowGroups
  , expandAllRowGroups
  , toggleAllRowGroups
  , toggleFieldset
  , hideFieldset
  , moveOptions
  , moveOptionUp
  , moveOptionTop
  , moveOptionDown
  , moveOptionBottom
  , initFilters
  , addFilter
  , buildFilterRow
  , toggleFilter
  , enableValues
  , toggleOperator
  , toggleMultiSelect
  , showTab
  , showIssueHistory
  , getRemoteTab
  , replaceInHistory
  , moveTabRight
  , moveTabLeft
  , displayTabsButtons
  , setPredecessorFieldsVisibility
  , showModal
  , hideModal
  , collapseScmEntry
  , expandScmEntry
  , scmEntryClick
  , randomKey
  , copyTextToClipboard
  , updateIssueFrom
  , replaceIssueFormWith
  , updateBulkEditFrom
  , observeAutocompleteField
  , multipleAutocompleteField
  , observeSearchfield
  , beforeShowDatePicker
  , warnLeavingUnsavedMessage
  , warnLeavingUnsaved
  , setupAjaxIndicator
  , setupTabs
  , setupFilePreviewNavigation
  , hideOnLoad
  , addFormObserversForDoubleSubmit
  , defaultFocus
  , blockEventPropagation
  , toggleDisabledOnChange
  , toggleDisabledInit
  , toggleMultiSelectIconInit
  , toggleNewObjectDropdown
  , keepAnchorOnSignIn
  , setFilecontentContainerHeight
  , setupAttachmentDetail
  , setupWikiTableSortableHeader
  , inlineAutoComplete
} from "./base.js";

export {
    openFlyout
  , closeFlyout
  , isMobile
  , setupFlyout
} from "./responsive.js";
