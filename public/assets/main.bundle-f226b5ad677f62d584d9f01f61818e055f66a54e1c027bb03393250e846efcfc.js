/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/actions/image_actions.js":
/*!*******************************************!*\
  !*** ./frontend/actions/image_actions.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLEAR_IMAGES: () => (/* binding */ CLEAR_IMAGES),
/* harmony export */   RECEIVE_IMAGES: () => (/* binding */ RECEIVE_IMAGES),
/* harmony export */   RECEIVE_PAGINATION: () => (/* binding */ RECEIVE_PAGINATION),
/* harmony export */   fetchImages: () => (/* binding */ fetchImages),
/* harmony export */   fetchMainPageImages: () => (/* binding */ fetchMainPageImages)
/* harmony export */ });
/* unused harmony exports receiveImages, receivePagination, clearImages */
/* harmony import */ var _api_images__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/images */ "./frontend/api/images.js");

var RECEIVE_IMAGES = 'RECEIVE_IMAGES';
var RECEIVE_PAGINATION = 'RECEIVE_PAGINATION';
var CLEAR_IMAGES = 'CLEAR_IMAGES';
var receiveImages = function receiveImages(images) {
  return {
    type: RECEIVE_IMAGES,
    images: images
  };
};
var receivePagination = function receivePagination(pagination) {
  return {
    type: RECEIVE_PAGINATION,
    pagination: pagination
  };
};
var clearImages = function clearImages() {
  return {
    type: CLEAR_IMAGES
  };
};
var fetchImages = function fetchImages(id) {
  return function (dispatch) {
    return _api_images__WEBPACK_IMPORTED_MODULE_0__.fetchImages(id).then(function (images) {
      return dispatch(receiveImages(images));
    });
  };
};
var fetchMainPageImages = function fetchMainPageImages() {
  return function (dispatch) {
    return _api_images__WEBPACK_IMPORTED_MODULE_0__.fetchImages({
      show_on_main_page: true
    }).then(function (paginated_images) {
      dispatch(receiveImages(paginated_images.images));
      dispatch(receivePagination(paginated_images.images));
    });
  };
};

/***/ }),

/***/ "./frontend/actions/slideshow_actions.js":
/*!***********************************************!*\
  !*** ./frontend/actions/slideshow_actions.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SET_CURRENT_IMAGE_INDEX: () => (/* binding */ SET_CURRENT_IMAGE_INDEX),
/* harmony export */   SET_IS_PLAYING: () => (/* binding */ SET_IS_PLAYING),
/* harmony export */   TOGGLE_PLAY_PAUSE: () => (/* binding */ TOGGLE_PLAY_PAUSE),
/* harmony export */   UPDATE_LAST_CHANGE_TIME: () => (/* binding */ UPDATE_LAST_CHANGE_TIME),
/* harmony export */   autoAdvanceSlideshow: () => (/* binding */ autoAdvanceSlideshow),
/* harmony export */   nextImage: () => (/* binding */ nextImage),
/* harmony export */   previousImage: () => (/* binding */ previousImage),
/* harmony export */   togglePlayPauseAndUpdateTime: () => (/* binding */ togglePlayPauseAndUpdateTime)
/* harmony export */ });
/* unused harmony exports setCurrentImageIndex, togglePlayPause, setIsPlaying, updateLastChangeTime */
var SET_CURRENT_IMAGE_INDEX = 'SET_CURRENT_IMAGE_INDEX';
var TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';
var SET_IS_PLAYING = 'SET_IS_PLAYING';
var UPDATE_LAST_CHANGE_TIME = 'UPDATE_LAST_CHANGE_TIME';

// Action creators
var setCurrentImageIndex = function setCurrentImageIndex(index) {
  return {
    type: SET_CURRENT_IMAGE_INDEX,
    index: index
  };
};
var togglePlayPause = function togglePlayPause() {
  return {
    type: TOGGLE_PLAY_PAUSE
  };
};
var setIsPlaying = function setIsPlaying(isPlaying) {
  return {
    type: SET_IS_PLAYING,
    isPlaying: isPlaying
  };
};
var updateLastChangeTime = function updateLastChangeTime() {
  return {
    type: UPDATE_LAST_CHANGE_TIME,
    timestamp: Date.now()
  };
};

// Thunk actions for navigation
var nextImage = function nextImage() {
  return function (dispatch, getState) {
    var _getState = getState(),
      images = _getState.images,
      slideshow = _getState.slideshow;
    var imageList = Object.values(images);
    if (imageList.length > 0) {
      // Ensure current index is within bounds
      var currentIndex = slideshow.currentImageIndex >= imageList.length ? 0 : slideshow.currentImageIndex;
      var nextIndex = (currentIndex + 1) % imageList.length;
      dispatch(setCurrentImageIndex(nextIndex));
      dispatch(updateLastChangeTime());
      dispatch(setIsPlaying(false)); // Stop auto-play when user manually navigates
    }
  };
};
var previousImage = function previousImage() {
  return function (dispatch, getState) {
    var _getState2 = getState(),
      images = _getState2.images,
      slideshow = _getState2.slideshow;
    var imageList = Object.values(images);
    if (imageList.length > 0) {
      // Ensure current index is within bounds
      var currentIndex = slideshow.currentImageIndex >= imageList.length ? 0 : slideshow.currentImageIndex;
      var prevIndex = currentIndex === 0 ? imageList.length - 1 : currentIndex - 1;
      dispatch(setCurrentImageIndex(prevIndex));
      dispatch(updateLastChangeTime());
      dispatch(setIsPlaying(false)); // Stop auto-play when user manually navigates
    }
  };
};
var togglePlayPauseAndUpdateTime = function togglePlayPauseAndUpdateTime() {
  return function (dispatch) {
    dispatch(togglePlayPause());
    dispatch(updateLastChangeTime());
  };
};

// Auto-advance action for timer
var autoAdvanceSlideshow = function autoAdvanceSlideshow() {
  return function (dispatch, getState) {
    var _getState3 = getState(),
      images = _getState3.images,
      slideshow = _getState3.slideshow;
    var imageList = Object.values(images);
    if (slideshow.isPlaying && imageList.length > 0) {
      // Ensure current index is within bounds
      var currentIndex = slideshow.currentImageIndex >= imageList.length ? 0 : slideshow.currentImageIndex;
      var nextIndex = (currentIndex + 1) % imageList.length;
      dispatch(setCurrentImageIndex(nextIndex));
      dispatch(updateLastChangeTime());
    }
  };
};

/***/ }),

/***/ "./frontend/api/images.js":
/*!********************************!*\
  !*** ./frontend/api/images.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchImages: () => (/* binding */ fetchImages)
/* harmony export */ });
var fetchImages = function fetchImages(data) {
  var params = new URLSearchParams(data);
  return fetch("/api/images?".concat(params)).then(function (response) {
    if (!response.ok) {
      throw new Error("HTTP error! status: ".concat(response.status));
    }
    return response.json();
  });
};

/***/ }),

/***/ "./frontend/assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF":
/*!****************************************************************!*\
  !*** ./frontend/assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "dc376333474f1dbacf73.TTF";

/***/ }),

/***/ "./frontend/assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF":
/*!********************************************************************!*\
  !*** ./frontend/assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "9bfb7b5cb445781033bf.TTF";

/***/ }),

/***/ "./frontend/assets/fonts/LibreBarcode128-Regular.ttf":
/*!***********************************************************!*\
  !*** ./frontend/assets/fonts/LibreBarcode128-Regular.ttf ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "fonts/LibreBarcode128-Regular.ttf";

/***/ }),

/***/ "./frontend/assets/fonts/andvari.ttf":
/*!*******************************************!*\
  !*** ./frontend/assets/fonts/andvari.ttf ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "fonts/andvari.ttf";

/***/ }),

/***/ "./frontend/assets/images/character.png":
/*!**********************************************!*\
  !*** ./frontend/assets/images/character.png ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/character.png";

/***/ }),

/***/ "./frontend/assets/images/favicon.svg":
/*!********************************************!*\
  !*** ./frontend/assets/images/favicon.svg ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/favicon.svg";

/***/ }),

/***/ "./frontend/assets/images/footer.png":
/*!*******************************************!*\
  !*** ./frontend/assets/images/footer.png ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/footer.png";

/***/ }),

/***/ "./frontend/assets/images/square_svg.svg":
/*!***********************************************!*\
  !*** ./frontend/assets/images/square_svg.svg ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/square_svg.svg";

/***/ }),

/***/ "./frontend/components/about/about.jsx":
/*!*********************************************!*\
  !*** ./frontend/components/about/about.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var About = function About() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "about-page"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("header", {
    className: "about-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "About")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "about-content"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "artist-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artist-info"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Atom Sergal"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "artist-bio"
  }, "Atom Sergal is a digital artist exploring themes of identity, belonging, and the human relationship with space. Through minimalist compositions and thoughtful use of color and form, Atom creates works that invite contemplation and reflection."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Based in the digital realm, Atom's work bridges the gap between traditional artistic expression and contemporary digital mediums, creating pieces that resonate with viewers across different backgrounds and experiences."))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "project-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Beyond Home"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "project-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "\"Beyond Home\" is a conceptual art project that examines our fundamental need for belonging and the complex relationship we have with the spaces we call home."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Through a series of carefully crafted digital artworks, the project explores themes of displacement, identity formation, and the search for meaning in an increasingly interconnected world."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Each piece in the collection serves as a meditation on place, memory, and the human condition, inviting viewers to reflect on their own experiences of home and belonging."))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "contact-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "Contact"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "contact-info"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "For inquiries about \"Beyond Home\" or collaboration opportunities:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "contact-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Email: atom@beyondhome.com"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Project: Beyond Home"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Year: 2024")))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (About);

/***/ }),

/***/ "./frontend/components/about/about_container.js":
/*!******************************************************!*\
  !*** ./frontend/components/about/about_container.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _about__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./about */ "./frontend/components/about/about.jsx");


var mapStateToProps = function mapStateToProps() {
  return {};
};
var mapDispatchToProps = function mapDispatchToProps() {
  return {};
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_about__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./frontend/components/app.jsx":
/*!*************************************!*\
  !*** ./frontend/components/app.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/styles */ "./node_modules/@mui/material/esm/styles/index.js");
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _home_home_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home/home_container */ "./frontend/components/home/home_container.js");
/* harmony import */ var _gallery_gallery_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gallery/gallery_container */ "./frontend/components/gallery/gallery_container.js");
/* harmony import */ var _about_about_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./about/about_container */ "./frontend/components/about/about_container.js");
/* harmony import */ var _navigation_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation/navigation */ "./frontend/components/navigation/navigation.jsx");
/* harmony import */ var _slideshow_timer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./slideshow_timer */ "./frontend/components/slideshow_timer.jsx");
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../contexts/AuthContext */ "./frontend/contexts/AuthContext.jsx");
/* harmony import */ var _contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../contexts/NotificationContext */ "./frontend/contexts/NotificationContext.jsx");
/* harmony import */ var _contexts_ConfirmationContext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../contexts/ConfirmationContext */ "./frontend/contexts/ConfirmationContext.jsx");
/* harmony import */ var _auth_LoginForm__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./auth/LoginForm */ "./frontend/components/auth/LoginForm.jsx");
/* harmony import */ var _auth_ProtectedRoute__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./auth/ProtectedRoute */ "./frontend/components/auth/ProtectedRoute.jsx");















// Lazy loaded components
var AdminLayout = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "frontend_components_layouts_AdminLayout_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./layouts/AdminLayout */ "./frontend/components/layouts/AdminLayout.jsx"));
});
var ClientLayout = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "frontend_components_layouts_ClientLayout_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./layouts/ClientLayout */ "./frontend/components/layouts/ClientLayout.jsx"));
});
var AdminDashboard = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("admin"), __webpack_require__.e("frontend_components_shared_StatisticsCharts_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/AdminDashboard */ "./frontend/components/admin/AdminDashboard.jsx"));
});
var ClientDashboard = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "client").then(__webpack_require__.bind(__webpack_require__, /*! ./client/ClientDashboard */ "./frontend/components/client/ClientDashboard.jsx"));
});
var ClientManagement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "admin").then(__webpack_require__.bind(__webpack_require__, /*! ./admin/ClientManagement */ "./frontend/components/admin/ClientManagement.jsx"));
});
var OrdersKanban = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "admin").then(__webpack_require__.bind(__webpack_require__, /*! ./admin/OrdersKanban */ "./frontend/components/admin/OrdersKanban.jsx"));
});
var WorkloadCalendar = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("admin")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/WorkloadCalendar */ "./frontend/components/admin/WorkloadCalendar.jsx"));
});
var ProjectManagement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "admin").then(__webpack_require__.bind(__webpack_require__, /*! ./admin/ProjectManagement */ "./frontend/components/admin/ProjectManagement.jsx"));
});
var OrderDetail = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "client").then(__webpack_require__.bind(__webpack_require__, /*! ./client/OrderDetail */ "./frontend/components/client/OrderDetail.jsx"));
});
var ArtistWorkloadCalendar = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("client")]).then(__webpack_require__.bind(__webpack_require__, /*! ./client/ArtistWorkloadCalendar */ "./frontend/components/client/ArtistWorkloadCalendar.jsx"));
});
var Notifications = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("client")]).then(__webpack_require__.bind(__webpack_require__, /*! ./client/Notifications */ "./frontend/components/client/Notifications.jsx"));
});
var ClientProfile = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "client").then(__webpack_require__.bind(__webpack_require__, /*! ./client/ClientProfile */ "./frontend/components/client/ClientProfile.jsx"));
});
var ImageManagement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("admin")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/ImageManagement */ "./frontend/components/admin/ImageManagement.jsx"));
});
var ResumeEditor = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("admin")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/ResumeEditor */ "./frontend/components/admin/ResumeEditor.jsx"));
});
var AdminLogs = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("admin")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/AdminLogs */ "./frontend/components/admin/AdminLogs.jsx"));
});
var PublicGallery = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__.e(/*! import() */ "frontend_components_public_PublicGallery_jsx").then(__webpack_require__.bind(__webpack_require__, /*! ./public/PublicGallery */ "./frontend/components/public/PublicGallery.jsx"));
});
var ArtistInfo = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("frontend_components_public_ArtistInfo_jsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./public/ArtistInfo */ "./frontend/components/public/ArtistInfo.jsx"));
});

// Loading component
var LoadingSpinner = function LoadingSpinner() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_3__.CircularProgress, null));
};
var theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_2__.createTheme)({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    },
    background: {
      "default": '#121212',
      paper: '#1e1e1e'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 12px 12px 0'
        }
      }
    }
  },
  typography: {
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  }
});
var App = function App() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material_styles__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_3__.CssBaseline, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_9__.AuthProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts_NotificationContext__WEBPACK_IMPORTED_MODULE_10__.NotificationProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts_ConfirmationContext__WEBPACK_IMPORTED_MODULE_11__.ConfirmationProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Routes, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "home-app"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_navigation_navigation__WEBPACK_IMPORTED_MODULE_7__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_slideshow_timer__WEBPACK_IMPORTED_MODULE_8__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
      className: "main-content"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_home_home_container__WEBPACK_IMPORTED_MODULE_4__["default"], null)))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/resume",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "home-app"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_navigation_navigation__WEBPACK_IMPORTED_MODULE_7__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_slideshow_timer__WEBPACK_IMPORTED_MODULE_8__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
      className: "main-content"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_about_about_container__WEBPACK_IMPORTED_MODULE_6__["default"], null)))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/gallery",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "home-app"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_navigation_navigation__WEBPACK_IMPORTED_MODULE_7__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_slideshow_timer__WEBPACK_IMPORTED_MODULE_8__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
      className: "main-content"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_gallery_gallery_container__WEBPACK_IMPORTED_MODULE_5__["default"], null)))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/public-gallery",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PublicGallery, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/artist",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArtistInfo, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/login",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_auth_LoginForm__WEBPACK_IMPORTED_MODULE_12__["default"], null)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/admin",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_auth_ProtectedRoute__WEBPACK_IMPORTED_MODULE_13__["default"], {
      requireRole: "admin"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AdminLayout, null)))
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    index: true,
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AdminDashboard, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "clients",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ClientManagement, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "orders",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(OrdersKanban, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "projects",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ProjectManagement, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "images",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ImageManagement, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "resume",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ResumeEditor, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "calendar",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(WorkloadCalendar, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "logs",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AdminLogs, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "notifications",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Admin Notifications (Coming Soon)")
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "/client",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_auth_ProtectedRoute__WEBPACK_IMPORTED_MODULE_13__["default"], {
      requireRole: "client"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ClientLayout, null)))
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    index: true,
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ClientDashboard, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "orders/:orderId",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(OrderDetail, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "workload",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArtistWorkloadCalendar, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "notifications",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Notifications, null))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "profile",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingSpinner, null)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ClientProfile, null))
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
    path: "*",
    element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
      to: "/",
      replace: true
    })
  }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./frontend/components/auth/LoginForm.jsx":
/*!************************************************!*\
  !*** ./frontend/components/auth/LoginForm.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../contexts/AuthContext */ "./frontend/contexts/AuthContext.jsx");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var LoginForm = function LoginForm() {
  var _location$state;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    email = _useState2[0],
    setEmail = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    password = _useState4[0],
    setPassword = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    loading = _useState8[0],
    setLoading = _useState8[1];
  var _useAuth = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__.useAuth)(),
    login = _useAuth.login,
    isAuthenticated = _useAuth.isAuthenticated,
    user = _useAuth.user;
  var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  var from = ((_location$state = location.state) === null || _location$state === void 0 || (_location$state = _location$state.from) === null || _location$state === void 0 ? void 0 : _location$state.pathname) || ((user === null || user === void 0 ? void 0 : user.role) === 'admin' ? '/admin' : '/client');
  if (isAuthenticated) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
      to: from,
      replace: true
    });
  }
  var handleSubmit = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
      var result;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            e.preventDefault();
            setLoading(true);
            setError('');
            _context.n = 1;
            return login(email, password);
          case 1:
            result = _context.v;
            if (!result.success) {
              setError(result.error);
            }
            setLoading(false);
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function handleSubmit(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Container, {
    component: "main",
    maxWidth: "sm"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Box, {
    sx: {
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Paper, {
    elevation: 3,
    sx: {
      padding: 4,
      width: '100%'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    component: "h1",
    variant: "h4",
    align: "center",
    gutterBottom: true
  }, "Sign In"), error && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Alert, {
    severity: "error",
    sx: {
      mb: 2
    }
  }, error), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Box, {
    component: "form",
    onSubmit: handleSubmit
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.TextField, {
    margin: "normal",
    required: true,
    fullWidth: true,
    id: "email",
    label: "Email Address",
    name: "email",
    autoComplete: "email",
    autoFocus: true,
    value: email,
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.TextField, {
    margin: "normal",
    required: true,
    fullWidth: true,
    name: "password",
    label: "Password",
    type: "password",
    id: "password",
    autoComplete: "current-password",
    value: password,
    onChange: function onChange(e) {
      return setPassword(e.target.value);
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Button, {
    type: "submit",
    fullWidth: true,
    variant: "contained",
    sx: {
      mt: 3,
      mb: 2
    },
    disabled: loading
  }, loading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.CircularProgress, {
    size: 24
  }) : 'Sign In')))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginForm);

/***/ }),

