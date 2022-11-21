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

module TurboStreamActionsHelper
  def show_modal(target = nil, width: nil, title: nil, partial: nil, locals: {}, &)
    dialog = target || 'ajax-modal'
    html = @view_context.component('remote_dialog', width: width, title: title, partial: partial, locals: locals, &)
    update dialog, html
  end

  def hide_modal(target = nil)
    dialog = target || 'ajax-modal'
    data = {
      modal_target: 'hide'
    }
    append(dialog) { tag.template nil, data: data }
  end

  def hide(target)
    append target do
      tag.template data: {visibility_target: 'dummy', force: 'false'}
    end
  end
end
