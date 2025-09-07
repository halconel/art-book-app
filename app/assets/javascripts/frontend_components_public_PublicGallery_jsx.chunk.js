"use strict";
(self["webpackChunkart_book_app"] = self["webpackChunkart_book_app"] || []).push([["frontend_components_public_PublicGallery_jsx"],{

/***/ "./frontend/components/public/PublicGallery.jsx":
/*!******************************************************!*\
  !*** ./frontend/components/public/PublicGallery.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/esm/index.js");
/* harmony import */ var _mui_icons_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/icons-material */ "./node_modules/@mui/icons-material/esm/index.js");
/* harmony import */ var _services_authService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/authService */ "./frontend/services/authService.js");
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




var PublicGallery = function PublicGallery() {
  var _selectedImage$tags;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    images = _useState2[0],
    setImages = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedImage = _useState8[0],
    setSelectedImage = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState0 = _slicedToArray(_useState9, 2),
    currentImageIndex = _useState0[0],
    setCurrentImageIndex = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    openLightbox = _useState10[0],
    setOpenLightbox = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState12 = _slicedToArray(_useState11, 2),
    searchTerm = _useState12[0],
    setSearchTerm = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    filterAnchorEl = _useState14[0],
    setFilterAnchorEl = _useState14[1];
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all'),
    _useState16 = _slicedToArray(_useState15, 2),
    tagFilter = _useState16[0],
    setTagFilter = _useState16[1];
  var _useState17 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState18 = _slicedToArray(_useState17, 2),
    allTags = _useState18[0],
    setAllTags = _useState18[1];
  var _useState19 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Set()),
    _useState20 = _slicedToArray(_useState19, 2),
    favorites = _useState20[0],
    setFavorites = _useState20[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    fetchGallery();
  }, []);
  var fetchGallery = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, galleryImages, tags, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            setLoading(true);
            // Use public API endpoint that doesn't require authentication
            _context.n = 1;
            return _services_authService__WEBPACK_IMPORTED_MODULE_3__["default"].get('/gallery/images');
          case 1:
            response = _context.v;
            galleryImages = response.data.images || [];
            setImages(galleryImages);

            // Extract all unique tags
            tags = new Set();
            galleryImages.forEach(function (image) {
              if (image.tags) {
                image.tags.forEach(function (tag) {
                  return tags.add(tag);
                });
              }
            });
            setAllTags(Array.from(tags).sort());
            setError('');
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            setError('Failed to load gallery');
            console.error('Failed to fetch gallery:', _t);
          case 3:
            _context.p = 3;
            setLoading(false);
            return _context.f(3);
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2, 3, 4]]);
    }));
    return function fetchGallery() {
      return _ref.apply(this, arguments);
    };
  }();
  var handleImageClick = function handleImageClick(image, index) {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setOpenLightbox(true);
  };
  var handleNextImage = function handleNextImage() {
    var filteredImages = getFilteredImages();
    var nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };
  var handlePrevImage = function handlePrevImage() {
    var filteredImages = getFilteredImages();
    var prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };
  var handleToggleFavorite = function handleToggleFavorite(imageId) {
    var newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites["delete"](imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);

    // Store in localStorage for persistence
    localStorage.setItem('gallery_favorites', JSON.stringify(Array.from(newFavorites)));
  };
  var handleShareImage = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(image) {
      var shareData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            shareData = {
              title: image.title || 'Artwork',
              text: image.description || 'Check out this amazing artwork!',
              url: window.location.origin + '/gallery/' + image.id
            };
            _context2.p = 1;
            if (!navigator.share) {
              _context2.n = 3;
              break;
            }
            _context2.n = 2;
            return navigator.share(shareData);
          case 2:
            _context2.n = 4;
            break;
          case 3:
            _context2.n = 4;
            return navigator.clipboard.writeText(shareData.url);
          case 4:
            _context2.n = 6;
            break;
          case 5:
            _context2.p = 5;
            _t2 = _context2.v;
            console.error('Error sharing:', _t2);
          case 6:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 5]]);
    }));
    return function handleShareImage(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var getFilteredImages = function getFilteredImages() {
    var filtered = images.filter(function (image) {
      return image.is_visible !== false;
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(function (image) {
        var _image$title, _image$description, _image$tags;
        return ((_image$title = image.title) === null || _image$title === void 0 ? void 0 : _image$title.toLowerCase().includes(searchTerm.toLowerCase())) || ((_image$description = image.description) === null || _image$description === void 0 ? void 0 : _image$description.toLowerCase().includes(searchTerm.toLowerCase())) || ((_image$tags = image.tags) === null || _image$tags === void 0 ? void 0 : _image$tags.some(function (tag) {
          return tag.toLowerCase().includes(searchTerm.toLowerCase());
        }));
      });
    }

    // Apply tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(function (image) {
        var _image$tags2;
        return (_image$tags2 = image.tags) === null || _image$tags2 === void 0 ? void 0 : _image$tags2.includes(tagFilter);
      });
    }
    return filtered;
  };
  var filteredImages = getFilteredImages();

  // Load favorites from localStorage on component mount
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var savedFavorites = localStorage.getItem('gallery_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);
  if (loading) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, {
      size: 60
    }));
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    sx: {
      textAlign: 'center',
      mb: 4
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h2",
    component: "h1",
    gutterBottom: true
  }, "Art Gallery"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    color: "text.secondary",
    sx: {
      maxWidth: 600,
      mx: 'auto'
    }
  }, "Explore my collection of digital artwork, from character designs to environmental concepts.")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mb: 4,
    flexWrap: "wrap"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.TextField, {
    size: "small",
    placeholder: "Search artwork...",
    value: searchTerm,
    onChange: function onChange(e) {
      return setSearchTerm(e.target.value);
    },
    InputProps: {
      startAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Search, {
        sx: {
          mr: 1
        }
      })
    },
    sx: {
      minWidth: 250
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Button, {
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.FilterList, null),
    onClick: function onClick(e) {
      return setFilterAnchorEl(e.currentTarget);
    },
    variant: "outlined"
  }, "Tags: ", tagFilter === 'all' ? 'All' : tagFilter)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    justifyContent: "center",
    gap: 4,
    mb: 4
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    textAlign: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h4",
    color: "primary"
  }, filteredImages.length), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, "Artworks")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    textAlign: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h4",
    color: "secondary"
  }, allTags.length), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, "Categories")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    textAlign: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h4",
    color: "success.main"
  }, favorites.size), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, "Favorites"))), filteredImages.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.ImageList, {
    variant: "masonry",
    cols: 3,
    gap: 16
  }, filteredImages.map(function (image, index) {
    var _image$tags3, _image$tags4;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Fade, {
      "in": true,
      timeout: 300 + index * 50,
      key: image.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.ImageListItem, {
      sx: {
        cursor: 'pointer',
        '&:hover': {
          '& img': {
            transform: 'scale(1.05)'
          },
          '& .overlay': {
            opacity: 1
          }
        }
      },
      onClick: function onClick() {
        return handleImageClick(image, index);
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: image.thumbnail_url || image.url,
      alt: image.alt_text || image.title,
      loading: "lazy",
      style: {
        transition: 'transform 0.3s ease',
        borderRadius: 8
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
      className: "overlay",
      sx: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Fullscreen, {
      sx: {
        color: 'white',
        fontSize: 40
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.ImageListItemBar, {
      title: image.title,
      subtitle: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, null, image.description && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
        variant: "caption",
        display: "block",
        sx: {
          mb: 0.5
        }
      }, image.description.substring(0, 100), "..."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
        display: "flex",
        gap: 0.5,
        flexWrap: "wrap"
      }, (_image$tags3 = image.tags) === null || _image$tags3 === void 0 ? void 0 : _image$tags3.slice(0, 3).map(function (tag) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Chip, {
          key: tag,
          label: tag,
          size: "small",
          variant: "outlined",
          sx: {
            fontSize: '0.7rem'
          }
        });
      }), ((_image$tags4 = image.tags) === null || _image$tags4 === void 0 ? void 0 : _image$tags4.length) > 3 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Chip, {
        label: "+".concat(image.tags.length - 3),
        size: "small",
        variant: "outlined",
        sx: {
          fontSize: '0.7rem'
        }
      }))),
      actionIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
        sx: {
          color: 'rgba(255, 255, 255, 0.54)'
        },
        onClick: function onClick(e) {
          e.stopPropagation();
          handleToggleFavorite(image.id);
        }
      }, favorites.has(image.id) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Favorite, {
        color: "error"
      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.FavoriteBorder, null))
    })));
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    textAlign: "center",
    py: 8
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    color: "text.secondary",
    gutterBottom: true
  }, "No artworks found"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, searchTerm || tagFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'The gallery is currently empty')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Menu, {
    anchorEl: filterAnchorEl,
    open: Boolean(filterAnchorEl),
    onClose: function onClose() {
      return setFilterAnchorEl(null);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.MenuItem, {
    onClick: function onClick() {
      setTagFilter('all');
      setFilterAnchorEl(null);
    }
  }, "All Tags"), allTags.map(function (tag) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.MenuItem, {
      key: tag,
      onClick: function onClick() {
        setTagFilter(tag);
        setFilterAnchorEl(null);
      }
    }, tag);
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: openLightbox,
    onClose: function onClose() {
      return setOpenLightbox(false);
    },
    maxWidth: "lg",
    fullWidth: true,
    sx: {
      '& .MuiDialog-paper': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'hidden'
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.DialogContent, {
    sx: {
      p: 0,
      position: 'relative'
    }
  }, selectedImage && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    sx: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      zIndex: 1,
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.7)'
      }
    },
    onClick: handlePrevImage
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.ChevronLeft, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    sx: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      zIndex: 1,
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.7)'
      }
    },
    onClick: handleNextImage
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.ChevronRight, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    sx: {
      position: 'absolute',
      right: 16,
      top: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      zIndex: 1,
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.7)'
      }
    },
    onClick: function onClick() {
      return setOpenLightbox(false);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Close, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: selectedImage.url,
    alt: selectedImage.alt_text || selectedImage.title,
    style: {
      width: '100%',
      height: 'auto',
      maxHeight: '80vh',
      objectFit: 'contain',
      display: 'block'
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Card, {
    sx: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.CardContent, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h6",
    gutterBottom: true
  }, selectedImage.title), selectedImage.description && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    sx: {
      mb: 1,
      opacity: 0.9
    }
  }, selectedImage.description), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    gap: 1,
    flexWrap: "wrap"
  }, (_selectedImage$tags = selectedImage.tags) === null || _selectedImage$tags === void 0 ? void 0 : _selectedImage$tags.map(function (tag) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Chip, {
      key: tag,
      label: tag,
      size: "small",
      variant: "outlined",
      sx: {
        color: 'white',
        borderColor: 'white'
      }
    });
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    display: "flex",
    gap: 1
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    sx: {
      color: 'white'
    },
    onClick: function onClick() {
      return handleToggleFavorite(selectedImage.id);
    }
  }, favorites.has(selectedImage.id) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Favorite, {
    color: "error"
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.FavoriteBorder, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    sx: {
      color: 'white'
    },
    onClick: function onClick() {
      return handleShareImage(selectedImage);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_icons_material__WEBPACK_IMPORTED_MODULE_2__.Share, null)))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Box, {
    sx: {
      position: 'absolute',
      top: 16,
      left: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      px: 2,
      py: 1,
      borderRadius: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mui_material__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, currentImageIndex + 1, " of ", filteredImages.length))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PublicGallery);

/***/ })

}]);
//# sourceMappingURL=frontend_components_public_PublicGallery_jsx.chunk.js.map