/***/ "./frontend/components/auth/ProtectedRoute.jsx":
/*!*****************************************************!*\
  !*** ./frontend/components/auth/ProtectedRoute.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../contexts/AuthContext */ "./frontend/contexts/AuthContext.jsx");




var ProtectedRoute = function ProtectedRoute(_ref) {
  var children = _ref.children,
    _ref$requireRole = _ref.requireRole,
    requireRole = _ref$requireRole === void 0 ? null : _ref$requireRole;
  var _useAuth = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__.useAuth)(),
    user = _useAuth.user,
    loading = _useAuth.loading,
    isAuthenticated = _useAuth.isAuthenticated;
  var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  if (loading) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Box, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_2__.CircularProgress, null));
  }
  if (!isAuthenticated) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
      to: "/login",
      state: {
        from: location
      },
      replace: true
    });
  }
  if (requireRole && (user === null || user === void 0 ? void 0 : user.role) !== requireRole) {
    var redirectPath = (user === null || user === void 0 ? void 0 : user.role) === 'admin' ? '/admin' : '/client';
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
      to: redirectPath,
      replace: true
    });
  }
  return children;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProtectedRoute);

/***/ }),

/***/ "./frontend/components/gallery/gallery.jsx":
/*!*************************************************!*\
  !*** ./frontend/components/gallery/gallery.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }

var Gallery = function Gallery(_ref) {
  var images = _ref.images,
    fetchImages = _ref.fetchImages,
    projectId = _ref.projectId;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (projectId) {
      fetchImages(projectId);
    }
  }, [projectId, fetchImages]);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    selectedImage = _useState2[0],
    setSelectedImage = _useState2[1];
  var openModal = function openModal(image) {
    setSelectedImage(image);
  };
  var closeModal = function closeModal() {
    setSelectedImage(null);
  };
  if (!images || images.length === 0) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "gallery-page"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "container"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "Gallery"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "No images available.")));
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "gallery-page"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("header", {
    className: "gallery-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "Beyond Home Gallery"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Explore the complete collection of artworks")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "gallery-grid"
  }, images.map(function (image) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: image.id,
      className: "gallery-item",
      onClick: function onClick() {
        return openModal(image);
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: image.img_url,
      alt: image.caption,
      className: "gallery-image",
      loading: "lazy"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "image-overlay"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "image-caption"
    }, image.caption)));
  })), selectedImage && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "modal-overlay",
    onClick: closeModal
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "modal-content",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    className: "modal-close",
    onClick: closeModal
  }, "\xD7"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: selectedImage.img_url,
    alt: selectedImage.caption,
    className: "modal-image"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "modal-caption"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, selectedImage.caption))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gallery);

/***/ }),

/***/ "./frontend/components/gallery/gallery_container.js":
/*!**********************************************************!*\
  !*** ./frontend/components/gallery/gallery_container.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_image_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../actions/image_actions */ "./frontend/actions/image_actions.js");
/* harmony import */ var _gallery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gallery */ "./frontend/components/gallery/gallery.jsx");



var mapStateToProps = function mapStateToProps(state) {
  var _state$projects$beyon2;
  return {
    images: Object.values(state.images).filter(function (image) {
      var _state$projects$beyon;
      return image.project_id === ((_state$projects$beyon = state.projects.beyond_home) === null || _state$projects$beyon === void 0 ? void 0 : _state$projects$beyon.id);
    }),
    projectId: (_state$projects$beyon2 = state.projects.beyond_home) === null || _state$projects$beyon2 === void 0 ? void 0 : _state$projects$beyon2.id
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchImages: function fetchImages(projectId) {
      return dispatch((0,_actions_image_actions__WEBPACK_IMPORTED_MODULE_1__.fetchImages)(projectId));
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_gallery__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./frontend/components/home/about/about_section.jsx":
/*!**********************************************************!*\
  !*** ./frontend/components/home/about/about_section.jsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_images_character_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../assets/images/character.png */ "./frontend/assets/images/character.png");


var InfoField = function InfoField(_ref) {
  var label = _ref.label,
    value = _ref.value,
    subtitle = _ref.subtitle;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-field"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "field-label"
  }, label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "field-value"
  }, value), subtitle && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "field-subtitle"
  }, subtitle));
};
var AboutSection = function AboutSection() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "about-me-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "about-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "character-illustration"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: _assets_images_character_png__WEBPACK_IMPORTED_MODULE_1__,
    alt: "Character Illustration",
    className: "character-image"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-card"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-card-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, "/ABOUT ME")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-fields-grid"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-fields-left"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InfoField, {
    label: "My name",
    value: "ARTEM VINOGRADOV",
    subtitle: "[nickname: Atom.Sergal]"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InfoField, {
    label: "Out there",
    value: "RUSSIA/SAINT PETERSBURG"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-fields-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InfoField, {
    label: "DOB",
    value: "01/06/2001"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-separator"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info-content"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "I'm a concept artist and illustrator specializing in sci-fi environments, vehicles, and character design. My work focuses on creating immersive worlds that blend realistic details with fantastical elements."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "I draw inspiration from science fiction literature, films, and games to create artwork that tells stories about future worlds, alien landscapes, and the intersection of technology and nature.")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AboutSection);

/***/ }),

/***/ "./frontend/components/home/about/footer.jsx":
/*!***************************************************!*\
  !*** ./frontend/components/home/about/footer.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _assets_images_footer_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../assets/images/footer.png */ "./frontend/assets/images/footer.png");



var Footer = function Footer() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("footer", {
    className: "main-footer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "waved-background"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "footer-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "footer-left"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "social-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, "/SOCIAL"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "social-links"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6L8 8.5 4.5 6h7z",
    fill: "currentColor"
  })), "ARTSTATION"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M8 0L6.59 1.41l2.75 2.75H0v2h9.34l-2.75 2.75L8 10l5-5-5-5z",
    fill: "currentColor"
  })), "YOUTUBE"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M13.545 2.907a4.13 4.13 0 00-.832-.634c-.39-.198-.8-.336-1.22-.408A6.27 6.27 0 008 2a6.27 6.27 0 00-3.493.865c-.42.072-.83.21-1.22.408a4.13 4.13 0 00-.832.634 4.13 4.13 0 00-.634.832c-.198.39-.336.8-.408 1.22A6.27 6.27 0 001 8c0 1.24.224 2.466.635 3.632.072.42.21.83.408 1.22.136.315.315.594.832.634.39.198.8.336 1.22.408A6.27 6.27 0 008 14a6.27 6.27 0 003.493-.865c.42-.072.83-.21 1.22-.408.315-.136.594-.315.832-.634.198-.39.336-.8.408-1.22A6.27 6.27 0 0015 8a6.27 6.27 0 00-.865-3.493c-.072-.42-.21-.83-.408-1.22a4.13 4.13 0 00-.832-.634z",
    fill: "currentColor"
  })), "DISCORD"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M16 8A8 8 0 110 8a8 8 0 0116 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.296-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 01-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 00-.013-.315.337.337 0 00-.114-.217.526.526 0 00-.31-.093c-.3.005-.763.166-2.984 1.09z",
    fill: "currentColor"
  })), "TELEGRAM"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.087.793A3.286 3.286 0 007.875 6.03a9.325 9.325 0 01-6.767-3.429 3.289 3.289 0 001.018 4.382A3.323 3.323 0 01.64 6.575v.045a3.288 3.288 0 002.632 3.218 3.203 3.203 0 01-.865.115 3.23 3.23 0 01-.614-.057 3.283 3.283 0 003.067 2.277A6.588 6.588 0 01.78 13.58a6.32 6.32 0 01-.78-.045A9.344 9.344 0 005.026 15z",
    fill: "currentColor"
  })), "TWITTER"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    className: "social-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "social-icon"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063c.632 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z",
    fill: "currentColor"
  })), "VK"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nav-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, "/NAV"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nav-buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/",
    className: "nav-button active"
  }, "HOME"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/resume",
    className: "nav-button"
  }, "CURRICULUM VITAE"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/gallery",
    className: "nav-button"
  }, "ART GALLERY"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/projects",
    className: "nav-button"
  }, "PROJECTS")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "footer-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "scanning-svg"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: _assets_images_footer_png__WEBPACK_IMPORTED_MODULE_2__,
    alt: "Scanning",
    className: "scanning-image"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "footer-logo"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "logo-text"
  }, "ATOM.SERGAL"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "logo-tagline"
  }, "CONCEPT ART")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ }),

/***/ "./frontend/components/home/hero/artist_branding.jsx":
/*!***********************************************************!*\
  !*** ./frontend/components/home/hero/artist_branding.jsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_images_favicon_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../assets/images/favicon.svg */ "./frontend/assets/images/favicon.svg");
/* harmony import */ var _navigation_slideshow_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../navigation/slideshow_controls */ "./frontend/components/navigation/slideshow_controls.jsx");



var ArtistBranding = function ArtistBranding() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artist-branding"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "bottom-top-gradient-shadow"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artist-branding-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artist-branding__logo"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: _assets_images_favicon_svg__WEBPACK_IMPORTED_MODULE_1__,
    alt: "Atom.Sergal Logo",
    className: "artist-branding__logo-icon"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artist-branding__content"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", {
    className: "artist-branding__name"
  }, "ATOM.SERGAL"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "artist-branding__subtitle"
  }, "Concept sci-fi Artist"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "artist-branding__tagline"
  }, "Per aspera Ad astra")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "slideshow-controls-bottom-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_navigation_slideshow_controls__WEBPACK_IMPORTED_MODULE_2__["default"], null))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArtistBranding);

/***/ }),

/***/ "./frontend/components/home/hero/hero_slideshow.jsx":
/*!**********************************************************!*\
  !*** ./frontend/components/home/hero/hero_slideshow.jsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _metadata_overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./metadata_overlay */ "./frontend/components/home/hero/metadata_overlay.jsx");
/* harmony import */ var _artist_branding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./artist_branding */ "./frontend/components/home/hero/artist_branding.jsx");



var HeroSlideshow = function HeroSlideshow(_ref) {
  var currentImage = _ref.currentImage,
    nextImage = _ref.nextImage,
    isTransitioning = _ref.isTransitioning;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "hero-slideshow"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "slideshow-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "slide ".concat(!isTransitioning ? 'active' : ''),
    style: {
      backgroundImage: "url(".concat(currentImage.img_url, ")")
    }
  }), isTransitioning && nextImage && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "slide slide-next active",
    style: {
      backgroundImage: "url(".concat(nextImage.img_url, ")")
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_metadata_overlay__WEBPACK_IMPORTED_MODULE_1__["default"], {
    image: isTransitioning ? nextImage : currentImage
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_artist_branding__WEBPACK_IMPORTED_MODULE_2__["default"], null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HeroSlideshow);

/***/ }),

/***/ "./frontend/components/home/hero/metadata_overlay.jsx":
/*!************************************************************!*\
  !*** ./frontend/components/home/hero/metadata_overlay.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_images_square_svg_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../assets/images/square_svg.svg */ "./frontend/assets/images/square_svg.svg");


var MetadataOverlay = function MetadataOverlay(_ref) {
  var image = _ref.image;
  if (!image) return null;
  var formatFileSize = function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    var mb = bytes / (1024 * 1024);
    return "".concat(mb.toFixed(1), " MB");
  };
  var formatDimensions = function formatDimensions(width, height) {
    if (!width || !height) return 'Unknown';
    return "".concat(width, "/").concat(height);
  };
  var truncateTitle = function truncateTitle(title) {
    var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    if (!title) return 'Test Artwork';
    return title.length > maxLength ? "".concat(title.substring(0, maxLength), "...") : title;
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-overlay"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "top-bottom-gradient-shadow"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-blocks"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-blocks-left"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-block size-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-label"
  }, "SIZE:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-value"
  }, formatDimensions(image.width, image.height))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-block description-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-label"
  }, "DESCRIPTION:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-value"
  }, image.description || 'Digital Illustration')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-block weight-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-label"
  }, "WEIGHT:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-value"
  }, formatFileSize(image.file_size)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "metadata-block art-title-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "art-title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "art-title-column-1"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "barcode-wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "barcode-text"
  }, truncateTitle(image.title || image.caption))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "artwork-title"
  }, truncateTitle(image.title || image.caption))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "art-title-column-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "squares-svg"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: _assets_images_square_svg_svg__WEBPACK_IMPORTED_MODULE_1__,
    alt: "squares"
  })))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MetadataOverlay);

/***/ }),

/***/ "./frontend/components/home/home.jsx":
/*!*******************************************!*\
  !*** ./frontend/components/home/home.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_image_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../actions/image_actions */ "./frontend/actions/image_actions.js");
/* harmony import */ var _hero_hero_slideshow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hero/hero_slideshow */ "./frontend/components/home/hero/hero_slideshow.jsx");
/* harmony import */ var _about_about_section__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./about/about_section */ "./frontend/components/home/about/about_section.jsx");
/* harmony import */ var _about_footer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./about/footer */ "./frontend/components/home/about/footer.jsx");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






var Home = function Home(_ref) {
  var images = _ref.images,
    fetchImages = _ref.fetchMainPageImages,
    currentImageIndex = _ref.currentImageIndex;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    currentSlideIndex = _useState2[0],
    setCurrentSlideIndex = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    nextSlideIndex = _useState4[0],
    setNextSlideIndex = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isTransitioning = _useState6[0],
    setIsTransitioning = _useState6[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchImages();
  }, [fetchImages]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (currentImageIndex !== currentSlideIndex && images && images.length > 0) {
      setIsTransitioning(true);
      setNextSlideIndex(currentImageIndex);
      setTimeout(function () {
        setCurrentSlideIndex(currentImageIndex);
        setIsTransitioning(false);
      }, 500); // Half of the fade duration
    }
  }, [currentImageIndex, currentSlideIndex, images]);
  if (!images || images.length === 0) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "home"
    });
  }
  var currentImage = images[currentSlideIndex];
  var nextImage = images[nextSlideIndex];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "home"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_hero_hero_slideshow__WEBPACK_IMPORTED_MODULE_3__["default"], {
    currentImage: currentImage,
    nextImage: nextImage,
    isTransitioning: isTransitioning
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_about_about_section__WEBPACK_IMPORTED_MODULE_4__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_about_footer__WEBPACK_IMPORTED_MODULE_5__["default"], null));
};
var mapStateToProps = function mapStateToProps(state) {
  return {
    images: Object.values(state.images),
    currentImageIndex: state.slideshow.currentImageIndex
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchMainPageImages: function fetchMainPageImages() {
      return dispatch((0,_actions_image_actions__WEBPACK_IMPORTED_MODULE_2__.fetchMainPageImages)());
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, mapDispatchToProps)(Home));

/***/ }),

/***/ "./frontend/components/home/home_container.js":
/*!****************************************************!*\
  !*** ./frontend/components/home/home_container.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_image_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../actions/image_actions */ "./frontend/actions/image_actions.js");
/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home */ "./frontend/components/home/home.jsx");




var mapStateToProps = function mapStateToProps(state) {
  return {
    images: Object.values(state.images)
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchMainPageImages: function fetchMainPageImages() {
      return dispatch((0,_actions_image_actions__WEBPACK_IMPORTED_MODULE_2__.fetchMainPageImages)());
    }
  };
};
var HomeContainer = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, mapDispatchToProps)(_home__WEBPACK_IMPORTED_MODULE_3__["default"]);

// Wrapper component - no props needed now since everything comes from Redux
var HomeContainerWrapper = function HomeContainerWrapper() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(HomeContainer, null);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HomeContainerWrapper);

/***/ }),

/***/ "./frontend/components/navigation/navigation.jsx":
/*!*******************************************************!*\
  !*** ./frontend/components/navigation/navigation.jsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _assets_images_favicon_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../assets/images/favicon.svg */ "./frontend/assets/images/favicon.svg");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



var Navigation = function Navigation() {
  var location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    clickedItem = _useState2[0],
    setClickedItem = _useState2[1];
  var isActive = function isActive(path) {
    return location.pathname === path ? 'active' : '';
  };
  var handleClick = function handleClick(path) {
    setClickedItem(path);
    // Reset after animation
    setTimeout(function () {
      return setClickedItem(null);
    }, 400);
  };
  var getSeparatorIcon = function getSeparatorIcon(path, isClicked) {
    if (isClicked) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "nav-separator animating"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        className: "separator-icon"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
        d: "M2 2L10 10M2 10L10 2",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round"
      })));
    } else if (location.pathname === path) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "nav-separator"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        className: "separator-icon"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
        d: "M3 3L9 9L3 3L9 3Z",
        fill: "currentColor"
      })));
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: "nav-separator"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        className: "separator-icon"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
        d: "M2 10L10 2",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round"
      })));
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: "navigation"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nav-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/",
    className: "nav-brand"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: _assets_images_favicon_svg__WEBPACK_IMPORTED_MODULE_2__,
    alt: "Logo",
    className: "nav-logo"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: "nav-menu"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: "nav-item ".concat(isActive('/'))
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/",
    className: "nav-link",
    onClick: function onClick() {
      return handleClick('/');
    }
  }, getSeparatorIcon('/', clickedItem === '/'), " HOME")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: "nav-item ".concat(isActive('/resume'))
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/resume",
    className: "nav-link",
    onClick: function onClick() {
      return handleClick('/resume');
    }
  }, getSeparatorIcon('/resume', clickedItem === '/resume'), ' ', "CURRICULUM VITAE")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: "nav-item ".concat(isActive('/gallery'))
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/gallery",
    className: "nav-link",
    onClick: function onClick() {
      return handleClick('/gallery');
    }
  }, getSeparatorIcon('/gallery', clickedItem === '/gallery'), " ART GALLERY")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Navigation);

/***/ }),

/***/ "./frontend/components/navigation/slideshow_controls.jsx":
/*!***************************************************************!*\
  !*** ./frontend/components/navigation/slideshow_controls.jsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../actions/slideshow_actions */ "./frontend/actions/slideshow_actions.js");
