'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilities = require('../utilities');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Component: Container
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Update & delegation layer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var isBrowser = typeof HTMLElement !== 'undefined';

/**
 *
 */

var Container = function (_Component) {
  _inherits(Container, _Component);

  function Container(props) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

    _this.state = {
      root: _this.getRoot(props),
      latest: null
    };
    return _this;
  }

  _createClass(Container, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.tree !== this.props.tree) {
        this.setState({
          root: this.getRoot(nextProps),
          latest: null
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onHover = _props.onHover,
          customRender = _props.customRender;
      var root = this.state.root;

      return _react2.default.createElement(
        'div',
        { className: 'Container' },
        _react2.default.createElement(
          'div',
          { className: 'Container__Nodes' },
          _react2.default.createElement(_Node2.default, { node: root, update: this.onUpdate.bind(this), onHover: onHover, customRender: customRender })
        ),
        _react2.default.createElement('input', { className: 'Container__Input', type: 'text', ref: 'input',
          onFocus: this.toggleFocus.bind(this),
          onBlur: this.toggleFocus.bind(this)
        })
      );
    }

    /**
     * Retrieve an immutable representation of the nodes (incl. extended/trimmed data)
     * @param  {Object}  props.tree                - [description]
     * @param  {Array}   props.defaultExpandedTags - [description]
     * @return {Object}                            - [description]
     */

  }, {
    key: 'getRoot',
    value: function getRoot(_ref) {
      var tree = _ref.tree,
          defaultExpandedTags = _ref.defaultExpandedTags;

      transformNodes(tree, [], true);
      return _immutable2.default.fromJS(tree[0]);

      // recursive enumeration
      function transformNodes(tree, keyPath, initial) {
        tree.forEach(function (node, i) {
          node.depth = (0, _utilities.getDepth)(node);
          node.selector = (0, _utilities.getSelector)(node.name ? node : node.parent);
          node.keyPath = initial ? keyPath : [].concat(_toConsumableArray(keyPath), ['children', i]);
          node.state = defaultExpandedTags.indexOf(node.name) > -1 ? { expanded: true } : {};
          if (node.children) {
            if (node.children.length) {
              node.children = node.children.filter(function (child) {
                return child.type !== 'text' || child.data.trim().length;
              });
              transformNodes(node.children, node.keyPath);
            } else {
              delete node.children;
            }
          }
          if (node.attribs && !Object.keys(node.attribs).length) {
            delete node.attribs;
          }
          delete node.parent;
          delete node.next;
          delete node.prev;
        });
      }
    }

    /**
     * [toggleFocus description]
     * @param  {Event} e - [description]
     */

  }, {
    key: 'toggleFocus',
    value: function toggleFocus(e) {
      var _this2 = this;

      e.preventDefault();
      e.stopPropagation();

      var latest = this.state.latest;


      if (e.type === 'focus') {
        return this.onUpdate(null, latest, 'toggleFocus', { selected: true, unfocused: false });
      }
      // === blur || delay to check upcoming click
      this.timeout = setTimeout(function () {
        return _this2.onUpdate(null, latest, 'toggleFocus', { selected: false, unfocused: true });
      }, 100);
    }

    /**
     * Reducer for different actions based on the type
     * @param  {String} type      - [description]
     * @param  {Object} component - [description]
     * @param  {Object} nextState - [description]
     */

    /**
     * Reducer for different actions based on the type
     * @param  {Event}          e         - [description]
     * @param  {ReactComponent} component - [description]
     * @param  {String}         type      - [description]
     * @param  {Object}         data      - [description]
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(e, component, type, data) {
      var _context2;

      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();

      clearTimeout(this.timeout);

      var _props2 = this.props,
          origin = _props2.origin,
          onHover = _props2.onHover,
          onExpand = _props2.onExpand,
          onSelect = _props2.onSelect,
          onUnfocus = _props2.onUnfocus;
      var node = component.props.node;
      var _state = this.state,
          root = _state.root,
          latest = _state.latest;


      var name = node.get('name');
      var attribs = node.get('attribs');
      var selector = node.get('selector');

      var element = origin ? selector.match('>') ? origin.querySelectorAll(selector)[0] : origin : { // shallow representation
        tagName: name || node.get('type'),
        attributes: attribs && attribs.toJS(),
        selector: selector
      };

      var keyPath = [].concat(_toConsumableArray(node.get('keyPath').toJS()), ['state']);
      var updater = null; // toggle: (value) => !value

      switch (type) {

        case 'toggleHover':
          if (onHover && onHover.call(this, element, component) !== undefined) return;
          if (typeof data.tailed !== 'undefined') {
            keyPath = [].concat(_toConsumableArray(keyPath), ['tailed']);
            updater = function updater() {
              return data.tailed;
            };
            break;
          }
          return;

        case 'toggleExpand':
          if (onExpand && onExpand.call(this, element, component) !== undefined) return;
          // check: unfolding all children
          if (e.altKey && e.ctrlKey) {
            return this.setState({
              root: root.setIn([].concat(_toConsumableArray(node.get('keyPath').toJS())), (0, _utilities.setDeep)(node, 'children', ['state', 'expanded'], true))
            });
          }
          // TODO:
          // - fix [issue#1]('tailed')
          // console.log(node.toJSON(), data, e.target)
          keyPath = [].concat(_toConsumableArray(keyPath), ['expanded']);
          updater = function updater(expanded) {
            return !expanded;
          };
          break;

        case 'triggerSelect':
          if (latest) {
            var _context;

            this.refs.input.blur();
            var latestKeyPath = [].concat(_toConsumableArray(latest.props.node.get('keyPath').toJS()), ['state']);
            return this.setState({
              root: root.withMutations(function (map) {
                return map.setIn([].concat(_toConsumableArray(latestKeyPath), ['tailed']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['selected']), false).setIn([].concat(_toConsumableArray(latestKeyPath), ['unfocused']), false).setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed);
              }),
              latest: component
            }, (_context = this.refs.input).focus.bind(_context));
          }
          return this.setState({
            root: root.setIn([].concat(_toConsumableArray(keyPath), ['tailed']), data.tailed),
            latest: component
          }, (_context2 = this.refs.input).focus.bind(_context2));

        case 'toggleFocus':
          if (data.selected) {
            if (onSelect && onSelect.call(this, element, component) !== undefined) return;
          } else {
            if (onUnfocus && onUnfocus.call(this, element, component) !== undefined) return;
          }
          return this.setState({
            root: root.withMutations(function (map) {
              return map.setIn([].concat(_toConsumableArray(keyPath), ['selected']), data.selected).setIn([].concat(_toConsumableArray(keyPath), ['unfocused']), data.unfocused);
            })
          });
      }

      this.setState({
        root: root.updateIn(keyPath, updater)
      });
    }
  }]);

  return Container;
}(_react.Component);

Container.propTypes = {
  tree: _propTypes2.default.array.isRequired,
  origin: _propTypes2.default.instanceOf(isBrowser && HTMLElement),
  defaultExpandedTags: _propTypes2.default.array.isRequired,
  customRender: _propTypes2.default.func,
  onHover: _propTypes2.default.func,
  onExpand: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  onUnfocus: _propTypes2.default.func
};
exports.default = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGFpbmVyLmpzeCJdLCJuYW1lcyI6WyJpc0Jyb3dzZXIiLCJIVE1MRWxlbWVudCIsIkNvbnRhaW5lciIsInByb3BzIiwic3RhdGUiLCJyb290IiwiZ2V0Um9vdCIsImxhdGVzdCIsIm5leHRQcm9wcyIsInRyZWUiLCJzZXRTdGF0ZSIsIm9uSG92ZXIiLCJjdXN0b21SZW5kZXIiLCJvblVwZGF0ZSIsInRvZ2dsZUZvY3VzIiwiZGVmYXVsdEV4cGFuZGVkVGFncyIsInRyYW5zZm9ybU5vZGVzIiwiZnJvbUpTIiwia2V5UGF0aCIsImluaXRpYWwiLCJmb3JFYWNoIiwibm9kZSIsImkiLCJkZXB0aCIsInNlbGVjdG9yIiwibmFtZSIsInBhcmVudCIsImluZGV4T2YiLCJleHBhbmRlZCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZmlsdGVyIiwiY2hpbGQiLCJ0eXBlIiwiZGF0YSIsInRyaW0iLCJhdHRyaWJzIiwiT2JqZWN0Iiwia2V5cyIsIm5leHQiLCJwcmV2IiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwic2VsZWN0ZWQiLCJ1bmZvY3VzZWQiLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsImNvbXBvbmVudCIsImNsZWFyVGltZW91dCIsIm9yaWdpbiIsIm9uRXhwYW5kIiwib25TZWxlY3QiLCJvblVuZm9jdXMiLCJnZXQiLCJlbGVtZW50IiwibWF0Y2giLCJxdWVyeVNlbGVjdG9yQWxsIiwidGFnTmFtZSIsImF0dHJpYnV0ZXMiLCJ0b0pTIiwidXBkYXRlciIsImNhbGwiLCJ1bmRlZmluZWQiLCJ0YWlsZWQiLCJhbHRLZXkiLCJjdHJsS2V5Iiwic2V0SW4iLCJyZWZzIiwiaW5wdXQiLCJibHVyIiwibGF0ZXN0S2V5UGF0aCIsIndpdGhNdXRhdGlvbnMiLCJtYXAiLCJmb2N1cyIsInVwZGF0ZUluIiwicHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwiaW5zdGFuY2VPZiIsImZ1bmMiXSwibWFwcGluZ3Mi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QUFMLENBQWM7QUFDWkwsY0FBTUEsS0FBS3NFLFFBQUwsQ0FBY3pELE9BQWQsRUFBdUIyQyxPQUF2QjtBQURNLE9BQWQ7QUFHRDs7Ozs7O0FBeE1rQjNELFMsQ0FFWjBFLFMsR0FBWTtBQUNqQm5FLFFBQU0sb0JBQVVvRSxLQUFWLENBQWdCQyxVQURMO0FBRWpCNUIsVUFBUSxvQkFBVTZCLFVBQVYsQ0FBcUIvRSxhQUFhQyxXQUFsQyxDQUZTO0FBR2pCYyx1QkFBcUIsb0JBQVU4RCxLQUFWLENBQWdCQyxVQUhwQjtBQUlqQmxFLGdCQUFjLG9CQUFVb0UsSUFKUDtBQUtqQnJFLFdBQVMsb0JBQVVxRSxJQUxGO0FBTWpCN0IsWUFBVSxvQkFBVTZCLElBTkg7QUFPakI1QixZQUFVLG9CQUFVNEIsSUFQSDtBQVFqQjNCLGFBQVcsb0JBQVUyQjtBQVJKLEM7a0JBRkE5RSxTIiwiZmlsZSI6ImNvbXBvbmVudHMvQ29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIENvbXBvbmVudDogQ29udGFpbmVyXG4gKlxuICogVXBkYXRlICYgZGVsZWdhdGlvbiBsYXllclxuICovXG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcblxuaW1wb3J0IHsgZ2V0U2VsZWN0b3IsIGdldERlcHRoLCBzZXREZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJ1xuaW1wb3J0IE5vZGUgZnJvbSAnLi9Ob2RlJ1xuXG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRyZWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIG9yaWdpbjogUHJvcFR5cGVzLmluc3RhbmNlT2YoaXNCcm93c2VyICYmIEhUTUxFbGVtZW50KSxcbiAgICBkZWZhdWx0RXhwYW5kZWRUYWdzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjdXN0b21SZW5kZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSG92ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRXhwYW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25VbmZvY3VzOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByb290OiB0aGlzLmdldFJvb3QocHJvcHMpLFxuICAgICAgbGF0ZXN0OiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy50cmVlICE9PSB0aGlzLnByb3BzLnRyZWUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByb290OiB0aGlzLmdldFJvb3QobmV4dFByb3BzKSxcbiAgICAgICAgbGF0ZXN0OiBudWxsXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IHsgb25Ib3ZlciwgY3VzdG9tUmVuZGVyIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzLnN0YXRlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQ29udGFpbmVyX19Ob2Rlc1wiPlxuICAgICAgICAgIDxOb2RlIG5vZGU9e3Jvb3R9IHVwZGF0ZT17Ojp0aGlzLm9uVXBkYXRlfSBvbkhvdmVyPXtvbkhvdmVyfSBjdXN0b21SZW5kZXI9e2N1c3RvbVJlbmRlcn0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cIkNvbnRhaW5lcl9fSW5wdXRcIiB0eXBlPVwidGV4dFwiIHJlZj1cImlucHV0XCJcbiAgICAgICAgICBvbkZvY3VzPXs6OnRoaXMudG9nZ2xlRm9jdXN9XG4gICAgICAgICAgb25CbHVyPXs6OnRoaXMudG9nZ2xlRm9jdXN9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYW4gaW1tdXRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBub2RlcyAoaW5jbC4gZXh0ZW5kZWQvdHJpbW1lZCBkYXRhKVxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBwcm9wcy50cmVlICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtBcnJheX0gICBwcm9wcy5kZWZhdWx0RXhwYW5kZWRUYWdzIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0Um9vdCAoeyB0cmVlLCBkZWZhdWx0RXhwYW5kZWRUYWdzIH0pIHtcbiAgICB0cmFuc2Zvcm1Ob2Rlcyh0cmVlLCBbXSwgdHJ1ZSlcbiAgICByZXR1cm4gSW1tdXRhYmxlLmZyb21KUyh0cmVlWzBdKVxuXG4gICAgLy8gcmVjdXJzaXZlIGVudW1lcmF0aW9uXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTm9kZXMgKHRyZWUsIGtleVBhdGgsIGluaXRpYWwpIHtcbiAgICAgIHRyZWUuZm9yRWFjaCgobm9kZSwgaSkgPT4ge1xuICAgICAgICBub2RlLmRlcHRoID0gZ2V0RGVwdGgobm9kZSlcbiAgICAgICAgbm9kZS5zZWxlY3RvciA9IGdldFNlbGVjdG9yKG5vZGUubmFtZSA/IG5vZGUgOiBub2RlLnBhcmVudClcbiAgICAgICAgbm9kZS5rZXlQYXRoID0gaW5pdGlhbCA/IGtleVBhdGggOiBbLi4ua2V5UGF0aCwgJ2NoaWxkcmVuJywgaV1cbiAgICAgICAgbm9kZS5zdGF0ZSA9IGRlZmF1bHRFeHBhbmRlZFRhZ3MuaW5kZXhPZihub2RlLm5hbWUpID4gLTEgPyB7IGV4cGFuZGVkOiB0cnVlIH0gOiB7fVxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQudHlwZSAhPT0gJ3RleHQnIHx8IGNoaWxkLmRhdGEudHJpbSgpLmxlbmd0aClcbiAgICAgICAgICAgIHRyYW5zZm9ybU5vZGVzKG5vZGUuY2hpbGRyZW4sIG5vZGUua2V5UGF0aClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuYXR0cmlicyAmJiAhT2JqZWN0LmtleXMobm9kZS5hdHRyaWJzKS5sZW5ndGgpIHtcbiAgICAgICAgICBkZWxldGUgbm9kZS5hdHRyaWJzXG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50XG4gICAgICAgIGRlbGV0ZSBub2RlLm5leHRcbiAgICAgICAgZGVsZXRlIG5vZGUucHJldlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogW3RvZ2dsZUZvY3VzIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtFdmVudH0gZSAtIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHRvZ2dsZUZvY3VzIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgY29uc3QgeyBsYXRlc3QgfSA9IHRoaXMuc3RhdGVcblxuICAgIGlmIChlLnR5cGUgPT09ICdmb2N1cycpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uVXBkYXRlKG51bGwsIGxhdGVzdCwgJ3RvZ2dsZUZvY3VzJywgeyBzZWxlY3RlZDogdHJ1ZSwgdW5mb2N1c2VkOiBmYWxzZSB9KVxuICAgIH1cbiAgICAvLyA9PT0gYmx1ciB8fCBkZWxheSB0byBjaGVjayB1cGNvbWluZyBjbGlja1xuICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25VcGRhdGUobnVsbCwgbGF0ZXN0LCAndG9nZ2xlRm9jdXMnLCB7IHNlbGVjdGVkOiBmYWxzZSwgdW5mb2N1c2VkOiB0cnVlIH0pXG4gICAgfSwgMTAwKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgZm9yIGRpZmZlcmVudCBhY3Rpb25zIGJhc2VkIG9uIHRoZSB0eXBlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbXBvbmVudCAtIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSBuZXh0U3RhdGUgLSBbZGVzY3JpcHRpb25dXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZWR1Y2VyIGZvciBkaWZmZXJlbnQgYWN0aW9ucyBiYXNlZCBvbiB0aGUgdHlwZVxuICAgKiBAcGFyYW0gIHtFdmVudH0gICAgICAgICAgZSAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtSZWFjdENvbXBvbmVudH0gY29tcG9uZW50IC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgdHlwZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgZGF0YSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgb25VcGRhdGUgKGUsIGNvbXBvbmVudCwgdHlwZSwgZGF0YSkge1xuICAgIGlmIChlICYmIGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIChlICYmIGUuc3RvcFByb3BhZ2F0aW9uKSBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuXG4gICAgY29uc3QgeyBvcmlnaW4sIG9uSG92ZXIsIG9uRXhwYW5kLCBvblNlbGVjdCwgb25VbmZvY3VzIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBub2RlIH0gPSBjb21wb25lbnQucHJvcHNcbiAgICBjb25zdCB7IHJvb3QsIGxhdGVzdCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgY29uc3QgbmFtZSA9IG5vZGUuZ2V0KCduYW1lJylcbiAgICBjb25zdCBhdHRyaWJzID0gbm9kZS5nZXQoJ2F0dHJpYnMnKVxuICAgIGNvbnN0IHNlbGVjdG9yID0gbm9kZS5nZXQoJ3NlbGVjdG9yJylcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBvcmlnaW4gPyAoc2VsZWN0b3IubWF0Y2goJz4nKSA/IG9yaWdpbi5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVswXSA6IG9yaWdpbikgOlxuICAgICAgICAgICAgICAgICAgICB7IC8vIHNoYWxsb3cgcmVwcmVzZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICB0YWdOYW1lOiBuYW1lIHx8IG5vZGUuZ2V0KCd0eXBlJyksXG4gICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlicyAmJiBhdHRyaWJzLnRvSlMoKSxcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgdmFyIGtleVBhdGggPSBbLi4ubm9kZS5nZXQoJ2tleVBhdGgnKS50b0pTKCksICdzdGF0ZSddXG4gICAgdmFyIHVwZGF0ZXIgPSBudWxsIC8vIHRvZ2dsZTogKHZhbHVlKSA9PiAhdmFsdWVcblxuICAgIHN3aXRjaCAodHlwZSkge1xuXG4gICAgICBjYXNlICd0b2dnbGVIb3Zlcic6XG4gICAgICAgIGlmIChvbkhvdmVyICYmIG9uSG92ZXIuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEudGFpbGVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGtleVBhdGggPSBbLi4ua2V5UGF0aCwgJ3RhaWxlZCddXG4gICAgICAgICAgdXBkYXRlciA9ICgpID0+IGRhdGEudGFpbGVkXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgY2FzZSAndG9nZ2xlRXhwYW5kJzpcbiAgICAgICAgaWYgKG9uRXhwYW5kICYmIG9uRXhwYW5kLmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgLy8gY2hlY2s6IHVuZm9sZGluZyBhbGwgY2hpbGRyZW5cbiAgICAgICAgaWYgKGUuYWx0S2V5ICYmIGUuY3RybEtleSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJvb3Q6IHJvb3Quc2V0SW4oWy4uLm5vZGUuZ2V0KCdrZXlQYXRoJykudG9KUygpXSwgc2V0RGVlcChub2RlLCAnY2hpbGRyZW4nLCBbJ3N0YXRlJywgJ2V4cGFuZGVkJ10sIHRydWUpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgLy8gLSBmaXggW2lzc3VlIzFdKCd0YWlsZWQnKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlLnRvSlNPTigpLCBkYXRhLCBlLnRhcmdldClcbiAgICAgICAga2V5UGF0aCA9IFsuLi5rZXlQYXRoLCAnZXhwYW5kZWQnXVxuICAgICAgICB1cGRhdGVyID0gKGV4cGFuZGVkKSA9PiAhZXhwYW5kZWRcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAndHJpZ2dlclNlbGVjdCc6XG4gICAgICAgIGlmIChsYXRlc3QpIHtcbiAgICAgICAgICB0aGlzLnJlZnMuaW5wdXQuYmx1cigpXG4gICAgICAgICAgY29uc3QgbGF0ZXN0S2V5UGF0aCA9IFsuLi5sYXRlc3QucHJvcHMubm9kZS5nZXQoJ2tleVBhdGgnKS50b0pTKCksICdzdGF0ZSddXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcm9vdDogcm9vdC53aXRoTXV0YXRpb25zKChtYXApID0+IG1hcFxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5sYXRlc3RLZXlQYXRoLCAndGFpbGVkJ10sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5sYXRlc3RLZXlQYXRoLCAnc2VsZWN0ZWQnXSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmxhdGVzdEtleVBhdGgsICd1bmZvY3VzZWQnXSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SW4oWy4uLmtleVBhdGgsICd0YWlsZWQnXSwgZGF0YS50YWlsZWQpXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgbGF0ZXN0OiBjb21wb25lbnRcbiAgICAgICAgICB9LCA6OnRoaXMucmVmcy5pbnB1dC5mb2N1cylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcm9vdDogcm9vdC5zZXRJbihbLi4ua2V5UGF0aCwgJ3RhaWxlZCddLCBkYXRhLnRhaWxlZCksXG4gICAgICAgICAgbGF0ZXN0OiBjb21wb25lbnRcbiAgICAgICAgfSwgOjp0aGlzLnJlZnMuaW5wdXQuZm9jdXMpXG5cbiAgICAgIGNhc2UgJ3RvZ2dsZUZvY3VzJzpcbiAgICAgICAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICAgICAgICBpZiAob25TZWxlY3QgJiYgb25TZWxlY3QuY2FsbCh0aGlzLCBlbGVtZW50LCBjb21wb25lbnQpICE9PSB1bmRlZmluZWQpIHJldHVyblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvblVuZm9jdXMgJiYgb25VbmZvY3VzLmNhbGwodGhpcywgZWxlbWVudCwgY29tcG9uZW50KSAhPT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcm9vdDogcm9vdC53aXRoTXV0YXRpb25zKChtYXApID0+IG1hcFxuICAgICAgICAgICAgICAgICAgICAgIC5zZXRJbihbLi4ua2V5UGF0aCwgJ3NlbGVjdGVkJ10sIGRhdGEuc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgLnNldEluKFsuLi5rZXlQYXRoLCAndW5mb2N1c2VkJ10sIGRhdGEudW5mb2N1c2VkKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJvb3Q6IHJvb3QudXBkYXRlSW4oa2V5UGF0aCwgdXBkYXRlcilcbiAgICB9KVxuICB9XG5cbn1cbiJdfQ==
