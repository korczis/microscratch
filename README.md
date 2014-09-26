# microscratch

Light Weight Web Application Framework using node.js, mongo, sockets, ember.js, ... 


## Preview

[![preview](http://imageshack.com/a/img834/9594/wc8v.png)](http://microscratch.net)

## Applications

* [apolllocrawler.com](http://apollocrawler.com/) - [http://apollocrawler.com/](ApolloCrawler.com / Our) presentation
* [craftsmen.apolllocrawler.com](http://craftsmen.apollocrawler.com/) - Listing of Czech Craftmens

## Project Status

[![GitHub version](https://badge.fury.io/gh/korczis%2Fmicroscratch.png)](http://badge.fury.io/gh/korczis%2Fmicroscratch)
[![Build Status](https://travis-ci.org/ApolloCrawler/microscratch.png?branch=master)](https://travis-ci.org/ApolloCrawler/microscratch)
[![Dependency Status](https://gemnasium.com/korczis/microscratch.png)](https://gemnasium.com/korczis/microscratch)
[![Total views](https://sourcegraph.com/api/repos/github.com/ApolloCrawler/microscratch/counters/views.png)](https://sourcegraph.com/github.com/ApolloCrawler/microscratch) 
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ApolloCrawler/microscratch/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

### Uptime

[![uptime](https://share.pingdom.com/banners/f06c9d22)](http://stats.pingdom.com/49gq27kjt2mp/1103301)
## What microscratch is - first day in school

### What is the microscratch?

  microscratch is minimalistic opionated modern web application framework.
  
  For clarification of words and term used please see [glossary](https://github.com/korczis/microscratch/blob/master/GLOSSARY.md).

### What are the principles?

 * Being [idiomatic](https://github.com/rwaldron/idiomatic.js) - All code in any code-base should look like a single person typed it, no matter how many people contributed.
 * Asking [smart questions](http://www.catb.org/~esr/faqs/smart-questions.html).
   
### Why is called microscratch?

  It is smaller brother of "the scratch". Google for it.

### Is it really so micro?
   
  It depends. Compared with what? Reports will be added soon...

### Why should I choose microscratch?

  - It's open-source and will be!
  - It's quite small
  - It's quite modular
  - It's quite easy to understand
  - It's tested
  - It's continuously integrated
  - It's under the code QA
  - It's up-to-date
  
### Will the microscratch fit me?

  It depends. What are your needs? There is [no silver bullet](http://en.wikipedia.org/wiki/No_Silver_Bullet). 

### Is it production ready?

  It depends. If is the node.js, mongo and/or ember are production ready for you then microscratch is ready too...
  
## Installation

### Is the installation difficult?

  No. It will take you only few seconds, lets try...
  
### What are the prerequisites?

  If you have following, you should be ready to go.
  
  - [git](http://git-scm.com/)
    
    Git is a free and open source distributed version control system.

  - [node.js](http://nodejs.org/)

    Node.js is a platform built on Chrome's JavaScript runtime
    
  - [mongodb](http://www.mongodb.org/)
  
    MongoDB (from "humongous") is an open-source document database.
  
### What is the easiest way to try?

  If you have stuff mentioned above installed try this.
  
  ```
  # Install grunt and bower
  sudo npm install -g bower mocha mocha-phantomjs phantomjs grunt grunt-cli forever jsdoc@3.2.1

  # Install sass ruby gem
  sudo gem install sass
  
  # Clone repository
  git clone http://github.com/korczis/microscratch.git
  
  # Install required node modules
  npm install
  
  # Or
  sudo npm install
  
  # Install required bower modules
  bower install
  
  # Compile assets
  grunt build
  
  # Run application
  node app.js
  ```

## Troubleshooting

### Mac OS X

If you run `grunt server` you may get an error:

	Running "watch" task
	Waiting...Warning: EMFILE, too many open files

This is because default `ulimit` on Mac OS X is 256. Increate number of possibly open files to 10000 by:

	ulimit -n 10000

## First start

  - What is happening during the boot sequence?
  - What are the main configs?
  - Can I add my own initializers?
  - What are the steps in bootstrap process?
  - How can I override option from CLI?

## CLI

  - What is CLI?
  - How to use CLI?
  - Are there any CLI examples?

## Communication

- How can I communicate?
- How can I communicate horizontally?
- How can I communicate vertically?
- How can I communicate between modules?
- How can I communicate between apps?
- How can I communicate between clients?
- How can I communicate between servers?

## Technologies - Under the hood

- What technologies do you use?
- What is the usage of technology 'XYZ' ?
- Why was the technology 'XYZ' chosen instead of 'ABC' ?
- Can I replace technology 'XYZ' with ... ?
- Is the technology 'XYZ' needed? I can no use it? Do you have fallback?

## DIY - Do It Yourself 

- How can I add my own environment?
- How can I add my own module?
- How can I add my own application?

## Deploy and monitor - Going wild 
- How can I deploy *microscratch application*?
- How can I monitor my *microscratch application*?
 
## Hacking - Under the hood

- How can I hook to module events?
- How can I hook to application events?
- How can I hook to client events?
- How can I hook to server events?

## Film about film making

- What was the inspiration for modules layer?
- What was the inspiration for applications layer?
- What was the inspiration for clients layer?
- What was the inspiration for servers layer?

## Collaborating 

- How can I report issue?
- How can I propose feature?
- How can I help as developer?

## References
  
  To Be Done
