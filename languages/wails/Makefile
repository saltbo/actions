.PHONY: clean

dep:
	go install github.com/wailsapp/wails/v2/cmd/wails@v2.3.1

build: dep
	wails build

test: 
	echo "test success"
	
clean:
	rm -rf build/bin
	echo "clean success"