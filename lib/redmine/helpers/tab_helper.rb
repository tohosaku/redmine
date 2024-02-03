# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-2023  Jean-Philippe Lang
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
  module Helpers
    module TabHelper
      class StimulusContext

        attr_reader :controller_name

        def initialize(controller_name)
          @controller_name = controller_name
        end

        def action(tab)
          if tab[:data]
            tab[:data]
          else
            { action: "click->#{controller_name}#show", "#{controller_name}_name_param": tab[:name] }
          end
        end

        def link_target(tab)
          { "#{controller_name}_target": 'link' }.merge(action(tab))
        end

        def content_target(tab)
          { "#{controller_name}_target": 'content', 'tab_name': tab[:name] }
        end
      end

      def tab_container(controller_name, &block)
        context = StimulusContext.new(controller_name)

        tag.div nil, data: { controller: controller_name } do
          block.call(context)
        end
      end
    end
  end
end