/* harmony import */ var _ui_progress_ring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui/progress_ring */ "./frontend/components/ui/progress_ring.jsx");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var SlideshowControls = function SlideshowControls(_ref) {
  var totalImages = _ref.totalImages,
    isPlaying = _ref.isPlaying,
    lastChangeTime = _ref.lastChangeTime,
    onPrevious = _ref.onPrevious,
    onNext = _ref.onNext,
    onTogglePlay = _ref.onTogglePlay;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    progress = _useState2[0],
    setProgress = _useState2[1];
  var lastChangeTimeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(lastChangeTime);

  // Update ref when lastChangeTime changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    lastChangeTimeRef.current = lastChangeTime;
  }, [lastChangeTime]);

  // Progress animation for slideshow
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!isPlaying || totalImages === 0) {
      setProgress(0);
      return;
    }
    var duration = 5000; // 5 seconds
    var interval = 50; // Update every 50ms for smooth animation

    var timer = setInterval(function () {
      var elapsed = Date.now() - lastChangeTimeRef.current;
      var newProgress = Math.min(elapsed / duration * 100, 100);
      setProgress(newProgress);
    }, interval);
    return function () {
      return clearInterval(timer);
    };
  }, [isPlaying, totalImages]);
  if (totalImages === 0) return null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "slideshow-controls"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    className: "slideshow-control-btn prev-btn circular-notch",
    onClick: onPrevious,
    title: "Previous Image"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "notch-left"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12 15L7 10L12 5",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "play-pause-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ui_progress_ring__WEBPACK_IMPORTED_MODULE_3__["default"], {
    progress: progress
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    className: "slideshow-control-btn play-pause-btn",
    onClick: onTogglePlay,
    title: isPlaying ? 'Pause Slideshow' : 'Play Slideshow'
  }, isPlaying ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("rect", {
    x: "3",
    y: "2",
    width: "3",
    height: "12",
    fill: "currentColor",
    rx: "0.5"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("rect", {
    x: "10",
    y: "2",
    width: "3",
    height: "12",
    fill: "currentColor",
    rx: "0.5"
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M5 3L13 8L5 13V3Z",
    fill: "currentColor"
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    className: "slideshow-control-btn next-btn circular-notch",
    onClick: onNext,
    title: "Next Image"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "notch-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M8 5L13 10L8 15",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))));
};
var mapStateToProps = function mapStateToProps(state) {
  return {
    totalImages: Object.values(state.images).length,
    isPlaying: state.slideshow.isPlaying,
    lastChangeTime: state.slideshow.lastChangeTime
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onPrevious: function onPrevious() {
      return dispatch((0,_actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__.previousImage)());
    },
    onNext: function onNext() {
      return dispatch((0,_actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__.nextImage)());
    },
    onTogglePlay: function onTogglePlay() {
      return dispatch((0,_actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__.togglePlayPauseAndUpdateTime)());
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, mapDispatchToProps)(SlideshowControls));

/***/ }),

/***/ "./frontend/components/root.jsx":
/*!**************************************!*\
  !*** ./frontend/components/root.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app */ "./frontend/components/app.jsx");




var Root = function Root(_ref) {
  var store = _ref.store;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Provider, {
    store: store
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.HashRouter, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_app__WEBPACK_IMPORTED_MODULE_3__["default"], null)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Root);

/***/ }),

/***/ "./frontend/components/slideshow_timer.jsx":
/*!*************************************************!*\
  !*** ./frontend/components/slideshow_timer.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/slideshow_actions */ "./frontend/actions/slideshow_actions.js");



var SlideshowTimer = function SlideshowTimer(_ref) {
  var isPlaying = _ref.isPlaying,
    imagesLength = _ref.imagesLength,
    autoAdvance = _ref.autoAdvanceSlideshow;
  // Auto-advance slideshow
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!isPlaying || imagesLength === 0) return;
    var interval = setInterval(function () {
      autoAdvance();
    }, 5000); // Change image every 5 seconds

    return function () {
      return clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, imagesLength]);
  return null; // This component doesn't render anything
};
var mapStateToProps = function mapStateToProps(state) {
  return {
    isPlaying: state.slideshow.isPlaying,
    imagesLength: Object.values(state.images).length
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    autoAdvanceSlideshow: function autoAdvanceSlideshow() {
      return dispatch((0,_actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_2__.autoAdvanceSlideshow)());
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps, mapDispatchToProps)(SlideshowTimer));

/***/ }),

/***/ "./frontend/components/ui/progress_ring.jsx":
/*!**************************************************!*\
  !*** ./frontend/components/ui/progress_ring.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var ProgressRing = function ProgressRing(_ref) {
  var _ref$progress = _ref.progress,
    progress = _ref$progress === void 0 ? 0 : _ref$progress,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 60 : _ref$size,
    _ref$strokeWidth = _ref.strokeWidth,
    strokeWidth = _ref$strokeWidth === void 0 ? 3 : _ref$strokeWidth;
  var radius = (size - strokeWidth) / 2;
  var circumference = 2 * Math.PI * radius;
  var strokeDashoffset = circumference * (1 - progress / 100);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: "progress-ring",
    width: size,
    height: size
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    className: "progress-ring-circle-bg",
    stroke: "rgba(255, 255, 255, 0.2)",
    strokeWidth: strokeWidth,
    fill: "transparent",
    r: radius,
    cx: size / 2,
    cy: size / 2
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    className: "progress-ring-circle",
    stroke: "rgba(255, 255, 255, 0.8)",
    strokeWidth: strokeWidth,
    fill: "transparent",
    r: radius,
    cx: size / 2,
    cy: size / 2,
    strokeDasharray: circumference,
    strokeDashoffset: strokeDashoffset,
    style: {
      transform: 'rotate(-90deg)',
      transformOrigin: "".concat(size / 2, "px ").concat(size / 2, "px"),
      transition: 'stroke-dashoffset 0.05s linear'
    }
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProgressRing);

/***/ }),

/***/ "./frontend/contexts/AuthContext.jsx":
/*!*******************************************!*\
  !*** ./frontend/contexts/AuthContext.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),
/* harmony export */   useAuth: () => (/* binding */ useAuth)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_authService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/authService */ "./frontend/services/authService.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


var AuthContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
var useAuth = function useAuth() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
var AuthProvider = function AuthProvider(_ref) {
  var children = _ref.children;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    user = _useState2[0],
    setUser = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var initAuth = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var currentUser, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return _services_authService__WEBPACK_IMPORTED_MODULE_1__.authService.getCurrentUser();
            case 1:
              currentUser = _context.v;
              setUser(currentUser);
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              // eslint-disable-next-line no-console
              console.error('Auth initialization error:', _t);
            case 3:
              _context.p = 3;
              setLoading(false);
              return _context.f(3);
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[0, 2, 3, 4]]);
      }));
      return function initAuth() {
        return _ref2.apply(this, arguments);
      };
    }();
    initAuth();
  }, []);
  var login = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(email, password) {
      var _yield$authService$lo, loggedInUser, _error$response, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return _services_authService__WEBPACK_IMPORTED_MODULE_1__.authService.login(email, password);
          case 1:
            _yield$authService$lo = _context2.v;
            loggedInUser = _yield$authService$lo.user;
            setUser(loggedInUser);
            return _context2.a(2, {
              success: true,
              user: loggedInUser
            });
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            return _context2.a(2, {
              success: false,
              error: ((_error$response = _t2.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Login failed'
            });
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return function login(_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  var register = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userData) {
      var _yield$authService$re, newUser, _error$response2, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _context3.n = 1;
            return _services_authService__WEBPACK_IMPORTED_MODULE_1__.authService.register(userData);
          case 1:
            _yield$authService$re = _context3.v;
            newUser = _yield$authService$re.user;
            setUser(newUser);
            return _context3.a(2, {
              success: true,
              user: newUser
            });
          case 2:
            _context3.p = 2;
            _t3 = _context3.v;
            return _context3.a(2, {
              success: false,
              error: ((_error$response2 = _t3.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'Registration failed'
            });
        }
      }, _callee3, null, [[0, 2]]);
    }));
    return function register(_x3) {
      return _ref4.apply(this, arguments);
    };
  }();
  var logout = function logout() {
    _services_authService__WEBPACK_IMPORTED_MODULE_1__.authService.logout();
    setUser(null);
  };
  var value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      user: user,
      login: login,
      register: register,
      logout: logout,
      loading: loading,
      isAuthenticated: !!user,
      isAdmin: (user === null || user === void 0 ? void 0 : user.role) === 'admin',
      isClient: (user === null || user === void 0 ? void 0 : user.role) === 'client'
    };
  }, [user, loading]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AuthContext.Provider, {
    value: value
  }, children);
};

/***/ }),

/***/ "./frontend/contexts/ConfirmationContext.jsx":
/*!***************************************************!*\
  !*** ./frontend/contexts/ConfirmationContext.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmationProvider: () => (/* binding */ ConfirmationProvider),
/* harmony export */   useConfirmation: () => (/* binding */ useConfirmation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/icons-material */ "./node_modules/@mui/icons-material/esm/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



var ConfirmationContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
var useConfirmation = function useConfirmation() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ConfirmationContext);
  if (!context) {
    throw new _mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Error('useConfirmation must be used within ConfirmationProvider');
  }
  return context;
};
var ConfirmationProvider = function ConfirmationProvider(_ref) {
  var children = _ref.children;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    dialog = _useState2[0],
    setDialog = _useState2[1];
  var confirm = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (options) {
    return new Promise(function (resolve) {
      var handleClose = function handleClose(result) {
        setDialog(null);
        resolve(result);
      };
      setDialog(_objectSpread(_objectSpread({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        severity: 'warning'
      }, options), {}, {
        onClose: handleClose
      }));
    });
  }, []);
  var confirmDelete = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (itemName) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return confirm(_objectSpread({
      title: 'Delete Confirmation',
      message: "Are you sure you want to delete \"".concat(itemName, "\"? This action cannot be undone."),
      confirmText: 'Delete',
      cancelText: 'Keep',
      severity: 'error',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.DeleteForever, null)
    }, options));
  }, [confirm]);
  var confirmSave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return confirm(_objectSpread({
      title: 'Save Changes',
      message: 'Do you want to save your changes?',
      confirmText: 'Save',
      cancelText: 'Discard',
      severity: 'info',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.CheckCircle, null)
    }, options));
  }, [confirm]);
  var confirmDiscard = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return confirm(_objectSpread({
      title: 'Discard Changes',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      severity: 'warning',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Warning, null)
    }, options));
  }, [confirm]);
  var getDialogIcon = function getDialogIcon(severity) {
    switch (severity) {
      case 'error':
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Error, {
          color: "error",
          sx: {
            fontSize: 48
          }
        });
      case 'warning':
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Warning, {
          color: "warning",
          sx: {
            fontSize: 48
          }
        });
      case 'info':
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Info, {
          color: "info",
          sx: {
            fontSize: 48
          }
        });
      case 'success':
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.CheckCircle, {
          color: "success",
          sx: {
            fontSize: 48
          }
        });
      default:
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Info, {
          color: "info",
          sx: {
            fontSize: 48
          }
        });
    }
  };
  var getSeverityColor = function getSeverityColor(severity) {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };
  var value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      confirm: confirm,
      confirmDelete: confirmDelete,
      confirmSave: confirmSave,
      confirmDiscard: confirmDiscard
    };
  }, [confirm, confirmDelete, confirmSave, confirmDiscard]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ConfirmationContext.Provider, {
    value: value
  }, children, dialog && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: true,
    onClose: function onClose() {
      return dialog.onClose(false);
    },
    maxWidth: "sm",
    fullWidth: true,
    PaperProps: {
      sx: {
        borderRadius: 2,
        boxShadow: function boxShadow(theme) {
          return theme.shadows[10];
        }
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.DialogTitle, {
    sx: {
      pb: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    alignItems: "center",
    gap: 2
  }, dialog.icon || getDialogIcon(dialog.severity), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    component: "div"
  }, dialog.title))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.DialogContent, {
    sx: {
      py: 2
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body1",
    color: "text.secondary"
  }, dialog.message), dialog.details && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary",
    sx: {
      mt: 2
    }
  }, dialog.details)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.DialogActions, {
    sx: {
      px: 3,
      pb: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Button, {
    onClick: function onClick() {
      return dialog.onClose(false);
    },
    color: "inherit",
    variant: "outlined"
  }, dialog.cancelText), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Button, {
    onClick: function onClick() {
      return dialog.onClose(true);
    },
    color: getSeverityColor(dialog.severity),
    variant: "contained",
    autoFocus: true
  }, dialog.confirmText))));
};

/***/ }),

/***/ "./frontend/contexts/NotificationContext.jsx":
/*!***************************************************!*\
  !*** ./frontend/contexts/NotificationContext.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationProvider: () => (/* binding */ NotificationProvider),
/* harmony export */   useNotification: () => (/* binding */ useNotification)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/icons-material */ "./node_modules/@mui/icons-material/esm/index.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



var NotificationContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
var useNotification = function useNotification() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
var NotificationProvider = function NotificationProvider(_ref) {
  var children = _ref.children;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    notifications = _useState2[0],
    setNotifications = _useState2[1];
  var removeNotification = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (id) {
    setNotifications(function (prev) {
      return prev.filter(function (notification) {
        return notification.id !== id;
      });
    });
  }, []);
  var addNotification = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (notification) {
    var id = Date.now() + Math.random();
    var newNotification = _objectSpread({
      id: id,
      severity: 'info',
      autoHideDuration: 5000
    }, notification);
    setNotifications(function (prev) {
      return [].concat(_toConsumableArray(prev), [newNotification]);
    });

    // Auto remove after duration
    if (newNotification.autoHideDuration) {
      setTimeout(function () {
        removeNotification(id);
      }, newNotification.autoHideDuration);
    }
    return id;
  }, [removeNotification]);
  var clearAllNotifications = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    setNotifications([]);
  }, []);

  // Convenience methods
  var showSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return addNotification(_objectSpread({
      severity: 'success',
      message: message
    }, options));
  }, [addNotification]);
  var showError = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return addNotification(_objectSpread({
      severity: 'error',
      message: message,
      autoHideDuration: 7000
    }, options));
  }, [addNotification]);
  var showWarning = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return addNotification(_objectSpread({
      severity: 'warning',
      message: message
    }, options));
  }, [addNotification]);
  var showInfo = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return addNotification(_objectSpread({
      severity: 'info',
      message: message
    }, options));
  }, [addNotification]);
  var value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      addNotification: addNotification,
      removeNotification: removeNotification,
      clearAllNotifications: clearAllNotifications,
      showSuccess: showSuccess,
      showError: showError,
      showWarning: showWarning,
      showInfo: showInfo
    };
  }, [addNotification, removeNotification, clearAllNotifications, showSuccess, showError, showWarning, showInfo]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NotificationContext.Provider, {
    value: value
  }, children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    sx: {
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      maxWidth: '400px',
      width: '100%'
    }
  }, notifications.map(function (notification) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Snackbar, {
      key: notification.id,
      open: true,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      sx: {
        position: 'relative',
        transform: 'none !important',
        left: 'auto !important',
        right: 'auto !important',
        top: 'auto !important',
        bottom: 'auto !important'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Alert, {
      severity: notification.severity,
      variant: "filled",
      onClose: function onClose() {
        return removeNotification(notification.id);
      },
      action: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
        "aria-label": "close",
        color: "inherit",
        size: "small",
        onClick: function onClick() {
          return removeNotification(notification.id);
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Close, {
        fontSize: "inherit"
      })),
      sx: {
        width: '100%',
        '& .MuiAlert-message': {
          width: '100%'
        }
      }
    }, notification.title && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.AlertTitle, null, notification.title), notification.message, notification.action && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      sx: {
        mt: 1
      }
    }, notification.action)));
  })));
};

/***/ }),

/***/ "./frontend/index.jsx":
/*!****************************!*\
  !*** ./frontend/index.jsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_root__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/root */ "./frontend/components/root.jsx");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/store */ "./frontend/store/store.js");
/* harmony import */ var _styles_app_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/app.scss */ "./frontend/styles/app.scss");





// Импорт всех стилей приложения

document.addEventListener('DOMContentLoaded', function () {
  var store;
  if (window.currentUser) {
    var preloadedState = {
      session: {
        currentUser: window.currentUser,
        errors: []
      }
    };
    store = (0,_store_store__WEBPACK_IMPORTED_MODULE_3__["default"])(preloadedState);
    delete window.currentUser;
  } else {
    store = (0,_store_store__WEBPACK_IMPORTED_MODULE_3__["default"])();
  }
  var container = document.getElementById('root');
  var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
  root.render(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_root__WEBPACK_IMPORTED_MODULE_2__["default"], {
    store: store
  }));
});

/***/ }),

/***/ "./frontend/middleware/thunk_middleware.js":
/*!*************************************************!*\
  !*** ./frontend/middleware/thunk_middleware.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var thunkMiddleware = function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch,
    getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (thunkMiddleware);

/***/ }),

/***/ "./frontend/reducers/images_reducer.js":
/*!*********************************************!*\
  !*** ./frontend/reducers/images_reducer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _actions_image_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/image_actions */ "./frontend/actions/image_actions.js");

var imagesReducer = function imagesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  Object.freeze(state);
  switch (action.type) {
    case _actions_image_actions__WEBPACK_IMPORTED_MODULE_0__.RECEIVE_IMAGES:
      return action.images;
    case _actions_image_actions__WEBPACK_IMPORTED_MODULE_0__.RECEIVE_PAGINATION:
      return action.pagination;
    case _actions_image_actions__WEBPACK_IMPORTED_MODULE_0__.CLEAR_IMAGES:
      return {};
    default:
      return state;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (imagesReducer);

/***/ }),

/***/ "./frontend/reducers/projects_reducer.js":
/*!***********************************************!*\
  !*** ./frontend/reducers/projects_reducer.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// No imports needed for this reducer

var projectsReducer = function projectsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  Object.freeze(state);
  switch (action.type) {
    default:
      return state;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (projectsReducer);

/***/ }),

/***/ "./frontend/reducers/root_reducer.js":
/*!*******************************************!*\
  !*** ./frontend/reducers/root_reducer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _projects_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projects_reducer */ "./frontend/reducers/projects_reducer.js");
/* harmony import */ var _images_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images_reducer */ "./frontend/reducers/images_reducer.js");
/* harmony import */ var _slideshow_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./slideshow_reducer */ "./frontend/reducers/slideshow_reducer.js");




var rootReducer = (0,redux__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  projects: _projects_reducer__WEBPACK_IMPORTED_MODULE_1__["default"],
  images: _images_reducer__WEBPACK_IMPORTED_MODULE_2__["default"],
  slideshow: _slideshow_reducer__WEBPACK_IMPORTED_MODULE_3__["default"]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rootReducer);

/***/ }),

