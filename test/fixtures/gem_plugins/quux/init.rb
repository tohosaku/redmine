Redmine::Plugin.register :quux_plugin do
  # For gemmed plugins, the attributes of the plugin are described in the gemspec.
  # The correspondence between plugin attributes and gemspec is as follows
  name "This name should be overwritten with gemspec 'summary'"
  author_url "https://example.org/this_url_should_not_be_overwritten_with_gemspec"
end
