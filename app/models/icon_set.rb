# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-2022  Jean-Philippe Lang
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

class IconSet
  extend ActionView::Helpers::AssetUrlHelper
  extend Redmine::Icon::MapLoader

  def self.fetch(name)
    @icons ||= create_map
    @icons[name]
  end

  def self.create_map
    icon_map = load_icon_map

    Redmine::Plugin.all.each { |plugin| icon_map.merge! plugin.load_icon_map }

    current_theme = Redmine::Themes.theme(Setting.ui_theme)
    icon_map.merge! current_theme.load_icon_map if current_theme.present?

    icon_map.freeze
  end

  def self.icon_config_dir
    Rails.application.config.redmine_svg_icon_map
  end

  def self.icon_dir
    '/icons'
  end
end
