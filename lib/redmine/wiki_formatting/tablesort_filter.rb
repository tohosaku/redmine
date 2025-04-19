# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-  Jean-Philippe Lang
# This code is released under the GNU General Public License.

module Redmine
  module WikiFormatting
    class TablesortFilter < HTML::Pipeline::Filter
      include ERB::Util
      include ActionView::Helpers::TagHelper
      include ActionView::Helpers::UrlHelper
      include ActionView::Helpers::AssetTagHelper
      include IconsHelper
      include Propshaft::Helper

      def call
        return doc unless Setting.wiki_tablesort_enabled?

        doc.search("table").each do |node|
          rows = node.search('tr')
          next if rows.size < 3

          tr = rows.first
          if tr.search('th').present?
            node['data-controller'] = 'tablesort'
            tr['data-sort-method']  = 'none'
            tr.search('td').each do |td|
              td['data-sort-method'] = 'none'
            end
          end
        end
        doc.search('pre').each do |node|
          node['data-clipboard-target'] = 'pre'
          # Wrap the <pre> element with a container and add a copy button
          node.wrap('<div class="pre-wrapper" data-controller="clipboard"></div>')

          # Copy the contents of the pre tag when copyButton is clicked
          node.prepend_child('<a class="copy-pre-content-link icon-only" data-action="clipboard#copyPre">' + sprite_icon('copy-pre-content', size: 18) + '</a>')
        end
        doc
      end
    end
  end
end
