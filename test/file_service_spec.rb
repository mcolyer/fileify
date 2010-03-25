require 'spec_helper'

java_import 'name.colyer.matt.fileify.FileService'

describe FileService do
  before(:each) do
    @file_service = FileService.new
    @file_name = File.join($FIXTURES_DIR, "file")
    @file_content = "hello world\n"
    File.open(@file_name, "w"){|f| f.write(@file_content)}
  end

  after(:each) do
    FileUtils.rm(@file_name)
  end

  it "should be able to run methods in a privileged manner" do
    @file_service.runPrivileged("read", '["'+@file_name+'"]').should == '{"data":"'+@file_content.gsub("\n", "\\n")+'"}'
  end

  it "should be able to read a file" do
    @file_service.read(@file_name).should == '{"data":"'+@file_content.gsub("\n", "\\n")+'"}'
  end

  it "should handle a non-existant file" do
    @file_service.read("/tmp/this-file-doesn-t-exist").should == '{"error":"File not found"}'
  end

  it "should be able to write a file" do
    content = "special\n"
    @file_service.write(@file_name, content).should == "{}"
    File.read(@file_name).should == content
  end

  it "should handle writes to an non-existant directory" do
    @file_service.write(File.join(@file_name, "subdir"), @file_content).should == '{"error":"File not found"}'
  end

end
