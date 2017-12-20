'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Component: Node
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Representation of an HTML element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// http://www.w3.org/TR/html-markup/syntax.html#void-elements
var voidTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

/**
 *
 */

var Node = function (_Component) {
  _inherits(Node, _Component);

  function Node() {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
  }

  _createClass(Node, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.node !== this.props.node;
    }
  }, {
    key: 'render',
    value: function render() {
      var customRender = this.props.customRender;

      var Renderable = this.getRenderable();
      return !customRender ? Renderable : customRender(function (decorate) {
        return decorate(Renderable) || _react2.default.createElement(Renderable, Renderable.props);
      }, this.props.node.toJS());
    }
  }, {
    key: 'getRenderable',
    value: function getRenderable() {
      var _this2 = this;

      var _props = this.props,
          node = _props.node,
          update = _props.update,
          onHover = _props.onHover;


      var type = node.get('type');
      var name = node.get('name');
      var data = node.get('data');
      var attribs = node.get('attribs');
      var depth = node.get('depth');
      var children = node.get('children');

      var expanded = node.getIn(['state', 'expanded']);
      var selected = node.getIn(['state', 'selected']);
      var tailed = node.getIn(['state', 'tailed']);
      var unfocused = node.getIn(['state', 'unfocused']);

      var tagEventHandlers = {
        onMouseDown: function onMouseDown(e) {
          return update(e, _this2, 'triggerSelect', { tailed: false });
        }
      };
      if (onHover) {
        Object.assign(tagEventHandlers, {
          onMouseOver: function onMouseOver(e) {
            return update(e, _this2, 'toggleHover');
          },
          onMouseOut: function onMouseOut(e) {
            return update(e, _this2, 'toggleHover');
          }
        });
      }
      if (children && children.size && name !== 'html') {
        Object.assign(tagEventHandlers, {
          onDoubleClick: function onDoubleClick(e) {
            return update(e, _this2, 'toggleExpand');
          }
        });
      }

      // indentation
      var base = {
        paddingLeft: (depth + 1) * 10
      };

      var modifier = {
        selected: selected,
        unfocused: unfocused,
        tailed: tailed

        // render: text + comments
      };if (type === 'text' || type === 'comment') {
        return _react2.default.createElement(
          'div',
          { className: 'Node' },
          _react2.default.createElement(
            'div',
            _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
            type === 'text' ? _react2.default.createElement(
              'span',
              { className: 'Node__Wrap' },
              '"',
              _react2.default.createElement(
                'span',
                { className: 'Node__Text' },
                data
              ),
              '"'
            ) : _react2.default.createElement(
              'span',
              { className: 'Node__Comment' },
              '<!--' + data + '-->'
            )
          )
        );
      }

      // format: single-line tag, entries without children or just one + self-closing tags (e.g. images)
      if (!children || children.size === 1 && children.getIn([0, 'type']) === 'text') {
        var content = children && children.getIn([0, 'data']) || voidTags.indexOf(name) === -1;
        if (typeof content === 'boolean' || content.length < 500) {
          // only include less than 500
          return _react2.default.createElement(
            'div',
            { className: 'Node' },
            _react2.default.createElement(
              'div',
              _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
              _react2.default.createElement(
                'span',
                { className: 'Node__Container' },
                this.getOpenTag(!content),
                content && _react2.default.createElement(
                  'span',
                  { className: 'Node__Content' },
                  content
                ),
                content && this.getCloseTag()
              )
            )
          );
        }
      }

      // indentation
      var baseExpander = {
        left: base.paddingLeft - 12

        // render: collapsed + extended content
      };var head = _react2.default.createElement(
        'div',
        _extends({ className: (0, _classnames2.default)(["Node__Tag", "Node__Head", modifier]), style: base }, tagEventHandlers),
        name !== 'html' && _react2.default.createElement(
          'span',
          { className: 'Node__Expander', style: baseExpander, onMouseDown: function onMouseDown(e) {
              return update(e, _this2, 'toggleExpand');
            } },
          !expanded ? _react2.default.createElement(
            'span',
            null,
            '\u25B6'
          ) : _react2.default.createElement(
            'span',
            null,
            '\u25BC'
          )
        ),
        _react2.default.createElement(
          'span',
          { className: 'Node__Container' },
          this.getOpenTag(),
          !expanded && _react2.default.createElement(
            'span',
            null,
            '\u2026'
          ),
          !expanded && this.getCloseTag()
        )
      );

      // invoke head styling
      if (!selected && !unfocused) {
        Object.assign(tagEventHandlers, {
          onMouseOver: function onMouseOver(e) {
            return update(e, _this2, 'toggleHover', { tailed: true });
          },
          onMouseOut: function onMouseOut(e) {
            return update(e, _this2, 'toggleHover', { tailed: false });
          }
        });
      }

      return _react2.default.createElement(
        'div',
        { className: 'Node' },
        head,
        expanded && _react2.default.createElement(
          'div',
          { className: 'Node__Children' },
          children.map(function (child, i) {
            return _react2.default.createElement(Node, _extends({}, _this2.props, { node: child, key: i }));
          })
        ),
        expanded && _react2.default.createElement(
          'div',
          _extends({
            className: (0, _classnames2.default)(["Node__Tag", "Node__Tail", modifier]), style: base
          }, tagEventHandlers, {
            onMouseDown: function onMouseDown(e) {
              return update(e, _this2, 'triggerSelect', { tailed: true });
            }
          }),
          this.getCloseTag()
        )
      );
    }
  }, {
    key: 'getOpenTag',
    value: function getOpenTag(selfclosing) {
      var node = this.props.node;

      var name = node.get('name');
      var attribs = node.get('attribs');
      return _react2.default.createElement(
        'span',
        { className: 'Node__Wrap' },
        '<',
        _react2.default.createElement(
          'span',
          { className: 'Node__Name' },
          name
        ),
        attribs && attribs.entrySeq().map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          var isLink = ['src', 'href'].indexOf(key) > -1;
          return _react2.default.createElement(
            'span',
            { className: 'Node__Wrap', key: key },
            '\xA0',
            _react2.default.createElement(
              'span',
              { className: 'Node__AttributeKey' },
              key
            ),
            '="',
            !isLink ? _react2.default.createElement(
              'span',
              { className: 'Node__AttributeValue' },
              value
            ) : _react2.default.createElement(
              'a',
              { className: (0, _classnames2.default)(['Node__AttributeValue'], {
                  link: true,
                  external: /^https?:/.test(value)
                }),
                href: value, target: '_blank'
              },
              value
            ),
            '"'
          );
        }),
        selfclosing && '/',
        '>'
      );
    }
  }, {
    key: 'getCloseTag',
    value: function getCloseTag() {
      var node = this.props.node;

      var name = node.get('name');
      return _react2.default.createElement(
        'span',
        { className: 'Node__Wrap' },
        '<',
        _react2.default.createElement(
          'span',
          { className: 'Node__Name' },
          '/' + name
        ),
        '>'
      );
    }
  }]);

  return Node;
}(_react.Component);

