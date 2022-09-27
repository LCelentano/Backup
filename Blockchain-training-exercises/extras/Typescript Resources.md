### What is Typescript?
Typescript has all functionality of Javascript with some added features, such as type interfaces. We reccomend using Jetbrains' Webstorm or Microsoft's VS code as your editor. If you are familiar with Javascript syntax, moving to Typescript should be simple.

### Installing
We use yarn for adding packages for our projects. While other package management softwares can be used, it's best practice to install everything using the same manager. Please refer to this [guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-the-yarn-package-manager-for-node-js
) for any further help with yarn


Typescript can be added to a project by running the following command while inside your project directory
> yarn add typescript --dev

### Running a Typescript program
Type script can be run from the command line by using two commands: tsc and node. An example of running a Typescript program looks like this

> tsc && node src/path/to/program.js

Note that the program you are actually running is a Javascript file. When you run tsc, it converts all .ts files into corresponding .js files. Where tsc looks for .ts files and where it writes the .js files can be configured in the tsconfig.json file.

Running the `tsc` command sometimes takes a long time to compile. While you may not notice this with only a couple .ts files, you will soon be running code with many more files. Instead of running tsc everytime, you can create a new run configuration that only converts newly changed .ts files into .js files. 

In Webstorm, you can do this by clicking the current file dropdown on the top right of the window. Then go to new configuration > Add new > Node.js. In the next window, under JavaScirpt file click on the browse file option. Navigate to the .js file you would like to run inside the src folder(not ts_src!). Next, in the Before launch window click the plus icon and select Compile TypeScript. You can now run this file by clicking the green play button on the top right. 

### Typescript configs
The `tsconfig.json` file tells tsc how to run ts programs. You can the tsconfig file in the bitcoinjs library [here](https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/tsconfig.json) or use our tsconfig file located [here](https://github.com/Blockchain-Research-Team/blockchain-training/blob/main/extras/tsconfig.json). 