/***/ "./frontend/reducers/slideshow_reducer.js":
/*!************************************************!*\
  !*** ./frontend/reducers/slideshow_reducer.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/slideshow_actions */ "./frontend/actions/slideshow_actions.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var initialState = {
  currentImageIndex: 0,
  isPlaying: true,
  lastChangeTime: Date.now()
};
var slideshowReducer = function slideshowReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_0__.SET_CURRENT_IMAGE_INDEX:
      return _objectSpread(_objectSpread({}, state), {}, {
        currentImageIndex: action.index
      });
    case _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_PLAY_PAUSE:
      return _objectSpread(_objectSpread({}, state), {}, {
        isPlaying: !state.isPlaying
      });
    case _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_0__.SET_IS_PLAYING:
      return _objectSpread(_objectSpread({}, state), {}, {
        isPlaying: action.isPlaying
      });
    case _actions_slideshow_actions__WEBPACK_IMPORTED_MODULE_0__.UPDATE_LAST_CHANGE_TIME:
      return _objectSpread(_objectSpread({}, state), {}, {
        lastChangeTime: action.timestamp
      });
    default:
      return state;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slideshowReducer);

/***/ }),

/***/ "./frontend/services/authService.js":
/*!******************************************!*\
  !*** ./frontend/services/authService.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authService: () => (/* binding */ authService),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var API_BASE_URL =  false ? 0 : window.location.origin;
var api = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
  baseURL: "".concat(API_BASE_URL, "/api"),
  headers: {
    'Content-Type': 'application/json'
  }
});
api.interceptors.request.use(function (config) {
  var token = js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get('auth_token');
  if (token) {
    return _objectSpread(_objectSpread({}, config), {}, {
      headers: _objectSpread(_objectSpread({}, config.headers), {}, {
        Authorization: "Bearer ".concat(token)
      })
    });
  }
  return config;
});
api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  var _error$response;
  if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
    js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove('auth_token');
    js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove('user_role');
    window.location.href = '/#/login';
  }
  return Promise.reject(error);
});
var authService = {
  login: function login(email, password) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, _response$data, token, user;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return api.post('/auth/login', {
              email: email,
              password: password
            });
          case 1:
            response = _context.v;
            _response$data = response.data, token = _response$data.token, user = _response$data.user;
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('auth_token', token, {
              expires: 7
            });
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('user_role', user.role, {
              expires: 7
            });
            return _context.a(2, {
              token: token,
              user: user
            });
        }
      }, _callee);
    }))();
  },
  register: function register(userData) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var response, _response$data2, token, user;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return api.post('/auth/register', {
              user: userData
            });
          case 1:
            response = _context2.v;
            _response$data2 = response.data, token = _response$data2.token, user = _response$data2.user;
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('auth_token', token, {
              expires: 7
            });
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('user_role', user.role, {
              expires: 7
            });
            return _context2.a(2, {
              token: token,
              user: user
            });
        }
      }, _callee2);
    }))();
  },
  getCurrentUser: function getCurrentUser() {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var token, response, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            token = js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get('auth_token');
            if (token) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, null);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return api.get('/auth/me');
          case 2:
            response = _context3.v;
            return _context3.a(2, response.data.user);
          case 3:
            _context3.p = 3;
            _t = _context3.v;
            authService.logout();
            return _context3.a(2, null);
        }
      }, _callee3, null, [[1, 3]]);
    }))();
  },
  logout: function logout() {
    js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove('auth_token');
    js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove('user_role');
    window.location.href = '/#/login';
  },
  getToken: function getToken() {
    return js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get('auth_token');
  },
  getUserRole: function getUserRole() {
    return js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get('user_role');
  },
  isAuthenticated: function isAuthenticated() {
    return !!this.getToken();
  },
  isAdmin: function isAdmin() {
    return this.getUserRole() === 'admin';
  },
  isClient: function isClient() {
    return this.getUserRole() === 'client';
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);

/***/ }),

/***/ "./frontend/store/store.js":
/*!*********************************!*\
  !*** ./frontend/store/store.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _middleware_thunk_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../middleware/thunk_middleware */ "./frontend/middleware/thunk_middleware.js");
/* harmony import */ var _reducers_root_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reducers/root_reducer */ "./frontend/reducers/root_reducer.js");



var middlewares = [_middleware_thunk_middleware__WEBPACK_IMPORTED_MODULE_1__["default"]];
if (true) {
  var _require = __webpack_require__(/*! redux-logger */ "./node_modules/redux-logger/dist/redux-logger.js"),
    logger = _require.logger;
  middlewares.push(logger);
}
var configureStore = function configureStore() {
  var preloadedState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0,redux__WEBPACK_IMPORTED_MODULE_0__.createStore)(_reducers_root_reducer__WEBPACK_IMPORTED_MODULE_2__["default"], preloadedState, redux__WEBPACK_IMPORTED_MODULE_0__.applyMiddleware.apply(void 0, middlewares));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (configureStore);

/***/ }),

/***/ "./frontend/styles/app.scss":
/*!**********************************!*\
  !*** ./frontend/styles/app.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_app_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./app.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./frontend/styles/app.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_app_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_app_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_app_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_app_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./frontend/styles/app.scss":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./frontend/styles/app.scss ***!
  \*******************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/andvari.ttf */ "./frontend/assets/fonts/andvari.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF */ "./frontend/assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF */ "./frontend/assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/LibreBarcode128-Regular.ttf */ "./frontend/assets/fonts/LibreBarcode128-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: "Andvari";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Erbos Draco 1st NBP";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Erbos Draco 1st Open NBP";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "LibreBarcode128";
  src: url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
.beyond-home-text {
  font-family: "Andvari", serif;
  font-weight: normal;
  font-style: normal;
}

html,
body,
header,
nav,
h1,
a,
ul,
li,
strong,
main,
button,
i,
section,
img,
div,
h2,
h4,
p,
form,
fieldset,
label,
input,
textarea,
span,
article,
footer,
time,
small {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font: inherit;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  color: inherit;
  text-align: inherit;
  text-decoration: inherit;
  vertical-align: inherit;
  box-sizing: inherit;
  background: transparent;
}

ul {
  list-style: none;
}

img {
  display: block;
  width: 100%;
  height: auto;
}

input[type=password],
input[type=email],
input[type=text],
input[type=submit],
textarea,
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

button,
input[type=submit] {
  cursor: pointer;
  text-align: center;
}

/* Clearfix */
.group:after {
  content: "";
  display: block;
  clear: both;
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 20px 0;
}
.navigation .nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.navigation .nav-brand {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: stretch;
  gap: 15px;
  line-height: 1.2;
}
.navigation .nav-brand .nav-logo {
  width: 45px;
  height: 50px;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
  filter: brightness(0) invert(1);
}
.navigation .nav-brand .nav-brand-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 45px;
}
.navigation .nav-brand .artist-name {
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  margin: 0;
  font-family: "Arial", sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.navigation .nav-brand .project-name {
  font-size: 14px;
  color: #ffffff;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  font-family: "Andvari", serif;
}
.navigation .nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 40px;
}
.navigation .nav-item .nav-link {
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  font-family: "Andvari", serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
.navigation .nav-item .nav-link .nav-separator {
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}
.navigation .nav-item .nav-link .nav-separator .separator-icon {
  width: 12px;
  height: 12px;
  color: inherit;
  transition: all 0.2s ease;
}
.navigation .nav-item .nav-link .nav-separator.animating .separator-icon {
  animation: pathTransform 0.4s ease-in-out;
}
.navigation .nav-item .nav-link:hover {
  color: #00ff00;
}
.navigation .nav-item .nav-link.active {
  color: #00ff00;
}
.navigation .nav-item.active .nav-link {
  color: #00ff00;
}
.navigation .nav-item.active .nav-link .nav-separator .separator-icon {
  color: #00ff00;
}
.navigation .nav-item:hover .nav-link:not(.active) {
  color: #00ff00;
}
.navigation .nav-item:hover .nav-link:not(.active) .nav-separator .separator-icon {
  color: #00ff00;
}
@keyframes pathTransform {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(45deg) scale(1.2);
  }
  100% {
    transform: rotate(90deg) scale(1);
  }
}
@media (max-width: 768px) {
  .navigation .nav-brand {
    gap: 10px;
  }
  .navigation .nav-brand .nav-logo {
    width: 35px;
    height: 35px;
    filter: brightness(0) invert(1);
  }
  .navigation .nav-brand .nav-brand-text .artist-name {
    font-size: 16px;
    font-family: "Andvari", serif;
  }
  .navigation .nav-brand .nav-brand-text .project-name {
    font-size: 12px;
  }
  .navigation .nav-menu {
    gap: 20px;
  }
  .navigation .nav-item .nav-link {
    font-size: 14px;
  }
}
@media (max-width: 480px) {
  .navigation .nav-container {
    flex-direction: column;
    gap: 20px;
  }
  .navigation .nav-menu {
    gap: 15px;
  }
}

.home-app {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  background-color: #000000;
}

.main-content {
  margin-top: 0;
  min-height: 100vh;
}

.home .hero-slideshow {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.home .hero-slideshow .slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.home .hero-slideshow .slideshow-container .slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 150%;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.home .hero-slideshow .slideshow-container .slide.active {
  opacity: 1;
}
.home .hero-slideshow .slideshow-container .slide.slide-next {
  z-index: 2;
}
.home .hero-slideshow .slideshow-container .slide::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  z-index: 1;
}
.home .about-me-section {
  background: #0d0d0d;
  height: 70vh;
  padding: 60px 0;
  display: flex;
  align-items: center;
}
.home .about-me-section .about-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.home .about-me-section .character-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}
.home .about-me-section .character-illustration .character-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.7));
}
.home .about-me-section .info-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 45px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  margin-left: 20px;
}
.home .about-me-section .info-card .info-card-header {
  border-bottom: 2px solid #000;
  margin-bottom: 30px;
  padding-bottom: 15px;
}
.home .about-me-section .info-card .info-card-header h2 {
  font-size: 36px;
  font-weight: 400;
  color: #000000;
  margin: 0 0 20px 0;
  font-family: "ISL_Andvari", serif;
  line-height: 47px;
}
.home .about-me-section .info-card .info-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  margin-bottom: 25px;
}
.home .about-me-section .info-card .info-fields-grid .info-fields-left,
.home .about-me-section .info-card .info-fields-grid .info-fields-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.home .about-me-section .info-card .info-field {
  margin-bottom: 0;
}
.home .about-me-section .info-card .info-field .field-label {
  background: #1f1f1f;
  color: #ffffff;
  padding: 5px 10px;
  font-weight: 400;
  font-size: 16px;
  font-family: "Andvari", serif;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 0px 0px 17px 0px;
  line-height: 29px;
  width: 252px;
  height: 27px;
  box-sizing: border-box;
  padding-left: 5px;
}
.home .about-me-section .info-card .info-field .field-value {
  font-weight: 400;
  color: #000000;
  font-size: 20.3px;
  font-family: "ISL_Andvari", serif;
  line-height: 26px;
  margin-bottom: 4px;
}
.home .about-me-section .info-card .info-field .field-subtitle {
  font-weight: 400;
  color: #000000;
  font-size: 13px;
  font-family: "Andvari", serif;
  line-height: 24px;
}
.home .about-me-section .info-card .info-separator {
  width: 548px;
  height: 0px;
  border: 1px solid #000000;
  margin: 25px 0 20px 0;
}
.home .about-me-section .info-card .info-content {
  margin-top: 20px;
}
.home .about-me-section .info-card .info-content p {
  color: #000000;
  line-height: 29px;
  margin-bottom: 0;
  font-size: 16px;
  font-family: "Andvari", serif;
  font-weight: 400;
}

@media (max-width: 768px) {
  .home .about-me-section {
    height: auto;
    min-height: 70vh;
    padding: 30px 0;
  }
  .home .about-me-section .about-container {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }
  .home .about-me-section .character-illustration .character-image {
    max-width: 300px;
  }
  .home .about-me-section .info-card {
    padding: 30px;
    margin-left: 0;
  }
  .home .about-me-section .info-fields-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .home .about-me-section .info-fields-grid .info-fields-left,
  .home .about-me-section .info-fields-grid .info-fields-right {
    gap: 20px;
  }
}
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn--primary {
  background-color: #3a6ea5;
  color: white;
}
.btn--primary:hover {
  background-color: rgb(44.735426009, 84.8430493274, 127.264573991);
}
.btn--secondary {
  background-color: #c0c0c0;
  color: white;
}
.btn--secondary:hover {
  background-color: rgb(166.5, 166.5, 166.5);
}
.btn--success {
  background-color: #28a745;
  color: white;
}
.btn--success:hover {
  background-color: rgb(30.1449275362, 125.8550724638, 52);
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}
.card__title {
  font-size: 1.25rem;
  color: #011627;
  margin-bottom: 0.5rem;
}
.card__content {
  color: #c0c0c0;
  line-height: 1.6;
}

.grid {
  display: grid;
  gap: 1rem;
}
@media (min-width: 576px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.text-primary {
  color: #3a6ea5;
}

.text-secondary {
  color: #c0c0c0;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #ed0300;
}

.text-warning {
  color: #ff9f1c;
}

.text-info {
  color: #5697d8;
}

.bg-primary {
  background-color: #3a6ea5;
}

.bg-secondary {
  background-color: #c0c0c0;
}

.bg-success {
  background-color: #28a745;
}

.bg-danger {
  background-color: #ed0300;
}

.bg-warning {
  background-color: #ff9f1c;
}

.bg-info {
  background-color: #5697d8;
}

.slideshow-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 20px;
}
.slideshow-controls .slideshow-control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.slideshow-controls .slideshow-control-btn:hover {
  transform: scale(1.1);
  background: rgb(255, 255, 255);
}
.slideshow-controls .slideshow-control-btn.circular-notch {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
}
.slideshow-controls .slideshow-control-btn.circular-notch svg {
  color: #333;
}
.slideshow-controls .slideshow-control-btn.play-pause-btn {
  width: 50px;
  height: 50px;
  color: rgba(255, 255, 255, 0.9);
}
.slideshow-controls .slideshow-control-btn.play-pause-btn svg {
  color: #333;
}
.slideshow-controls .slideshow-control-btn.play-pause-btn:hover {
  background: rgb(255, 255, 255);
}
.slideshow-controls .play-pause-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}
.slideshow-controls .play-pause-container .progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.slideshow-controls .play-pause-container .play-pause-btn {
  position: relative;
  z-index: 1;
}

