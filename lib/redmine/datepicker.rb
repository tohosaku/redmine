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
  class Datepicker
    extend Forwardable

    def_delegators :@view_context, :tag, :l, :content_for, :current_language, :stylesheet_link_tag, :raw

    def initialize(view_context)
      @view_context = view_context
      include_headers_tags
    end

    def render
      yield(self) if block_given?
    end

    def wrapper
      { controller: 'datepicker' }
    end

    def field
      { datepicker_target: 'input', action: 'click->datepicker#dispatch' }
    end

    def include_headers_tags
      tags = ''.html_safe
      content_for :header_tags do
        start_of_week = Setting.start_of_week
        start_of_week = l(:general_first_day_of_week, :default => '1') if start_of_week.blank?

        # Redmine uses 1..7 (monday..sunday) in settings and locales
        # wc-datepicker uses 0..6 (sunday..saturday), 7 needs to be changed to 0
        start_of_week = start_of_week.to_i % 7
        tags << tag.script(raw({labels: { clearButton: l(:button_clear), todayButton: l(:label_today) },
                                'first-days-of-week': start_of_week.to_i}.to_json),
                                type: 'application/json', id: 'datepicker-labels')
        tags << stylesheet_link_tag('wc-datepicker.css')
        tags << tag.template(id: 'datepicker-template') do
          tag.wc_datepicker(
            data: {
              datepicker_target: 'picker',
              action: 'click@window->datepicker#close keydown.esc@window->dialog#close scroll@document->datepicker#close selectDate->datepicker#select'
            },
            locale: current_language.to_s,
            'show-month-stepper': true,
            'show-clear-button': true,
            'show-today-button': true
          )
        end
        tags
      end
    end
  end
end
