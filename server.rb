require 'webrick'

include WEBrick
s = HTTPServer.new(
 :Port => 3000,
 :DocumentRoot => Dir::pwd
)
trap("INT"){ s.shutdown }
s.start