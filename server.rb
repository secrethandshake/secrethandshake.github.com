require 'webrick'
include WEBrick
WEBrick::HTTPUtils::DefaultMimeTypes.store 'svg', 'image/svg+xml'
s = HTTPServer.new(
 :Port => 3000,
 :DocumentRoot => Dir::pwd
)
trap("INT"){ s.shutdown }
s.start