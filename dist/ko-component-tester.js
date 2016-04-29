(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["ko-component-tester"] = factory(require("knockout"), require("jquery"));
	else
		root["ko-component-tester"] = factory(root["ko"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var $ = __webpack_require__(2);

	$.fn.simulate = function (eventName, value) {
	  if (value) {
	    this.val(value);
	  }
	  var event = window.document.createEvent('UIEvents');
	  event.initEvent(eventName, true, true);
	  this.get(0).dispatchEvent(event);
	  ko.tasks.runEarly();
	};

	$.fn.waitForBinding = function (bindingName) {
	  var _arguments = arguments;

	  var $el = this;
	  var binding = ko.bindingHandlers[bindingName].init ? ko.bindingHandlers[bindingName].init.bind(ko.bindingHandlers[bindingName].init) : function () {};

	  return new Promise(function (resolve) {
	    ko.bindingHandlers[bindingName].init = function (el) {
	      if ($el.get(0) === el) {
	        binding.apply(undefined, _arguments);
	        ko.tasks.schedule(function () {
	          ko.bindingHandlers[bindingName].init = binding;
	          resolve($el);
	        });
	      } else {
	        binding.apply(undefined, _arguments);
	      }
	    };
	  });
	};

	$.fn.waitForProperty = function (prop, val) {
	  var _this = this;

	  var timeout = arguments.length <= 2 || arguments[2] === undefined ? 2000 : arguments[2];

	  return new Promise(function (resolve, reject) {
	    if (typeof _this.$data[prop]() !== 'undefined' && (typeof val === 'undefined' || _this.$data[prop]() === val)) {
	      return resolve(_this.$data[prop]());
	    }

	    var timeoutId = setTimeout(function () {
	      killMe.dispose();
	      reject('Timed out waiting for property ' + prop);
	    }, timeout);

	    var killMe = _this.$data[prop].subscribe(function (v) {
	      if (val && v !== val || typeof v === 'undefined') {
	        return;
	      }

	      clearTimeout(timeoutId);
	      killMe.dispose();
	      ko.tasks.runEarly();
	      resolve(v);
	    });
	  });
	};

	ko.components.loaders.unshift({
	  loadComponent: function loadComponent(name, component, done) {
	    if (!component.viewModel) {
	      var ViewModel = function ViewModel(params) {
	        _classCallCheck(this, ViewModel);

	        ko.utils.extend(this, params);
	      };

	      component.viewModel = ViewModel;
	    }
	    done(null);
	  },
	  loadViewModel: function loadViewModel(name, config, done) {
	    if (typeof config === 'function') {
	      done(function (params) {
	        var viewModel = new config(params);
	        viewModel._calledWith = params;
	        return viewModel;
	      }, done);
	    } else if (config.createViewModel) {
	      done(function (params, componentInfo) {
	        var viewModel = config.createViewModel(params, componentInfo);
	        viewModel._calledWith = params;
	        return viewModel;
	      }, done);
	    } else {
	      done(null);
	    }
	  }
	});

	$.fn.getComponentParams = function () {
	  return ko.contextFor(ko.virtualElements.firstChild(this.get(0))).$component._calledWith;
	};

	function renderComponent(component) {
	  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var $el = $('<div data-bind="component: { name: \'SUT\', params: params }"></div>');
	  component.synchronous = true;

	  ko.components.register('SUT', component);

	  $('body').html($el);
	  ko.applyBindings({ params: params }, $el.get(0));
	  ko.tasks.runEarly();

	  ko.components.unregister('SUT');

	  $el.$data = $el.children().length > 0 ? ko.dataFor($el.children().get(0)) : ko.dataFor(ko.virtualElements.firstChild($el.get(0)));

	  return $el;
	}

	function renderHtml(_ref) {
	  var template = _ref.template;
	  var _ref$viewModel = _ref.viewModel;
	  var viewModel = _ref$viewModel === undefined ? {} : _ref$viewModel;

	  var $el = void 0;
	  try {
	    $el = $(template);
	  } catch (e) {
	    $el = $('<span />').text(template);
	  }

	  $('body').html($el);

	  if (typeof viewModel === 'function') {
	    ko.applyBindings(new viewModel(), $el.get(0));
	  } else {
	    ko.applyBindings(viewModel, $el.get(0));
	  }

	  ko.tasks.runEarly();

	  $el.$data = ko.dataFor(ko.virtualElements.firstChild($el.get(0)));

	  return $el;
	}

	module.exports = { renderComponent: renderComponent, renderHtml: renderHtml };

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;