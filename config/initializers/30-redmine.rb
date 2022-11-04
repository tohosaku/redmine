# frozen_string_literal: true

require 'redmine/configuration'
require 'redmine/plugin_loader'

Rails.application.config.to_prepare do
  I18n.backend = Redmine::I18n::Backend.new
  # Forces I18n to load available locales from the backend
  I18n.config.available_locales = nil

  Redmine::Preparation.prepare
end

# Load the secret token from the Redmine configuration file
secret = Redmine::Configuration['secret_token']
if secret.present?
  RedmineApp::Application.config.secret_token = secret
end

Redmine::PluginLoader.load
plugin_assets_reloader = Redmine::PluginLoader.create_assets_reloader

Rails.application.reloaders << plugin_assets_reloader
unless Redmine::Configuration['mirror_plugins_assets_on_startup'] == false
  plugin_assets_reloader.execute
end

Rails.application.config.to_prepare do
  Redmine::FieldFormat::RecordList.subclasses.each do |klass|
    klass.instance.reset_target_class
  end

  plugin_assets_reloader.execute_if_updated
end

Rails.application.config.to_prepare do
  module Propshaft
    LoadPath.prepend(Module.new do
      def assets_by_path
        extension_paths = {
          plugins: Redmine::Plugin.asset_paths,
          themes:  Redmine::Themes.asset_paths
        }
        merge_required = @cached_assets_by_path == nil && extension_paths.values.any?{|e| !e.empty? }

        super

        if merge_required
          extension_paths.each do |name, paths|
            assets = extension_assets(name, paths)
            @cached_assets_by_path.merge!(assets)
          end
        end
        @cached_assets_by_path
      end

      def extension_assets(name, extension_paths)
        extension_paths.each_with_object({}) do |(id, paths), hash|
          paths.each do |path|
            without_dotfiles(all_files_from_tree(path)).each do |file|
              logical_path = "#{name}/#{id}/#{file.relative_path_from(path)}"
              asset = Propshaft::Asset.new(file, logical_path: logical_path, version: version)
              hash[asset.logical_path.to_s] ||= asset
            end
          end
        end
      end
    end)
  end
end
