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

module StimulusHelper
  def stimulus_append_actions(hash, *actions)
    action = hash.delete(:action)
    additional_actions = actions.join(' ')
    hash[:action] = action ? action + ' ' + aditional_actions : additional_actions
    hash
  end

  ConditionalAttribute = Struct.new do
    def identifier
      "conditional-attribute"
    end

    def actions(array, hash)
      array << "#{identifier}#update"
      hash[:conditional_attribute_target] = 'source'
    end

    def toggle_hidden(equal_to: nil, not_equal_to: nil, group: nil)
      toggle_attribute('toggleHidden', equal_to, not_equal_to, group)
    end

    def toggle_disabled(equal_to: nil, not_equal_to: nil, group: nil)
      toggle_attribute('toggleDisabled', equal_to, not_equal_to, group)
    end

    def toggle_checked(equal_to: nil, not_equal_to: nil, group: nil)
      toggle_attribute('toggleChecked', equal_to, not_equal_to, group)
    end

    def toggle(equal_to: nil, not_equal_to: nil, group: nil)
      toggle_attribute('toggle', equal_to, not_equal_to, group)
    end

    def element(group: nil, name: nil, inverse: nil)
      {
        conditional_attribute_target: 'element',
        conditional_attribute_group: group,
        conditional_attribute_name: name,
        conditional_attribute_inverse: inverse
      }
    end

    private
    def toggle_attribute(action, equal_to, not_equal_to, group)
      reise ArgumentError, 'cannot equal_to and not_equal_to at the same time' if equal_to && not_equal_to

      {
        action: "conditional-attribute##{action}",
        conditional_attribute_target: 'source',
        conditional_attribute_equal_to_param: equal_to,
        conditional_attribute_not_equal_to_param: not_equal_to,
        conditional_attribute_group: group
      }
    end
  end

  def conditional_attribute
    @conditional_attribute ||= ConditionalAttribute.new
  end
end

