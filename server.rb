require 'webrick'
include WEBrick

mime_types = WEBrick::HTTPUtils::DefaultMimeTypes
mime_types.store 'js', 'application/javascript'
mime_types.store 'svg', 'image/svg+xml'

s = HTTPServer.new(
 :Port => 3000,
 :DocumentRoot => Dir::pwd,
 :MimeTypes => mime_types
)

trap("INT"){ s.shutdown }
s.start