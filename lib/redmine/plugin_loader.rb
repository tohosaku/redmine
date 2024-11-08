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
  class PluginPath
    attr_reader :initializer

    def initialize(dir)
      @dir = dir
      @initializer = File.join dir, 'init.rb'
    end

    def run_initializer
      load initializer if has_initializer?
    end

    def to_s
      @dir
    end

    ASSET_PATHS = ['app/assets', 'assets']

    def assets_dir
      paths = ASSET_PATHS.filter_map do |entry|
        path = Pathname.new(@dir).join(entry)
        path if path.exist? && path.directory?
      end
      @assets_dir = paths.first
    end

    def has_assets_dir?
      return false unless assets_dir

      File.directory?(assets_dir)
    end

    def has_initializer?
      File.file?(@initializer)
    end

    def draw_importmap
      return unless importmap_path

      begin
        instance_eval(importmap_path.read, importmap_path.to_s)
      rescue => e
        Logger.warn "Importmap Error Occured. #{e}"
      end
    end

    def importmap_path
      path = File.join(@dir, 'config/importmap.rb')
      if File.exist? path
        Pathname.new(path)
      else
        nil
      end
    end

    private

    def pin(name, to: nil, preload: true)
      plugin_id     = File.basename(@dir)
      modified_name = File.join(plugin_id, name)
      asset_name    = File.join(PluginLoader.prefix, plugin_id, to)

      Rails.application.importmap.pin modified_name, to: asset_name, preload: preload
    end

    # with foo plugin
    # pin_all_from 'app/javascript/src', under: 'src', to: 'src'
    #   => import { ExampleFunction } from 'foo/src/example_function'
    #
    # The path name of the stimulus controller is not changed.
    def pin_all_from(dir, under: nil, to: nil, preload: true)
      plugin_id   = File.basename(@dir)
      plugin_dir  = File.join(@dir, dir)
      if under == 'controllers'
        Rails.application.importmap.pin_all_from plugin_dir, under: under, to: to, preload: preload
      else
        modified_under = File.join(plugin_id, under)
        modified_to    = File.join(PluginLoader.prefix, plugin_id, to)
        Rails.application.importmap.pin_all_from plugin_dir, under: modified_under,
                                                             to: modified_to,
                                                             preload: preload
      end
    end
  end

  class PluginLoader
    # Absolute path to the directory where plugins are located
    cattr_accessor :directory
    self.directory = Rails.root.join Rails.application.config.redmine_plugins_directory

    cattr_accessor :prefix
    self.prefix = 'plugin_assets'

    # Absolute path to the public directory where plugins assets are copied
    cattr_accessor :public_directory
    self.public_directory = Rails.public_path.join(prefix)

    def self.load
      setup
      add_autoload_paths

      Rails.application.config.to_prepare do
        PluginLoader.directories.each(&:run_initializer)

        Redmine::Hook.call_hook :after_plugins_loaded
      end
    end

    def self.setup
      @plugin_directories = []

      Dir.glob(File.join(directory, '*')).each do |directory|
        next unless File.directory?(directory)

        @plugin_directories << PluginPath.new(directory)
      end
    end

    def self.add_autoload_paths
      directories.each do |directory|
        # Add the plugin directories to rails autoload paths
        engine_cfg = Rails::Engine::Configuration.new(directory.to_s)
        engine_cfg.paths.add 'lib', eager_load: true
        engine_cfg.all_eager_load_paths.each do |dir|
          Rails.autoloaders.main.push_dir dir
          Rails.application.config.watchable_dirs[dir] = [:rb]
        end
      end
    end

    def self.directories
      @plugin_directories
    end
  end
end
