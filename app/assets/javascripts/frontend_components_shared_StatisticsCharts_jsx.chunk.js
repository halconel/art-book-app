"use strict";
(self["webpackChunkart_book_app"] = self["webpackChunkart_book_app"] || []).push([["frontend_components_shared_StatisticsCharts_jsx"],{

/***/ "./frontend/components/shared/StatisticsCharts.jsx":
/*!*********************************************************!*\
  !*** ./frontend/components/shared/StatisticsCharts.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var recharts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! recharts */ "./node_modules/recharts/es6/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var CustomTooltip = function CustomTooltip(_ref) {
  var active = _ref.active,
    payload = _ref.payload,
    label = _ref.label,
    _ref$formatter = _ref.formatter,
    formatter = _ref$formatter === void 0 ? null : _ref$formatter;
  if (active && payload && payload.length) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Paper, {
      sx: {
        p: 1.5,
        minWidth: 120
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
      variant: "body2",
      sx: {
        mb: 0.5
      }
    }, label), payload.map(function (entry, index) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
        key: index,
        variant: "body2",
        sx: {
          color: entry.color,
          fontSize: '0.875rem'
        }
      }, entry.name, ": ", formatter ? formatter(entry.value) : entry.value);
    }));
  }
  return null;
};
var StatisticsCharts = function StatisticsCharts(_ref2) {
  var _ref2$data = _ref2.data,
    data = _ref2$data === void 0 ? {} : _ref2$data,
    _ref2$title = _ref2.title,
    title = _ref2$title === void 0 ? 'Statistics Overview' : _ref2$title,
    _ref2$showAll = _ref2.showAll,
    showAll = _ref2$showAll === void 0 ? false : _ref2$showAll;
  var theme = (0,_mui_material__WEBPACK_IMPORTED_MODULE_1__.useTheme)();

  // Default data structure
  var defaultData = _objectSpread({
    cycleProgress: [{
      month: 'Jan',
      cycles: 42,
      target: 60
    }, {
      month: 'Feb',
      cycles: 58,
      target: 60
    }, {
      month: 'Mar',
      cycles: 45,
      target: 60
    }, {
      month: 'Apr',
      cycles: 67,
      target: 60
    }, {
      month: 'May',
      cycles: 73,
      target: 60
    }, {
      month: 'Jun',
      cycles: 55,
      target: 60
    }],
    orderStatus: [{
      name: 'Completed',
      value: 45,
      color: theme.palette.success.main
    }, {
      name: 'In Progress',
      value: 23,
      color: theme.palette.info.main
    }, {
      name: 'Pending',
      value: 12,
      color: theme.palette.warning.main
    }, {
      name: 'Cancelled',
      value: 5,
      color: theme.palette.error.main
    }],
    dailyActivity: [{
      day: 'Mon',
      cycles: 12,
      hours: 8.5
    }, {
      day: 'Tue',
      cycles: 15,
      hours: 9.2
    }, {
      day: 'Wed',
      cycles: 8,
      hours: 6.1
    }, {
      day: 'Thu',
      cycles: 18,
      hours: 10.8
    }, {
      day: 'Fri',
      cycles: 14,
      hours: 8.9
    }, {
      day: 'Sat',
      cycles: 9,
      hours: 5.5
    }, {
      day: 'Sun',
      cycles: 6,
      hours: 3.2
    }],
    clientProgress: [{
      client: 'Client A',
      progress: 85
    }, {
      client: 'Client B',
      progress: 62
    }, {
      client: 'Client C',
      progress: 94
    }, {
      client: 'Client D',
      progress: 38
    }, {
      client: 'Client E',
      progress: 77
    }],
    monthlyRevenue: [{
      month: 'Jan',
      revenue: 4200,
      orders: 8
    }, {
      month: 'Feb',
      revenue: 3800,
      orders: 6
    }, {
      month: 'Mar',
      revenue: 5500,
      orders: 11
    }, {
      month: 'Apr',
      revenue: 6200,
      orders: 12
    }, {
      month: 'May',
      revenue: 4900,
      orders: 9
    }, {
      month: 'Jun',
      revenue: 7100,
      orders: 14
    }]
  }, data);
  var formatCurrency = function formatCurrency(value) {
    return "$".concat(value.toLocaleString());
  };
  var formatPercent = function formatPercent(value) {
    return "".concat(value, "%");
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h5",
    gutterBottom: true,
    sx: {
      mb: {
        xs: 2,
        md: 3
      },
      fontSize: {
        xs: '1.25rem',
        sm: '1.5rem'
      },
      fontWeight: 600
    }
  }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    container: true,
    spacing: {
      xs: 2,
      md: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: showAll ? 6 : 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, {
    sx: {
      p: {
        xs: 2,
        md: 3
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true,
    sx: {
      fontSize: {
        xs: '1rem',
        md: '1.25rem'
      },
      fontWeight: 600
    }
  }, "Monthly Cycle Progress"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.ResponsiveContainer, {
    width: "100%",
    height: {
      xs: 250,
      md: 300
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.LineChart, {
    data: defaultData.cycleProgress
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.XAxis, {
    dataKey: "month"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.YAxis, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CustomTooltip, null)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Legend, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Line, {
    type: "monotone",
    dataKey: "cycles",
    stroke: theme.palette.primary.main,
    strokeWidth: 3,
    dot: {
      fill: theme.palette.primary.main,
      r: 6
    },
    activeDot: {
      r: 8
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Line, {
    type: "monotone",
    dataKey: "target",
    stroke: theme.palette.secondary.main,
    strokeDasharray: "5 5",
    strokeWidth: 2
  })))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: showAll ? 6 : 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, {
    sx: {
      p: {
        xs: 2,
        md: 3
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true,
    sx: {
      fontSize: {
        xs: '1rem',
        md: '1.25rem'
      },
      fontWeight: 600
    }
  }, "Order Status Distribution"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.ResponsiveContainer, {
    width: "100%",
    height: {
      xs: 250,
      md: 300
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.PieChart, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Pie, {
    data: defaultData.orderStatus,
    cx: "50%",
    cy: "50%",
    innerRadius: 60,
    outerRadius: 100,
    paddingAngle: 2,
    dataKey: "value",
    label: function label(_ref3) {
      var name = _ref3.name,
        percent = _ref3.percent;
      return "".concat(name, " ").concat((percent * 100).toFixed(0), "%");
    }
  }, defaultData.orderStatus.map(function (entry, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Cell, {
      key: "cell-".concat(index),
      fill: entry.color
    });
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CustomTooltip, null)
  })))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true
  }, "Weekly Activity Overview"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.AreaChart, {
    data: defaultData.dailyActivity
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.XAxis, {
    dataKey: "day"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.YAxis, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CustomTooltip, null)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Area, {
    type: "monotone",
    dataKey: "cycles",
    stackId: "1",
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.main,
    fillOpacity: 0.6
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Area, {
    type: "monotone",
    dataKey: "hours",
    stackId: "2",
    stroke: theme.palette.secondary.main,
    fill: theme.palette.secondary.main,
    fillOpacity: 0.6
  })))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true
  }, "Client Project Progress"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.RadialBarChart, {
    cx: "50%",
    cy: "50%",
    innerRadius: "10%",
    outerRadius: "90%",
    barSize: 20,
    data: defaultData.clientProgress
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.RadialBar, {
    minAngle: 15,
    label: {
      position: 'insideStart',
      fill: '#fff'
    },
    background: true,
    clockWise: true,
    dataKey: "progress",
    fill: theme.palette.success.main
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CustomTooltip, {
      formatter: formatPercent
    })
  })))))), showAll && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true
  }, "Monthly Revenue & Orders"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.BarChart, {
    data: defaultData.monthlyRevenue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.CartesianGrid, {
    strokeDasharray: "3 3"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.XAxis, {
    dataKey: "month"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.YAxis, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CustomTooltip, {
      formatter: formatCurrency
    })
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Legend, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Bar, {
    dataKey: "revenue",
    fill: theme.palette.primary.main,
    radius: [4, 4, 0, 0]
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(recharts__WEBPACK_IMPORTED_MODULE_2__.Bar, {
    dataKey: "orders",
    fill: theme.palette.secondary.main,
    radius: [4, 4, 0, 0]
  })))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true
  }, "Performance Metrics"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    sx: {
      height: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      pt: 2
    }
  }, [{
    label: 'Productivity Score',
    value: 87,
    color: theme.palette.success.main
  }, {
    label: 'Client Satisfaction',
    value: 94,
    color: theme.palette.info.main
  }, {
    label: 'Project Completion',
    value: 78,
    color: theme.palette.warning.main
  }, {
    label: 'Quality Rating',
    value: 92,
    color: theme.palette.primary.main
  }].map(function (metric, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      key: index,
      sx: {
        flex: 1
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 0.5
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
      variant: "body2"
    }, metric.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
      variant: "body2",
      fontWeight: "bold"
    }, metric.value, "%")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      sx: {
        width: '100%',
        height: 8,
        backgroundColor: 'grey.200',
        borderRadius: 1,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      sx: {
        width: "".concat(metric.value, "%"),
        height: '100%',
        backgroundColor: metric.color,
        borderRadius: 1,
        transition: 'width 1s ease-in-out'
      }
    })));
  }))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StatisticsCharts);

/***/ })

}]);
//# sourceMappingURL=frontend_components_shared_StatisticsCharts_jsx.chunk.js.map