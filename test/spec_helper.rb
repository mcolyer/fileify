require 'java'
$CLASSPATH << '../lib'
require 'json.jar'
$CLASSPATH << '/usr/lib/jvm/java-6-sun-1.6.0.16/jre/lib'
require 'plugin.jar'
$CLASSPATH << '../bin'

$FIXTURES_DIR = File.expand_path(File.join(File.dirname(__FILE__), "fixtures"))

require 'spec'
