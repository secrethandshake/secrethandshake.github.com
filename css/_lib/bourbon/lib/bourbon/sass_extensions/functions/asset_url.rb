# Asset URL thingy

module Bourbon::SassExtensions::Functions::AssetUrl
  def self.included(base)
    if base.respond_to?(:declare)
      base.declare :asset_url, :args => [:path]
    end
  end
  def asset_url(path)
    assert_type path, :String
    @@time ||= Time.now.to_i
    @jekyll_config ||= YAML.load(File.read(ENV['SASS_JEKYLL_CONFIG']))
    Sass::Script::String.new("url(#{@jekyll_config['cdn_url']}#{path.value}?#{@@time})")
  end
end