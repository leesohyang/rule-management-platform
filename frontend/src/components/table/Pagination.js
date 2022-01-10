import React, { Component } from "react";
import classnames from "classnames";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

//
// import _ from './utils'

var defaultButton = function defaultButton(props) {
  return React.createElement(
    "button",
    _extends({ type: "button" }, props, { className: "-btn" }),
    props.children
  );
};

var ReactTablePagination = (function(_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    _classCallCheck(this, ReactTablePagination);

    var _this = _possibleConstructorReturn(
      this,
      (
        ReactTablePagination.__proto__ ||
        Object.getPrototypeOf(ReactTablePagination)
      ).call(this)
    );

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [
    {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        this.setState({ page: nextProps.page });
      }
    },
    {
      key: "getSafePage",
      value: function getSafePage(page) {
        if (Number.isNaN(page)) {
          page = this.props.page;
        }
        return Math.min(Math.max(page, 0), this.props.pages - 1);
      }
    },
    {
      key: "changePage",
      value: function changePage(page) {
        page = this.getSafePage(page);
        this.setState({ page: page });
        if (this.props.page !== page) {
          this.props.onPageChange(page);
        }
      }
    },
    {
      key: "applyPage",
      value: function applyPage(e) {
        if (e) {
          e.preventDefault();
        }
        var page = this.state.page;
        this.changePage(page === "" ? this.props.page : page);
      }
    },
    {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _props = this.props,
          pages = _props.pages,
          page = _props.page,
          showPageSizeOptions = _props.showPageSizeOptions,
          pageSizeOptions = _props.pageSizeOptions,
          pageSize = _props.pageSize,
          showPageJump = _props.showPageJump,
          canPrevious = _props.canPrevious,
          canNext = _props.canNext,
          onPageSizeChange = _props.onPageSizeChange,
          className = _props.className,
          _props$PreviousCompon = _props.PreviousComponent,
          PreviousComponent =
            _props$PreviousCompon === undefined
              ? defaultButton
              : _props$PreviousCompon,
          _props$NextComponent = _props.NextComponent,
          NextComponent =
            _props$NextComponent === undefined
              ? defaultButton
              : _props$NextComponent;

        return React.createElement(
          "div",
          {
            className: classnames(className, "-pagination"),
            style: this.props.style
          },
          React.createElement(
            "div",
            { className: "-previous-first" },
            React.createElement(
              PreviousComponent,
              {
                onClick: function onClick() {
                  if (!canPrevious) return;
                  _this2.changePage(0);
                },
                disabled: !canPrevious
              },
              this.props.previousText
            )
          ),
          React.createElement(
            "div",
            { className: "-previous" },
            React.createElement(
              PreviousComponent,
              {
                onClick: function onClick() {
                  if (!canPrevious) return;
                  _this2.changePage(page - 1);
                },
                disabled: !canPrevious
              },
              this.props.previousText
            )
          ),
          React.createElement(
            "div",
            { className: "-center" },
            React.createElement(
              "span",
              { className: "-pageInfo" },
              this.props.pageText,
              " ",
              showPageJump
                ? React.createElement(
                    "div",
                    { className: "-pageJump" },
                    React.createElement("input", {
                      type: this.state.page === "" ? "text" : "number",
                      onChange: function onChange(e) {
                        var val = e.target.value;
                        var page = val - 1;
                        if (val === "") {
                          return _this2.setState({ page: val });
                        }
                        _this2.setState({ page: _this2.getSafePage(page) });
                      },
                      value: this.state.page === "" ? "" : this.state.page + 1,
                      onBlur: this.applyPage,
                      onKeyPress: function onKeyPress(e) {
                        if (e.which === 13 || e.keyCode === 13) {
                          _this2.applyPage();
                        }
                      }
                    })
                  )
                : React.createElement(
                    "span",
                    { className: "-currentPage" },
                    page + 1
                  ),
              " ",
              this.props.ofText,
              " ",
              React.createElement(
                "span",
                { className: "-totalPages" },
                pages || 1
              )
            ),
            showPageSizeOptions &&
              React.createElement(
                "span",
                { className: "select-wrap -pageSizeOptions" },
                React.createElement(
                  "select",
                  {
                    onChange: function onChange(e) {
                      return onPageSizeChange(Number(e.target.value));
                    },
                    value: pageSize
                  },
                  pageSizeOptions.map(function(option, i) {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      React.createElement(
                        "option",
                        { key: i, value: option },
                        option,
                        " ",
                        _this2.props.rowsText
                      )
                    );
                  })
                )
              )
          ),
          React.createElement(
            "div",
            { className: "-next" },
            React.createElement(
              NextComponent,
              {
                onClick: function onClick() {
                  if (!canNext) return;
                  _this2.changePage(page + 1);
                },
                disabled: !canNext
              },
              this.props.nextText
            )
          ),
          React.createElement(
            "div",
            { className: "-next-last" },
            React.createElement(
              NextComponent,
              {
                onClick: function onClick() {
                  if (!canNext) return;
                  _this2.changePage(pages);
                },
                disabled: !canNext
              },
              this.props.nextText
            )
          )
        );
      }
    }
  ]);

  return ReactTablePagination;
})(Component);

export default ReactTablePagination;