.metadata-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 15;
  pointer-events: none;
  font-family: "Erbos Draco 1st Open NBP", monospace;
  color: white;
}
.metadata-overlay .top-bottom-gradient-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 40.38%, rgba(255, 255, 255, 0) 100%);
  mix-blend-mode: multiply;
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
}
.metadata-overlay .metadata-blocks {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 40px;
}
.metadata-overlay .metadata-blocks .metadata-blocks-left {
  display: flex;
  gap: 108px;
  align-items: flex-start;
  flex-direction: row;
}
.metadata-overlay .metadata-blocks .metadata-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.metadata-overlay .metadata-blocks .metadata-block .metadata-label {
  font-family: "Erbos Draco 1st Open NBP", monospace;
  font-size: 14px;
  font-weight: normal;
  color: #ffffff;
  margin-bottom: 2px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
}
.metadata-overlay .metadata-blocks .metadata-block .metadata-value {
  font-family: "Erbos Draco 1st Open NBP", monospace;
  font-size: 14px;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
}
.metadata-overlay .metadata-blocks .art-title-block .art-title {
  display: flex;
  gap: 2px;
  align-items: flex-start;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .barcode-wrapper {
  height: 16px;
  overflow: hidden;
  margin-bottom: 2px;
  display: flex;
  align-items: flex-start;
  padding-top: 6px;
  width: fit-content;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .barcode-text {
  font-family: "LibreBarcode128", monospace;
  font-size: 48px;
  line-height: 1;
  color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
  white-space: nowrap;
  transform-origin: right;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .artwork-title {
  font-family: "Erbos Draco 1st Open NBP", monospace;
  font-size: 14px;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  text-align: right;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 6px;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
}
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg img,
.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg svg {
  width: 45px;
  height: 45px;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
}

.artist-branding {
  position: absolute;
  bottom: 60px;
  left: 40px;
  right: 40px;
  z-index: 15;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.artist-branding .artist-info .artist-name {
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-family: "Arial", sans-serif;
}
.artist-branding .artist-info .artist-subtitle {
  font-size: 16px;
  margin: 5px 0 10px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  font-family: "Erbos Draco 1st Open NBP", monospace;
}
.artist-branding .artist-info .artist-tagline {
  font-size: 14px;
  margin: 0;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  font-family: "Erbos Draco 1st Open NBP", monospace;
}
.artist-branding .slideshow-controls-container {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .metadata-overlay .metadata-top-left,
  .metadata-overlay .metadata-top-right {
    top: 20px;
    font-size: 10px;
  }
  .metadata-overlay .metadata-top-left {
    left: 20px;
  }
  .metadata-overlay .metadata-top-right {
    right: 20px;
  }
  .metadata-overlay .metadata-top-center {
    top: 20px;
  }
  .metadata-overlay .metadata-top-center .barcode-component {
    padding: 8px 15px;
  }
  .metadata-overlay .metadata-top-center .barcode-component .artwork-title {
    font-size: 12px;
  }
  .metadata-overlay .metadata-top-center .barcode-component .barcode-cross {
    width: 16px;
    height: 16px;
  }
  .artist-branding {
    bottom: 40px;
    left: 20px;
    right: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .artist-branding .slideshow-controls-container {
    align-self: center;
  }
  .artist-branding .artist-info .artist-name {
    font-size: 32px;
  }
  .artist-branding .artist-info .artist-subtitle {
    font-size: 14px;
  }
  .artist-branding .artist-info .artist-tagline {
    font-size: 12px;
  }
}
.main-footer {
  background: linear-gradient(135deg, #cc3333, #aa2222);
  color: white;
  height: 30vh;
  padding: 40px 0;
  display: flex;
  align-items: center;
  position: relative;
}
.main-footer .waved-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  background-size: 100px 100px, 150px 150px, 200px 200px;
  opacity: 0.3;
  animation: wave 20s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
.main-footer .footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
  align-items: start;
}
.main-footer .footer-left {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}
.main-footer .social-section h3,
.main-footer .nav-section h3 {
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 25px;
  font-family: "Courier New", monospace;
  letter-spacing: 2px;
  color: white;
}
.main-footer .social-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.main-footer .social-links .social-link {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-family: "Courier New", monospace;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}
.main-footer .social-links .social-link .social-icon {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.main-footer .social-links .social-link:hover {
  color: #ffeeee;
  transform: translateX(5px);
}
.main-footer .nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.main-footer .nav-buttons .nav-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
}
.main-footer .nav-buttons .nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
.main-footer .nav-buttons .nav-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}
.main-footer .footer-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
}
.main-footer .footer-right .scanning-svg .scanning-image {
  width: 120px;
  height: auto;
  filter: invert(1) brightness(0.9);
  opacity: 0.8;
}
.main-footer .footer-right .footer-logo {
  text-align: right;
}
.main-footer .footer-right .footer-logo .logo-text {
  font-size: 32px;
  font-weight: 900;
  font-family: "Arial", sans-serif;
  letter-spacing: 3px;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.main-footer .footer-right .footer-logo .logo-tagline {
  font-size: 14px;
  font-weight: 600;
  font-family: "Courier New", monospace;
  letter-spacing: 2px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .main-footer {
    height: auto;
    min-height: 30vh;
    padding: 30px 0;
  }
  .main-footer .footer-container {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }
  .main-footer .footer-left {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .main-footer .footer-right {
    justify-content: center;
  }
  .main-footer .footer-right .footer-logo {
    text-align: center;
  }
  .main-footer .footer-right .footer-logo .logo-text {
    font-size: 24px;
    letter-spacing: 2px;
  }
  .main-footer .footer-right .footer-logo .logo-tagline {
    font-size: 12px;
  }
}
@media (max-width: 480px) {
  .main-footer .social-links .social-link {
    font-size: 12px;
  }
  .main-footer .social-links .social-link .social-icon {
    font-size: 14px;
  }
  .main-footer .nav-buttons .nav-button {
    padding: 10px 15px;
    font-size: 12px;
  }
}
.artist-branding {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  align-items: flex-start;
}
.artist-branding .artist-branding-block {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 40px;
}
.artist-branding .bottom-top-gradient-shadow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
  mix-blend-mode: multiply;
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
}
.artist-branding__logo {
  align-self: center;
}
.artist-branding__logo-icon {
  height: 110px;
  filter: invert(1);
}
.artist-branding__content {
  color: white;
}
.artist-branding__name {
  font-size: 3rem;
  font-weight: 300;
  font-family: "Andvari";
  letter-spacing: 0.1em;
  margin: 0;
  color: white;
  text-transform: uppercase;
}
.artist-branding__subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
}
.artist-branding__separator {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}
.artist-branding__tagline-wrapper {
  align-items: center;
  width: 212px;
  justify-content: center;
}
.artist-branding__tagline {
  font-size: 1.1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
  letter-spacing: 0.05em;
}
@media (max-width: 1024px) {
  .artist-branding {
    padding: 1.5rem 2rem;
    bottom: 2rem;
    gap: 2rem;
  }
  .artist-branding__name {
    font-size: 2.5rem;
  }
  .artist-branding__logo-icon {
    width: 60px;
    height: 60px;
  }
}
@media (max-width: 768px) {
  .artist-branding {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
    bottom: 1rem;
  }
  .artist-branding__logo {
    justify-self: center;
  }
  .artist-branding__content {
    text-align: center;
  }
  .artist-branding__row {
    flex-direction: column;
    gap: 1rem;
  }
  .artist-branding__name {
    font-size: 2rem;
  }
  .artist-branding__logo-icon {
    width: 50px;
    height: 50px;
  }
}`, "",{"version":3,"sources":["webpack://./frontend/styles/fonts.scss","webpack://./frontend/styles/app.scss","webpack://./frontend/styles/reset.scss","webpack://./frontend/styles/navigation.scss","webpack://./frontend/styles/home.scss","webpack://./frontend/styles/components.scss","webpack://./frontend/styles/variables.scss","webpack://./frontend/styles/slideshow_controls.scss","webpack://./frontend/styles/metadata_overlay.scss","webpack://./frontend/styles/footer.scss","webpack://./frontend/styles/artist_branding.scss"],"names":[],"mappings":"AAEA;EACE,sBAAA;EACA,+DAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;ACDF;ADIA;EACE,kCAAA;EACA,+DAAA;EAEA,mBAAA;EACA,kBAAA;EACA,kBAAA;ACHF;ADMA;EACE,uCAAA;EACA,+DAAA;EAEA,mBAAA;EACA,kBAAA;EACA,kBAAA;ACLF;ADQA;EACE,8BAAA;EACA,+DAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;ACNF;ADUA;EACE,6BAAA;EACA,mBAAA;EACA,kBAAA;ACRF;;AChCA;;;;;;;;;;;;;;;;;;;;;;;;;;;;EA4BE,SAAA;EACA,UAAA;EACA,SAAA;EACA,UAAA;EACA,aAAA;EACA,oDAAA;EACA,cAAA;EACA,mBAAA;EACA,wBAAA;EACA,uBAAA;EACA,mBAAA;EACA,uBAAA;ADmCF;;AChCA;EACE,gBAAA;ADmCF;;AChCA;EACE,cAAA;EACA,WAAA;EACA,YAAA;ADmCF;;AChCA;;;;;;EAME,wBAAA;EACA,qBAAA;EACA,gBAAA;ADmCF;;AChCA;;EAEE,eAAA;EACA,kBAAA;ADmCF;;AChCA,aAAA;AAEA;EACE,WAAA;EACA,cAAA;EACA,WAAA;ADkCF;;AE7EA;EACE,eAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,8BAAA;EACA,2BAAA;EACA,iDAAA;EACA,aAAA;EACA,eAAA;AFgFF;AE9EE;EAjBA,iBAJoB;EAKpB,cAAA;EACA,eAAA;EAiBE,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,SAAA;AFkFJ;AE/EE;EACE,qBAAA;EACA,cAhDY;EAiDZ,aAAA;EACA,oBAAA;EACA,SAAA;EACA,gBAAA;AFiFJ;AE/EI;EACE,WAAA;EACA,YAAA;EACA,mBAAA;EACA,cAAA;EACA,cAAA;EACA,+BAAA;AFiFN;AE9EI;EACE,aAAA;EACA,sBAAA;EACA,8BAAA;EACA,uBAAA;EACA,YAAA;AFgFN;AE7EI;EACE,eAAA;EACA,gBAAA;EACA,cA1EU;EA2EV,gBAAA;EACA,SAAA;EACA,gCAAA;EACA,mBAAA;EACA,yBAAA;AF+EN;AE5EI;EACE,eAAA;EACA,cApFU;EAqFV,gBAAA;EACA,gBAAA;EACA,SAAA;EACA,6BAAA;AF8EN;AE1EE;EACE,aAAA;EACA,gBAAA;EACA,SAAA;EACA,UAAA;EACA,SAAA;AF4EJ;AExEI;EACE,qBAAA;EACA,cAvGU;EAwGV,gBAAA;EACA,eAAA;EACA,yBAjGO;EAkGP,kBAAA;EACA,6BAAA;EACA,mBAAA;EACA,yBAAA;EACA,aAAA;EACA,mBAAA;EACA,QAAA;AF0EN;AExEM;EACE,oBAAA;EACA,mBAAA;EACA,yBAAA;AF0ER;AExEQ;EACE,WAAA;EACA,YAAA;EACA,cAAA;EACA,yBAAA;AF0EV;AEvEQ;EACE,yCAAA;AFyEV;AErEM;EACE,cAAA;AFuER;AEpEM;EACE,cAAA;AFsER;AElEI;EACE,cAAA;AFoEN;AElEM;EACE,cAAA;AFoER;AEhEI;EACE,cAAA;AFkEN;AEhEM;EACE,cAAA;AFkER;AE7DE;EACE;IACE,gCAAA;EF+DJ;EE7DE;IACE,mCAAA;EF+DJ;EE7DE;IACE,iCAAA;EF+DJ;AACF;AE3DE;EACE;IACE,SAAA;EF6DJ;EE3DI;IACE,WAAA;IACA,YAAA;IACA,+BAAA;EF6DN;EEzDM;IACE,eAAA;IACA,6BAAA;EF2DR;EExDM;IACE,eAAA;EF0DR;EErDE;IACE,SAAA;EFuDJ;EEpDE;IACE,eAAA;EFsDJ;AACF;AEnDE;EACE;IACE,sBAAA;IACA,SAAA;EFqDJ;EElDE;IACE,SAAA;EFoDJ;AACF;;AG3PA;EACE,uFAAA;EAEA,gBAAA;EACA,cAAA;EACA,yBAAA;AH6PF;;AG1PA;EACE,aAAA;EACA,iBAAA;AH6PF;;AGxPE;EACE,kBAAA;EACA,aAAA;EACA,WAAA;EACA,gBAAA;AH2PJ;AGzPI;EACE,kBAAA;EACA,WAAA;EACA,YAAA;AH2PN;AGzPM;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,qBAAA;EACA,2BAAA;EACA,4BAAA;EACA,UAAA;EACA,kCAAA;AH2PR;AGzPQ;EACE,UAAA;AH2PV;AGxPQ;EACE,UAAA;AH0PV;AGvPQ;EACE,WAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,kGAAA;EAMA,UAAA;AHoPV;AG7OE;EACE,mBA7EW;EA8EX,YAAA;EACA,eAAA;EACA,aAAA;EACA,mBAAA;AH+OJ;AG7OI;EA/EF,iBALyB;EAMzB,cAAA;EACA,eAAA;EA+EI,aAAA;EACA,8BAAA;EACA,SAAA;EACA,mBAAA;AHiPN;AG9OI;EACE,aAAA;EACA,mBAAA;EACA,uBAAA;AHgPN;AG9OM;EACE,WAAA;EACA,gBAAA;EACA,YAAA;EACA,mBAAA;EACA,mDAAA;AHgPR;AG5OI;EACE,qCAAA;EACA,mBAAA;EACA,aAAA;EACA,0CAAA;EACA,iBAAA;AH8ON;AG5OM;EACE,6BAAA;EACA,mBAAA;EACA,oBAAA;AH8OR;AG5OQ;EACE,eAAA;EACA,gBAAA;EACA,cAAA;EACA,kBAAA;EACA,iCAAA;EACA,iBAAA;AH8OV;AG1OM;EACE,aAAA;EACA,8BAAA;EACA,SAAA;EACA,mBAAA;AH4OR;AG1OQ;;EAEE,aAAA;EACA,sBAAA;EACA,SAAA;AH4OV;AGxOM;EACE,gBAAA;AH0OR;AGxOQ;EACE,mBAAA;EACA,cAAA;EACA,iBAAA;EACA,gBAAA;EACA,eAAA;EACA,6BAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;EACA,+BAAA;EACA,iBAAA;EACA,YAAA;EACA,YAAA;EACA,sBAAA;EACA,iBAAA;AH0OV;AGvOQ;EACE,gBAAA;EACA,cAAA;EACA,iBAAA;EACA,iCAAA;EACA,iBAAA;EACA,kBAAA;AHyOV;AGtOQ;EACE,gBAAA;EACA,cAAA;EACA,eAAA;EACA,6BAAA;EACA,iBAAA;AHwOV;AGpOM;EACE,YAAA;EACA,WAAA;EACA,yBAAA;EACA,qBAAA;AHsOR;AGnOM;EACE,gBAAA;AHqOR;AGnOQ;EACE,cAAA;EACA,iBAAA;EACA,gBAAA;EACA,eAAA;EACA,6BAAA;EACA,gBAAA;AHqOV;;AG7NA;EAEI;IACE,YAAA;IACA,gBAAA;IACA,eAAA;EH+NJ;EG7NI;IACE,0BAAA;IACA,SAAA;IACA,eAAA;EH+NN;EG3NM;IACE,gBAAA;EH6NR;EGzNI;IACE,aAAA;IACA,cAAA;EH2NN;EGxNI;IACE,0BAAA;IACA,SAAA;EH0NN;EGxNM;;IAEE,SAAA;EH0NR;AACF;AItcA;EACE,qBAAA;EACA,oBAAA;EACA,YAAA;EACA,kBAAA;EACA,eCwBe;EDvBf,eAAA;EACA,yBAAA;AJwcF;AItcE;EACE,yBCNG;EDOH,YAAA;AJwcJ;AItcI;EACE,iEAAA;AJwcN;AIpcE;EACE,yBCpBG;EDqBH,YAAA;AJscJ;AIpcI;EACE,0CAAA;AJscN;AIlcE;EACE,yBCRY;EDSZ,YAAA;AJocJ;AIlcI;EACE,wDAAA;AJocN;;AI9bA;EACE,iBAAA;EACA,kBAAA;EACA,wCAAA;EACA,eCLW;EDMX,mBCPW;ALwcb;AI/bE;EACE,kBChBc;EDiBd,cCzCG;ED0CH,qBCbS;AL8cb;AI9bE;EACE,cCrDG;EDsDH,gBAAA;AJgcJ;;AI3bA;EACE,aAAA;EACA,SCxBW;ALsdb;AKncI;EDGJ;IAKI,qCAAA;EJ+bF;AACF;AKpcI;EDDJ;IASI,qCAAA;EJgcF;AACF;AKrcI;EDLJ;IAaI,qCAAA;EJicF;AACF;;AI7bA;EACE,cCzEK;ALygBP;;AI9bA;EACE,cCjFK;ALkhBP;;AI/bA;EACE,cC/Dc;ALigBhB;;AIhcA;EACE,cC9ES;ALihBX;;AIjcA;EACE,cCxFa;AL4hBf;;AIlcA;EACE,cCzFW;AL8hBb;;AIlcA;EACE,yBC5FK;ALiiBP;;AIncA;EACE,yBCpGK;AL0iBP;;AIpcA;EACE,yBClFc;ALyhBhB;;AIrcA;EACE,yBCjGS;ALyiBX;;AItcA;EACE,yBC3Ga;ALojBf;;AIvcA;EACE,yBC5GW;ALsjBb;;AM1jBA;EACE,aAAA;EACA,mBAAA;EACA,SAAA;EACA,cAAA;AN6jBF;AM3jBE;EACE,oCAAA;EACA,YAAA;EACA,WAAA;EACA,eAAA;EACA,UAAA;EACA,yBAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;AN6jBJ;AM3jBI;EACE,qBAAA;EACA,8BAAA;AN6jBN;AM1jBI;EACE,kBAAA;EACA,oCAAA;AN4jBN;AM1jBM;EACE,WAAA;AN4jBR;AMxjBI;EACE,WAAA;EACA,YAAA;EACA,+BAAA;AN0jBN;AMxjBM;EACE,WAAA;AN0jBR;AMvjBM;EACE,8BAAA;ANyjBR;AMpjBE;EACE,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,WAAA;EACA,YAAA;ANsjBJ;AMpjBI;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,oBAAA;ANsjBN;AMnjBI;EACE,kBAAA;EACA,UAAA;ANqjBN;;AOznBA;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,WAAA;EACA,oBAAA;EACA,kDAAA;EACA,YAAA;AP4nBF;AO1nBE;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,2FAAA;EAKA,wBAAA;EACA,YAAA;EACA,oBAAA;EACA,WAAA;APwnBJ;AOrnBE;EACE,kBAAA;EACA,UAAA;EACA,SAAA;EACA,2BAAA;EACA,iBAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,eAAA;APunBJ;AOrnBI;EACE,aAAA;EACA,UAAA;EACA,uBAAA;EACA,mBAAA;APunBN;AOpnBI;EACE,aAAA;EACA,sBAAA;EACA,uBAAA;APsnBN;AOpnBM;EACE,kDAAA;EACA,eAAA;EACA,mBAAA;EACA,cAAA;EACA,kBAAA;EACA,yCAAA;APsnBR;AOnnBM;EACE,kDAAA;EACA,eAAA;EACA,cAAA;EACA,yCAAA;APqnBR;AOhnBM;EACE,aAAA;EACA,QAAA;EACA,uBAAA;APknBR;AOhnBQ;EACE,aAAA;EACA,sBAAA;EACA,qBAAA;APknBV;AOhnBU;EACE,YAAA;EACA,gBAAA;EACA,kBAAA;EACA,aAAA;EACA,uBAAA;EACA,gBAAA;EACA,kBAAA;APknBZ;AO/mBU;EACE,yCAAA;EACA,eAAA;EACA,cAAA;EACA,YAAA;EACA,mDAAA;EACA,mBAAA;EACA,uBAAA;APinBZ;AO9mBU;EACE,kDAAA;EACA,eAAA;EACA,cAAA;EACA,yCAAA;EACA,iBAAA;APgnBZ;AO5mBQ;EACE,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,gBAAA;AP8mBV;AO5mBU;EACE,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,WAAA;EACA,YAAA;AP8mBZ;AO5mBY;;EAEE,WAAA;EACA,YAAA;EACA,mDAAA;AP8mBd;;AOpmBA;EACE,kBAAA;EACA,YAAA;EACA,UAAA;EACA,WAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,8BAAA;EACA,qBAAA;APumBF;AOpmBI;EACE,eAAA;EACA,gBAAA;EACA,SAAA;EACA,2CAAA;EACA,gCAAA;APsmBN;AOnmBI;EACE,eAAA;EACA,oBAAA;EACA,2CAAA;EACA,kDAAA;APqmBN;AOlmBI;EACE,eAAA;EACA,SAAA;EACA,kBAAA;EACA,2CAAA;EACA,kDAAA;APomBN;AOhmBE;EACE,aAAA;EACA,mBAAA;APkmBJ;;AO7lBA;EAEI;;IAEE,SAAA;IACA,eAAA;EP+lBJ;EO5lBE;IACE,UAAA;EP8lBJ;EO3lBE;IACE,WAAA;EP6lBJ;EO1lBE;IACE,SAAA;EP4lBJ;EO1lBI;IACE,iBAAA;EP4lBN;EO1lBM;IACE,eAAA;EP4lBR;EOzlBM;IACE,WAAA;IACA,YAAA;EP2lBR;EOrlBA;IACE,YAAA;IACA,UAAA;IACA,WAAA;IACA,sBAAA;IACA,uBAAA;IACA,SAAA;EPulBF;EOrlBE;IACE,kBAAA;EPulBJ;EOnlBI;IACE,eAAA;EPqlBN;EOllBI;IACE,eAAA;EPolBN;EOjlBI;IACE,eAAA;EPmlBN;AACF;AQ9zBA;EACE,qDAAA;EACA,YAAA;EACA,YAAA;EACA,eAAA;EACA,aAAA;EACA,mBAAA;EACA,kBAAA;ARg0BF;AQ9zBE;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,wQAAA;EAeA,sDAAA;EACA,YAAA;EACA,wCAAA;ARkzBJ;AQ/yBE;EACE;IAEE,0BAAA;ERgzBJ;EQ9yBE;IACE,4BAAA;ERgzBJ;AACF;AQ7yBE;EACE,iBAAA;EACA,cAAA;EACA,eAAA;EACA,aAAA;EACA,8BAAA;EACA,SAAA;EACA,kBAAA;AR+yBJ;AQ5yBE;EACE,aAAA;EACA,8BAAA;EACA,SAAA;AR8yBJ;AQzyBI;;EACE,eAAA;EACA,gBAAA;EACA,mBAAA;EACA,qCAAA;EACA,mBAAA;EACA,YAAA;AR4yBN;AQxyBE;EACE,aAAA;EACA,sBAAA;EACA,SAAA;AR0yBJ;AQxyBI;EACE,YAAA;EACA,qBAAA;EACA,eAAA;EACA,qCAAA;EACA,gBAAA;EACA,mBAAA;EACA,yBAAA;EACA,aAAA;EACA,mBAAA;AR0yBN;AQxyBM;EACE,kBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;AR0yBR;AQvyBM;EACE,cAAA;EACA,0BAAA;ARyyBR;AQpyBE;EACE,aAAA;EACA,sBAAA;EACA,SAAA;ARsyBJ;AQpyBI;EACE,oCAAA;EACA,YAAA;EACA,qBAAA;EACA,kBAAA;EACA,kBAAA;EACA,qCAAA;EACA,gBAAA;EACA,eAAA;EACA,mBAAA;EACA,yBAAA;EACA,kBAAA;EACA,6BAAA;ARsyBN;AQpyBM;EACE,oCAAA;EACA,2BAAA;ARsyBR;AQnyBM;EACE,oCAAA;EACA,sCAAA;ARqyBR;AQhyBE;EACE,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,qBAAA;EACA,SAAA;ARkyBJ;AQ/xBM;EACE,YAAA;EACA,YAAA;EACA,iCAAA;EACA,YAAA;ARiyBR;AQ7xBI;EACE,iBAAA;AR+xBN;AQ7xBM;EACE,eAAA;EACA,gBAAA;EACA,gCAAA;EACA,mBAAA;EACA,kBAAA;EACA,2CAAA;AR+xBR;AQ5xBM;EACE,eAAA;EACA,gBAAA;EACA,qCAAA;EACA,mBAAA;EACA,YAAA;AR8xBR;;AQvxBA;EACE;IACE,YAAA;IACA,gBAAA;IACA,eAAA;ER0xBF;EQxxBE;IACE,0BAAA;IACA,SAAA;IACA,eAAA;ER0xBJ;EQvxBE;IACE,0BAAA;IACA,SAAA;ERyxBJ;EQtxBE;IACE,uBAAA;ERwxBJ;EQtxBI;IACE,kBAAA;ERwxBN;EQtxBM;IACE,eAAA;IACA,mBAAA;ERwxBR;EQrxBM;IACE,eAAA;ERuxBR;AACF;AQjxBA;EAGM;IACE,eAAA;ERixBN;EQ/wBM;IACE,eAAA;ERixBR;EQ3wBI;IACE,kBAAA;IACA,eAAA;ER6wBN;AACF;ASh/BA;EACE,kBAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,WAAA;EACA,uBAAA;ATk/BF;ASh/BE;EACE,kBAAA;EACA,YAAA;EACA,SAAA;EACA,2BAAA;EACA,iBAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,eAAA;ATk/BJ;AS/+BE;EACE,kBAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,uFAAA;EAKA,wBAAA;EACA,YAAA;EACA,oBAAA;EACA,WAAA;AT6+BJ;AS1+BE;EACE,kBAAA;AT4+BJ;AS1+BI;EACE,aAAA;EACA,iBAAA;AT4+BN;ASx+BE;EACE,YAAA;AT0+BJ;ASv+BE;EACE,eAAA;EACA,gBAAA;EACA,sBAAA;EACA,qBAAA;EACA,SAAA;EACA,YAAA;EACA,yBAAA;ATy+BJ;ASt+BE;EACE,iBAAA;EACA,gBAAA;EACA,SAAA;EACA,+BAAA;EACA,sBAAA;ATw+BJ;ASr+BE;EACE,WAAA;EACA,WAAA;EACA,oCAAA;ATu+BJ;ASp+BE;EACE,mBAAA;EACA,YAAA;EACA,uBAAA;ATs+BJ;ASn+BE;EACE,iBAAA;EACA,gBAAA;EACA,+BAAA;EACA,oBAAA;EACA,sBAAA;ATq+BJ;ASj+BE;EA1FF;IA2FI,oBAAA;IACA,YAAA;IACA,SAAA;ETo+BF;ESl+BE;IACE,iBAAA;ETo+BJ;ESj+BE;IACE,WAAA;IACA,YAAA;ETm+BJ;AACF;ASh+BE;EAzGF;IA0GI,0BAAA;IACA,WAAA;IACA,aAAA;IACA,YAAA;ETm+BF;ESj+BE;IACE,oBAAA;ETm+BJ;ESh+BE;IACE,kBAAA;ETk+BJ;ES/9BE;IACE,sBAAA;IACA,SAAA;ETi+BJ;ES99BE;IACE,eAAA;ETg+BJ;ES79BE;IACE,WAAA;IACA,YAAA;ET+9BJ;AACF","sourcesContent":["// Font definitions for Beyond Home application\n\n@font-face {\n  font-family: 'Andvari';\n  src: url('../assets/fonts/andvari.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: 'Erbos Draco 1st NBP';\n  src: url('../assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF')\n    format('truetype');\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: 'Erbos Draco 1st Open NBP';\n  src: url('../assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF')\n    format('truetype');\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: 'LibreBarcode128';\n  src: url('../assets/fonts/LibreBarcode128-Regular.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n\n// CSS class for Beyond Home text\n.beyond-home-text {\n  font-family: 'Andvari', serif;\n  font-weight: normal;\n  font-style: normal;\n}\n","@font-face {\n  font-family: \"Andvari\";\n  src: url(\"../assets/fonts/andvari.ttf\") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Erbos Draco 1st NBP\";\n  src: url(\"../assets/fonts/ERBOSDRACO1STNBPREGULAR-99V5.TTF\") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"Erbos Draco 1st Open NBP\";\n  src: url(\"../assets/fonts/ERBOSDRACO1STOPENNBPREGULAR-L5WX.TTF\") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n@font-face {\n  font-family: \"LibreBarcode128\";\n  src: url(\"../assets/fonts/LibreBarcode128-Regular.ttf\") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}\n.beyond-home-text {\n  font-family: \"Andvari\", serif;\n  font-weight: normal;\n  font-style: normal;\n}\n\nhtml,\nbody,\nheader,\nnav,\nh1,\na,\nul,\nli,\nstrong,\nmain,\nbutton,\ni,\nsection,\nimg,\ndiv,\nh2,\nh4,\np,\nform,\nfieldset,\nlabel,\ninput,\ntextarea,\nspan,\narticle,\nfooter,\ntime,\nsmall {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font: inherit;\n  font-family: \"Helvetica Neue\", Helvetica, sans-serif;\n  color: inherit;\n  text-align: inherit;\n  text-decoration: inherit;\n  vertical-align: inherit;\n  box-sizing: inherit;\n  background: transparent;\n}\n\nul {\n  list-style: none;\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\ninput[type=password],\ninput[type=email],\ninput[type=text],\ninput[type=submit],\ntextarea,\nbutton {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nbutton,\ninput[type=submit] {\n  cursor: pointer;\n  text-align: center;\n}\n\n/* Clearfix */\n.group:after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n\n.navigation {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.6);\n  backdrop-filter: blur(10px);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  z-index: 1000;\n  padding: 20px 0;\n}\n.navigation .nav-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n}\n.navigation .nav-brand {\n  text-decoration: none;\n  color: #ffffff;\n  display: flex;\n  align-items: stretch;\n  gap: 15px;\n  line-height: 1.2;\n}\n.navigation .nav-brand .nav-logo {\n  width: 45px;\n  height: 50px;\n  object-fit: contain;\n  flex-shrink: 0;\n  display: block;\n  filter: brightness(0) invert(1);\n}\n.navigation .nav-brand .nav-brand-text {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: flex-start;\n  height: 45px;\n}\n.navigation .nav-brand .artist-name {\n  font-size: 20px;\n  font-weight: 900;\n  color: #ffffff;\n  line-height: 1.1;\n  margin: 0;\n  font-family: \"Arial\", sans-serif;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n.navigation .nav-brand .project-name {\n  font-size: 14px;\n  color: #ffffff;\n  font-weight: 400;\n  line-height: 1.2;\n  margin: 0;\n  font-family: \"Andvari\", serif;\n}\n.navigation .nav-menu {\n  display: flex;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  gap: 40px;\n}\n.navigation .nav-item .nav-link {\n  text-decoration: none;\n  color: #ffffff;\n  font-weight: 500;\n  font-size: 16px;\n  transition: all 0.3s ease;\n  position: relative;\n  font-family: \"Andvari\", serif;\n  letter-spacing: 1px;\n  text-transform: uppercase;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.navigation .nav-item .nav-link .nav-separator {\n  display: inline-flex;\n  align-items: center;\n  transition: all 0.3s ease;\n}\n.navigation .nav-item .nav-link .nav-separator .separator-icon {\n  width: 12px;\n  height: 12px;\n  color: inherit;\n  transition: all 0.2s ease;\n}\n.navigation .nav-item .nav-link .nav-separator.animating .separator-icon {\n  animation: pathTransform 0.4s ease-in-out;\n}\n.navigation .nav-item .nav-link:hover {\n  color: #00ff00;\n}\n.navigation .nav-item .nav-link.active {\n  color: #00ff00;\n}\n.navigation .nav-item.active .nav-link {\n  color: #00ff00;\n}\n.navigation .nav-item.active .nav-link .nav-separator .separator-icon {\n  color: #00ff00;\n}\n.navigation .nav-item:hover .nav-link:not(.active) {\n  color: #00ff00;\n}\n.navigation .nav-item:hover .nav-link:not(.active) .nav-separator .separator-icon {\n  color: #00ff00;\n}\n@keyframes pathTransform {\n  0% {\n    transform: rotate(0deg) scale(1);\n  }\n  50% {\n    transform: rotate(45deg) scale(1.2);\n  }\n  100% {\n    transform: rotate(90deg) scale(1);\n  }\n}\n@media (max-width: 768px) {\n  .navigation .nav-brand {\n    gap: 10px;\n  }\n  .navigation .nav-brand .nav-logo {\n    width: 35px;\n    height: 35px;\n    filter: brightness(0) invert(1);\n  }\n  .navigation .nav-brand .nav-brand-text .artist-name {\n    font-size: 16px;\n    font-family: \"Andvari\", serif;\n  }\n  .navigation .nav-brand .nav-brand-text .project-name {\n    font-size: 12px;\n  }\n  .navigation .nav-menu {\n    gap: 20px;\n  }\n  .navigation .nav-item .nav-link {\n    font-size: 14px;\n  }\n}\n@media (max-width: 480px) {\n  .navigation .nav-container {\n    flex-direction: column;\n    gap: 20px;\n  }\n  .navigation .nav-menu {\n    gap: 15px;\n  }\n}\n\n.home-app {\n  font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  line-height: 1.6;\n  color: #ffffff;\n  background-color: #000000;\n}\n\n.main-content {\n  margin-top: 0;\n  min-height: 100vh;\n}\n\n.home .hero-slideshow {\n  position: relative;\n  height: 100vh;\n  width: 100%;\n  overflow: hidden;\n}\n.home .hero-slideshow .slideshow-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.home .hero-slideshow .slideshow-container .slide {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-size: 150%;\n  background-position: center;\n  background-repeat: no-repeat;\n  opacity: 0;\n  transition: opacity 1s ease-in-out;\n}\n.home .hero-slideshow .slideshow-container .slide.active {\n  opacity: 1;\n}\n.home .hero-slideshow .slideshow-container .slide.slide-next {\n  z-index: 2;\n}\n.home .hero-slideshow .slideshow-container .slide::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));\n  z-index: 1;\n}\n.home .about-me-section {\n  background: #0d0d0d;\n  height: 70vh;\n  padding: 60px 0;\n  display: flex;\n  align-items: center;\n}\n.home .about-me-section .about-container {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 0 20px;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 80px;\n  align-items: center;\n}\n.home .about-me-section .character-illustration {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.home .about-me-section .character-illustration .character-image {\n  width: 100%;\n  max-width: 400px;\n  height: auto;\n  border-radius: 12px;\n  filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.7));\n}\n.home .about-me-section .info-card {\n  background: rgba(255, 255, 255, 0.97);\n  border-radius: 12px;\n  padding: 45px;\n  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);\n  margin-left: 20px;\n}\n.home .about-me-section .info-card .info-card-header {\n  border-bottom: 2px solid #000;\n  margin-bottom: 30px;\n  padding-bottom: 15px;\n}\n.home .about-me-section .info-card .info-card-header h2 {\n  font-size: 36px;\n  font-weight: 400;\n  color: #000000;\n  margin: 0 0 20px 0;\n  font-family: \"ISL_Andvari\", serif;\n  line-height: 47px;\n}\n.home .about-me-section .info-card .info-fields-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 44px;\n  margin-bottom: 25px;\n}\n.home .about-me-section .info-card .info-fields-grid .info-fields-left,\n.home .about-me-section .info-card .info-fields-grid .info-fields-right {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n}\n.home .about-me-section .info-card .info-field {\n  margin-bottom: 0;\n}\n.home .about-me-section .info-card .info-field .field-label {\n  background: #1f1f1f;\n  color: #ffffff;\n  padding: 5px 10px;\n  font-weight: 400;\n  font-size: 16px;\n  font-family: \"Andvari\", serif;\n  display: flex;\n  align-items: center;\n  margin-bottom: 10px;\n  border-radius: 0px 0px 17px 0px;\n  line-height: 29px;\n  width: 252px;\n  height: 27px;\n  box-sizing: border-box;\n  padding-left: 5px;\n}\n.home .about-me-section .info-card .info-field .field-value {\n  font-weight: 400;\n  color: #000000;\n  font-size: 20.3px;\n  font-family: \"ISL_Andvari\", serif;\n  line-height: 26px;\n  margin-bottom: 4px;\n}\n.home .about-me-section .info-card .info-field .field-subtitle {\n  font-weight: 400;\n  color: #000000;\n  font-size: 13px;\n  font-family: \"Andvari\", serif;\n  line-height: 24px;\n}\n.home .about-me-section .info-card .info-separator {\n  width: 548px;\n  height: 0px;\n  border: 1px solid #000000;\n  margin: 25px 0 20px 0;\n}\n.home .about-me-section .info-card .info-content {\n  margin-top: 20px;\n}\n.home .about-me-section .info-card .info-content p {\n  color: #000000;\n  line-height: 29px;\n  margin-bottom: 0;\n  font-size: 16px;\n  font-family: \"Andvari\", serif;\n  font-weight: 400;\n}\n\n@media (max-width: 768px) {\n  .home .about-me-section {\n    height: auto;\n    min-height: 70vh;\n    padding: 30px 0;\n  }\n  .home .about-me-section .about-container {\n    grid-template-columns: 1fr;\n    gap: 40px;\n    padding: 0 20px;\n  }\n  .home .about-me-section .character-illustration .character-image {\n    max-width: 300px;\n  }\n  .home .about-me-section .info-card {\n    padding: 30px;\n    margin-left: 0;\n  }\n  .home .about-me-section .info-fields-grid {\n    grid-template-columns: 1fr;\n    gap: 20px;\n  }\n  .home .about-me-section .info-fields-grid .info-fields-left,\n  .home .about-me-section .info-fields-grid .info-fields-right {\n    gap: 20px;\n  }\n}\n.btn {\n  display: inline-block;\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 4px;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.btn--primary {\n  background-color: #3a6ea5;\n  color: white;\n}\n.btn--primary:hover {\n  background-color: rgb(44.735426009, 84.8430493274, 127.264573991);\n}\n.btn--secondary {\n  background-color: #c0c0c0;\n  color: white;\n}\n.btn--secondary:hover {\n  background-color: rgb(166.5, 166.5, 166.5);\n}\n.btn--success {\n  background-color: #28a745;\n  color: white;\n}\n.btn--success:hover {\n  background-color: rgb(30.1449275362, 125.8550724638, 52);\n}\n\n.card {\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  padding: 1.5rem;\n  margin-bottom: 1rem;\n}\n.card__title {\n  font-size: 1.25rem;\n  color: #011627;\n  margin-bottom: 0.5rem;\n}\n.card__content {\n  color: #c0c0c0;\n  line-height: 1.6;\n}\n\n.grid {\n  display: grid;\n  gap: 1rem;\n}\n@media (min-width: 576px) {\n  .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n@media (min-width: 992px) {\n  .grid {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n\n.text-primary {\n  color: #3a6ea5;\n}\n\n.text-secondary {\n  color: #c0c0c0;\n}\n\n.text-success {\n  color: #28a745;\n}\n\n.text-danger {\n  color: #ed0300;\n}\n\n.text-warning {\n  color: #ff9f1c;\n}\n\n.text-info {\n  color: #5697d8;\n}\n\n.bg-primary {\n  background-color: #3a6ea5;\n}\n\n.bg-secondary {\n  background-color: #c0c0c0;\n}\n\n.bg-success {\n  background-color: #28a745;\n}\n\n.bg-danger {\n  background-color: #ed0300;\n}\n\n.bg-warning {\n  background-color: #ff9f1c;\n}\n\n.bg-info {\n  background-color: #5697d8;\n}\n\n.slideshow-controls {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin: 0 20px;\n}\n.slideshow-controls .slideshow-control-btn {\n  background: rgba(255, 255, 255, 0.9);\n  border: none;\n  color: #333;\n  cursor: pointer;\n  padding: 0;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 45px;\n  height: 45px;\n  border-radius: 50%;\n}\n.slideshow-controls .slideshow-control-btn:hover {\n  transform: scale(1.1);\n  background: rgb(255, 255, 255);\n}\n.slideshow-controls .slideshow-control-btn.circular-notch {\n  position: relative;\n  background: rgba(255, 255, 255, 0.9);\n}\n.slideshow-controls .slideshow-control-btn.circular-notch svg {\n  color: #333;\n}\n.slideshow-controls .slideshow-control-btn.play-pause-btn {\n  width: 50px;\n  height: 50px;\n  color: rgba(255, 255, 255, 0.9);\n}\n.slideshow-controls .slideshow-control-btn.play-pause-btn svg {\n  color: #333;\n}\n.slideshow-controls .slideshow-control-btn.play-pause-btn:hover {\n  background: rgb(255, 255, 255);\n}\n.slideshow-controls .play-pause-container {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 60px;\n  height: 60px;\n}\n.slideshow-controls .play-pause-container .progress-ring {\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n}\n.slideshow-controls .play-pause-container .play-pause-btn {\n  position: relative;\n  z-index: 1;\n}\n\n.metadata-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 15;\n  pointer-events: none;\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n  color: white;\n}\n.metadata-overlay .top-bottom-gradient-shadow {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 300px;\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 40.38%, rgba(255, 255, 255, 0) 100%);\n  mix-blend-mode: multiply;\n  opacity: 0.7;\n  pointer-events: none;\n  z-index: -1;\n}\n.metadata-overlay .metadata-blocks {\n  position: absolute;\n  top: 120px;\n  left: 50%;\n  transform: translateX(-50%);\n  max-width: 1200px;\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 0 40px;\n}\n.metadata-overlay .metadata-blocks .metadata-blocks-left {\n  display: flex;\n  gap: 108px;\n  align-items: flex-start;\n  flex-direction: row;\n}\n.metadata-overlay .metadata-blocks .metadata-block {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n.metadata-overlay .metadata-blocks .metadata-block .metadata-label {\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n  font-size: 14px;\n  font-weight: normal;\n  color: #ffffff;\n  margin-bottom: 2px;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n}\n.metadata-overlay .metadata-blocks .metadata-block .metadata-value {\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n  font-size: 14px;\n  color: #ffffff;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title {\n  display: flex;\n  gap: 2px;\n  align-items: flex-start;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .barcode-wrapper {\n  height: 16px;\n  overflow: hidden;\n  margin-bottom: 2px;\n  display: flex;\n  align-items: flex-start;\n  padding-top: 6px;\n  width: fit-content;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .barcode-text {\n  font-family: \"LibreBarcode128\", monospace;\n  font-size: 48px;\n  line-height: 1;\n  color: white;\n  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));\n  white-space: nowrap;\n  transform-origin: right;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-1 .artwork-title {\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n  font-size: 14px;\n  color: #ffffff;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n  text-align: right;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding-top: 6px;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 45px;\n  height: 45px;\n}\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg img,\n.metadata-overlay .metadata-blocks .art-title-block .art-title .art-title-column-2 .squares-svg svg {\n  width: 45px;\n  height: 45px;\n  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));\n}\n\n.artist-branding {\n  position: absolute;\n  bottom: 60px;\n  left: 40px;\n  right: 40px;\n  z-index: 15;\n  color: white;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n}\n.artist-branding .artist-info .artist-name {\n  font-size: 48px;\n  font-weight: 900;\n  margin: 0;\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\n  font-family: \"Arial\", sans-serif;\n}\n.artist-branding .artist-info .artist-subtitle {\n  font-size: 16px;\n  margin: 5px 0 10px 0;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n}\n.artist-branding .artist-info .artist-tagline {\n  font-size: 14px;\n  margin: 0;\n  font-style: italic;\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);\n  font-family: \"Erbos Draco 1st Open NBP\", monospace;\n}\n.artist-branding .slideshow-controls-container {\n  display: flex;\n  align-items: center;\n}\n\n@media (max-width: 768px) {\n  .metadata-overlay .metadata-top-left,\n  .metadata-overlay .metadata-top-right {\n    top: 20px;\n    font-size: 10px;\n  }\n  .metadata-overlay .metadata-top-left {\n    left: 20px;\n  }\n  .metadata-overlay .metadata-top-right {\n    right: 20px;\n  }\n  .metadata-overlay .metadata-top-center {\n    top: 20px;\n  }\n  .metadata-overlay .metadata-top-center .barcode-component {\n    padding: 8px 15px;\n  }\n  .metadata-overlay .metadata-top-center .barcode-component .artwork-title {\n    font-size: 12px;\n  }\n  .metadata-overlay .metadata-top-center .barcode-component .barcode-cross {\n    width: 16px;\n    height: 16px;\n  }\n  .artist-branding {\n    bottom: 40px;\n    left: 20px;\n    right: 20px;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 20px;\n  }\n  .artist-branding .slideshow-controls-container {\n    align-self: center;\n  }\n  .artist-branding .artist-info .artist-name {\n    font-size: 32px;\n  }\n  .artist-branding .artist-info .artist-subtitle {\n    font-size: 14px;\n  }\n  .artist-branding .artist-info .artist-tagline {\n    font-size: 12px;\n  }\n}\n.main-footer {\n  background: linear-gradient(135deg, #cc3333, #aa2222);\n  color: white;\n  height: 30vh;\n  padding: 40px 0;\n  display: flex;\n  align-items: center;\n  position: relative;\n}\n.main-footer .waved-background {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);\n  background-size: 100px 100px, 150px 150px, 200px 200px;\n  opacity: 0.3;\n  animation: wave 20s ease-in-out infinite;\n}\n@keyframes wave {\n  0%, 100% {\n    transform: translateY(0px);\n  }\n  50% {\n    transform: translateY(-10px);\n  }\n}\n.main-footer .footer-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 40px;\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 80px;\n  align-items: start;\n}\n.main-footer .footer-left {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 60px;\n}\n.main-footer .social-section h3,\n.main-footer .nav-section h3 {\n  font-size: 16px;\n  font-weight: 900;\n  margin-bottom: 25px;\n  font-family: \"Courier New\", monospace;\n  letter-spacing: 2px;\n  color: white;\n}\n.main-footer .social-links {\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n}\n.main-footer .social-links .social-link {\n  color: white;\n  text-decoration: none;\n  font-size: 14px;\n  font-family: \"Courier New\", monospace;\n  font-weight: 600;\n  letter-spacing: 1px;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n}\n.main-footer .social-links .social-link .social-icon {\n  margin-right: 10px;\n  width: 16px;\n  height: 16px;\n  fill: currentColor;\n}\n.main-footer .social-links .social-link:hover {\n  color: #ffeeee;\n  transform: translateX(5px);\n}\n.main-footer .nav-buttons {\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n}\n.main-footer .nav-buttons .nav-button {\n  background: rgba(255, 255, 255, 0.1);\n  color: white;\n  text-decoration: none;\n  padding: 12px 20px;\n  border-radius: 4px;\n  font-family: \"Courier New\", monospace;\n  font-weight: 600;\n  font-size: 14px;\n  letter-spacing: 1px;\n  transition: all 0.3s ease;\n  text-align: center;\n  border: 2px solid transparent;\n}\n.main-footer .nav-buttons .nav-button:hover {\n  background: rgba(255, 255, 255, 0.2);\n  transform: translateY(-2px);\n}\n.main-footer .nav-buttons .nav-button.active {\n  background: rgba(255, 255, 255, 0.3);\n  border-color: rgba(255, 255, 255, 0.5);\n}\n.main-footer .footer-right {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: flex-end;\n  gap: 20px;\n}\n.main-footer .footer-right .scanning-svg .scanning-image {\n  width: 120px;\n  height: auto;\n  filter: invert(1) brightness(0.9);\n  opacity: 0.8;\n}\n.main-footer .footer-right .footer-logo {\n  text-align: right;\n}\n.main-footer .footer-right .footer-logo .logo-text {\n  font-size: 32px;\n  font-weight: 900;\n  font-family: \"Arial\", sans-serif;\n  letter-spacing: 3px;\n  margin-bottom: 5px;\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);\n}\n.main-footer .footer-right .footer-logo .logo-tagline {\n  font-size: 14px;\n  font-weight: 600;\n  font-family: \"Courier New\", monospace;\n  letter-spacing: 2px;\n  opacity: 0.9;\n}\n\n@media (max-width: 768px) {\n  .main-footer {\n    height: auto;\n    min-height: 30vh;\n    padding: 30px 0;\n  }\n  .main-footer .footer-container {\n    grid-template-columns: 1fr;\n    gap: 40px;\n    padding: 0 20px;\n  }\n  .main-footer .footer-left {\n    grid-template-columns: 1fr;\n    gap: 40px;\n  }\n  .main-footer .footer-right {\n    justify-content: center;\n  }\n  .main-footer .footer-right .footer-logo {\n    text-align: center;\n  }\n  .main-footer .footer-right .footer-logo .logo-text {\n    font-size: 24px;\n    letter-spacing: 2px;\n  }\n  .main-footer .footer-right .footer-logo .logo-tagline {\n    font-size: 12px;\n  }\n}\n@media (max-width: 480px) {\n  .main-footer .social-links .social-link {\n    font-size: 12px;\n  }\n  .main-footer .social-links .social-link .social-icon {\n    font-size: 14px;\n  }\n  .main-footer .nav-buttons .nav-button {\n    padding: 10px 15px;\n    font-size: 12px;\n  }\n}\n.artist-branding {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 15;\n  align-items: flex-start;\n}\n.artist-branding .artist-branding-block {\n  position: absolute;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  max-width: 1200px;\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 0 40px;\n}\n.artist-branding .bottom-top-gradient-shadow {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 200px;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.7) 100%);\n  mix-blend-mode: multiply;\n  opacity: 0.7;\n  pointer-events: none;\n  z-index: -1;\n}\n.artist-branding__logo {\n  align-self: center;\n}\n.artist-branding__logo-icon {\n  height: 110px;\n  filter: invert(1);\n}\n.artist-branding__content {\n  color: white;\n}\n.artist-branding__name {\n  font-size: 3rem;\n  font-weight: 300;\n  font-family: \"Andvari\";\n  letter-spacing: 0.1em;\n  margin: 0;\n  color: white;\n  text-transform: uppercase;\n}\n.artist-branding__subtitle {\n  font-size: 1.2rem;\n  font-weight: 300;\n  margin: 0;\n  color: rgba(255, 255, 255, 0.8);\n  letter-spacing: 0.05em;\n}\n.artist-branding__separator {\n  width: 100%;\n  height: 1px;\n  background: rgba(255, 255, 255, 0.3);\n}\n.artist-branding__tagline-wrapper {\n  align-items: center;\n  width: 212px;\n  justify-content: center;\n}\n.artist-branding__tagline {\n  font-size: 1.1rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0.5rem 0 0 0;\n  letter-spacing: 0.05em;\n}\n@media (max-width: 1024px) {\n  .artist-branding {\n    padding: 1.5rem 2rem;\n    bottom: 2rem;\n    gap: 2rem;\n  }\n  .artist-branding__name {\n    font-size: 2.5rem;\n  }\n  .artist-branding__logo-icon {\n    width: 60px;\n    height: 60px;\n  }\n}\n@media (max-width: 768px) {\n  .artist-branding {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n    padding: 1rem;\n    bottom: 1rem;\n  }\n  .artist-branding__logo {\n    justify-self: center;\n  }\n  .artist-branding__content {\n    text-align: center;\n  }\n  .artist-branding__row {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .artist-branding__name {\n    font-size: 2rem;\n  }\n  .artist-branding__logo-icon {\n    width: 50px;\n    height: 50px;\n  }\n}","html,\nbody,\nheader,\nnav,\nh1,\na,\nul,\nli,\nstrong,\nmain,\nbutton,\ni,\nsection,\nimg,\ndiv,\nh2,\nh4,\np,\nform,\nfieldset,\nlabel,\ninput,\ntextarea,\nspan,\narticle,\nfooter,\ntime,\nsmall {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font: inherit;\n  font-family: 'Helvetica Neue', Helvetica, sans-serif;\n  color: inherit;\n  text-align: inherit;\n  text-decoration: inherit;\n  vertical-align: inherit;\n  box-sizing: inherit;\n  background: transparent;\n}\n\nul {\n  list-style: none;\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\ninput[type='password'],\ninput[type='email'],\ninput[type='text'],\ninput[type='submit'],\ntextarea,\nbutton {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nbutton,\ninput[type='submit'] {\n  cursor: pointer;\n  text-align: center;\n}\n\n/* Clearfix */\n\n.group:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n","// Navigation Styles\n@use 'sass:color';\n\n// Variables\n$primary-color: #ffffff;\n$secondary-color: #2a2a2a;\n$accent-color: #888;\n$text-color: #ffffff;\n$light-text: #cccccc;\n$white: #ffffff;\n$black: #000000;\n$border-color: #444;\n$shadow: 0 2px 20px rgba(0, 0, 0, 0.3);\n$transition: all 0.3s ease;\n\n// Typography\n$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n  sans-serif;\n$font-secondary: 'Andvari', serif;\n\n// Layout\n$container-max-width: 1200px;\n\n// Mixins\n@mixin container {\n  max-width: $container-max-width;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n// Navigation\n.navigation {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.6);\n  backdrop-filter: blur(10px);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  z-index: 1000;\n  padding: 20px 0;\n\n  .nav-container {\n    @include container;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n  }\n\n  .nav-brand {\n    text-decoration: none;\n    color: $primary-color;\n    display: flex;\n    align-items: stretch;\n    gap: 15px;\n    line-height: 1.2;\n\n    .nav-logo {\n      width: 45px;\n      height: 50px;\n      object-fit: contain;\n      flex-shrink: 0;\n      display: block;\n      filter: brightness(0) invert(1); // Make logo white for dark theme\n    }\n\n    .nav-brand-text {\n      display: flex;\n      flex-direction: column;\n      justify-content: space-between;\n      align-items: flex-start;\n      height: 45px; // Same height as logo\n    }\n\n    .artist-name {\n      font-size: 20px;\n      font-weight: 900;\n      color: $primary-color;\n      line-height: 1.1;\n      margin: 0;\n      font-family: 'Arial', sans-serif;\n      letter-spacing: 2px;\n      text-transform: uppercase;\n    }\n\n    .project-name {\n      font-size: 14px;\n      color: $primary-color;\n      font-weight: 400;\n      line-height: 1.2;\n      margin: 0;\n      font-family: 'Andvari', serif;\n    }\n  }\n\n  .nav-menu {\n    display: flex;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    gap: 40px;\n  }\n\n  .nav-item {\n    .nav-link {\n      text-decoration: none;\n      color: $primary-color;\n      font-weight: 500;\n      font-size: 16px;\n      transition: $transition;\n      position: relative;\n      font-family: 'Andvari', serif;\n      letter-spacing: 1px;\n      text-transform: uppercase;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n\n      .nav-separator {\n        display: inline-flex;\n        align-items: center;\n        transition: all 0.3s ease;\n\n        .separator-icon {\n          width: 12px;\n          height: 12px;\n          color: inherit;\n          transition: all 0.2s ease;\n        }\n\n        &.animating .separator-icon {\n          animation: pathTransform 0.4s ease-in-out;\n        }\n      }\n\n      &:hover {\n        color: #00ff00;\n      }\n\n      &.active {\n        color: #00ff00;\n      }\n    }\n\n    &.active .nav-link {\n      color: #00ff00;\n\n      .nav-separator .separator-icon {\n        color: #00ff00;\n      }\n    }\n\n    &:hover .nav-link:not(.active) {\n      color: #00ff00;\n\n      .nav-separator .separator-icon {\n        color: #00ff00;\n      }\n    }\n  }\n\n  @keyframes pathTransform {\n    0% {\n      transform: rotate(0deg) scale(1);\n    }\n    50% {\n      transform: rotate(45deg) scale(1.2);\n    }\n    100% {\n      transform: rotate(90deg) scale(1);\n    }\n  }\n\n  // Responsive design for mobile devices\n  @media (max-width: 768px) {\n    .nav-brand {\n      gap: 10px;\n\n      .nav-logo {\n        width: 35px;\n        height: 35px;\n        filter: brightness(0) invert(1); // Make logo white for dark theme\n      }\n\n      .nav-brand-text {\n        .artist-name {\n          font-size: 16px;\n          font-family: 'Andvari', serif;\n        }\n\n        .project-name {\n          font-size: 12px;\n        }\n      }\n    }\n\n    .nav-menu {\n      gap: 20px;\n    }\n\n    .nav-item .nav-link {\n      font-size: 14px;\n    }\n  }\n\n  @media (max-width: 480px) {\n    .nav-container {\n      flex-direction: column;\n      gap: 20px;\n    }\n\n    .nav-menu {\n      gap: 15px;\n    }\n  }\n}\n","// Home - Modern Art Book Styles\n@use './variables.scss' as *;\n\n// Home specific variables\n$home-container-max-width: 1400px;\n$home-dark-bg: #0d0d0d;\n\n// Mixins\n@mixin home-container {\n  max-width: $home-container-max-width;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n// Base app styles\n.home-app {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    sans-serif;\n  line-height: 1.6;\n  color: #ffffff;\n  background-color: #000000;\n}\n\n.main-content {\n  margin-top: 0;\n  min-height: 100vh;\n}\n\n// Hero Slideshow\n.home {\n  .hero-slideshow {\n    position: relative;\n    height: 100vh;\n    width: 100%;\n    overflow: hidden;\n\n    .slideshow-container {\n      position: relative;\n      width: 100%;\n      height: 100%;\n\n      .slide {\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background-size: 150%;\n        background-position: center;\n        background-repeat: no-repeat;\n        opacity: 0;\n        transition: opacity 1s ease-in-out;\n\n        &.active {\n          opacity: 1;\n        }\n\n        &.slide-next {\n          z-index: 2;\n        }\n\n        &::after {\n          content: '';\n          position: absolute;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background: linear-gradient(\n            to bottom,\n            rgba(0, 0, 0, 0.3),\n            rgba(0, 0, 0, 0.1),\n            rgba(0, 0, 0, 0.4)\n          );\n          z-index: 1;\n        }\n      }\n    }\n  }\n\n  // About Me Section\n  .about-me-section {\n    background: $home-dark-bg;\n    height: 70vh;\n    padding: 60px 0;\n    display: flex;\n    align-items: center;\n\n    .about-container {\n      @include home-container;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 80px;\n      align-items: center;\n    }\n\n    .character-illustration {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n\n      .character-image {\n        width: 100%;\n        max-width: 400px;\n        height: auto;\n        border-radius: 12px;\n        filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.7));\n      }\n    }\n\n    .info-card {\n      background: rgba(255, 255, 255, 0.97);\n      border-radius: 12px;\n      padding: 45px;\n      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);\n      margin-left: 20px;\n\n      .info-card-header {\n        border-bottom: 2px solid #000;\n        margin-bottom: 30px;\n        padding-bottom: 15px;\n\n        h2 {\n          font-size: 36px;\n          font-weight: 400;\n          color: #000000;\n          margin: 0 0 20px 0;\n          font-family: 'ISL_Andvari', serif;\n          line-height: 47px;\n        }\n      }\n\n      .info-fields-grid {\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 44px;\n        margin-bottom: 25px;\n\n        .info-fields-left,\n        .info-fields-right {\n          display: flex;\n          flex-direction: column;\n          gap: 25px;\n        }\n      }\n\n      .info-field {\n        margin-bottom: 0;\n\n        .field-label {\n          background: #1f1f1f;\n          color: #ffffff;\n          padding: 5px 10px;\n          font-weight: 400;\n          font-size: 16px;\n          font-family: 'Andvari', serif;\n          display: flex;\n          align-items: center;\n          margin-bottom: 10px;\n          border-radius: 0px 0px 17px 0px;\n          line-height: 29px;\n          width: 252px;\n          height: 27px;\n          box-sizing: border-box;\n          padding-left: 5px;\n        }\n\n        .field-value {\n          font-weight: 400;\n          color: #000000;\n          font-size: 20.3px;\n          font-family: 'ISL_Andvari', serif;\n          line-height: 26px;\n          margin-bottom: 4px;\n        }\n\n        .field-subtitle {\n          font-weight: 400;\n          color: #000000;\n          font-size: 13px;\n          font-family: 'Andvari', serif;\n          line-height: 24px;\n        }\n      }\n\n      .info-separator {\n        width: 548px;\n        height: 0px;\n        border: 1px solid #000000;\n        margin: 25px 0 20px 0;\n      }\n\n      .info-content {\n        margin-top: 20px;\n\n        p {\n          color: #000000;\n          line-height: 29px;\n          margin-bottom: 0;\n          font-size: 16px;\n          font-family: 'Andvari', serif;\n          font-weight: 400;\n        }\n      }\n    }\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .home {\n    .about-me-section {\n      height: auto;\n      min-height: 70vh;\n      padding: 30px 0;\n\n      .about-container {\n        grid-template-columns: 1fr;\n        gap: 40px;\n        padding: 0 20px;\n      }\n\n      .character-illustration {\n        .character-image {\n          max-width: 300px;\n        }\n      }\n\n      .info-card {\n        padding: 30px;\n        margin-left: 0;\n      }\n\n      .info-fields-grid {\n        grid-template-columns: 1fr;\n        gap: 20px;\n\n        .info-fields-left,\n        .info-fields-right {\n          gap: 20px;\n        }\n      }\n    }\n  }\n}\n","@use 'sass:color';\n@use './variables.scss' as *;\n\n// Стили для кнопок\n.btn {\n  display: inline-block;\n  padding: $spacing-sm $spacing-md;\n  border: none;\n  border-radius: 4px;\n  font-size: $font-size-base;\n  cursor: pointer;\n  transition: all 0.3s ease;\n\n  &--primary {\n    background-color: $primary-color;\n    color: white;\n\n    &:hover {\n      background-color: color.adjust($primary-color, $lightness: -10%);\n    }\n  }\n\n  &--secondary {\n    background-color: $secondary-color;\n    color: white;\n\n    &:hover {\n      background-color: color.adjust($secondary-color, $lightness: -10%);\n    }\n  }\n\n  &--success {\n    background-color: $success-color;\n    color: white;\n\n    &:hover {\n      background-color: color.adjust($success-color, $lightness: -10%);\n    }\n  }\n}\n\n// Стили для карточек\n.card {\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  padding: $spacing-lg;\n  margin-bottom: $spacing-md;\n\n  &__title {\n    font-size: $font-size-large;\n    color: $dark-color;\n    margin-bottom: $spacing-sm;\n  }\n\n  &__content {\n    color: $secondary-color;\n    line-height: 1.6;\n  }\n}\n\n// Адаптивная сетка\n.grid {\n  display: grid;\n  gap: $spacing-md;\n\n  @include responsive(sm) {\n    grid-template-columns: repeat(2, 1fr);\n  }\n\n  @include responsive(md) {\n    grid-template-columns: repeat(3, 1fr);\n  }\n\n  @include responsive(lg) {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n\n// Утилитарные классы\n.text-primary {\n  color: $primary-color;\n}\n.text-secondary {\n  color: $secondary-color;\n}\n.text-success {\n  color: $success-color;\n}\n.text-danger {\n  color: $danger-color;\n}\n.text-warning {\n  color: $warning-color;\n}\n.text-info {\n  color: $info-color;\n}\n\n.bg-primary {\n  background-color: $primary-color;\n}\n.bg-secondary {\n  background-color: $secondary-color;\n}\n.bg-success {\n  background-color: $success-color;\n}\n.bg-danger {\n  background-color: $danger-color;\n}\n.bg-warning {\n  background-color: $warning-color;\n}\n.bg-info {\n  background-color: $info-color;\n}\n","// Цветовая палитра проекта\n$whiteish: #fdfffc;\n$light-gray: #ebebeb;\n$gray: #c0c0c0;\n\n$light-orange: #ff9f1c;\n$orange: #ff6700;\n$light-blue: #5697d8;\n$blue: #3a6ea5;\n$dark-blue: #004e98;\n$dark: #011627;\n\n$deep-red: #ed0300;\n$deep-blue: #2b2d42;\n$gray-blue: #8d99ae;\n$light-white: #fbfbff;\n$dark-white: #edf2f4;\n\n$light-black: #353535;\n$background: #f9f9f9;\n\n// Дополнительные цвета для компонентов\n$primary-color: $blue;\n$secondary-color: $gray;\n$success-color: #28a745;\n$danger-color: $deep-red;\n$warning-color: $light-orange;\n$info-color: $light-blue;\n$light-color: $light-white;\n$dark-color: $dark;\n\n// Размеры шрифтов\n$font-size-small: 0.875rem;\n$font-size-base: 1rem;\n$font-size-large: 1.25rem;\n$font-size-xlarge: 1.5rem;\n\n// Отступы\n$spacing-xs: 0.25rem;\n$spacing-sm: 0.5rem;\n$spacing-md: 1rem;\n$spacing-lg: 1.5rem;\n$spacing-xl: 3rem;\n\n// Breakpoints\n$breakpoint-sm: 576px;\n$breakpoint-md: 768px;\n$breakpoint-lg: 992px;\n$breakpoint-xl: 1200px;\n\n// Миксины\n@mixin flex-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n@mixin responsive($breakpoint) {\n  @if $breakpoint == sm {\n    @media (min-width: $breakpoint-sm) {\n      @content;\n    }\n  } @else if $breakpoint == md {\n    @media (min-width: $breakpoint-md) {\n      @content;\n    }\n  } @else if $breakpoint == lg {\n    @media (min-width: $breakpoint-lg) {\n      @content;\n    }\n  } @else if $breakpoint == xl {\n    @media (min-width: $breakpoint-xl) {\n      @content;\n    }\n  }\n}\n","@use './variables.scss' as *;\n@use './colors.scss' as *;\n\n.slideshow-controls {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  margin: 0 20px;\n\n  .slideshow-control-btn {\n    background: rgba(255, 255, 255, 0.9);\n    border: none;\n    color: #333;\n    cursor: pointer;\n    padding: 0;\n    transition: all 0.3s ease;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 45px;\n    height: 45px;\n    border-radius: 50%;\n\n    &:hover {\n      transform: scale(1.1);\n      background: rgba(255, 255, 255, 1);\n    }\n\n    &.circular-notch {\n      position: relative;\n      background: rgba(255, 255, 255, 0.9);\n\n      svg {\n        color: #333;\n      }\n    }\n\n    &.play-pause-btn {\n      width: 50px;\n      height: 50px;\n      color: rgba(255, 255, 255, 0.9);\n\n      svg {\n        color: #333;\n      }\n\n      &:hover {\n        background: rgba(255, 255, 255, 1);\n      }\n    }\n  }\n\n  .play-pause-container {\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 60px;\n    height: 60px;\n\n    .progress-ring {\n      position: absolute;\n      top: 0;\n      left: 0;\n      pointer-events: none;\n    }\n\n    .play-pause-btn {\n      position: relative;\n      z-index: 1;\n    }\n  }\n}\n","// Metadata Overlay Styles\n.metadata-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 15;\n  pointer-events: none;\n  font-family: 'Erbos Draco 1st Open NBP', monospace;\n  color: white;\n\n  .top-bottom-gradient-shadow {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 300px;\n    background: linear-gradient(\n      180deg,\n      rgba(0, 0, 0, 0.7) 40.38%,\n      rgba(255, 255, 255, 0) 100%\n    );\n    mix-blend-mode: multiply;\n    opacity: 0.7;\n    pointer-events: none;\n    z-index: -1;\n  }\n\n  .metadata-blocks {\n    position: absolute;\n    top: 120px;\n    left: 50%;\n    transform: translateX(-50%);\n    max-width: 1200px;\n    width: 100%;\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    padding: 0 40px;\n\n    .metadata-blocks-left {\n      display: flex;\n      gap: 108px;\n      align-items: flex-start;\n      flex-direction: row;\n    }\n\n    .metadata-block {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-start;\n\n      .metadata-label {\n        font-family: 'Erbos Draco 1st Open NBP', monospace;\n        font-size: 14px;\n        font-weight: normal;\n        color: #ffffff;\n        margin-bottom: 2px;\n        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n      }\n\n      .metadata-value {\n        font-family: 'Erbos Draco 1st Open NBP', monospace;\n        font-size: 14px;\n        color: #ffffff;\n        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n      }\n    }\n\n    .art-title-block {\n      .art-title {\n        display: flex;\n        gap: 2px;\n        align-items: flex-start;\n\n        .art-title-column-1 {\n          display: flex;\n          flex-direction: column;\n          align-items: flex-end;\n\n          .barcode-wrapper {\n            height: 16px;\n            overflow: hidden;\n            margin-bottom: 2px;\n            display: flex;\n            align-items: flex-start;\n            padding-top: 6px;\n            width: fit-content;\n          }\n\n          .barcode-text {\n            font-family: 'LibreBarcode128', monospace;\n            font-size: 48px;\n            line-height: 1;\n            color: white;\n            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));\n            white-space: nowrap;\n            transform-origin: right;\n          }\n\n          .artwork-title {\n            font-family: 'Erbos Draco 1st Open NBP', monospace;\n            font-size: 14px;\n            color: #ffffff;\n            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);\n            text-align: right;\n          }\n        }\n\n        .art-title-column-2 {\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          padding-top: 6px;\n\n          .squares-svg {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            width: 45px;\n            height: 45px;\n\n            img,\n            svg {\n              width: 45px;\n              height: 45px;\n              filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// Artist branding styles\n.artist-branding {\n  position: absolute;\n  bottom: 60px;\n  left: 40px;\n  right: 40px;\n  z-index: 15;\n  color: white;\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n\n  .artist-info {\n    .artist-name {\n      font-size: 48px;\n      font-weight: 900;\n      margin: 0;\n      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\n      font-family: 'Arial', sans-serif;\n    }\n\n    .artist-subtitle {\n      font-size: 16px;\n      margin: 5px 0 10px 0;\n      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);\n      font-family: 'Erbos Draco 1st Open NBP', monospace;\n    }\n\n    .artist-tagline {\n      font-size: 14px;\n      margin: 0;\n      font-style: italic;\n      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);\n      font-family: 'Erbos Draco 1st Open NBP', monospace;\n    }\n  }\n\n  .slideshow-controls-container {\n    display: flex;\n    align-items: center;\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .metadata-overlay {\n    .metadata-top-left,\n    .metadata-top-right {\n      top: 20px;\n      font-size: 10px;\n    }\n\n    .metadata-top-left {\n      left: 20px;\n    }\n\n    .metadata-top-right {\n      right: 20px;\n    }\n\n    .metadata-top-center {\n      top: 20px;\n\n      .barcode-component {\n        padding: 8px 15px;\n\n        .artwork-title {\n          font-size: 12px;\n        }\n\n        .barcode-cross {\n          width: 16px;\n          height: 16px;\n        }\n      }\n    }\n  }\n\n  .artist-branding {\n    bottom: 40px;\n    left: 20px;\n    right: 20px;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 20px;\n\n    .slideshow-controls-container {\n      align-self: center;\n    }\n\n    .artist-info {\n      .artist-name {\n        font-size: 32px;\n      }\n\n      .artist-subtitle {\n        font-size: 14px;\n      }\n\n      .artist-tagline {\n        font-size: 12px;\n      }\n    }\n  }\n}\n","// Footer Styles\n.main-footer {\n  background: linear-gradient(135deg, #cc3333, #aa2222);\n  color: white;\n  height: 30vh;\n  padding: 40px 0;\n  display: flex;\n  align-items: center;\n  position: relative;\n\n  .waved-background {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-image: radial-gradient(\n        circle at 20% 50%,\n        rgba(255, 255, 255, 0.1) 0%,\n        transparent 50%\n      ),\n      radial-gradient(\n        circle at 80% 20%,\n        rgba(255, 255, 255, 0.05) 0%,\n        transparent 50%\n      ),\n      radial-gradient(\n        circle at 40% 80%,\n        rgba(255, 255, 255, 0.08) 0%,\n        transparent 50%\n      );\n    background-size: 100px 100px, 150px 150px, 200px 200px;\n    opacity: 0.3;\n    animation: wave 20s ease-in-out infinite;\n  }\n\n  @keyframes wave {\n    0%,\n    100% {\n      transform: translateY(0px);\n    }\n    50% {\n      transform: translateY(-10px);\n    }\n  }\n\n  .footer-container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 40px;\n    display: grid;\n    grid-template-columns: 2fr 1fr;\n    gap: 80px;\n    align-items: start;\n  }\n\n  .footer-left {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 60px;\n  }\n\n  .social-section,\n  .nav-section {\n    h3 {\n      font-size: 16px;\n      font-weight: 900;\n      margin-bottom: 25px;\n      font-family: 'Courier New', monospace;\n      letter-spacing: 2px;\n      color: white;\n    }\n  }\n\n  .social-links {\n    display: flex;\n    flex-direction: column;\n    gap: 15px;\n\n    .social-link {\n      color: white;\n      text-decoration: none;\n      font-size: 14px;\n      font-family: 'Courier New', monospace;\n      font-weight: 600;\n      letter-spacing: 1px;\n      transition: all 0.3s ease;\n      display: flex;\n      align-items: center;\n\n      .social-icon {\n        margin-right: 10px;\n        width: 16px;\n        height: 16px;\n        fill: currentColor;\n      }\n\n      &:hover {\n        color: #ffeeee;\n        transform: translateX(5px);\n      }\n    }\n  }\n\n  .nav-buttons {\n    display: flex;\n    flex-direction: column;\n    gap: 15px;\n\n    .nav-button {\n      background: rgba(255, 255, 255, 0.1);\n      color: white;\n      text-decoration: none;\n      padding: 12px 20px;\n      border-radius: 4px;\n      font-family: 'Courier New', monospace;\n      font-weight: 600;\n      font-size: 14px;\n      letter-spacing: 1px;\n      transition: all 0.3s ease;\n      text-align: center;\n      border: 2px solid transparent;\n\n      &:hover {\n        background: rgba(255, 255, 255, 0.2);\n        transform: translateY(-2px);\n      }\n\n      &.active {\n        background: rgba(255, 255, 255, 0.3);\n        border-color: rgba(255, 255, 255, 0.5);\n      }\n    }\n  }\n\n  .footer-right {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-end;\n    gap: 20px;\n\n    .scanning-svg {\n      .scanning-image {\n        width: 120px;\n        height: auto;\n        filter: invert(1) brightness(0.9);\n        opacity: 0.8;\n      }\n    }\n\n    .footer-logo {\n      text-align: right;\n\n      .logo-text {\n        font-size: 32px;\n        font-weight: 900;\n        font-family: 'Arial', sans-serif;\n        letter-spacing: 3px;\n        margin-bottom: 5px;\n        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);\n      }\n\n      .logo-tagline {\n        font-size: 14px;\n        font-weight: 600;\n        font-family: 'Courier New', monospace;\n        letter-spacing: 2px;\n        opacity: 0.9;\n      }\n    }\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .main-footer {\n    height: auto;\n    min-height: 30vh;\n    padding: 30px 0;\n\n    .footer-container {\n      grid-template-columns: 1fr;\n      gap: 40px;\n      padding: 0 20px;\n    }\n\n    .footer-left {\n      grid-template-columns: 1fr;\n      gap: 40px;\n    }\n\n    .footer-right {\n      justify-content: center;\n\n      .footer-logo {\n        text-align: center;\n\n        .logo-text {\n          font-size: 24px;\n          letter-spacing: 2px;\n        }\n\n        .logo-tagline {\n          font-size: 12px;\n        }\n      }\n    }\n  }\n}\n\n@media (max-width: 480px) {\n  .main-footer {\n    .social-links {\n      .social-link {\n        font-size: 12px;\n\n        .social-icon {\n          font-size: 14px;\n        }\n      }\n    }\n\n    .nav-buttons {\n      .nav-button {\n        padding: 10px 15px;\n        font-size: 12px;\n      }\n    }\n  }\n}\n",".artist-branding {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 15;\n  align-items: flex-start;\n\n  .artist-branding-block {\n    position: absolute;\n    bottom: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n    max-width: 1200px;\n    width: 100%;\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    padding: 0 40px;\n  }\n\n  .bottom-top-gradient-shadow {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 200px;\n    background: linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0) 0%,\n      rgba(0, 0, 0, 0.7) 100%\n    );\n    mix-blend-mode: multiply;\n    opacity: 0.7;\n    pointer-events: none;\n    z-index: -1;\n  }\n\n  &__logo {\n    align-self: center;\n\n    &-icon {\n      height: 110px;\n      filter: invert(1); // Make logo white\n    }\n  }\n\n  &__content {\n    color: white;\n  }\n\n  &__name {\n    font-size: 3rem;\n    font-weight: 300;\n    font-family: 'Andvari';\n    letter-spacing: 0.1em;\n    margin: 0;\n    color: white;\n    text-transform: uppercase;\n  }\n\n  &__subtitle {\n    font-size: 1.2rem;\n    font-weight: 300;\n    margin: 0;\n    color: rgba(255, 255, 255, 0.8);\n    letter-spacing: 0.05em;\n  }\n\n  &__separator {\n    width: 100%;\n    height: 1px;\n    background: rgba(255, 255, 255, 0.3);\n  }\n\n  &__tagline-wrapper {\n    align-items: center;\n    width: 212px;\n    justify-content: center;\n  }\n\n  &__tagline {\n    font-size: 1.1rem;\n    font-weight: 300;\n    color: rgba(255, 255, 255, 0.8);\n    margin: 0.5rem 0 0 0;\n    letter-spacing: 0.05em;\n  }\n\n  // Responsive adjustments\n  @media (max-width: 1024px) {\n    padding: 1.5rem 2rem;\n    bottom: 2rem;\n    gap: 2rem;\n\n    &__name {\n      font-size: 2.5rem;\n    }\n\n    &__logo-icon {\n      width: 60px;\n      height: 60px;\n    }\n  }\n\n  @media (max-width: 768px) {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n    padding: 1rem;\n    bottom: 1rem;\n\n    &__logo {\n      justify-self: center;\n    }\n\n    &__content {\n      text-align: center;\n    }\n\n    &__row {\n      flex-direction: column;\n      gap: 1rem;\n    }\n\n    &__name {\n      font-size: 2rem;\n    }\n\n    &__logo-icon {\n      width: 50px;\n      height: 50px;\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".chunk.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "art-book-app:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkart_book_app"] = self["webpackChunkart_book_app"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./frontend/index.jsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=/assets/main.bundle.js-da3eadbfcfe8f88f11f04ae013b6fc5c3beabf27843b139adaeba477bfe533e1.map
//!
;
