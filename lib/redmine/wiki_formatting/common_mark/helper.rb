# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-  Jean-Philippe Lang
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

module Redmine
  module WikiFormatting
    module CommonMark
      module Helper
        def initial_page_content(page)
          "# #{page.pretty_title}"
        end

        def wiki_help_url
          help_file = "/help/#{current_language.to_s.downcase}/wiki_syntax_common_mark.html"
          # fall back to the english help page if there is none for the current
          # language
          unless File.readable? Rails.public_path.join(help_file)
            help_file = "/help/en/wiki_syntax_common_mark.html"
          end
          "#{Redmine::Utils.relative_url_root}#{help_file}"
        end
      end
    end
  end
end