Node.propTypes = {
  node: _propTypes2.default.object.isRequired,
  update: _propTypes2.default.func.isRequired,
  onHover: _propTypes2.default.func,
  customRenderer: _propTypes2.default.func
};
exports.default = Node;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTm9kZS5qc3giXSwibmFtZXMiOlsidm9pZFRhZ3MiLCJOb2RlIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwibm9kZSIsInByb3BzIiwiY3VzdG9tUmVuZGVyIiwiUmVuZGVyYWJsZSIsImdldFJlbmRlcmFibGUiLCJkZWNvcmF0ZSIsInRvSlMiLCJ1cGRhdGUiLCJvbkhvdmVyIiwidHlwZSIsImdldCIsIm5hbWUiLCJkYXRhIiwiYXR0cmlicyIsImRlcHRoIiwiY2hpbGRyZW4iLCJleHBhbmRlZCIsImdldEluIiwic2VsZWN0ZWQiLCJ0YWlsZWQiLCJ1bmZvY3VzZWQiLCJ0YWdFdmVudEhhbmRsZXJzIiwib25Nb3VzZURvd24iLCJlIiwiT2JqZWN0IiwiYXNzaWduIiwib25Nb3VzZU92ZXIiLCJvbk1vdXNlT3V0Iiwic2l6ZSIsIm9uRG91YmxlQ2xpY2siLCJiYXNlIiwicGFkZGluZ0xlZnQiLCJtb2RpZmllciIsImNvbnRlbnQiLCJpbmRleE9mIiwibGVuZ3RoIiwiZ2V0T3BlblRhZyIsImdldENsb3NlVGFnIiwiYmFzZUV4cGFuZGVyIiwibGVmdCIsImhlYWQiLCJtYXAiLCJjaGlsZCIsImkiLCJzZWxmY2xvc2luZyIsImVudHJ5U2VxIiwia2V5IiwidmFsdWUiLCJpc0xpbmsiLCJsaW5rIiwiZXh0ZXJuYWwiLCJ0ZXN0IiwicHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJjdXN0b21SZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OytlQVJBOzs7Ozs7QUFVQTtBQUNBLElBQU1BLFdBQVcsQ0FDZixNQURlLEVBQ1AsTUFETyxFQUNDLElBREQsRUFDTyxLQURQLEVBQ2MsU0FEZCxFQUN5QixPQUR6QixFQUNrQyxJQURsQyxFQUN3QyxLQUR4QyxFQUVmLE9BRmUsRUFFTixRQUZNLEVBRUksTUFGSixFQUVZLFVBRlosRUFFd0IsTUFGeEIsRUFF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b2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIENvbXBvbmVudDogTm9kZVxuICpcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGFuIEhUTUwgZWxlbWVudFxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sLW1hcmt1cC9zeW50YXguaHRtbCN2b2lkLWVsZW1lbnRzXG5jb25zdCB2b2lkVGFncyA9IFtcbiAgJ2FyZWEnLCAnYmFzZScsICdicicsICdjb2wnLCAnY29tbWFuZCcsICdlbWJlZCcsICdocicsICdpbWcnLFxuICAnaW5wdXQnLCAna2V5Z2VuJywgJ2xpbmsnLCAnbWVudWl0ZW0nLCAnbWV0YScsICdwYXJhbScsICdzb3VyY2UnLFxuICAndHJhY2snLCAnd2JyJ1xuXVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGUgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbm9kZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkhvdmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBjdXN0b21SZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUgKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRQcm9wcy5ub2RlICE9PSB0aGlzLnByb3BzLm5vZGVcbiAgfVxuXG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IHsgY3VzdG9tUmVuZGVyIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgUmVuZGVyYWJsZSA9IHRoaXMuZ2V0UmVuZGVyYWJsZSgpXG4gICAgcmV0dXJuICghY3VzdG9tUmVuZGVyKSA/IFJlbmRlcmFibGUgOiBjdXN0b21SZW5kZXIoKGRlY29yYXRlKSA9PiB7XG4gICAgICByZXR1cm4gZGVjb3JhdGUoUmVuZGVyYWJsZSkgfHwgPFJlbmRlcmFibGUgey4uLlJlbmRlcmFibGUucHJvcHN9Lz5cbiAgICB9LCB0aGlzLnByb3BzLm5vZGUudG9KUygpKVxuICB9XG5cbiAgZ2V0UmVuZGVyYWJsZSgpe1xuICAgIGNvbnN0IHsgbm9kZSwgdXBkYXRlLCBvbkhvdmVyIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB0eXBlID0gbm9kZS5nZXQoJ3R5cGUnKVxuICAgIGNvbnN0IG5hbWUgPSBub2RlLmdldCgnbmFtZScpXG4gICAgY29uc3QgZGF0YSA9IG5vZGUuZ2V0KCdkYXRhJylcbiAgICBjb25zdCBhdHRyaWJzID0gbm9kZS5nZXQoJ2F0dHJpYnMnKVxuICAgIGNvbnN0IGRlcHRoID0gbm9kZS5nZXQoJ2RlcHRoJylcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuZ2V0KCdjaGlsZHJlbicpXG5cbiAgICBjb25zdCBleHBhbmRlZCA9IG5vZGUuZ2V0SW4oWydzdGF0ZScsICdleHBhbmRlZCddKVxuICAgIGNvbnN0IHNlbGVjdGVkID0gbm9kZS5nZXRJbihbJ3N0YXRlJywgJ3NlbGVjdGVkJ10pXG4gICAgY29uc3QgdGFpbGVkID0gbm9kZS5nZXRJbihbJ3N0YXRlJywgJ3RhaWxlZCddKVxuICAgIGNvbnN0IHVuZm9jdXNlZCA9IG5vZGUuZ2V0SW4oWydzdGF0ZScsICd1bmZvY3VzZWQnXSlcblxuICAgIGNvbnN0IHRhZ0V2ZW50SGFuZGxlcnMgPSB7XG4gICAgICBvbk1vdXNlRG93bjogKGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndHJpZ2dlclNlbGVjdCcsIHsgdGFpbGVkOiBmYWxzZSB9KVxuICAgIH1cbiAgICBpZiAob25Ib3Zlcikge1xuICAgICAgT2JqZWN0LmFzc2lnbih0YWdFdmVudEhhbmRsZXJzLCB7XG4gICAgICAgIG9uTW91c2VPdmVyOiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVIb3ZlcicpLFxuICAgICAgICBvbk1vdXNlT3V0OiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVIb3ZlcicpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4uc2l6ZSAmJiBuYW1lICE9PSAnaHRtbCcpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGFnRXZlbnRIYW5kbGVycywge1xuICAgICAgICBvbkRvdWJsZUNsaWNrOiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVFeHBhbmQnKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBpbmRlbnRhdGlvblxuICAgIHZhciBiYXNlID0ge1xuICAgICAgcGFkZGluZ0xlZnQ6IChkZXB0aCArIDEpICogMTBcbiAgICB9XG5cbiAgICB2YXIgbW9kaWZpZXIgPSB7XG4gICAgICBzZWxlY3RlZDogc2VsZWN0ZWQsXG4gICAgICB1bmZvY3VzZWQ6IHVuZm9jdXNlZCxcbiAgICAgIHRhaWxlZFxuICAgIH1cblxuICAgIC8vIHJlbmRlcjogdGV4dCArIGNvbW1lbnRzXG4gICAgaWYgKHR5cGUgPT09ICd0ZXh0JyB8fCB0eXBlID09PSAnY29tbWVudCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTm9kZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFtcIk5vZGVfX1RhZ1wiLCBcIk5vZGVfX0hlYWRcIiwgbW9kaWZpZXJdKX0gc3R5bGU9e2Jhc2V9IHsuLi50YWdFdmVudEhhbmRsZXJzfT5cbiAgICAgICAgICAgIHt0eXBlID09PSAndGV4dCcgPyAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX1dyYXBcIj5cbiAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX1RleHRcIj57ZGF0YX08L3NwYW4+XCJcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fQ29tbWVudFwiPlxuICAgICAgICAgICAgICAgIHtgPCEtLSR7ZGF0YX0tLT5gfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQ6IHNpbmdsZS1saW5lIHRhZywgZW50cmllcyB3aXRob3V0IGNoaWxkcmVuIG9yIGp1c3Qgb25lICsgc2VsZi1jbG9zaW5nIHRhZ3MgKGUuZy4gaW1hZ2VzKVxuICAgIGlmICghY2hpbGRyZW4gfHwgY2hpbGRyZW4uc2l6ZSA9PT0gMSAmJiBjaGlsZHJlbi5nZXRJbihbMCwgJ3R5cGUnXSkgPT09ICd0ZXh0Jykge1xuICAgICAgY29uc3QgY29udGVudCA9IGNoaWxkcmVuICYmIGNoaWxkcmVuLmdldEluKFswLCAnZGF0YSddKSB8fCB2b2lkVGFncy5pbmRleE9mKG5hbWUpID09PSAtMVxuICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnYm9vbGVhbicgfHxjb250ZW50Lmxlbmd0aCA8IDUwMCkgeyAvLyBvbmx5IGluY2x1ZGUgbGVzcyB0aGFuIDUwMFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTm9kZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoW1wiTm9kZV9fVGFnXCIsIFwiTm9kZV9fSGVhZFwiLCBtb2RpZmllcl0pfSBzdHlsZT17YmFzZX0gey4uLnRhZ0V2ZW50SGFuZGxlcnN9PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19Db250YWluZXJcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRPcGVuVGFnKCFjb250ZW50KX1cbiAgICAgICAgICAgICAgICB7Y29udGVudCAmJiA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19Db250ZW50XCI+e2NvbnRlbnR9PC9zcGFuPn1cbiAgICAgICAgICAgICAgICB7Y29udGVudCAmJiB0aGlzLmdldENsb3NlVGFnKCl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW5kZW50YXRpb25cbiAgICB2YXIgYmFzZUV4cGFuZGVyID0ge1xuICAgICAgbGVmdDogYmFzZS5wYWRkaW5nTGVmdCAtIDEyXG4gICAgfVxuXG4gICAgLy8gcmVuZGVyOiBjb2xsYXBzZWQgKyBleHRlbmRlZCBjb250ZW50XG4gICAgY29uc3QgaGVhZCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFtcIk5vZGVfX1RhZ1wiLCBcIk5vZGVfX0hlYWRcIiwgbW9kaWZpZXJdKX0gc3R5bGU9e2Jhc2V9IHsuLi50YWdFdmVudEhhbmRsZXJzfT5cbiAgICAgICAge25hbWUgIT09ICdodG1sJyAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fRXhwYW5kZXJcIiBzdHlsZT17YmFzZUV4cGFuZGVyfSBvbk1vdXNlRG93bj17KGUpID0+IHVwZGF0ZShlLCB0aGlzLCAndG9nZ2xlRXhwYW5kJyl9PlxuICAgICAgICAgICAgeyFleHBhbmRlZCA/IDxzcGFuPiYjOTY1NDs8L3NwYW4+IDogPHNwYW4+JiM5NjYwOzwvc3Bhbj59ey8qKiAn4pa2JyA6ICfilrwnICoqL31cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0NvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLmdldE9wZW5UYWcoKX1cbiAgICAgICAgICB7IWV4cGFuZGVkICYmIDxzcGFuPiZoZWxsaXA7PC9zcGFuPn1cbiAgICAgICAgICB7IWV4cGFuZGVkICYmIHRoaXMuZ2V0Q2xvc2VUYWcoKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuXG4gICAgLy8gaW52b2tlIGhlYWQgc3R5bGluZ1xuICAgIGlmICghc2VsZWN0ZWQgJiYgIXVuZm9jdXNlZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0YWdFdmVudEhhbmRsZXJzLCB7XG4gICAgICAgIG9uTW91c2VPdmVyOiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVIb3ZlcicsIHsgdGFpbGVkOiB0cnVlIH0pLFxuICAgICAgICBvbk1vdXNlT3V0OiAoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0b2dnbGVIb3ZlcicsIHsgdGFpbGVkOiBmYWxzZSB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJOb2RlXCI+XG4gICAgICAgIHtoZWFkfVxuICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTm9kZV9fQ2hpbGRyZW5cIj5cbiAgICAgICAgICAgIHtjaGlsZHJlbi5tYXAoKGNoaWxkLCBpKSA9PiA8Tm9kZSB7Li4udGhpcy5wcm9wc30gbm9kZT17Y2hpbGR9IGtleT17aX0vPil9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFtcIk5vZGVfX1RhZ1wiLCBcIk5vZGVfX1RhaWxcIiwgbW9kaWZpZXJdKX0gc3R5bGU9e2Jhc2V9XG4gICAgICAgICAgICB7Li4udGFnRXZlbnRIYW5kbGVyc31cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4gdXBkYXRlKGUsIHRoaXMsICd0cmlnZ2VyU2VsZWN0JywgeyB0YWlsZWQ6IHRydWUgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuZ2V0Q2xvc2VUYWcoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldE9wZW5UYWcgKHNlbGZjbG9zaW5nKSB7XG4gICAgY29uc3QgeyBub2RlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgbmFtZSA9IG5vZGUuZ2V0KCduYW1lJylcbiAgICBjb25zdCBhdHRyaWJzID0gbm9kZS5nZXQoJ2F0dHJpYnMnKVxuICAgIHJldHVybiAgKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fV3JhcFwiPlxuICAgICAgICAmbHQ7XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX05hbWVcIj57bmFtZX08L3NwYW4+XG4gICAgICAgIHthdHRyaWJzICYmIGF0dHJpYnMuZW50cnlTZXEoKS5tYXAoKFsga2V5LCB2YWx1ZSBdKSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNMaW5rID0gWydzcmMnLCAnaHJlZiddLmluZGV4T2Yoa2V5KSA+IC0xXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX1dyYXBcIiBrZXk9e2tleX0+XG4gICAgICAgICAgICAgICZuYnNwO1xuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJOb2RlX19BdHRyaWJ1dGVLZXlcIj57a2V5fTwvc3Bhbj49XCJcbiAgICAgICAgICAgICAgeyFpc0xpbmsgP1xuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX0F0dHJpYnV0ZVZhbHVlXCI+e3ZhbHVlfTwvc3Bhbj4gOlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhbJ05vZGVfX0F0dHJpYnV0ZVZhbHVlJ10sIHtcbiAgICAgICAgICAgICAgICAgICAgbGluazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWw6IC9eaHR0cHM/Oi8udGVzdCh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgaHJlZj17dmFsdWV9IHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3ZhbHVlfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgICAge3NlbGZjbG9zaW5nICYmICcvJ31cbiAgICAgICAgJmd0O1xuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIGdldENsb3NlVGFnKCl7XG4gICAgY29uc3QgeyBub2RlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgbmFtZSA9IG5vZGUuZ2V0KCduYW1lJylcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiTm9kZV9fV3JhcFwiPlxuICAgICAgICAmbHQ7XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIk5vZGVfX05hbWVcIj57YC8ke25hbWV9YH08L3NwYW4+XG4gICAgICAgICZndDtcbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxufVxuIl19
