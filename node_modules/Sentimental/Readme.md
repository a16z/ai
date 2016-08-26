[![Build Status](https://secure.travis-ci.org/thinkroth/Sentimental.png)](http://travis-ci.org/thinkroth/Sentimental)
# SentiMental - Putting the Mental in Sentimental
      
  Sentiment analysis tool for node.js based on the [AFINN-111 wordlist](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010).

  Version 1.0 introduces performance improvements making it both the first, and now fastest, AFINN backed Sentiment Analysis tool for node.
  
## Install
    $ npm install Sentimental

## Features

  * Positivity ranking
  * Negativity ranking
  * Analyze - combines Positivity and Negativity ranking into an aggregate sentiment score

## Example
```js
var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;

analyze("Hey you worthless scumbag"); //Score: -6, Comparative:-1.5
positivity("This is so cool"); //Score: 1, Comparative:.25
negativity("Hey you worthless scumbag"); //Score: 6, Comparative:1.5
analyze("I am happy"); //Score: 3, Comparative: 1
analyze("I am so happy"); //Score: 6, Comparative: 1.5
analyze("I am extremely happy"); //Score: 12, Comparative: 3
analyze("I am really sad"); //Score: -4, Comparative: -1
```



## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install

then run the tests:

    $ make test



## License 

(The MIT License)

Copyright (c) 2012 Kevin M Roth &lt;kevinroth82@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
