#!/bin/sh
while true; do
	EVENT=$(inotifywait -e modify --excludei ".*\.swp" --format '%e %f' -r ../src . 2>/dev/null)
	[ $? != 0 ] && continue

  [ "$EVENT" = "MODIFY ./" ] && continue
	echo "Running specs:"
	java -jar ../lib/jruby-complete-1.3.1.jar -S spec . -p *_spec.rb
	echo "Waiting."
done
