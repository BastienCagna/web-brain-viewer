# Web Brain Viewer
Welcome to the WBV project. This typescript base package provide a web viewer dedicated to brain mesh visualization 
based on ThreeJS.

## Quick start (release coming soon)
If your are interest in to adding a viewer to your webpage, you just new to download the last 
javascript release and add it to your page.

## Development
Feel free to contribute by creating new issues, create your own fork...etc

## Build
### Compile typescript to javascript

### Generate documentation
You can use typedoc to generate the documentation by following those steps:
```shell
# Install typedoc using npm
npm install typedoc --save-dev

# Then compile the documentation to docs/ (add --watch while modifying the source code)
typedoc src/*.ts --name "Web Brain Viewer" --readme ./README.md
```