// Copyright, 2013-2014, by Tomas Korcak. <korczis@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function (global) {
    require(["ember"], function (ember) {
        var deps = [
            //  Application
            'app',

            //  Router
            '../app/logger.js',
            '../app/router.js',
            '../app/storage.js',
            '../app/xhr.js',

            // Helpers
            '../app/helpers/cond.js',
            '../app/helpers/datetime.js',
            '../app/helpers/linkTo.js',
            '../app/helpers/math.js',
            '../app/helpers/misc.js',
            '../app/helpers/object.js',

            // Routes
            '../app/routes/admin/index.js',
            '../app/routes/application.js',

            // Templates
            '../assets/templates.js',

            "exports"
        ];

        require(deps, function (App, exports) {
                App.initialize();

                return App;
            }
        );
    });
})(this);