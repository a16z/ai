/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// webpack-livereload-plugin
/******/ 	(function() {
/******/ 	  if (typeof window === "undefined") { return };
/******/ 	  var id = "webpack-livereload-plugin-script";
/******/ 	  if (document.getElementById(id)) { return; }
/******/ 	  var el = document.createElement("script");
/******/ 	  el.id = id;
/******/ 	  el.async = true;
/******/ 	  el.src = "http://localhost:35729/livereload.js";
/******/ 	  document.head.appendChild(el);
/******/ 	}());
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************!*\
  !*** multi global ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! client/js/app/app.js */1);
	module.exports = __webpack_require__(/*! client/sass/screen.scss */3);


/***/ },
/* 1 */
/*!******************************!*\
  !*** ./client/js/app/app.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mobileMenu = __webpack_require__(/*! ./mobile-menu */ 2);
	
	var _mobileMenu2 = _interopRequireDefault(_mobileMenu);
	
	(0, _mobileMenu2['default'])();

/***/ },
/* 2 */
/*!**************************************!*\
  !*** ./client/js/app/mobile-menu.js ***!
  \**************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	exports['default'] = function () {
	  var menuBtn = document.getElementById('icon-bars');
	  var sideBar = document.getElementById('sidebar');
	  if (menuBtn) {
	    menuBtn.addEventListener('click', function (evt) {
	      evt.preventDefault();
	      sideBar.classList.add('active');
	    });
	  }
	  console.log(menuBtn);
	};
	
	module.exports = exports['default'];

/***/ },
/* 3 */
/*!*********************************!*\
  !*** ./client/sass/screen.scss ***!
  \*********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=global.bundle.js.map