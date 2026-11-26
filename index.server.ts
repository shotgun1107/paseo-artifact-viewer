var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target3) => (target3 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target3, "default", { value: mod, enumerable: true }) : target3,
  mod
));

// node_modules/xmlchars/xml/1.0/ed5.js
var require_ed5 = __commonJS({
  "node_modules/xmlchars/xml/1.0/ed5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CHAR = "	\n\r -\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}";
    exports.S = " 	\r\n";
    exports.NAME_START_CHAR = ":A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}";
    exports.NAME_CHAR = "-" + exports.NAME_START_CHAR + ".0-9\xB7\u0300-\u036F\u203F-\u2040";
    exports.CHAR_RE = new RegExp("^[" + exports.CHAR + "]$", "u");
    exports.S_RE = new RegExp("^[" + exports.S + "]+$", "u");
    exports.NAME_START_CHAR_RE = new RegExp("^[" + exports.NAME_START_CHAR + "]$", "u");
    exports.NAME_CHAR_RE = new RegExp("^[" + exports.NAME_CHAR + "]$", "u");
    exports.NAME_RE = new RegExp("^[" + exports.NAME_START_CHAR + "][" + exports.NAME_CHAR + "]*$", "u");
    exports.NMTOKEN_RE = new RegExp("^[" + exports.NAME_CHAR + "]+$", "u");
    var TAB = 9;
    var NL = 10;
    var CR = 13;
    var SPACE = 32;
    exports.S_LIST = [SPACE, NL, CR, TAB];
    function isChar(c) {
      return c >= SPACE && c <= 55295 || c === NL || c === CR || c === TAB || c >= 57344 && c <= 65533 || c >= 65536 && c <= 1114111;
    }
    exports.isChar = isChar;
    function isS(c) {
      return c === SPACE || c === NL || c === CR || c === TAB;
    }
    exports.isS = isS;
    function isNameStartChar(c) {
      return c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 58 || c === 95 || c === 8204 || c === 8205 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 767 || c >= 880 && c <= 893 || c >= 895 && c <= 8191 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
    }
    exports.isNameStartChar = isNameStartChar;
    function isNameChar(c) {
      return isNameStartChar(c) || c >= 48 && c <= 57 || c === 45 || c === 46 || c === 183 || c >= 768 && c <= 879 || c >= 8255 && c <= 8256;
    }
    exports.isNameChar = isNameChar;
  }
});

// node_modules/xmlchars/xml/1.1/ed2.js
var require_ed2 = __commonJS({
  "node_modules/xmlchars/xml/1.1/ed2.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CHAR = "-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}";
    exports.RESTRICTED_CHAR = "-\b\v\f-\x7F-\x84\x86-\x9F";
    exports.S = " 	\r\n";
    exports.NAME_START_CHAR = ":A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}";
    exports.NAME_CHAR = "-" + exports.NAME_START_CHAR + ".0-9\xB7\u0300-\u036F\u203F-\u2040";
    exports.CHAR_RE = new RegExp("^[" + exports.CHAR + "]$", "u");
    exports.RESTRICTED_CHAR_RE = new RegExp("^[" + exports.RESTRICTED_CHAR + "]$", "u");
    exports.S_RE = new RegExp("^[" + exports.S + "]+$", "u");
    exports.NAME_START_CHAR_RE = new RegExp("^[" + exports.NAME_START_CHAR + "]$", "u");
    exports.NAME_CHAR_RE = new RegExp("^[" + exports.NAME_CHAR + "]$", "u");
    exports.NAME_RE = new RegExp("^[" + exports.NAME_START_CHAR + "][" + exports.NAME_CHAR + "]*$", "u");
    exports.NMTOKEN_RE = new RegExp("^[" + exports.NAME_CHAR + "]+$", "u");
    var TAB = 9;
    var NL = 10;
    var CR = 13;
    var SPACE = 32;
    exports.S_LIST = [SPACE, NL, CR, TAB];
    function isChar(c) {
      return c >= 1 && c <= 55295 || c >= 57344 && c <= 65533 || c >= 65536 && c <= 1114111;
    }
    exports.isChar = isChar;
    function isRestrictedChar(c) {
      return c >= 1 && c <= 8 || c === 11 || c === 12 || c >= 14 && c <= 31 || c >= 127 && c <= 132 || c >= 134 && c <= 159;
    }
    exports.isRestrictedChar = isRestrictedChar;
    function isCharAndNotRestricted(c) {
      return c === 9 || c === 10 || c === 13 || c > 31 && c < 127 || c === 133 || c > 159 && c <= 55295 || c >= 57344 && c <= 65533 || c >= 65536 && c <= 1114111;
    }
    exports.isCharAndNotRestricted = isCharAndNotRestricted;
    function isS(c) {
      return c === SPACE || c === NL || c === CR || c === TAB;
    }
    exports.isS = isS;
    function isNameStartChar(c) {
      return c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 58 || c === 95 || c === 8204 || c === 8205 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 767 || c >= 880 && c <= 893 || c >= 895 && c <= 8191 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
    }
    exports.isNameStartChar = isNameStartChar;
    function isNameChar(c) {
      return isNameStartChar(c) || c >= 48 && c <= 57 || c === 45 || c === 46 || c === 183 || c >= 768 && c <= 879 || c >= 8255 && c <= 8256;
    }
    exports.isNameChar = isNameChar;
  }
});

// node_modules/xmlchars/xmlns/1.0/ed3.js
var require_ed3 = __commonJS({
  "node_modules/xmlchars/xmlns/1.0/ed3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NC_NAME_START_CHAR = "A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}";
    exports.NC_NAME_CHAR = "-" + exports.NC_NAME_START_CHAR + ".0-9\xB7\u0300-\u036F\u203F-\u2040";
    exports.NC_NAME_START_CHAR_RE = new RegExp("^[" + exports.NC_NAME_START_CHAR + "]$", "u");
    exports.NC_NAME_CHAR_RE = new RegExp("^[" + exports.NC_NAME_CHAR + "]$", "u");
    exports.NC_NAME_RE = new RegExp("^[" + exports.NC_NAME_START_CHAR + "][" + exports.NC_NAME_CHAR + "]*$", "u");
    function isNCNameStartChar(c) {
      return c >= 65 && c <= 90 || c === 95 || c >= 97 && c <= 122 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 767 || c >= 880 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
    }
    exports.isNCNameStartChar = isNCNameStartChar;
    function isNCNameChar(c) {
      return isNCNameStartChar(c) || (c === 45 || c === 46 || c >= 48 && c <= 57 || c === 183 || c >= 768 && c <= 879 || c >= 8255 && c <= 8256);
    }
    exports.isNCNameChar = isNCNameChar;
  }
});

// node_modules/saxes/saxes.js
var require_saxes = __commonJS({
  "node_modules/saxes/saxes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SaxesParser = exports.EVENTS = void 0;
    var ed5 = require_ed5();
    var ed2 = require_ed2();
    var NSed3 = require_ed3();
    var isS = ed5.isS;
    var isChar10 = ed5.isChar;
    var isNameStartChar = ed5.isNameStartChar;
    var isNameChar = ed5.isNameChar;
    var S_LIST = ed5.S_LIST;
    var NAME_RE = ed5.NAME_RE;
    var isChar11 = ed2.isChar;
    var isNCNameStartChar = NSed3.isNCNameStartChar;
    var isNCNameChar = NSed3.isNCNameChar;
    var NC_NAME_RE = NSed3.NC_NAME_RE;
    var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
    var rootNS = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      __proto__: null,
      xml: XML_NAMESPACE,
      xmlns: XMLNS_NAMESPACE
    };
    var XML_ENTITIES = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      __proto__: null,
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    };
    var EOC = -1;
    var NL_LIKE = -2;
    var S_BEGIN = 0;
    var S_BEGIN_WHITESPACE = 1;
    var S_DOCTYPE = 2;
    var S_DOCTYPE_QUOTE = 3;
    var S_DTD = 4;
    var S_DTD_QUOTED = 5;
    var S_DTD_OPEN_WAKA = 6;
    var S_DTD_OPEN_WAKA_BANG = 7;
    var S_DTD_COMMENT = 8;
    var S_DTD_COMMENT_ENDING = 9;
    var S_DTD_COMMENT_ENDED = 10;
    var S_DTD_PI = 11;
    var S_DTD_PI_ENDING = 12;
    var S_TEXT = 13;
    var S_ENTITY = 14;
    var S_OPEN_WAKA = 15;
    var S_OPEN_WAKA_BANG = 16;
    var S_COMMENT = 17;
    var S_COMMENT_ENDING = 18;
    var S_COMMENT_ENDED = 19;
    var S_CDATA = 20;
    var S_CDATA_ENDING = 21;
    var S_CDATA_ENDING_2 = 22;
    var S_PI_FIRST_CHAR = 23;
    var S_PI_REST = 24;
    var S_PI_BODY = 25;
    var S_PI_ENDING = 26;
    var S_XML_DECL_NAME_START = 27;
    var S_XML_DECL_NAME = 28;
    var S_XML_DECL_EQ = 29;
    var S_XML_DECL_VALUE_START = 30;
    var S_XML_DECL_VALUE = 31;
    var S_XML_DECL_SEPARATOR = 32;
    var S_XML_DECL_ENDING = 33;
    var S_OPEN_TAG = 34;
    var S_OPEN_TAG_SLASH = 35;
    var S_ATTRIB = 36;
    var S_ATTRIB_NAME = 37;
    var S_ATTRIB_NAME_SAW_WHITE = 38;
    var S_ATTRIB_VALUE = 39;
    var S_ATTRIB_VALUE_QUOTED = 40;
    var S_ATTRIB_VALUE_CLOSED = 41;
    var S_ATTRIB_VALUE_UNQUOTED = 42;
    var S_CLOSE_TAG = 43;
    var S_CLOSE_TAG_SAW_WHITE = 44;
    var TAB = 9;
    var NL = 10;
    var CR = 13;
    var SPACE = 32;
    var BANG = 33;
    var DQUOTE = 34;
    var AMP = 38;
    var SQUOTE = 39;
    var MINUS = 45;
    var FORWARD_SLASH = 47;
    var SEMICOLON = 59;
    var LESS = 60;
    var EQUAL = 61;
    var GREATER = 62;
    var QUESTION = 63;
    var OPEN_BRACKET = 91;
    var CLOSE_BRACKET = 93;
    var NEL = 133;
    var LS = 8232;
    var isQuote = (c) => c === DQUOTE || c === SQUOTE;
    var QUOTES = [DQUOTE, SQUOTE];
    var DOCTYPE_TERMINATOR = [...QUOTES, OPEN_BRACKET, GREATER];
    var DTD_TERMINATOR = [...QUOTES, LESS, CLOSE_BRACKET];
    var XML_DECL_NAME_TERMINATOR = [EQUAL, QUESTION, ...S_LIST];
    var ATTRIB_VALUE_UNQUOTED_TERMINATOR = [...S_LIST, GREATER, AMP, LESS];
    function nsPairCheck(parser, prefix, uri) {
      switch (prefix) {
        case "xml":
          if (uri !== XML_NAMESPACE) {
            parser.fail(`xml prefix must be bound to ${XML_NAMESPACE}.`);
          }
          break;
        case "xmlns":
          if (uri !== XMLNS_NAMESPACE) {
            parser.fail(`xmlns prefix must be bound to ${XMLNS_NAMESPACE}.`);
          }
          break;
        default:
      }
      switch (uri) {
        case XMLNS_NAMESPACE:
          parser.fail(prefix === "" ? `the default namespace may not be set to ${uri}.` : `may not assign a prefix (even "xmlns") to the URI ${XMLNS_NAMESPACE}.`);
          break;
        case XML_NAMESPACE:
          switch (prefix) {
            case "xml":
              break;
            case "":
              parser.fail(`the default namespace may not be set to ${uri}.`);
              break;
            default:
              parser.fail("may not assign the xml namespace to another prefix.");
          }
          break;
        default:
      }
    }
    function nsMappingCheck(parser, mapping) {
      for (const local of Object.keys(mapping)) {
        nsPairCheck(parser, local, mapping[local]);
      }
    }
    var isNCName = (name) => NC_NAME_RE.test(name);
    var isName = (name) => NAME_RE.test(name);
    var FORBIDDEN_START = 0;
    var FORBIDDEN_BRACKET = 1;
    var FORBIDDEN_BRACKET_BRACKET = 2;
    exports.EVENTS = [
      "xmldecl",
      "text",
      "processinginstruction",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "cdata",
      "error",
      "end",
      "ready"
    ];
    var EVENT_NAME_TO_HANDLER_NAME = {
      xmldecl: "xmldeclHandler",
      text: "textHandler",
      processinginstruction: "piHandler",
      doctype: "doctypeHandler",
      comment: "commentHandler",
      opentagstart: "openTagStartHandler",
      attribute: "attributeHandler",
      opentag: "openTagHandler",
      closetag: "closeTagHandler",
      cdata: "cdataHandler",
      error: "errorHandler",
      end: "endHandler",
      ready: "readyHandler"
    };
    var SaxesParser2 = class {
      /**
       * @param opt The parser options.
       */
      constructor(opt2) {
        this.opt = opt2 !== null && opt2 !== void 0 ? opt2 : {};
        this.fragmentOpt = !!this.opt.fragment;
        const xmlnsOpt = this.xmlnsOpt = !!this.opt.xmlns;
        this.trackPosition = this.opt.position !== false;
        this.fileName = this.opt.fileName;
        if (xmlnsOpt) {
          this.nameStartCheck = isNCNameStartChar;
          this.nameCheck = isNCNameChar;
          this.isName = isNCName;
          this.processAttribs = this.processAttribsNS;
          this.pushAttrib = this.pushAttribNS;
          this.ns = Object.assign({ __proto__: null }, rootNS);
          const additional = this.opt.additionalNamespaces;
          if (additional != null) {
            nsMappingCheck(this, additional);
            Object.assign(this.ns, additional);
          }
        } else {
          this.nameStartCheck = isNameStartChar;
          this.nameCheck = isNameChar;
          this.isName = isName;
          this.processAttribs = this.processAttribsPlain;
          this.pushAttrib = this.pushAttribPlain;
        }
        this.stateTable = [
          /* eslint-disable @typescript-eslint/unbound-method */
          this.sBegin,
          this.sBeginWhitespace,
          this.sDoctype,
          this.sDoctypeQuote,
          this.sDTD,
          this.sDTDQuoted,
          this.sDTDOpenWaka,
          this.sDTDOpenWakaBang,
          this.sDTDComment,
          this.sDTDCommentEnding,
          this.sDTDCommentEnded,
          this.sDTDPI,
          this.sDTDPIEnding,
          this.sText,
          this.sEntity,
          this.sOpenWaka,
          this.sOpenWakaBang,
          this.sComment,
          this.sCommentEnding,
          this.sCommentEnded,
          this.sCData,
          this.sCDataEnding,
          this.sCDataEnding2,
          this.sPIFirstChar,
          this.sPIRest,
          this.sPIBody,
          this.sPIEnding,
          this.sXMLDeclNameStart,
          this.sXMLDeclName,
          this.sXMLDeclEq,
          this.sXMLDeclValueStart,
          this.sXMLDeclValue,
          this.sXMLDeclSeparator,
          this.sXMLDeclEnding,
          this.sOpenTag,
          this.sOpenTagSlash,
          this.sAttrib,
          this.sAttribName,
          this.sAttribNameSawWhite,
          this.sAttribValue,
          this.sAttribValueQuoted,
          this.sAttribValueClosed,
          this.sAttribValueUnquoted,
          this.sCloseTag,
          this.sCloseTagSawWhite
          /* eslint-enable @typescript-eslint/unbound-method */
        ];
        this._init();
      }
      /**
       * Indicates whether or not the parser is closed. If ``true``, wait for
       * the ``ready`` event to write again.
       */
      get closed() {
        return this._closed;
      }
      _init() {
        var _a;
        this.openWakaBang = "";
        this.text = "";
        this.name = "";
        this.piTarget = "";
        this.entity = "";
        this.q = null;
        this.tags = [];
        this.tag = null;
        this.topNS = null;
        this.chunk = "";
        this.chunkPosition = 0;
        this.i = 0;
        this.prevI = 0;
        this.carriedFromPrevious = void 0;
        this.forbiddenState = FORBIDDEN_START;
        this.attribList = [];
        const { fragmentOpt } = this;
        this.state = fragmentOpt ? S_TEXT : S_BEGIN;
        this.reportedTextBeforeRoot = this.reportedTextAfterRoot = this.closedRoot = this.sawRoot = fragmentOpt;
        this.xmlDeclPossible = !fragmentOpt;
        this.xmlDeclExpects = ["version"];
        this.entityReturnState = void 0;
        let { defaultXMLVersion } = this.opt;
        if (defaultXMLVersion === void 0) {
          if (this.opt.forceXMLVersion === true) {
            throw new Error("forceXMLVersion set but defaultXMLVersion is not set");
          }
          defaultXMLVersion = "1.0";
        }
        this.setXMLVersion(defaultXMLVersion);
        this.positionAtNewLine = 0;
        this.doctype = false;
        this._closed = false;
        this.xmlDecl = {
          version: void 0,
          encoding: void 0,
          standalone: void 0
        };
        this.line = 1;
        this.column = 0;
        this.ENTITIES = Object.create(XML_ENTITIES);
        (_a = this.readyHandler) === null || _a === void 0 ? void 0 : _a.call(this);
      }
      /**
       * The stream position the parser is currently looking at. This field is
       * zero-based.
       *
       * This field is not based on counting Unicode characters but is to be
       * interpreted as a plain index into a JavaScript string.
       */
      get position() {
        return this.chunkPosition + this.i;
      }
      /**
       * The column number of the next character to be read by the parser.  *
       * This field is zero-based. (The first column in a line is 0.)
       *
       * This field reports the index at which the next character would be in the
       * line if the line were represented as a JavaScript string.  Note that this
       * *can* be different to a count based on the number of *Unicode characters*
       * due to how JavaScript handles astral plane characters.
       *
       * See [[column]] for a number that corresponds to a count of Unicode
       * characters.
       */
      get columnIndex() {
        return this.position - this.positionAtNewLine;
      }
      /**
       * Set an event listener on an event. The parser supports one handler per
       * event type. If you try to set an event handler over an existing handler,
       * the old handler is silently overwritten.
       *
       * @param name The event to listen to.
       *
       * @param handler The handler to set.
       */
      on(name, handler) {
        this[EVENT_NAME_TO_HANDLER_NAME[name]] = handler;
      }
      /**
       * Unset an event handler.
       *
       * @parma name The event to stop listening to.
       */
      off(name) {
        this[EVENT_NAME_TO_HANDLER_NAME[name]] = void 0;
      }
      /**
       * Make an error object. The error object will have a message that contains
       * the ``fileName`` option passed at the creation of the parser. If position
       * tracking was turned on, it will also have line and column number
       * information.
       *
       * @param message The message describing the error to report.
       *
       * @returns An error object with a properly formatted message.
       */
      makeError(message) {
        var _a;
        let msg = (_a = this.fileName) !== null && _a !== void 0 ? _a : "";
        if (this.trackPosition) {
          if (msg.length > 0) {
            msg += ":";
          }
          msg += `${this.line}:${this.column}`;
        }
        if (msg.length > 0) {
          msg += ": ";
        }
        return new Error(msg + message);
      }
      /**
       * Report a parsing error. This method is made public so that client code may
       * check for issues that are outside the scope of this project and can report
       * errors.
       *
       * @param message The error to report.
       *
       * @returns this
       */
      fail(message) {
        const err = this.makeError(message);
        const handler = this.errorHandler;
        if (handler === void 0) {
          throw err;
        } else {
          handler(err);
        }
        return this;
      }
      /**
       * Write a XML data to the parser.
       *
       * @param chunk The XML data to write.
       *
       * @returns this
       */
      // We do need object for the type here. Yes, it often causes problems
      // but not in this case.
      write(chunk) {
        if (this.closed) {
          return this.fail("cannot write after close; assign an onready handler.");
        }
        let end = false;
        if (chunk === null) {
          end = true;
          chunk = "";
        } else if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        if (this.carriedFromPrevious !== void 0) {
          chunk = `${this.carriedFromPrevious}${chunk}`;
          this.carriedFromPrevious = void 0;
        }
        let limit = chunk.length;
        const lastCode = chunk.charCodeAt(limit - 1);
        if (!end && // A trailing CR or surrogate must be carried over to the next
        // chunk.
        (lastCode === CR || lastCode >= 55296 && lastCode <= 56319)) {
          this.carriedFromPrevious = chunk[limit - 1];
          limit--;
          chunk = chunk.slice(0, limit);
        }
        const { stateTable } = this;
        this.chunk = chunk;
        this.i = 0;
        while (this.i < limit) {
          stateTable[this.state].call(this);
        }
        this.chunkPosition += limit;
        return end ? this.end() : this;
      }
      /**
       * Close the current stream. Perform final well-formedness checks and reset
       * the parser tstate.
       *
       * @returns this
       */
      close() {
        return this.write(null);
      }
      /**
       * Get a single code point out of the current chunk. This updates the current
       * position if we do position tracking.
       *
       * This is the algorithm to use for XML 1.0.
       *
       * @returns The character read.
       */
      getCode10() {
        const { chunk, i } = this;
        this.prevI = i;
        this.i = i + 1;
        if (i >= chunk.length) {
          return EOC;
        }
        const code = chunk.charCodeAt(i);
        this.column++;
        if (code < 55296) {
          if (code >= SPACE || code === TAB) {
            return code;
          }
          switch (code) {
            case NL:
              this.line++;
              this.column = 0;
              this.positionAtNewLine = this.position;
              return NL;
            case CR:
              if (chunk.charCodeAt(i + 1) === NL) {
                this.i = i + 2;
              }
              this.line++;
              this.column = 0;
              this.positionAtNewLine = this.position;
              return NL_LIKE;
            default:
              this.fail("disallowed character.");
              return code;
          }
        }
        if (code > 56319) {
          if (!(code >= 57344 && code <= 65533)) {
            this.fail("disallowed character.");
          }
          return code;
        }
        const final = 65536 + (code - 55296) * 1024 + (chunk.charCodeAt(i + 1) - 56320);
        this.i = i + 2;
        if (final > 1114111) {
          this.fail("disallowed character.");
        }
        return final;
      }
      /**
       * Get a single code point out of the current chunk. This updates the current
       * position if we do position tracking.
       *
       * This is the algorithm to use for XML 1.1.
       *
       * @returns {number} The character read.
       */
      getCode11() {
        const { chunk, i } = this;
        this.prevI = i;
        this.i = i + 1;
        if (i >= chunk.length) {
          return EOC;
        }
        const code = chunk.charCodeAt(i);
        this.column++;
        if (code < 55296) {
          if (code > 31 && code < 127 || code > 159 && code !== LS || code === TAB) {
            return code;
          }
          switch (code) {
            case NL:
              this.line++;
              this.column = 0;
              this.positionAtNewLine = this.position;
              return NL;
            case CR: {
              const next2 = chunk.charCodeAt(i + 1);
              if (next2 === NL || next2 === NEL) {
                this.i = i + 2;
              }
            }
            /* yes, fall through */
            case NEL:
            // 0x85
            case LS:
              this.line++;
              this.column = 0;
              this.positionAtNewLine = this.position;
              return NL_LIKE;
            default:
              this.fail("disallowed character.");
              return code;
          }
        }
        if (code > 56319) {
          if (!(code >= 57344 && code <= 65533)) {
            this.fail("disallowed character.");
          }
          return code;
        }
        const final = 65536 + (code - 55296) * 1024 + (chunk.charCodeAt(i + 1) - 56320);
        this.i = i + 2;
        if (final > 1114111) {
          this.fail("disallowed character.");
        }
        return final;
      }
      /**
       * Like ``getCode`` but with the return value normalized so that ``NL`` is
       * returned for ``NL_LIKE``.
       */
      getCodeNorm() {
        const c = this.getCode();
        return c === NL_LIKE ? NL : c;
      }
      unget() {
        this.i = this.prevI;
        this.column--;
      }
      /**
       * Capture characters into a buffer until encountering one of a set of
       * characters.
       *
       * @param chars An array of codepoints. Encountering a character in the array
       * ends the capture. (``chars`` may safely contain ``NL``.)
       *
       * @return The character code that made the capture end, or ``EOC`` if we hit
       * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
       * instead.
       */
      captureTo(chars2) {
        let { i: start } = this;
        const { chunk } = this;
        while (true) {
          const c = this.getCode();
          const isNLLike = c === NL_LIKE;
          const final = isNLLike ? NL : c;
          if (final === EOC || chars2.includes(final)) {
            this.text += chunk.slice(start, this.prevI);
            return final;
          }
          if (isNLLike) {
            this.text += `${chunk.slice(start, this.prevI)}
`;
            start = this.i;
          }
        }
      }
      /**
       * Capture characters into a buffer until encountering a character.
       *
       * @param char The codepoint that ends the capture. **NOTE ``char`` MAY NOT
       * CONTAIN ``NL``.** Passing ``NL`` will result in buggy behavior.
       *
       * @return ``true`` if we ran into the character. Otherwise, we ran into the
       * end of the current chunk.
       */
      captureToChar(char) {
        let { i: start } = this;
        const { chunk } = this;
        while (true) {
          let c = this.getCode();
          switch (c) {
            case NL_LIKE:
              this.text += `${chunk.slice(start, this.prevI)}
`;
              start = this.i;
              c = NL;
              break;
            case EOC:
              this.text += chunk.slice(start);
              return false;
            default:
          }
          if (c === char) {
            this.text += chunk.slice(start, this.prevI);
            return true;
          }
        }
      }
      /**
       * Capture characters that satisfy ``isNameChar`` into the ``name`` field of
       * this parser.
       *
       * @return The character code that made the test fail, or ``EOC`` if we hit
       * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
       * instead.
       */
      captureNameChars() {
        const { chunk, i: start } = this;
        while (true) {
          const c = this.getCode();
          if (c === EOC) {
            this.name += chunk.slice(start);
            return EOC;
          }
          if (!isNameChar(c)) {
            this.name += chunk.slice(start, this.prevI);
            return c === NL_LIKE ? NL : c;
          }
        }
      }
      /**
       * Skip white spaces.
       *
       * @return The character that ended the skip, or ``EOC`` if we hit
       * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
       * instead.
       */
      skipSpaces() {
        while (true) {
          const c = this.getCodeNorm();
          if (c === EOC || !isS(c)) {
            return c;
          }
        }
      }
      setXMLVersion(version2) {
        this.currentXMLVersion = version2;
        if (version2 === "1.0") {
          this.isChar = isChar10;
          this.getCode = this.getCode10;
        } else {
          this.isChar = isChar11;
          this.getCode = this.getCode11;
        }
      }
      // STATE ENGINE METHODS
      // This needs to be a state separate from S_BEGIN_WHITESPACE because we want
      // to be sure never to come back to this state later.
      sBegin() {
        if (this.chunk.charCodeAt(0) === 65279) {
          this.i++;
          this.column++;
        }
        this.state = S_BEGIN_WHITESPACE;
      }
      sBeginWhitespace() {
        const iBefore = this.i;
        const c = this.skipSpaces();
        if (this.prevI !== iBefore) {
          this.xmlDeclPossible = false;
        }
        switch (c) {
          case LESS:
            this.state = S_OPEN_WAKA;
            if (this.text.length !== 0) {
              throw new Error("no-empty text at start");
            }
            break;
          case EOC:
            break;
          default:
            this.unget();
            this.state = S_TEXT;
            this.xmlDeclPossible = false;
        }
      }
      sDoctype() {
        var _a;
        const c = this.captureTo(DOCTYPE_TERMINATOR);
        switch (c) {
          case GREATER: {
            (_a = this.doctypeHandler) === null || _a === void 0 ? void 0 : _a.call(this, this.text);
            this.text = "";
            this.state = S_TEXT;
            this.doctype = true;
            break;
          }
          case EOC:
            break;
          default:
            this.text += String.fromCodePoint(c);
            if (c === OPEN_BRACKET) {
              this.state = S_DTD;
            } else if (isQuote(c)) {
              this.state = S_DOCTYPE_QUOTE;
              this.q = c;
            }
        }
      }
      sDoctypeQuote() {
        const q = this.q;
        if (this.captureToChar(q)) {
          this.text += String.fromCodePoint(q);
          this.q = null;
          this.state = S_DOCTYPE;
        }
      }
      sDTD() {
        const c = this.captureTo(DTD_TERMINATOR);
        if (c === EOC) {
          return;
        }
        this.text += String.fromCodePoint(c);
        if (c === CLOSE_BRACKET) {
          this.state = S_DOCTYPE;
        } else if (c === LESS) {
          this.state = S_DTD_OPEN_WAKA;
        } else if (isQuote(c)) {
          this.state = S_DTD_QUOTED;
          this.q = c;
        }
      }
      sDTDQuoted() {
        const q = this.q;
        if (this.captureToChar(q)) {
          this.text += String.fromCodePoint(q);
          this.state = S_DTD;
          this.q = null;
        }
      }
      sDTDOpenWaka() {
        const c = this.getCodeNorm();
        this.text += String.fromCodePoint(c);
        switch (c) {
          case BANG:
            this.state = S_DTD_OPEN_WAKA_BANG;
            this.openWakaBang = "";
            break;
          case QUESTION:
            this.state = S_DTD_PI;
            break;
          default:
            this.state = S_DTD;
        }
      }
      sDTDOpenWakaBang() {
        const char = String.fromCodePoint(this.getCodeNorm());
        const owb = this.openWakaBang += char;
        this.text += char;
        if (owb !== "-") {
          this.state = owb === "--" ? S_DTD_COMMENT : S_DTD;
          this.openWakaBang = "";
        }
      }
      sDTDComment() {
        if (this.captureToChar(MINUS)) {
          this.text += "-";
          this.state = S_DTD_COMMENT_ENDING;
        }
      }
      sDTDCommentEnding() {
        const c = this.getCodeNorm();
        this.text += String.fromCodePoint(c);
        this.state = c === MINUS ? S_DTD_COMMENT_ENDED : S_DTD_COMMENT;
      }
      sDTDCommentEnded() {
        const c = this.getCodeNorm();
        this.text += String.fromCodePoint(c);
        if (c === GREATER) {
          this.state = S_DTD;
        } else {
          this.fail("malformed comment.");
          this.state = S_DTD_COMMENT;
        }
      }
      sDTDPI() {
        if (this.captureToChar(QUESTION)) {
          this.text += "?";
          this.state = S_DTD_PI_ENDING;
        }
      }
      sDTDPIEnding() {
        const c = this.getCodeNorm();
        this.text += String.fromCodePoint(c);
        if (c === GREATER) {
          this.state = S_DTD;
        }
      }
      sText() {
        if (this.tags.length !== 0) {
          this.handleTextInRoot();
        } else {
          this.handleTextOutsideRoot();
        }
      }
      sEntity() {
        let { i: start } = this;
        const { chunk } = this;
        loop:
          while (true) {
            switch (this.getCode()) {
              case NL_LIKE:
                this.entity += `${chunk.slice(start, this.prevI)}
`;
                start = this.i;
                break;
              case SEMICOLON: {
                const { entityReturnState } = this;
                const entity = this.entity + chunk.slice(start, this.prevI);
                this.state = entityReturnState;
                let parsed;
                if (entity === "") {
                  this.fail("empty entity name.");
                  parsed = "&;";
                } else {
                  parsed = this.parseEntity(entity);
                  this.entity = "";
                }
                if (entityReturnState !== S_TEXT || this.textHandler !== void 0) {
                  this.text += parsed;
                }
                break loop;
              }
              case EOC:
                this.entity += chunk.slice(start);
                break loop;
              default:
            }
          }
      }
      sOpenWaka() {
        const c = this.getCode();
        if (isNameStartChar(c)) {
          this.state = S_OPEN_TAG;
          this.unget();
          this.xmlDeclPossible = false;
        } else {
          switch (c) {
            case FORWARD_SLASH:
              this.state = S_CLOSE_TAG;
              this.xmlDeclPossible = false;
              break;
            case BANG:
              this.state = S_OPEN_WAKA_BANG;
              this.openWakaBang = "";
              this.xmlDeclPossible = false;
              break;
            case QUESTION:
              this.state = S_PI_FIRST_CHAR;
              break;
            default:
              this.fail("disallowed character in tag name");
              this.state = S_TEXT;
              this.xmlDeclPossible = false;
          }
        }
      }
      sOpenWakaBang() {
        this.openWakaBang += String.fromCodePoint(this.getCodeNorm());
        switch (this.openWakaBang) {
          case "[CDATA[":
            if (!this.sawRoot && !this.reportedTextBeforeRoot) {
              this.fail("text data outside of root node.");
              this.reportedTextBeforeRoot = true;
            }
            if (this.closedRoot && !this.reportedTextAfterRoot) {
              this.fail("text data outside of root node.");
              this.reportedTextAfterRoot = true;
            }
            this.state = S_CDATA;
            this.openWakaBang = "";
            break;
          case "--":
            this.state = S_COMMENT;
            this.openWakaBang = "";
            break;
          case "DOCTYPE":
            this.state = S_DOCTYPE;
            if (this.doctype || this.sawRoot) {
              this.fail("inappropriately located doctype declaration.");
            }
            this.openWakaBang = "";
            break;
          default:
            if (this.openWakaBang.length >= 7) {
              this.fail("incorrect syntax.");
            }
        }
      }
      sComment() {
        if (this.captureToChar(MINUS)) {
          this.state = S_COMMENT_ENDING;
        }
      }
      sCommentEnding() {
        var _a;
        const c = this.getCodeNorm();
        if (c === MINUS) {
          this.state = S_COMMENT_ENDED;
          (_a = this.commentHandler) === null || _a === void 0 ? void 0 : _a.call(this, this.text);
          this.text = "";
        } else {
          this.text += `-${String.fromCodePoint(c)}`;
          this.state = S_COMMENT;
        }
      }
      sCommentEnded() {
        const c = this.getCodeNorm();
        if (c !== GREATER) {
          this.fail("malformed comment.");
          this.text += `--${String.fromCodePoint(c)}`;
          this.state = S_COMMENT;
        } else {
          this.state = S_TEXT;
        }
      }
      sCData() {
        if (this.captureToChar(CLOSE_BRACKET)) {
          this.state = S_CDATA_ENDING;
        }
      }
      sCDataEnding() {
        const c = this.getCodeNorm();
        if (c === CLOSE_BRACKET) {
          this.state = S_CDATA_ENDING_2;
        } else {
          this.text += `]${String.fromCodePoint(c)}`;
          this.state = S_CDATA;
        }
      }
      sCDataEnding2() {
        var _a;
        const c = this.getCodeNorm();
        switch (c) {
          case GREATER: {
            (_a = this.cdataHandler) === null || _a === void 0 ? void 0 : _a.call(this, this.text);
            this.text = "";
            this.state = S_TEXT;
            break;
          }
          case CLOSE_BRACKET:
            this.text += "]";
            break;
          default:
            this.text += `]]${String.fromCodePoint(c)}`;
            this.state = S_CDATA;
        }
      }
      // We need this separate state to check the first character fo the pi target
      // with this.nameStartCheck which allows less characters than this.nameCheck.
      sPIFirstChar() {
        const c = this.getCodeNorm();
        if (this.nameStartCheck(c)) {
          this.piTarget += String.fromCodePoint(c);
          this.state = S_PI_REST;
        } else if (c === QUESTION || isS(c)) {
          this.fail("processing instruction without a target.");
          this.state = c === QUESTION ? S_PI_ENDING : S_PI_BODY;
        } else {
          this.fail("disallowed character in processing instruction name.");
          this.piTarget += String.fromCodePoint(c);
          this.state = S_PI_REST;
        }
      }
      sPIRest() {
        const { chunk, i: start } = this;
        while (true) {
          const c = this.getCodeNorm();
          if (c === EOC) {
            this.piTarget += chunk.slice(start);
            return;
          }
          if (!this.nameCheck(c)) {
            this.piTarget += chunk.slice(start, this.prevI);
            const isQuestion = c === QUESTION;
            if (isQuestion || isS(c)) {
              if (this.piTarget === "xml") {
                if (!this.xmlDeclPossible) {
                  this.fail("an XML declaration must be at the start of the document.");
                }
                this.state = isQuestion ? S_XML_DECL_ENDING : S_XML_DECL_NAME_START;
              } else {
                this.state = isQuestion ? S_PI_ENDING : S_PI_BODY;
              }
            } else {
              this.fail("disallowed character in processing instruction name.");
              this.piTarget += String.fromCodePoint(c);
            }
            break;
          }
        }
      }
      sPIBody() {
        if (this.text.length === 0) {
          const c = this.getCodeNorm();
          if (c === QUESTION) {
            this.state = S_PI_ENDING;
          } else if (!isS(c)) {
            this.text = String.fromCodePoint(c);
          }
        } else if (this.captureToChar(QUESTION)) {
          this.state = S_PI_ENDING;
        }
      }
      sPIEnding() {
        var _a;
        const c = this.getCodeNorm();
        if (c === GREATER) {
          const { piTarget } = this;
          if (piTarget.toLowerCase() === "xml") {
            this.fail("the XML declaration must appear at the start of the document.");
          }
          (_a = this.piHandler) === null || _a === void 0 ? void 0 : _a.call(this, {
            target: piTarget,
            body: this.text
          });
          this.piTarget = this.text = "";
          this.state = S_TEXT;
        } else if (c === QUESTION) {
          this.text += "?";
        } else {
          this.text += `?${String.fromCodePoint(c)}`;
          this.state = S_PI_BODY;
        }
        this.xmlDeclPossible = false;
      }
      sXMLDeclNameStart() {
        const c = this.skipSpaces();
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          return;
        }
        if (c !== EOC) {
          this.state = S_XML_DECL_NAME;
          this.name = String.fromCodePoint(c);
        }
      }
      sXMLDeclName() {
        const c = this.captureTo(XML_DECL_NAME_TERMINATOR);
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          this.name += this.text;
          this.text = "";
          this.fail("XML declaration is incomplete.");
          return;
        }
        if (!(isS(c) || c === EQUAL)) {
          return;
        }
        this.name += this.text;
        this.text = "";
        if (!this.xmlDeclExpects.includes(this.name)) {
          switch (this.name.length) {
            case 0:
              this.fail("did not expect any more name/value pairs.");
              break;
            case 1:
              this.fail(`expected the name ${this.xmlDeclExpects[0]}.`);
              break;
            default:
              this.fail(`expected one of ${this.xmlDeclExpects.join(", ")}`);
          }
        }
        this.state = c === EQUAL ? S_XML_DECL_VALUE_START : S_XML_DECL_EQ;
      }
      sXMLDeclEq() {
        const c = this.getCodeNorm();
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          this.fail("XML declaration is incomplete.");
          return;
        }
        if (isS(c)) {
          return;
        }
        if (c !== EQUAL) {
          this.fail("value required.");
        }
        this.state = S_XML_DECL_VALUE_START;
      }
      sXMLDeclValueStart() {
        const c = this.getCodeNorm();
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          this.fail("XML declaration is incomplete.");
          return;
        }
        if (isS(c)) {
          return;
        }
        if (!isQuote(c)) {
          this.fail("value must be quoted.");
          this.q = SPACE;
        } else {
          this.q = c;
        }
        this.state = S_XML_DECL_VALUE;
      }
      sXMLDeclValue() {
        const c = this.captureTo([this.q, QUESTION]);
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          this.text = "";
          this.fail("XML declaration is incomplete.");
          return;
        }
        if (c === EOC) {
          return;
        }
        const value = this.text;
        this.text = "";
        switch (this.name) {
          case "version": {
            this.xmlDeclExpects = ["encoding", "standalone"];
            const version2 = value;
            this.xmlDecl.version = version2;
            if (!/^1\.[0-9]+$/.test(version2)) {
              this.fail("version number must match /^1\\.[0-9]+$/.");
            } else if (!this.opt.forceXMLVersion) {
              this.setXMLVersion(version2);
            }
            break;
          }
          case "encoding":
            if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(value)) {
              this.fail("encoding value must match /^[A-Za-z0-9][A-Za-z0-9._-]*$/.");
            }
            this.xmlDeclExpects = ["standalone"];
            this.xmlDecl.encoding = value;
            break;
          case "standalone":
            if (value !== "yes" && value !== "no") {
              this.fail('standalone value must match "yes" or "no".');
            }
            this.xmlDeclExpects = [];
            this.xmlDecl.standalone = value;
            break;
          default:
        }
        this.name = "";
        this.state = S_XML_DECL_SEPARATOR;
      }
      sXMLDeclSeparator() {
        const c = this.getCodeNorm();
        if (c === QUESTION) {
          this.state = S_XML_DECL_ENDING;
          return;
        }
        if (!isS(c)) {
          this.fail("whitespace required.");
          this.unget();
        }
        this.state = S_XML_DECL_NAME_START;
      }
      sXMLDeclEnding() {
        var _a;
        const c = this.getCodeNorm();
        if (c === GREATER) {
          if (this.piTarget !== "xml") {
            this.fail("processing instructions are not allowed before root.");
          } else if (this.name !== "version" && this.xmlDeclExpects.includes("version")) {
            this.fail("XML declaration must contain a version.");
          }
          (_a = this.xmldeclHandler) === null || _a === void 0 ? void 0 : _a.call(this, this.xmlDecl);
          this.name = "";
          this.piTarget = this.text = "";
          this.state = S_TEXT;
        } else {
          this.fail("The character ? is disallowed anywhere in XML declarations.");
        }
        this.xmlDeclPossible = false;
      }
      sOpenTag() {
        var _a;
        const c = this.captureNameChars();
        if (c === EOC) {
          return;
        }
        const tag = this.tag = {
          name: this.name,
          attributes: /* @__PURE__ */ Object.create(null)
        };
        this.name = "";
        if (this.xmlnsOpt) {
          this.topNS = tag.ns = /* @__PURE__ */ Object.create(null);
        }
        (_a = this.openTagStartHandler) === null || _a === void 0 ? void 0 : _a.call(this, tag);
        this.sawRoot = true;
        if (!this.fragmentOpt && this.closedRoot) {
          this.fail("documents may contain only one root.");
        }
        switch (c) {
          case GREATER:
            this.openTag();
            break;
          case FORWARD_SLASH:
            this.state = S_OPEN_TAG_SLASH;
            break;
          default:
            if (!isS(c)) {
              this.fail("disallowed character in tag name.");
            }
            this.state = S_ATTRIB;
        }
      }
      sOpenTagSlash() {
        if (this.getCode() === GREATER) {
          this.openSelfClosingTag();
        } else {
          this.fail("forward-slash in opening tag not followed by >.");
          this.state = S_ATTRIB;
        }
      }
      sAttrib() {
        const c = this.skipSpaces();
        if (c === EOC) {
          return;
        }
        if (isNameStartChar(c)) {
          this.unget();
          this.state = S_ATTRIB_NAME;
        } else if (c === GREATER) {
          this.openTag();
        } else if (c === FORWARD_SLASH) {
          this.state = S_OPEN_TAG_SLASH;
        } else {
          this.fail("disallowed character in attribute name.");
        }
      }
      sAttribName() {
        const c = this.captureNameChars();
        if (c === EQUAL) {
          this.state = S_ATTRIB_VALUE;
        } else if (isS(c)) {
          this.state = S_ATTRIB_NAME_SAW_WHITE;
        } else if (c === GREATER) {
          this.fail("attribute without value.");
          this.pushAttrib(this.name, this.name);
          this.name = this.text = "";
          this.openTag();
        } else if (c !== EOC) {
          this.fail("disallowed character in attribute name.");
        }
      }
      sAttribNameSawWhite() {
        const c = this.skipSpaces();
        switch (c) {
          case EOC:
            return;
          case EQUAL:
            this.state = S_ATTRIB_VALUE;
            break;
          default:
            this.fail("attribute without value.");
            this.text = "";
            this.name = "";
            if (c === GREATER) {
              this.openTag();
            } else if (isNameStartChar(c)) {
              this.unget();
              this.state = S_ATTRIB_NAME;
            } else {
              this.fail("disallowed character in attribute name.");
              this.state = S_ATTRIB;
            }
        }
      }
      sAttribValue() {
        const c = this.getCodeNorm();
        if (isQuote(c)) {
          this.q = c;
          this.state = S_ATTRIB_VALUE_QUOTED;
        } else if (!isS(c)) {
          this.fail("unquoted attribute value.");
          this.state = S_ATTRIB_VALUE_UNQUOTED;
          this.unget();
        }
      }
      sAttribValueQuoted() {
        const { q, chunk } = this;
        let { i: start } = this;
        while (true) {
          switch (this.getCode()) {
            case q:
              this.pushAttrib(this.name, this.text + chunk.slice(start, this.prevI));
              this.name = this.text = "";
              this.q = null;
              this.state = S_ATTRIB_VALUE_CLOSED;
              return;
            case AMP:
              this.text += chunk.slice(start, this.prevI);
              this.state = S_ENTITY;
              this.entityReturnState = S_ATTRIB_VALUE_QUOTED;
              return;
            case NL:
            case NL_LIKE:
            case TAB:
              this.text += `${chunk.slice(start, this.prevI)} `;
              start = this.i;
              break;
            case LESS:
              this.text += chunk.slice(start, this.prevI);
              this.fail("disallowed character.");
              return;
            case EOC:
              this.text += chunk.slice(start);
              return;
            default:
          }
        }
      }
      sAttribValueClosed() {
        const c = this.getCodeNorm();
        if (isS(c)) {
          this.state = S_ATTRIB;
        } else if (c === GREATER) {
          this.openTag();
        } else if (c === FORWARD_SLASH) {
          this.state = S_OPEN_TAG_SLASH;
        } else if (isNameStartChar(c)) {
          this.fail("no whitespace between attributes.");
          this.unget();
          this.state = S_ATTRIB_NAME;
        } else {
          this.fail("disallowed character in attribute name.");
        }
      }
      sAttribValueUnquoted() {
        const c = this.captureTo(ATTRIB_VALUE_UNQUOTED_TERMINATOR);
        switch (c) {
          case AMP:
            this.state = S_ENTITY;
            this.entityReturnState = S_ATTRIB_VALUE_UNQUOTED;
            break;
          case LESS:
            this.fail("disallowed character.");
            break;
          case EOC:
            break;
          default:
            if (this.text.includes("]]>")) {
              this.fail('the string "]]>" is disallowed in char data.');
            }
            this.pushAttrib(this.name, this.text);
            this.name = this.text = "";
            if (c === GREATER) {
              this.openTag();
            } else {
              this.state = S_ATTRIB;
            }
        }
      }
      sCloseTag() {
        const c = this.captureNameChars();
        if (c === GREATER) {
          this.closeTag();
        } else if (isS(c)) {
          this.state = S_CLOSE_TAG_SAW_WHITE;
        } else if (c !== EOC) {
          this.fail("disallowed character in closing tag.");
        }
      }
      sCloseTagSawWhite() {
        switch (this.skipSpaces()) {
          case GREATER:
            this.closeTag();
            break;
          case EOC:
            break;
          default:
            this.fail("disallowed character in closing tag.");
        }
      }
      // END OF STATE ENGINE METHODS
      handleTextInRoot() {
        let { i: start, forbiddenState } = this;
        const { chunk, textHandler: handler } = this;
        scanLoop:
          while (true) {
            switch (this.getCode()) {
              case LESS: {
                this.state = S_OPEN_WAKA;
                if (handler !== void 0) {
                  const { text } = this;
                  const slice = chunk.slice(start, this.prevI);
                  if (text.length !== 0) {
                    handler(text + slice);
                    this.text = "";
                  } else if (slice.length !== 0) {
                    handler(slice);
                  }
                }
                forbiddenState = FORBIDDEN_START;
                break scanLoop;
              }
              case AMP:
                this.state = S_ENTITY;
                this.entityReturnState = S_TEXT;
                if (handler !== void 0) {
                  this.text += chunk.slice(start, this.prevI);
                }
                forbiddenState = FORBIDDEN_START;
                break scanLoop;
              case CLOSE_BRACKET:
                switch (forbiddenState) {
                  case FORBIDDEN_START:
                    forbiddenState = FORBIDDEN_BRACKET;
                    break;
                  case FORBIDDEN_BRACKET:
                    forbiddenState = FORBIDDEN_BRACKET_BRACKET;
                    break;
                  case FORBIDDEN_BRACKET_BRACKET:
                    break;
                  default:
                    throw new Error("impossible state");
                }
                break;
              case GREATER:
                if (forbiddenState === FORBIDDEN_BRACKET_BRACKET) {
                  this.fail('the string "]]>" is disallowed in char data.');
                }
                forbiddenState = FORBIDDEN_START;
                break;
              case NL_LIKE:
                if (handler !== void 0) {
                  this.text += `${chunk.slice(start, this.prevI)}
`;
                }
                start = this.i;
                forbiddenState = FORBIDDEN_START;
                break;
              case EOC:
                if (handler !== void 0) {
                  this.text += chunk.slice(start);
                }
                break scanLoop;
              default:
                forbiddenState = FORBIDDEN_START;
            }
          }
        this.forbiddenState = forbiddenState;
      }
      handleTextOutsideRoot() {
        let { i: start } = this;
        const { chunk, textHandler: handler } = this;
        let nonSpace = false;
        outRootLoop:
          while (true) {
            const code = this.getCode();
            switch (code) {
              case LESS: {
                this.state = S_OPEN_WAKA;
                if (handler !== void 0) {
                  const { text } = this;
                  const slice = chunk.slice(start, this.prevI);
                  if (text.length !== 0) {
                    handler(text + slice);
                    this.text = "";
                  } else if (slice.length !== 0) {
                    handler(slice);
                  }
                }
                break outRootLoop;
              }
              case AMP:
                this.state = S_ENTITY;
                this.entityReturnState = S_TEXT;
                if (handler !== void 0) {
                  this.text += chunk.slice(start, this.prevI);
                }
                nonSpace = true;
                break outRootLoop;
              case NL_LIKE:
                if (handler !== void 0) {
                  this.text += `${chunk.slice(start, this.prevI)}
`;
                }
                start = this.i;
                break;
              case EOC:
                if (handler !== void 0) {
                  this.text += chunk.slice(start);
                }
                break outRootLoop;
              default:
                if (!isS(code)) {
                  nonSpace = true;
                }
            }
          }
        if (!nonSpace) {
          return;
        }
        if (!this.sawRoot && !this.reportedTextBeforeRoot) {
          this.fail("text data outside of root node.");
          this.reportedTextBeforeRoot = true;
        }
        if (this.closedRoot && !this.reportedTextAfterRoot) {
          this.fail("text data outside of root node.");
          this.reportedTextAfterRoot = true;
        }
      }
      pushAttribNS(name, value) {
        var _a;
        const { prefix, local } = this.qname(name);
        const attr2 = { name, prefix, local, value };
        this.attribList.push(attr2);
        (_a = this.attributeHandler) === null || _a === void 0 ? void 0 : _a.call(this, attr2);
        if (prefix === "xmlns") {
          const trimmed = value.trim();
          if (this.currentXMLVersion === "1.0" && trimmed === "") {
            this.fail("invalid attempt to undefine prefix in XML 1.0");
          }
          this.topNS[local] = trimmed;
          nsPairCheck(this, local, trimmed);
        } else if (name === "xmlns") {
          const trimmed = value.trim();
          this.topNS[""] = trimmed;
          nsPairCheck(this, "", trimmed);
        }
      }
      pushAttribPlain(name, value) {
        var _a;
        const attr2 = { name, value };
        this.attribList.push(attr2);
        (_a = this.attributeHandler) === null || _a === void 0 ? void 0 : _a.call(this, attr2);
      }
      /**
       * End parsing. This performs final well-formedness checks and resets the
       * parser to a clean state.
       *
       * @returns this
       */
      end() {
        var _a, _b;
        if (!this.sawRoot) {
          this.fail("document must contain a root element.");
        }
        const { tags } = this;
        while (tags.length > 0) {
          const tag = tags.pop();
          this.fail(`unclosed tag: ${tag.name}`);
        }
        if (this.state !== S_BEGIN && this.state !== S_TEXT) {
          this.fail("unexpected end.");
        }
        const { text } = this;
        if (text.length !== 0) {
          (_a = this.textHandler) === null || _a === void 0 ? void 0 : _a.call(this, text);
          this.text = "";
        }
        this._closed = true;
        (_b = this.endHandler) === null || _b === void 0 ? void 0 : _b.call(this);
        this._init();
        return this;
      }
      /**
       * Resolve a namespace prefix.
       *
       * @param prefix The prefix to resolve.
       *
       * @returns The namespace URI or ``undefined`` if the prefix is not defined.
       */
      resolve(prefix) {
        var _a, _b;
        let uri = this.topNS[prefix];
        if (uri !== void 0) {
          return uri;
        }
        const { tags } = this;
        for (let index = tags.length - 1; index >= 0; index--) {
          uri = tags[index].ns[prefix];
          if (uri !== void 0) {
            return uri;
          }
        }
        uri = this.ns[prefix];
        if (uri !== void 0) {
          return uri;
        }
        return (_b = (_a = this.opt).resolvePrefix) === null || _b === void 0 ? void 0 : _b.call(_a, prefix);
      }
      /**
       * Parse a qname into its prefix and local name parts.
       *
       * @param name The name to parse
       *
       * @returns
       */
      qname(name) {
        const colon = name.indexOf(":");
        if (colon === -1) {
          return { prefix: "", local: name };
        }
        const local = name.slice(colon + 1);
        const prefix = name.slice(0, colon);
        if (prefix === "" || local === "" || local.includes(":")) {
          this.fail(`malformed name: ${name}.`);
        }
        return { prefix, local };
      }
      processAttribsNS() {
        var _a;
        const { attribList } = this;
        const tag = this.tag;
        {
          const { prefix, local } = this.qname(tag.name);
          tag.prefix = prefix;
          tag.local = local;
          const uri = tag.uri = (_a = this.resolve(prefix)) !== null && _a !== void 0 ? _a : "";
          if (prefix !== "") {
            if (prefix === "xmlns") {
              this.fail('tags may not have "xmlns" as prefix.');
            }
            if (uri === "") {
              this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
              tag.uri = prefix;
            }
          }
        }
        if (attribList.length === 0) {
          return;
        }
        const { attributes: attributes2 } = tag;
        const seen = /* @__PURE__ */ new Set();
        for (const attr2 of attribList) {
          const { name, prefix, local } = attr2;
          let uri;
          let eqname;
          if (prefix === "") {
            uri = name === "xmlns" ? XMLNS_NAMESPACE : "";
            eqname = name;
          } else {
            uri = this.resolve(prefix);
            if (uri === void 0) {
              this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
              uri = prefix;
            }
            eqname = `{${uri}}${local}`;
          }
          if (seen.has(eqname)) {
            this.fail(`duplicate attribute: ${eqname}.`);
          }
          seen.add(eqname);
          attr2.uri = uri;
          attributes2[name] = attr2;
        }
        this.attribList = [];
      }
      processAttribsPlain() {
        const { attribList } = this;
        const attributes2 = this.tag.attributes;
        for (const { name, value } of attribList) {
          if (attributes2[name] !== void 0) {
            this.fail(`duplicate attribute: ${name}.`);
          }
          attributes2[name] = value;
        }
        this.attribList = [];
      }
      /**
       * Handle a complete open tag. This parser code calls this once it has seen
       * the whole tag. This method checks for well-formeness and then emits
       * ``onopentag``.
       */
      openTag() {
        var _a;
        this.processAttribs();
        const { tags } = this;
        const tag = this.tag;
        tag.isSelfClosing = false;
        (_a = this.openTagHandler) === null || _a === void 0 ? void 0 : _a.call(this, tag);
        tags.push(tag);
        this.state = S_TEXT;
        this.name = "";
      }
      /**
       * Handle a complete self-closing tag. This parser code calls this once it has
       * seen the whole tag. This method checks for well-formeness and then emits
       * ``onopentag`` and ``onclosetag``.
       */
      openSelfClosingTag() {
        var _a, _b, _c;
        this.processAttribs();
        const { tags } = this;
        const tag = this.tag;
        tag.isSelfClosing = true;
        (_a = this.openTagHandler) === null || _a === void 0 ? void 0 : _a.call(this, tag);
        (_b = this.closeTagHandler) === null || _b === void 0 ? void 0 : _b.call(this, tag);
        const top = this.tag = (_c = tags[tags.length - 1]) !== null && _c !== void 0 ? _c : null;
        if (top === null) {
          this.closedRoot = true;
        }
        this.state = S_TEXT;
        this.name = "";
      }
      /**
       * Handle a complete close tag. This parser code calls this once it has seen
       * the whole tag. This method checks for well-formeness and then emits
       * ``onclosetag``.
       */
      closeTag() {
        const { tags, name } = this;
        this.state = S_TEXT;
        this.name = "";
        if (name === "") {
          this.fail("weird empty close tag.");
          this.text += "</>";
          return;
        }
        const handler = this.closeTagHandler;
        let l = tags.length;
        while (l-- > 0) {
          const tag = this.tag = tags.pop();
          this.topNS = tag.ns;
          handler === null || handler === void 0 ? void 0 : handler(tag);
          if (tag.name === name) {
            break;
          }
          this.fail("unexpected close tag.");
        }
        if (l === 0) {
          this.closedRoot = true;
        } else if (l < 0) {
          this.fail(`unmatched closing tag: ${name}.`);
          this.text += `</${name}>`;
        }
      }
      /**
       * Resolves an entity. Makes any necessary well-formedness checks.
       *
       * @param entity The entity to resolve.
       *
       * @returns The parsed entity.
       */
      parseEntity(entity) {
        if (entity[0] !== "#") {
          const defined = this.ENTITIES[entity];
          if (defined !== void 0) {
            return defined;
          }
          this.fail(this.isName(entity) ? "undefined entity." : "disallowed character in entity name.");
          return `&${entity};`;
        }
        let num = NaN;
        if (entity[1] === "x" && /^#x[0-9a-f]+$/i.test(entity)) {
          num = parseInt(entity.slice(2), 16);
        } else if (/^#[0-9]+$/.test(entity)) {
          num = parseInt(entity.slice(1), 10);
        }
        if (!this.isChar(num)) {
          this.fail("malformed character entity.");
          return `&${entity};`;
        }
        return String.fromCodePoint(num);
      }
    };
    exports.SaxesParser = SaxesParser2;
  }
});

// node_modules/ts-interface-checker/dist/util.js
var require_util = __commonJS({
  "node_modules/ts-interface-checker/dist/util.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DetailContext = exports.NoopContext = exports.VError = void 0;
    var VError = (
      /** @class */
      (function(_super) {
        __extends(VError2, _super);
        function VError2(path, message) {
          var _this = _super.call(this, message) || this;
          _this.path = path;
          Object.setPrototypeOf(_this, VError2.prototype);
          return _this;
        }
        return VError2;
      })(Error)
    );
    exports.VError = VError;
    var NoopContext = (
      /** @class */
      (function() {
        function NoopContext2() {
        }
        NoopContext2.prototype.fail = function(relPath, message, score) {
          return false;
        };
        NoopContext2.prototype.unionResolver = function() {
          return this;
        };
        NoopContext2.prototype.createContext = function() {
          return this;
        };
        NoopContext2.prototype.resolveUnion = function(ur) {
        };
        return NoopContext2;
      })()
    );
    exports.NoopContext = NoopContext;
    var DetailContext = (
      /** @class */
      (function() {
        function DetailContext2() {
          this._propNames = [""];
          this._messages = [null];
          this._score = 0;
        }
        DetailContext2.prototype.fail = function(relPath, message, score) {
          this._propNames.push(relPath);
          this._messages.push(message);
          this._score += score;
          return false;
        };
        DetailContext2.prototype.unionResolver = function() {
          return new DetailUnionResolver();
        };
        DetailContext2.prototype.resolveUnion = function(unionResolver) {
          var _a, _b;
          var u = unionResolver;
          var best = null;
          for (var _i = 0, _c = u.contexts; _i < _c.length; _i++) {
            var ctx = _c[_i];
            if (!best || ctx._score >= best._score) {
              best = ctx;
            }
          }
          if (best && best._score > 0) {
            (_a = this._propNames).push.apply(_a, best._propNames);
            (_b = this._messages).push.apply(_b, best._messages);
          }
        };
        DetailContext2.prototype.getError = function(path) {
          var msgParts = [];
          for (var i = this._propNames.length - 1; i >= 0; i--) {
            var p = this._propNames[i];
            path += typeof p === "number" ? "[" + p + "]" : p ? "." + p : "";
            var m = this._messages[i];
            if (m) {
              msgParts.push(path + " " + m);
            }
          }
          return new VError(path, msgParts.join("; "));
        };
        DetailContext2.prototype.getErrorDetail = function(path) {
          var details = [];
          for (var i = this._propNames.length - 1; i >= 0; i--) {
            var p = this._propNames[i];
            path += typeof p === "number" ? "[" + p + "]" : p ? "." + p : "";
            var message = this._messages[i];
            if (message) {
              details.push({ path, message });
            }
          }
          var detail = null;
          for (var i = details.length - 1; i >= 0; i--) {
            if (detail) {
              details[i].nested = [detail];
            }
            detail = details[i];
          }
          return detail;
        };
        return DetailContext2;
      })()
    );
    exports.DetailContext = DetailContext;
    var DetailUnionResolver = (
      /** @class */
      (function() {
        function DetailUnionResolver2() {
          this.contexts = [];
        }
        DetailUnionResolver2.prototype.createContext = function() {
          var ctx = new DetailContext();
          this.contexts.push(ctx);
          return ctx;
        };
        return DetailUnionResolver2;
      })()
    );
  }
});

// node_modules/ts-interface-checker/dist/types.js
var require_types = __commonJS({
  "node_modules/ts-interface-checker/dist/types.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.basicTypes = exports.BasicType = exports.TParamList = exports.TParam = exports.param = exports.TFunc = exports.func = exports.TProp = exports.TOptional = exports.opt = exports.TIface = exports.iface = exports.TEnumLiteral = exports.enumlit = exports.TEnumType = exports.enumtype = exports.TIntersection = exports.intersection = exports.TUnion = exports.union = exports.TTuple = exports.tuple = exports.TArray = exports.array = exports.TLiteral = exports.lit = exports.TName = exports.name = exports.TType = void 0;
    var util_1 = require_util();
    var TType = (
      /** @class */
      /* @__PURE__ */ (function() {
        function TType2() {
        }
        return TType2;
      })()
    );
    exports.TType = TType;
    function parseSpec(typeSpec) {
      return typeof typeSpec === "string" ? name(typeSpec) : typeSpec;
    }
    function getNamedType(suite, name2) {
      var ttype = suite[name2];
      if (!ttype) {
        throw new Error("Unknown type " + name2);
      }
      return ttype;
    }
    function name(value) {
      return new TName(value);
    }
    exports.name = name;
    var TName = (
      /** @class */
      (function(_super) {
        __extends(TName2, _super);
        function TName2(name2) {
          var _this = _super.call(this) || this;
          _this.name = name2;
          _this._failMsg = "is not a " + name2;
          return _this;
        }
        TName2.prototype.getChecker = function(suite, strict, allowedProps) {
          var _this = this;
          var ttype = getNamedType(suite, this.name);
          var checker = ttype.getChecker(suite, strict, allowedProps);
          if (ttype instanceof BasicType || ttype instanceof TName2) {
            return checker;
          }
          return function(value, ctx) {
            return checker(value, ctx) ? true : ctx.fail(null, _this._failMsg, 0);
          };
        };
        return TName2;
      })(TType)
    );
    exports.TName = TName;
    function lit2(value) {
      return new TLiteral(value);
    }
    exports.lit = lit2;
    var TLiteral = (
      /** @class */
      (function(_super) {
        __extends(TLiteral2, _super);
        function TLiteral2(value) {
          var _this = _super.call(this) || this;
          _this.value = value;
          _this.name = JSON.stringify(value);
          _this._failMsg = "is not " + _this.name;
          return _this;
        }
        TLiteral2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          return function(value, ctx) {
            return value === _this.value ? true : ctx.fail(null, _this._failMsg, -1);
          };
        };
        return TLiteral2;
      })(TType)
    );
    exports.TLiteral = TLiteral;
    function array2(typeSpec) {
      return new TArray(parseSpec(typeSpec));
    }
    exports.array = array2;
    var TArray = (
      /** @class */
      (function(_super) {
        __extends(TArray2, _super);
        function TArray2(ttype) {
          var _this = _super.call(this) || this;
          _this.ttype = ttype;
          return _this;
        }
        TArray2.prototype.getChecker = function(suite, strict) {
          var itemChecker = this.ttype.getChecker(suite, strict);
          return function(value, ctx) {
            if (!Array.isArray(value)) {
              return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < value.length; i++) {
              var ok = itemChecker(value[i], ctx);
              if (!ok) {
                return ctx.fail(i, null, 1);
              }
            }
            return true;
          };
        };
        return TArray2;
      })(TType)
    );
    exports.TArray = TArray;
    function tuple() {
      var typeSpec = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        typeSpec[_i2] = arguments[_i2];
      }
      return new TTuple(typeSpec.map(function(t2) {
        return parseSpec(t2);
      }));
    }
    exports.tuple = tuple;
    var TTuple = (
      /** @class */
      (function(_super) {
        __extends(TTuple2, _super);
        function TTuple2(ttypes) {
          var _this = _super.call(this) || this;
          _this.ttypes = ttypes;
          return _this;
        }
        TTuple2.prototype.getChecker = function(suite, strict) {
          var itemCheckers = this.ttypes.map(function(t2) {
            return t2.getChecker(suite, strict);
          });
          var checker = function(value, ctx) {
            if (!Array.isArray(value)) {
              return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < itemCheckers.length; i++) {
              var ok = itemCheckers[i](value[i], ctx);
              if (!ok) {
                return ctx.fail(i, null, 1);
              }
            }
            return true;
          };
          if (!strict) {
            return checker;
          }
          return function(value, ctx) {
            if (!checker(value, ctx)) {
              return false;
            }
            return value.length <= itemCheckers.length ? true : ctx.fail(itemCheckers.length, "is extraneous", 2);
          };
        };
        return TTuple2;
      })(TType)
    );
    exports.TTuple = TTuple;
    function union2() {
      var typeSpec = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        typeSpec[_i2] = arguments[_i2];
      }
      return new TUnion(typeSpec.map(function(t2) {
        return parseSpec(t2);
      }));
    }
    exports.union = union2;
    var TUnion = (
      /** @class */
      (function(_super) {
        __extends(TUnion2, _super);
        function TUnion2(ttypes) {
          var _this = _super.call(this) || this;
          _this.ttypes = ttypes;
          var names = ttypes.map(function(t2) {
            return t2 instanceof TName || t2 instanceof TLiteral ? t2.name : null;
          }).filter(function(n) {
            return n;
          });
          var otherTypes = ttypes.length - names.length;
          if (names.length) {
            if (otherTypes > 0) {
              names.push(otherTypes + " more");
            }
            _this._failMsg = "is none of " + names.join(", ");
          } else {
            _this._failMsg = "is none of " + otherTypes + " types";
          }
          return _this;
        }
        TUnion2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          var itemCheckers = this.ttypes.map(function(t2) {
            return t2.getChecker(suite, strict);
          });
          return function(value, ctx) {
            var ur = ctx.unionResolver();
            for (var i = 0; i < itemCheckers.length; i++) {
              var ok = itemCheckers[i](value, ur.createContext());
              if (ok) {
                return true;
              }
            }
            ctx.resolveUnion(ur);
            return ctx.fail(null, _this._failMsg, 0);
          };
        };
        return TUnion2;
      })(TType)
    );
    exports.TUnion = TUnion;
    function intersection() {
      var typeSpec = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        typeSpec[_i2] = arguments[_i2];
      }
      return new TIntersection(typeSpec.map(function(t2) {
        return parseSpec(t2);
      }));
    }
    exports.intersection = intersection;
    var TIntersection = (
      /** @class */
      (function(_super) {
        __extends(TIntersection2, _super);
        function TIntersection2(ttypes) {
          var _this = _super.call(this) || this;
          _this.ttypes = ttypes;
          return _this;
        }
        TIntersection2.prototype.getChecker = function(suite, strict) {
          var allowedProps = /* @__PURE__ */ new Set();
          var itemCheckers = this.ttypes.map(function(t2) {
            return t2.getChecker(suite, strict, allowedProps);
          });
          return function(value, ctx) {
            var ok = itemCheckers.every(function(checker) {
              return checker(value, ctx);
            });
            if (ok) {
              return true;
            }
            return ctx.fail(null, null, 0);
          };
        };
        return TIntersection2;
      })(TType)
    );
    exports.TIntersection = TIntersection;
    function enumtype(values) {
      return new TEnumType(values);
    }
    exports.enumtype = enumtype;
    var TEnumType = (
      /** @class */
      (function(_super) {
        __extends(TEnumType2, _super);
        function TEnumType2(members) {
          var _this = _super.call(this) || this;
          _this.members = members;
          _this.validValues = /* @__PURE__ */ new Set();
          _this._failMsg = "is not a valid enum value";
          _this.validValues = new Set(Object.keys(members).map(function(name2) {
            return members[name2];
          }));
          return _this;
        }
        TEnumType2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          return function(value, ctx) {
            return _this.validValues.has(value) ? true : ctx.fail(null, _this._failMsg, 0);
          };
        };
        return TEnumType2;
      })(TType)
    );
    exports.TEnumType = TEnumType;
    function enumlit(name2, prop) {
      return new TEnumLiteral(name2, prop);
    }
    exports.enumlit = enumlit;
    var TEnumLiteral = (
      /** @class */
      (function(_super) {
        __extends(TEnumLiteral2, _super);
        function TEnumLiteral2(enumName, prop) {
          var _this = _super.call(this) || this;
          _this.enumName = enumName;
          _this.prop = prop;
          _this._failMsg = "is not " + enumName + "." + prop;
          return _this;
        }
        TEnumLiteral2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          var ttype = getNamedType(suite, this.enumName);
          if (!(ttype instanceof TEnumType)) {
            throw new Error("Type " + this.enumName + " used in enumlit is not an enum type");
          }
          var val = ttype.members[this.prop];
          if (!ttype.members.hasOwnProperty(this.prop)) {
            throw new Error("Unknown value " + this.enumName + "." + this.prop + " used in enumlit");
          }
          return function(value, ctx) {
            return value === val ? true : ctx.fail(null, _this._failMsg, -1);
          };
        };
        return TEnumLiteral2;
      })(TType)
    );
    exports.TEnumLiteral = TEnumLiteral;
    function makeIfaceProps(props) {
      return Object.keys(props).map(function(name2) {
        return makeIfaceProp(name2, props[name2]);
      });
    }
    function makeIfaceProp(name2, prop) {
      return prop instanceof TOptional ? new TProp(name2, prop.ttype, true) : new TProp(name2, parseSpec(prop), false);
    }
    function iface2(bases, props) {
      return new TIface(bases, makeIfaceProps(props));
    }
    exports.iface = iface2;
    var TIface = (
      /** @class */
      (function(_super) {
        __extends(TIface2, _super);
        function TIface2(bases, props) {
          var _this = _super.call(this) || this;
          _this.bases = bases;
          _this.props = props;
          _this.propSet = new Set(props.map(function(p) {
            return p.name;
          }));
          return _this;
        }
        TIface2.prototype.getChecker = function(suite, strict, allowedProps) {
          var _this = this;
          var baseCheckers = this.bases.map(function(b) {
            return getNamedType(suite, b).getChecker(suite, strict);
          });
          var propCheckers = this.props.map(function(prop) {
            return prop.ttype.getChecker(suite, strict);
          });
          var testCtx = new util_1.NoopContext();
          var isPropRequired = this.props.map(function(prop, i) {
            return !prop.isOpt && !propCheckers[i](void 0, testCtx);
          });
          var checker = function(value, ctx) {
            if (typeof value !== "object" || value === null) {
              return ctx.fail(null, "is not an object", 0);
            }
            for (var i = 0; i < baseCheckers.length; i++) {
              if (!baseCheckers[i](value, ctx)) {
                return false;
              }
            }
            for (var i = 0; i < propCheckers.length; i++) {
              var name_1 = _this.props[i].name;
              var v = value[name_1];
              if (v === void 0) {
                if (isPropRequired[i]) {
                  return ctx.fail(name_1, "is missing", 1);
                }
              } else {
                var ok = propCheckers[i](v, ctx);
                if (!ok) {
                  return ctx.fail(name_1, null, 1);
                }
              }
            }
            return true;
          };
          if (!strict) {
            return checker;
          }
          var propSet = this.propSet;
          if (allowedProps) {
            this.propSet.forEach(function(prop) {
              return allowedProps.add(prop);
            });
            propSet = allowedProps;
          }
          return function(value, ctx) {
            if (!checker(value, ctx)) {
              return false;
            }
            for (var prop in value) {
              if (!propSet.has(prop)) {
                return ctx.fail(prop, "is extraneous", 2);
              }
            }
            return true;
          };
        };
        return TIface2;
      })(TType)
    );
    exports.TIface = TIface;
    function opt2(typeSpec) {
      return new TOptional(parseSpec(typeSpec));
    }
    exports.opt = opt2;
    var TOptional = (
      /** @class */
      (function(_super) {
        __extends(TOptional2, _super);
        function TOptional2(ttype) {
          var _this = _super.call(this) || this;
          _this.ttype = ttype;
          return _this;
        }
        TOptional2.prototype.getChecker = function(suite, strict) {
          var itemChecker = this.ttype.getChecker(suite, strict);
          return function(value, ctx) {
            return value === void 0 || itemChecker(value, ctx);
          };
        };
        return TOptional2;
      })(TType)
    );
    exports.TOptional = TOptional;
    var TProp = (
      /** @class */
      /* @__PURE__ */ (function() {
        function TProp2(name2, ttype, isOpt) {
          this.name = name2;
          this.ttype = ttype;
          this.isOpt = isOpt;
        }
        return TProp2;
      })()
    );
    exports.TProp = TProp;
    function func(resultSpec) {
      var params = [];
      for (var _i2 = 1; _i2 < arguments.length; _i2++) {
        params[_i2 - 1] = arguments[_i2];
      }
      return new TFunc(new TParamList(params), parseSpec(resultSpec));
    }
    exports.func = func;
    var TFunc = (
      /** @class */
      (function(_super) {
        __extends(TFunc2, _super);
        function TFunc2(paramList, result) {
          var _this = _super.call(this) || this;
          _this.paramList = paramList;
          _this.result = result;
          return _this;
        }
        TFunc2.prototype.getChecker = function(suite, strict) {
          return function(value, ctx) {
            return typeof value === "function" ? true : ctx.fail(null, "is not a function", 0);
          };
        };
        return TFunc2;
      })(TType)
    );
    exports.TFunc = TFunc;
    function param(name2, typeSpec, isOpt) {
      return new TParam(name2, parseSpec(typeSpec), Boolean(isOpt));
    }
    exports.param = param;
    var TParam = (
      /** @class */
      /* @__PURE__ */ (function() {
        function TParam2(name2, ttype, isOpt) {
          this.name = name2;
          this.ttype = ttype;
          this.isOpt = isOpt;
        }
        return TParam2;
      })()
    );
    exports.TParam = TParam;
    var TParamList = (
      /** @class */
      (function(_super) {
        __extends(TParamList2, _super);
        function TParamList2(params) {
          var _this = _super.call(this) || this;
          _this.params = params;
          return _this;
        }
        TParamList2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          var itemCheckers = this.params.map(function(t2) {
            return t2.ttype.getChecker(suite, strict);
          });
          var testCtx = new util_1.NoopContext();
          var isParamRequired = this.params.map(function(param2, i) {
            return !param2.isOpt && !itemCheckers[i](void 0, testCtx);
          });
          var checker = function(value, ctx) {
            if (!Array.isArray(value)) {
              return ctx.fail(null, "is not an array", 0);
            }
            for (var i = 0; i < itemCheckers.length; i++) {
              var p = _this.params[i];
              if (value[i] === void 0) {
                if (isParamRequired[i]) {
                  return ctx.fail(p.name, "is missing", 1);
                }
              } else {
                var ok = itemCheckers[i](value[i], ctx);
                if (!ok) {
                  return ctx.fail(p.name, null, 1);
                }
              }
            }
            return true;
          };
          if (!strict) {
            return checker;
          }
          return function(value, ctx) {
            if (!checker(value, ctx)) {
              return false;
            }
            return value.length <= itemCheckers.length ? true : ctx.fail(itemCheckers.length, "is extraneous", 2);
          };
        };
        return TParamList2;
      })(TType)
    );
    exports.TParamList = TParamList;
    var BasicType = (
      /** @class */
      (function(_super) {
        __extends(BasicType2, _super);
        function BasicType2(validator, message) {
          var _this = _super.call(this) || this;
          _this.validator = validator;
          _this.message = message;
          return _this;
        }
        BasicType2.prototype.getChecker = function(suite, strict) {
          var _this = this;
          return function(value, ctx) {
            return _this.validator(value) ? true : ctx.fail(null, _this.message, 0);
          };
        };
        return BasicType2;
      })(TType)
    );
    exports.BasicType = BasicType;
    exports.basicTypes = {
      any: new BasicType(function(v) {
        return true;
      }, "is invalid"),
      number: new BasicType(function(v) {
        return typeof v === "number";
      }, "is not a number"),
      object: new BasicType(function(v) {
        return typeof v === "object" && v;
      }, "is not an object"),
      boolean: new BasicType(function(v) {
        return typeof v === "boolean";
      }, "is not a boolean"),
      string: new BasicType(function(v) {
        return typeof v === "string";
      }, "is not a string"),
      symbol: new BasicType(function(v) {
        return typeof v === "symbol";
      }, "is not a symbol"),
      void: new BasicType(function(v) {
        return v == null;
      }, "is not void"),
      undefined: new BasicType(function(v) {
        return v === void 0;
      }, "is not undefined"),
      null: new BasicType(function(v) {
        return v === null;
      }, "is not null"),
      never: new BasicType(function(v) {
        return false;
      }, "is unexpected"),
      Date: new BasicType(getIsNativeChecker("[object Date]"), "is not a Date"),
      RegExp: new BasicType(getIsNativeChecker("[object RegExp]"), "is not a RegExp")
    };
    var nativeToString = Object.prototype.toString;
    function getIsNativeChecker(tag) {
      return function(v) {
        return typeof v === "object" && v && nativeToString.call(v) === tag;
      };
    }
    if (typeof Buffer !== "undefined") {
      exports.basicTypes.Buffer = new BasicType(function(v) {
        return Buffer.isBuffer(v);
      }, "is not a Buffer");
    }
    var _loop_1 = function(array_12) {
      exports.basicTypes[array_12.name] = new BasicType(function(v) {
        return v instanceof array_12;
      }, "is not a " + array_12.name);
    };
    for (_i = 0, _a = [
      Int8Array,
      Uint8Array,
      Uint8ClampedArray,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      ArrayBuffer
    ]; _i < _a.length; _i++) {
      array_1 = _a[_i];
      _loop_1(array_1);
    }
    var array_1;
    var _i;
    var _a;
  }
});

// node_modules/ts-interface-checker/dist/index.js
var require_dist = __commonJS({
  "node_modules/ts-interface-checker/dist/index.js"(exports) {
    "use strict";
    var __spreadArrays = exports && exports.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checker = exports.createCheckers = void 0;
    var types_1 = require_types();
    var util_1 = require_util();
    var types_2 = require_types();
    Object.defineProperty(exports, "TArray", { enumerable: true, get: function() {
      return types_2.TArray;
    } });
    Object.defineProperty(exports, "TEnumType", { enumerable: true, get: function() {
      return types_2.TEnumType;
    } });
    Object.defineProperty(exports, "TEnumLiteral", { enumerable: true, get: function() {
      return types_2.TEnumLiteral;
    } });
    Object.defineProperty(exports, "TFunc", { enumerable: true, get: function() {
      return types_2.TFunc;
    } });
    Object.defineProperty(exports, "TIface", { enumerable: true, get: function() {
      return types_2.TIface;
    } });
    Object.defineProperty(exports, "TLiteral", { enumerable: true, get: function() {
      return types_2.TLiteral;
    } });
    Object.defineProperty(exports, "TName", { enumerable: true, get: function() {
      return types_2.TName;
    } });
    Object.defineProperty(exports, "TOptional", { enumerable: true, get: function() {
      return types_2.TOptional;
    } });
    Object.defineProperty(exports, "TParam", { enumerable: true, get: function() {
      return types_2.TParam;
    } });
    Object.defineProperty(exports, "TParamList", { enumerable: true, get: function() {
      return types_2.TParamList;
    } });
    Object.defineProperty(exports, "TProp", { enumerable: true, get: function() {
      return types_2.TProp;
    } });
    Object.defineProperty(exports, "TTuple", { enumerable: true, get: function() {
      return types_2.TTuple;
    } });
    Object.defineProperty(exports, "TType", { enumerable: true, get: function() {
      return types_2.TType;
    } });
    Object.defineProperty(exports, "TUnion", { enumerable: true, get: function() {
      return types_2.TUnion;
    } });
    Object.defineProperty(exports, "TIntersection", { enumerable: true, get: function() {
      return types_2.TIntersection;
    } });
    Object.defineProperty(exports, "array", { enumerable: true, get: function() {
      return types_2.array;
    } });
    Object.defineProperty(exports, "enumlit", { enumerable: true, get: function() {
      return types_2.enumlit;
    } });
    Object.defineProperty(exports, "enumtype", { enumerable: true, get: function() {
      return types_2.enumtype;
    } });
    Object.defineProperty(exports, "func", { enumerable: true, get: function() {
      return types_2.func;
    } });
    Object.defineProperty(exports, "iface", { enumerable: true, get: function() {
      return types_2.iface;
    } });
    Object.defineProperty(exports, "lit", { enumerable: true, get: function() {
      return types_2.lit;
    } });
    Object.defineProperty(exports, "name", { enumerable: true, get: function() {
      return types_2.name;
    } });
    Object.defineProperty(exports, "opt", { enumerable: true, get: function() {
      return types_2.opt;
    } });
    Object.defineProperty(exports, "param", { enumerable: true, get: function() {
      return types_2.param;
    } });
    Object.defineProperty(exports, "tuple", { enumerable: true, get: function() {
      return types_2.tuple;
    } });
    Object.defineProperty(exports, "union", { enumerable: true, get: function() {
      return types_2.union;
    } });
    Object.defineProperty(exports, "intersection", { enumerable: true, get: function() {
      return types_2.intersection;
    } });
    Object.defineProperty(exports, "BasicType", { enumerable: true, get: function() {
      return types_2.BasicType;
    } });
    var util_2 = require_util();
    Object.defineProperty(exports, "VError", { enumerable: true, get: function() {
      return util_2.VError;
    } });
    function createCheckers2() {
      var typeSuite = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        typeSuite[_i] = arguments[_i];
      }
      var fullSuite = Object.assign.apply(Object, __spreadArrays([{}, types_1.basicTypes], typeSuite));
      var checkers = {};
      for (var _a = 0, typeSuite_1 = typeSuite; _a < typeSuite_1.length; _a++) {
        var suite_1 = typeSuite_1[_a];
        for (var _b = 0, _c = Object.keys(suite_1); _b < _c.length; _b++) {
          var name = _c[_b];
          checkers[name] = new Checker(fullSuite, suite_1[name]);
        }
      }
      return checkers;
    }
    exports.createCheckers = createCheckers2;
    var Checker = (
      /** @class */
      (function() {
        function Checker2(suite, ttype, _path) {
          if (_path === void 0) {
            _path = "value";
          }
          this.suite = suite;
          this.ttype = ttype;
          this._path = _path;
          this.props = /* @__PURE__ */ new Map();
          if (ttype instanceof types_1.TIface) {
            for (var _i = 0, _a = ttype.props; _i < _a.length; _i++) {
              var p = _a[_i];
              this.props.set(p.name, p.ttype);
            }
          }
          this.checkerPlain = this.ttype.getChecker(suite, false);
          this.checkerStrict = this.ttype.getChecker(suite, true);
        }
        Checker2.prototype.setReportedPath = function(path) {
          this._path = path;
        };
        Checker2.prototype.check = function(value) {
          return this._doCheck(this.checkerPlain, value);
        };
        Checker2.prototype.test = function(value) {
          return this.checkerPlain(value, new util_1.NoopContext());
        };
        Checker2.prototype.validate = function(value) {
          return this._doValidate(this.checkerPlain, value);
        };
        Checker2.prototype.strictCheck = function(value) {
          return this._doCheck(this.checkerStrict, value);
        };
        Checker2.prototype.strictTest = function(value) {
          return this.checkerStrict(value, new util_1.NoopContext());
        };
        Checker2.prototype.strictValidate = function(value) {
          return this._doValidate(this.checkerStrict, value);
        };
        Checker2.prototype.getProp = function(prop) {
          var ttype = this.props.get(prop);
          if (!ttype) {
            throw new Error("Type has no property " + prop);
          }
          return new Checker2(this.suite, ttype, this._path + "." + prop);
        };
        Checker2.prototype.methodArgs = function(methodName) {
          var tfunc = this._getMethod(methodName);
          return new Checker2(this.suite, tfunc.paramList);
        };
        Checker2.prototype.methodResult = function(methodName) {
          var tfunc = this._getMethod(methodName);
          return new Checker2(this.suite, tfunc.result);
        };
        Checker2.prototype.getArgs = function() {
          if (!(this.ttype instanceof types_1.TFunc)) {
            throw new Error("getArgs() applied to non-function");
          }
          return new Checker2(this.suite, this.ttype.paramList);
        };
        Checker2.prototype.getResult = function() {
          if (!(this.ttype instanceof types_1.TFunc)) {
            throw new Error("getResult() applied to non-function");
          }
          return new Checker2(this.suite, this.ttype.result);
        };
        Checker2.prototype.getType = function() {
          return this.ttype;
        };
        Checker2.prototype._doCheck = function(checkerFunc, value) {
          var noopCtx = new util_1.NoopContext();
          if (!checkerFunc(value, noopCtx)) {
            var detailCtx = new util_1.DetailContext();
            checkerFunc(value, detailCtx);
            throw detailCtx.getError(this._path);
          }
        };
        Checker2.prototype._doValidate = function(checkerFunc, value) {
          var noopCtx = new util_1.NoopContext();
          if (checkerFunc(value, noopCtx)) {
            return null;
          }
          var detailCtx = new util_1.DetailContext();
          checkerFunc(value, detailCtx);
          return detailCtx.getErrorDetail(this._path);
        };
        Checker2.prototype._getMethod = function(methodName) {
          var ttype = this.props.get(methodName);
          if (!ttype) {
            throw new Error("Type has no property " + methodName);
          }
          if (!(ttype instanceof types_1.TFunc)) {
            throw new Error("Property " + methodName + " is not a method");
          }
          return ttype;
        };
        return Checker2;
      })()
    );
    exports.Checker = Checker;
  }
});

// node_modules/lines-and-columns/build/index.js
var require_build = __commonJS({
  "node_modules/lines-and-columns/build/index.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.LinesAndColumns = void 0;
    var LF = "\n";
    var CR = "\r";
    var LinesAndColumns2 = (
      /** @class */
      (function() {
        function LinesAndColumns3(string) {
          this.string = string;
          var offsets = [0];
          for (var offset = 0; offset < string.length; ) {
            switch (string[offset]) {
              case LF:
                offset += LF.length;
                offsets.push(offset);
                break;
              case CR:
                offset += CR.length;
                if (string[offset] === LF) {
                  offset += LF.length;
                }
                offsets.push(offset);
                break;
              default:
                offset++;
                break;
            }
          }
          this.offsets = offsets;
        }
        LinesAndColumns3.prototype.locationForIndex = function(index) {
          if (index < 0 || index > this.string.length) {
            return null;
          }
          var line = 0;
          var offsets = this.offsets;
          while (offsets[line + 1] <= index) {
            line++;
          }
          var column = index - offsets[line];
          return { line, column };
        };
        LinesAndColumns3.prototype.indexForLocation = function(location) {
          var line = location.line, column = location.column;
          if (line < 0 || line >= this.offsets.length) {
            return null;
          }
          if (column < 0 || column > this.lengthOfLine(line)) {
            return null;
          }
          return this.offsets[line] + column;
        };
        LinesAndColumns3.prototype.lengthOfLine = function(line) {
          var offset = this.offsets[line];
          var nextOffset = line === this.offsets.length - 1 ? this.string.length : this.offsets[line + 1];
          return nextOffset - offset;
        };
        return LinesAndColumns3;
      })()
    );
    exports.LinesAndColumns = LinesAndColumns2;
    exports["default"] = LinesAndColumns2;
  }
});

// index.server.ts
import { homedir } from "node:os";
import { join, resolve as resolve4, isAbsolute } from "node:path";

// shared/language.ts
function artifactLocale(tag) {
  return tag?.trim().split("-")[0].toLowerCase() === "ko" ? "ko" : "en";
}
function localized(locale, en, ko) {
  return artifactLocale(locale) === "ko" ? ko : en;
}

// server/artifact-identity.ts
import { createHash } from "node:crypto";
function noticeId(artifactId, version2) {
  return `artifact:${artifactId}:${version2}`;
}
function contentHash(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}
function hash(value) {
  return contentHash(JSON.stringify(value));
}
function requestKey(...parts) {
  return JSON.stringify(parts);
}

// server/repository.ts
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { createRequire } from "node:module";

// server/library.ts
var import_saxes = __toESM(require_saxes(), 1);
var maxThumbnailBytes = 8192;
var staticElements = new Set("svg g path rect circle ellipse line polyline polygon title desc text tspan".split(" "));
var attributes = new Set("xmlns viewBox width height x y x1 y1 x2 y2 cx cy r rx ry points d fill stroke stroke-width fill-rule clip-rule stroke-linecap stroke-linejoin opacity fill-opacity stroke-opacity transform text-anchor font-size font-weight preserveAspectRatio".split(" "));
function staticThumbnail(source) {
  if (!source || Buffer.byteLength(source) > maxThumbnailBytes) return null;
  const image = source.replace(/^(\s*(?:<\?xml\s[^?]*\?>\s*)?<svg)(?=[\s/>])([^>]*>)/, (root, name, attrs) => /\sxmlns\s*=/.test(attrs) ? root : name + ' xmlns="http://www.w3.org/2000/svg"' + attrs);
  let safe = true, rootSeen = false;
  const parser = new import_saxes.SaxesParser({ xmlns: true });
  parser.on("opentag", (tag) => {
    if (!rootSeen) {
      safe = safe && tag.name === "svg";
      rootSeen = true;
    }
    if (tag.uri !== "http://www.w3.org/2000/svg" || !staticElements.has(tag.name)) safe = false;
    for (const attribute2 of Object.values(tag.attributes)) {
      if (!attributes.has(attribute2.name)) safe = false;
      if (attribute2.name === "fill" || attribute2.name === "stroke") {
        if (!/^(?:#[\da-f]{3,8}|[a-z]+|(?:rgb|hsl)a?\([\d\s.,%/+\-]+\))$/i.test(attribute2.value.trim())) safe = false;
      }
    }
  });
  parser.on("doctype", () => {
    safe = false;
  });
  parser.on("processinginstruction", () => {
    safe = false;
  });
  try {
    parser.write(image).close();
  } catch {
    return null;
  }
  return rootSeen && safe ? "data:image/svg+xml;base64," + Buffer.from(image).toString("base64") : null;
}
async function findInDirectory(ids, page2) {
  const values = /* @__PURE__ */ new Map();
  const visited = /* @__PURE__ */ new Set();
  let cursor;
  try {
    while (values.size < ids.size) {
      const result = await page2(cursor);
      for (const { id: id2, value } of result.entries) if (ids.has(id2)) values.set(id2, value);
      if (!result.next) break;
      if (visited.has(result.next)) return { values, complete: false };
      cursor = result.next;
      visited.add(cursor);
    }
    return { values, complete: true };
  } catch {
    return { values, complete: false };
  }
}
function displayName(value, id2) {
  const name = value?.trim();
  if (!name || name === id2 || /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(name)) return null;
  return name;
}
async function withSourceNames(items, paseo, locale) {
  const ids = new Set(items.flatMap((item) => item.sessionId ? [item.sessionId] : []));
  const agents = await findInDirectory(ids, async (cursor) => {
    const result = await paseo.agents.list({ filter: { includeArchived: true }, includeBackground: true, page: { limit: 200, cursor } });
    return { entries: result.entries.map(({ agent }) => ({ id: agent.id, value: { title: displayName(agent.title, agent.id), workspaceId: agent.workspaceId } })), next: result.pageInfo.nextCursor };
  });
  const workspaceIds = new Set([...agents.values.values()].flatMap((a) => a.workspaceId ? [a.workspaceId] : []));
  const workspaces = await findInDirectory(workspaceIds, async (cursor) => {
    const result = await paseo.workspaces.list({ includeBackground: true, page: { limit: 200, cursor } });
    return { entries: result.entries.map((w) => ({ id: w.id, value: displayName(w.name, w.id) })), next: result.pageInfo.nextCursor };
  });
  const fallbackTitles = {
    untitled: localized(locale, "Untitled conversation", "\uC774\uB984 \uC5C6\uB294 \uB300\uD654"),
    deleted: localized(locale, "Deleted conversation", "\uC0AD\uC81C\uB41C \uB300\uD654"),
    unavailable: localized(locale, "Source unavailable", "\uCD9C\uCC98 \uD655\uC778 \uBD88\uAC00")
  };
  return items.map((item) => {
    const agent = item.sessionId ? agents.values.get(item.sessionId) : void 0;
    const status = agent ? "untitled" : !item.sessionId || agents.complete ? "deleted" : "unavailable";
    return {
      ...item,
      ...agent?.title ? { sessionTitle: agent.title } : { sessionTitle: fallbackTitles[status], sessionTitleStatus: status },
      workspaceName: agent?.workspaceId ? workspaces.values.get(agent.workspaceId) ?? null : null
    };
  });
}

// server/repository.ts
var legacyIdsColumn = `(SELECT json_group_array(id) FROM (
  SELECT DISTINCT alias.value AS id
  FROM requests r, json_each(json_array(
    json_extract(r.origin,'$.legacyId'), json_extract(r.origin,'$.observedLegacyId')
  )) alias
  WHERE r.artifact=a.id AND alias.value IS NOT NULL LIMIT 1000
)) AS legacy_ids`;
var MAX_NOTICE_ATTEMPTS = 24;
function ulid() {
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let value = BigInt(Date.now()) << 80n | BigInt("0x" + randomBytes(10).toString("hex")), result = "";
  for (let i = 0; i < 26; i++) {
    result = alphabet[Number(value & 31n)] + result;
    value >>= 5n;
  }
  return result;
}
function openRepositorySync(path) {
  mkdirSync(dirname(path), { recursive: true });
  let database;
  try {
    const { DatabaseSync } = createRequire(resolve("artifact-runtime.cjs"))("node:sqlite");
    database = new DatabaseSync(path);
    return new SqliteArtifactRepository(database);
  } catch (error) {
    database?.close();
    throw new Error(`Cannot open the artifact database. Check the data path and node:sqlite support in the plugin runtime: ${error instanceof Error ? error.message : error}`);
  }
}
var SqliteArtifactRepository = class {
  constructor(db) {
    this.db = db;
    this.windows = /* @__PURE__ */ new Map();
    if (Number(db.prepare("PRAGMA user_version").get().user_version) > 2) throw new Error("This database requires a newer plugin version.");
    db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS artifacts(id TEXT PRIMARY KEY, session TEXT NOT NULL, key TEXT NOT NULL, title TEXT NOT NULL, format TEXT NOT NULL, head INTEGER NOT NULL, updated TEXT NOT NULL, UNIQUE(session,key));
      CREATE TABLE IF NOT EXISTS versions(artifact TEXT NOT NULL REFERENCES artifacts(id), version INTEGER NOT NULL, parent INTEGER NOT NULL, title TEXT NOT NULL, format TEXT NOT NULL, content TEXT NOT NULL, hash TEXT NOT NULL, origin TEXT NOT NULL, created TEXT NOT NULL, PRIMARY KEY(artifact,version));
      CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY, hash TEXT NOT NULL, artifact TEXT NOT NULL REFERENCES artifacts(id), version INTEGER NOT NULL, origin TEXT NOT NULL, alias INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS requests_by_artifact ON requests(artifact);
      CREATE INDEX IF NOT EXISTS requests_by_hash ON requests(hash);
      CREATE INDEX IF NOT EXISTS versions_publish_turn ON versions(json_extract(origin,'$.turnId'), json_extract(origin,'$.kind'));
      CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY, session TEXT NOT NULL, payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, next INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS artifact_host_locale (
        id INTEGER PRIMARY KEY CHECK(id=1), locale TEXT NOT NULL CHECK(locale IN ('en','ko')));
      CREATE TABLE IF NOT EXISTS turns(session TEXT PRIMARY KEY, token TEXT NOT NULL);
      BEGIN IMMEDIATE;
      CREATE TABLE IF NOT EXISTS artifact_settings (
        artifact TEXT PRIMARY KEY REFERENCES artifacts(id), display_title TEXT,
        pinned INTEGER NOT NULL DEFAULT 0, deleted INTEGER NOT NULL DEFAULT 0);
      CREATE VIEW IF NOT EXISTS artifact_listing AS
        SELECT a.*, COALESCE(s.display_title,a.title) AS display_title,
               COALESCE(s.pinned,0) AS pinned, COALESCE(s.deleted,0) AS deleted
        FROM artifacts a LEFT JOIN artifact_settings s ON s.artifact=a.id;
      PRAGMA user_version=2; COMMIT;`);
    db.function("artifact_search_key", { deterministic: true }, (value) => String(value ?? "").normalize("NFC").toLowerCase());
    this.hostLocale = this.row("SELECT locale FROM artifact_host_locale WHERE id=1")?.locale;
  }
  setHostLocale(tag) {
    const locale = artifactLocale(tag);
    if (this.hostLocale !== locale) {
      this.db.prepare("INSERT INTO artifact_host_locale VALUES(1,?) ON CONFLICT(id) DO UPDATE SET locale=excluded.locale").run(locale);
      this.hostLocale = locale;
    }
    return locale;
  }
  close() {
    this.db.close();
  }
  row(sql, ...args) {
    return this.db.prepare(sql).get(...args);
  }
  rows(sql, ...args) {
    return this.db.prepare(sql).all(...args);
  }
  summary(row) {
    const legacyIds = JSON.parse(row.legacy_ids);
    return { artifactId: row.id, sessionId: row.session, key: row.key, title: row.display_title, pinned: !!row.pinned, format: row.format, headVersion: row.head, updatedAt: row.updated, legacyIds };
  }
  versionMeta(row) {
    return {
      artifactId: row.artifact,
      version: row.version,
      parentVersion: row.parent,
      title: row.title,
      format: row.format,
      contentHash: row.hash,
      origin: JSON.parse(row.origin),
      createdAt: row.created
    };
  }
  version(row) {
    return { ...this.versionMeta(row), content: row.content };
  }
  latestId(sessionId) {
    return this.row("SELECT id FROM artifact_listing WHERE session=? AND deleted=0 ORDER BY updated DESC,id DESC LIMIT 1", sessionId)?.id;
  }
  headVersion(sessionId, artifactId) {
    return this.row("SELECT head FROM artifact_listing WHERE session=? AND id=? AND deleted=0", sessionId, artifactId)?.head;
  }
  libraryList(query, offset, limit, pinnedOnly = false, pinnedFirst = false) {
    const rows = this.rows(`SELECT a.id, NULLIF(trim(a.session),'') AS session, a.updated,
        COALESCE(s.display_title,v.title) AS title, v.version, v.format, COALESCE(s.pinned,0) AS pinned,
        CASE WHEN v.format='svg' AND length(CAST(v.content AS BLOB))<=? THEN v.content END AS svg
      FROM artifacts a
      JOIN versions v ON v.artifact=a.id AND v.version=(SELECT MAX(h.version) FROM versions h WHERE h.artifact=a.id)
      LEFT JOIN artifact_settings s ON s.artifact=a.id
      WHERE COALESCE(s.deleted,0)=0 AND (?=0 OR s.pinned=1)
        AND instr(artifact_search_key(COALESCE(s.display_title,v.title)),?)>0
      ORDER BY CASE WHEN ?=1 THEN COALESCE(s.pinned,0) ELSE 0 END DESC, a.updated DESC, a.id DESC
      LIMIT ? OFFSET ?`, maxThumbnailBytes, Number(pinnedOnly), query.normalize("NFC").toLowerCase(), Number(pinnedFirst), limit + 1, offset);
    const items = rows.slice(0, limit).map((row) => ({
      artifactId: row.id,
      sessionId: row.session,
      title: row.title,
      format: row.format,
      headVersion: row.version,
      pinned: !!row.pinned,
      updatedAt: row.updated,
      thumbnail: staticThumbnail(row.svg)
    }));
    return { items, nextOffset: rows.length > limit ? offset + limit : null };
  }
  libraryGet(id2, requestedVersion) {
    const row = this.row(`SELECT a.session,a.key,a.updated,COALESCE(s.pinned,0) AS pinned,
        COALESCE(s.display_title,h.title) AS title,h.format,h.version AS latest
      FROM artifacts a JOIN versions h ON h.artifact=a.id
      LEFT JOIN artifact_settings s ON s.artifact=a.id
      WHERE a.id=? AND COALESCE(s.deleted,0)=0 ORDER BY h.version DESC LIMIT 1`, id2);
    if (!row) return null;
    const revision2 = this.row("SELECT * FROM versions WHERE artifact=? AND version=?", id2, requestedVersion ?? row.latest);
    if (!revision2) return null;
    return { artifact: {
      artifactId: id2,
      sessionId: row.session?.trim() || null,
      key: row.key,
      title: row.title,
      format: row.format,
      headVersion: row.latest,
      updatedAt: row.updated,
      pinned: !!row.pinned
    }, version: this.version(revision2) };
  }
  list(sessionId, cursor, limit = 40) {
    const after = cursor ? this.row("SELECT pinned FROM artifact_listing WHERE session=? AND id=?", sessionId, cursor) : void 0;
    const rows = this.rows(`SELECT a.*, ${legacyIdsColumn} FROM artifact_listing a WHERE session=? AND deleted=0 AND (pinned,id)<(?,?) ORDER BY pinned DESC,id DESC LIMIT ?`, sessionId, after?.pinned ?? 2, cursor ?? "", Math.min(100, limit) + 1);
    const hidden = this.rows(`SELECT a.id, a.key, ${legacyIdsColumn} FROM artifact_listing a WHERE session=? AND deleted=1`, sessionId).flatMap((row) => [row.id, row.key, ...JSON.parse(row.legacy_ids)]);
    return { items: rows.slice(0, limit).map((row) => this.summary(row)), cursor: rows.length > limit ? rows[limit - 1].id : null, ...hidden.length ? { hidden } : {} };
  }
  get(sessionId, artifactId, version2) {
    const artifact2 = this.row(`SELECT a.*, ${legacyIdsColumn} FROM artifact_listing a WHERE id=? AND session=? AND deleted=0`, artifactId, sessionId);
    if (!artifact2) return null;
    const value = this.row("SELECT * FROM versions WHERE artifact=? AND version=?", artifactId, version2 ?? artifact2.head);
    return value ? { artifact: this.summary(artifact2), version: this.version(value) } : null;
  }
  history(sessionId, artifactId, cursor, limit = 40) {
    if (!this.row("SELECT id FROM artifact_listing WHERE id=? AND session=? AND deleted=0", artifactId, sessionId)) return { items: [], cursor: null };
    const before = cursor === void 0 ? Number.MAX_SAFE_INTEGER : Number(cursor);
    if (!Number.isSafeInteger(before) || before < 1) throw new Error(localized(this.hostLocale, "Invalid version cursor.", "\uC798\uBABB\uB41C \uBC84\uC804 \uCEE4\uC11C\uC785\uB2C8\uB2E4"));
    const rows = this.rows(`SELECT artifact,version,parent,title,format,hash,origin,created FROM versions
      WHERE artifact=? AND version<? ORDER BY version DESC LIMIT ?`, artifactId, before, Math.min(100, limit) + 1);
    const items = rows.slice(0, limit).map((row) => this.versionMeta(row));
    return { items, cursor: rows.length > limit ? String(items.at(-1).version) : null };
  }
  manage(sessionId, id2, action) {
    const row = this.row("SELECT * FROM artifact_listing WHERE session=? AND id=?", sessionId, id2);
    if (!row || row.deleted && action.type !== "restore" && action.type !== "delete") throw new Error(localized(this.hostLocale, "Artifact not found in this conversation.", "\uC774 \uB300\uD654\uC5D0\uC11C \uC544\uD2F0\uD329\uD2B8\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."));
    if (action.type === "duplicate") {
      const selected = this.get(sessionId, id2, action.version);
      if (!selected) throw new Error(localized(this.hostLocale, "Selected version not found.", "\uC120\uD0DD\uD55C \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."));
      const suffix = localized(this.hostLocale, " copy", " \uC0AC\uBCF8");
      const result = this.commit({
        sessionId,
        title: row.display_title.slice(0, 100 - suffix.length) + suffix,
        format: selected.version.format,
        content: selected.version.content,
        origin: { kind: "edit" },
        idemKey: JSON.stringify(["duplicate", sessionId, action.requestId]),
        request: { source: id2, version: action.version }
      });
      if (result.status !== "ok") throw new Error(localized(this.hostLocale, "The copy request conflicts with another operation.", "\uBCF5\uC81C \uC694\uCCAD\uC774 \uB2E4\uB978 \uC791\uC5C5\uACFC \uCDA9\uB3CC\uD588\uC2B5\uB2C8\uB2E4."));
      return { artifactId: result.artifactId };
    }
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db.prepare("INSERT INTO artifact_settings(artifact) VALUES(?) ON CONFLICT DO NOTHING").run(id2);
      if (action.type === "rename") this.db.prepare("UPDATE artifact_settings SET display_title=? WHERE artifact=?").run(action.title, id2);
      else if (action.type === "pin") this.db.prepare("UPDATE artifact_settings SET pinned=? WHERE artifact=?").run(+action.pinned, id2);
      else this.db.prepare("UPDATE artifact_settings SET deleted=? WHERE artifact=?").run(+(action.type === "delete"), id2);
      const updated = this.row("SELECT * FROM artifact_listing WHERE id=?", id2);
      this.db.prepare(`UPDATE outbox SET state=CASE WHEN state='history' THEN state ELSE 'pending' END, attempts=0, next=0,
        payload=json_set(payload,'$.title',?,'$.deleted',json(?),'$.pinned',json(?),'$.managed',json('true'))
        WHERE session=? AND json_extract(payload,'$.artifactId')=?`).run(updated.display_title, JSON.stringify(!!updated.deleted), JSON.stringify(!!updated.pinned), sessionId, id2);
      this.db.exec("COMMIT");
      return { artifactId: id2 };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  deliveryWindow(sessionId) {
    let token = this.windows.get(sessionId);
    if (!token) {
      token = ulid();
      this.windows.set(sessionId, token);
    }
    return token;
  }
  resetWindow(sessionId) {
    this.windows.delete(sessionId);
  }
  beginTurn(sessionId, token) {
    this.db.prepare("INSERT INTO turns(session,token) VALUES(?,?) ON CONFLICT(session) DO UPDATE SET token=excluded.token").run(sessionId, token);
  }
  currentTurn(sessionId) {
    return this.row("SELECT token FROM turns WHERE session=?", sessionId)?.token ?? null;
  }
  endTurn(sessionId, token) {
    this.db.prepare("DELETE FROM turns WHERE session=? AND token=?").run(sessionId, token);
  }
  // A later append cannot consume an older occurrence that fell outside the first bounded scan of this epoch.
  replayThrough(sessionId, epoch, tail) {
    const anchor = this.row(`SELECT id,json_extract(origin,'$.scanWindow') AS saved FROM requests
      WHERE artifact=(SELECT id FROM artifacts WHERE session=? ORDER BY rowid LIMIT 1) ORDER BY rowid LIMIT 1`, sessionId);
    if (!anchor) return tail;
    const saved = anchor.saved && JSON.parse(anchor.saved);
    if (saved?.epoch === epoch) return saved.tail;
    this.db.prepare("UPDATE requests SET origin=json_set(origin,'$.scanWindow',json(?)) WHERE id=?").run(JSON.stringify({ epoch, tail }), anchor.id);
    return tail;
  }
  // A request can account for only one occurrence in a timeline generation. Old rows have just the original position.
  replayRequest(input2, requestHash) {
    const position = input2.replay;
    const rows = this.db.prepare(`SELECT r.* FROM requests r JOIN artifacts a ON a.id=r.artifact
      WHERE r.hash=? AND a.session=? AND json_extract(r.origin,'$.blockIndex')=? ORDER BY r.rowid`).iterate(requestHash, input2.sessionId, input2.origin.blockIndex);
    let best, bestScore = -1;
    for (const row of rows) {
      const origin = JSON.parse(String(row.origin));
      const legacy = /^seq:(.*):(\d+)$/s.exec(origin.messageId);
      if (!legacy || origin.providerMessageId || origin.legacyId?.startsWith("msg:")) continue;
      const last = origin.replay;
      if (last && last.textHash !== position.textHash) continue;
      const originalEpoch = legacy[1], originalSeq = Number(legacy[2]);
      if (last?.epoch === position.epoch) {
        if (last.seq === position.seq) return row;
        continue;
      }
      if (originalEpoch === position.epoch) {
        if (originalSeq === position.seq) return row;
        continue;
      }
      if (position.seq > position.through) continue;
      const score = position.timestamp && last?.timestamp === position.timestamp ? 2 : (last?.seq ?? originalSeq) === position.seq ? 1 : 0;
      if (score > bestScore) {
        best = row;
        bestScore = score;
      }
    }
    return best;
  }
  publishedFile(input2) {
    const body = input2.content.trim();
    const rows = this.db.prepare(`SELECT v.artifact,v.version,v.content,a.deleted FROM artifact_listing a JOIN versions v ON v.artifact=a.id
      WHERE a.session=? AND v.format=? AND json_extract(v.origin,'$.kind')='publish'`).iterate(input2.sessionId, input2.format);
    let first, ambiguous = false, deleted;
    for (const row of rows) {
      if (String(row.content).trim() !== body) continue;
      if (!first || row.artifact === first.artifact && Number(row.version) > first.version) first = row;
      else if (row.artifact !== first.artifact) ambiguous = true;
      if (row.deleted) deleted = row;
    }
    return ambiguous ? deleted && { ...deleted, ambiguous: true } : first;
  }
  commit(input2, locale = this.hostLocale) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const requestHash = hash(input2.request);
      const previous = input2.replay ? this.replayRequest(input2, requestHash) : this.row("SELECT * FROM requests WHERE id=?", input2.idemKey);
      const requestOrigin = input2.replay ? { ...input2.origin, replay: input2.replay } : input2.origin.kind === "extract" && input2.origin.blockIndex !== void 0 ? { ...input2.origin, providerMessageId: true } : input2.origin;
      if (previous) {
        if (input2.replay) {
          const origin = JSON.parse(previous.origin);
          const observed = JSON.stringify({ ...origin, replay: input2.replay, observedLegacyId: input2.origin.legacyId });
          if (previous.origin !== observed) this.db.prepare("UPDATE requests SET origin=? WHERE id=?").run(observed, previous.id);
        }
        this.db.exec("COMMIT");
        return previous.hash === requestHash ? { status: "ok", artifactId: previous.artifact, version: previous.version, alias: !!previous.alias } : { status: "conflict", artifactId: previous.artifact, version: previous.version, reason: "idempotency" };
      }
      const publisher = input2.inferredKey && input2.origin.kind === "extract" ? this.publishedFile(input2) : void 0;
      if (publisher) {
        if (publisher.ambiguous) {
          this.db.exec("COMMIT");
          return { status: "conflict", artifactId: publisher.artifact, version: publisher.version, reason: "deleted" };
        }
        this.db.prepare("INSERT INTO requests VALUES(?,?,?,?,?,1)").run(input2.idemKey, requestHash, publisher.artifact, publisher.version, JSON.stringify(requestOrigin));
        this.db.exec("COMMIT");
        return { status: "ok", artifactId: publisher.artifact, version: publisher.version, alias: true };
      }
      const artifact2 = input2.artifactId ? this.row("SELECT * FROM artifacts WHERE id=? AND session=?", input2.artifactId, input2.sessionId) : input2.key ? this.row("SELECT * FROM artifacts WHERE session=? AND key=?", input2.sessionId, input2.key) : void 0;
      if (artifact2 && this.row("SELECT artifact FROM artifact_settings WHERE artifact=? AND deleted=1", artifact2.id)) {
        this.db.exec("COMMIT");
        return { status: "conflict", artifactId: artifact2.id, version: artifact2.head, reason: "deleted" };
      }
      if (input2.artifactId && !artifact2) throw new Error(localized(locale, "Artifact not found in this conversation.", "\uC774 \uB300\uD654\uC5D0\uC11C \uC544\uD2F0\uD329\uD2B8\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"));
      if (artifact2 && input2.key && artifact2.key !== input2.key) throw new Error(localized(locale, "artifactId and key refer to different artifacts.", "artifactId\uC640 key\uAC00 \uC11C\uB85C \uB2E4\uB978 \uACB0\uACFC\uBB3C\uC744 \uAC00\uB9AC\uD0B5\uB2C8\uB2E4"));
      if (input2.baseVersion !== void 0 && artifact2?.head !== input2.baseVersion) {
        this.db.exec("COMMIT");
        return { status: "conflict", artifactId: artifact2?.id ?? null, version: artifact2?.head ?? 0, reason: "baseVersion" };
      }
      const contentHash2 = contentHash(input2.content), turn = input2.origin.turnId;
      const candidates = input2.origin.kind === "extract" && !input2.inferredKey && turn ? this.rows(`SELECT v.*, a.key, a.session FROM versions v JOIN artifacts a ON a.id=v.artifact
        WHERE a.session=? AND v.hash=? AND v.format=? AND json_extract(v.origin,'$.kind')='publish' AND json_extract(v.origin,'$.turnId')=?`, input2.sessionId, contentHash2, input2.format, turn).filter((row) => row.content === input2.content && (!input2.key || input2.inferredKey || row.key === input2.key)) : [];
      const candidate = input2.key && !input2.inferredKey ? candidates.sort((a, b) => b.version - a.version)[0] : candidates.length === 1 ? candidates[0] : void 0;
      if (candidate) {
        this.db.prepare("INSERT INTO requests(id,hash,artifact,version,origin,alias) VALUES(?,?,?,?,?,1)").run(input2.idemKey, requestHash, candidate.artifact, candidate.version, JSON.stringify(requestOrigin));
        this.db.exec("COMMIT");
        return { status: "ok", artifactId: candidate.artifact, version: candidate.version, alias: true };
      }
      const sourceTime = input2.origin.kind === "extract" && input2.sourceTimestamp ? Date.parse(input2.sourceTimestamp) : NaN;
      if (artifact2 && Number.isFinite(sourceTime)) {
        const head = this.row("SELECT origin,created FROM versions WHERE artifact=? AND version=?", artifact2.id, artifact2.head);
        if (head) {
          const origin = JSON.parse(head.origin);
          const sameTurn = input2.origin.turnId && origin.turnId === input2.origin.turnId;
          const headTime = Date.parse(origin.kind === "extract" ? origin.sourceTimestamp : head.created);
          if (!sameTurn && sourceTime < headTime) {
            this.db.exec("COMMIT");
            return { status: "conflict", artifactId: artifact2.id, version: artifact2.head, reason: "staleSource" };
          }
        }
      }
      const id2 = artifact2?.id ?? ulid(), version2 = (artifact2?.head ?? 0) + 1, timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const key = artifact2?.key ?? input2.key ?? `artifact-${id2.toLowerCase()}`;
      if (!artifact2) this.db.prepare("INSERT INTO artifacts VALUES(?,?,?,?,?,?,?)").run(id2, input2.sessionId, key, input2.title, input2.format, version2, timestamp);
      else this.db.prepare("UPDATE artifacts SET title=?,format=?,head=?,updated=? WHERE id=?").run(input2.title, input2.format, version2, timestamp, id2);
      this.db.prepare("INSERT INTO versions VALUES(?,?,?,?,?,?,?,?,?)").run(id2, version2, version2 - 1, input2.title, input2.format, input2.content, contentHash2, JSON.stringify(Number.isFinite(sourceTime) ? { ...input2.origin, sourceTimestamp: input2.sourceTimestamp } : input2.origin), timestamp);
      this.db.prepare("INSERT INTO requests VALUES(?,?,?,?,?,0)").run(input2.idemKey, requestHash, id2, version2, JSON.stringify(requestOrigin));
      const settings = this.row("SELECT display_title,pinned FROM artifact_settings WHERE artifact=?", id2);
      const payload = { ...input2.historyOnly ? {} : { liveDelivery: this.deliveryWindow(input2.sessionId) }, artifactId: id2, artifactVersion: version2, title: settings?.display_title ?? input2.title, format: input2.format, originKind: input2.origin.kind, ...settings?.pinned ? { pinned: true } : {} };
      this.db.prepare("INSERT INTO outbox(id,session,payload,state) VALUES(?,?,?,?)").run(noticeId(id2, version2), input2.sessionId, JSON.stringify(payload), input2.historyOnly ? "history" : "pending");
      this.db.exec("COMMIT");
      return { status: "ok", artifactId: id2, version: version2, alias: false };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  readySessions(now = Date.now()) {
    return this.rows("SELECT DISTINCT session FROM outbox WHERE state='pending' AND next<=?", now).map((row) => row.session);
  }
  pending(now = Date.now(), limit = 50, held = [], sessionId) {
    return this.rows(`SELECT * FROM outbox WHERE state='pending' AND next<=?
      AND id NOT IN (SELECT value FROM json_each(?))
      AND (? IS NULL OR session=?) ORDER BY rowid LIMIT ?`, now, JSON.stringify(held), sessionId ?? null, sessionId ?? null, limit).map((row) => ({ id: row.id, sessionId: row.session, payload: JSON.parse(row.payload), attempts: row.attempts }));
  }
  isFailed(id2) {
    return !!this.row("SELECT 1 FROM outbox WHERE id=? AND state='failed'", id2);
  }
  hasNotices(sessionId) {
    return !!this.row("SELECT 1 FROM outbox WHERE session=? LIMIT 1", sessionId);
  }
  isPending(item) {
    return !!this.row("SELECT 1 FROM outbox WHERE id=? AND state='pending' AND payload=?", item.id, JSON.stringify(item.payload));
  }
  noticeSessions() {
    return this.rows("SELECT DISTINCT session FROM outbox").map((row) => row.session);
  }
  historical(item) {
    this.db.prepare("UPDATE outbox SET state='history' WHERE id=? AND state='pending' AND payload=?").run(item.id, JSON.stringify(item.payload));
  }
  placementSources(sessionId) {
    return this.rows(`SELECT o.id,o.payload,v.hash,v.origin,
      (SELECT min(r.origin) FROM requests r WHERE r.artifact=v.artifact AND r.version=v.version AND r.alias=1
         AND json_extract(r.origin,'$.kind')='extract' AND json_extract(r.origin,'$.blockIndex') IS NOT NULL
         AND json_extract(r.origin,'$.turnId')=json_extract(v.origin,'$.turnId')
       HAVING count(DISTINCT json_array(json_extract(r.origin,'$.messageId'),json_extract(r.origin,'$.blockIndex')))=1) AS fence
      FROM outbox o JOIN versions v
      ON v.artifact=json_extract(o.payload,'$.artifactId') AND v.version=json_extract(o.payload,'$.artifactVersion')
      WHERE o.session=? ORDER BY o.rowid`, sessionId).map((row) => ({
      id: String(row.id),
      notice: JSON.parse(row.payload),
      hash: String(row.hash),
      origin: JSON.parse(row.origin),
      fence: row.fence ? JSON.parse(row.fence) : void 0
    }));
  }
  publishRequests(sessionId) {
    const ids = /* @__PURE__ */ new Map();
    for (const row of this.rows(`SELECT r.id,r.artifact,r.version FROM requests r JOIN artifacts a ON a.id=r.artifact
      WHERE a.session=? AND json_extract(r.origin,'$.kind')='publish'`, sessionId)) {
      try {
        const key = JSON.parse(row.id);
        if (Array.isArray(key) && key[0] === "publish" && key[1] === sessionId && typeof key[2] === "string")
          ids.set(key[2], noticeId(row.artifact, row.version));
      } catch {
      }
    }
    return ids;
  }
  notices(sessionId, deliveredOnly = false) {
    return this.rows("SELECT * FROM outbox WHERE session=? AND (?=0 OR state='delivered') ORDER BY rowid", sessionId, Number(deliveredOnly)).map((row) => ({ id: row.id, sessionId: row.session, payload: JSON.parse(row.payload), attempts: row.attempts }));
  }
  delivered(id2, payload) {
    if (payload) this.db.prepare("UPDATE outbox SET state='delivered' WHERE id=? AND payload=?").run(id2, JSON.stringify(payload));
    else this.db.prepare("UPDATE outbox SET state='delivered' WHERE id=?").run(id2);
  }
  retry(item, now) {
    const attempts = item.attempts + 1, state2 = attempts >= MAX_NOTICE_ATTEMPTS ? "failed" : "pending";
    const next2 = state2 === "failed" ? 0 : now + 1e3 * 2 ** Math.min(attempts, 8);
    const updated = this.db.prepare("UPDATE outbox SET state=?,attempts=?,next=? WHERE id=? AND state='pending' AND attempts=? AND payload=?").run(state2, attempts, next2, item.id, item.attempts, JSON.stringify(item.payload));
    return updated.changes ? state2 : void 0;
  }
  requeueFailed(sessionId) {
    this.db.prepare("UPDATE outbox SET state='pending',attempts=0,next=0 WHERE session=? AND state='failed'").run(sessionId);
  }
  failedNotices(sessionId, cursor = "", limit = 40) {
    const rows = this.rows("SELECT id,attempts,json_extract(payload,'$.artifactId') AS artifactId,json_extract(payload,'$.artifactVersion') AS version FROM outbox WHERE state='failed' AND session=? AND id>? ORDER BY id LIMIT ?", sessionId, cursor, limit + 1);
    return { items: rows.slice(0, limit).map((row) => ({ id: row.id, artifactId: row.artifactId, version: row.version, attempts: row.attempts })), cursor: rows.length > limit ? rows[limit - 1].id : null };
  }
};

// server/timeline-pages.ts
function checkTimelinePage(page2, epoch, locale) {
  if (!epoch || page2.error || page2.epoch !== epoch || page2.staleCursor || page2.gap || page2.reset) {
    throw new Error(localized(
      locale,
      "Conversation history changed. Fetch it again to continue.",
      "\uB300\uD654 \uAE30\uB85D\uC774 \uBCC0\uACBD\uB410\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC870\uD68C\uD558\uC138\uC694."
    ));
  }
}
async function* timelinePages(timeline, maxPages = Infinity, locale) {
  let page2 = await timeline.refetch({ direction: "tail", limit: 200 });
  const epoch = page2.epoch;
  const cursors = /* @__PURE__ */ new Set();
  for (let count = 1; ; count++) {
    checkTimelinePage(page2, epoch, locale);
    yield page2;
    if (!page2.hasOlder || count >= maxPages) return;
    const cursor = page2.startCursor;
    const key = JSON.stringify(cursor);
    if (!cursor || cursors.has(key)) throw new Error(localized(
      locale,
      "Invalid conversation history cursor.",
      "\uB300\uD654 \uAE30\uB85D\uC744 \uC774\uC5B4\uC11C \uC870\uD68C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
    ));
    cursors.add(key);
    page2 = await timeline.refetch({ direction: "before", limit: 200, cursor });
  }
}

// shared/artifacts.ts
var MAX_SOURCE_LENGTH = 512e3;
function fingerprint(value) {
  let hash2 = 2166136261;
  for (let i = 0; i < value.length; i++) hash2 = Math.imul(hash2 ^ value.charCodeAt(i), 16777619);
  return (hash2 >>> 0).toString(36);
}
function attribute(info, key) {
  return new RegExp(`(?:^|\\s)${key}=(?:"([^"]+)"|'([^']+)'|([^\\s]+))`, "i").exec(info)?.slice(1).find(Boolean);
}
function extractedTitle(authored, en, ko, locale) {
  return authored === void 0 ? { title: localized(locale, en, ko), legacyDefaultTitle: ko } : { title: authored.slice(0, 100) };
}
function extractArtifacts(text, sourceId, locale) {
  const found = [];
  const fencedRanges = [];
  const fence = /^([ \t]*)(`{3,}|~{3,})([^\r\n]*)\r?\n/gm;
  let match2;
  while ((match2 = fence.exec(text)) && found.length < 12) {
    const info = match2[3].trim(), language = info.split(/\s+/)[0].toLowerCase();
    const close = new RegExp(`^[ \\t]*${match2[2][0]}{${match2[2].length},}[ \\t]*\\r?$`, "gm");
    close.lastIndex = fence.lastIndex;
    const end = close.exec(text), code = text.slice(fence.lastIndex, end?.index ?? text.length).trim();
    fence.lastIndex = end ? close.lastIndex : text.length;
    fencedRanges.push([match2.index, fence.lastIndex]);
    const kind = ["html", "htm", "svg"].includes(language) ? "html" : ["jsx", "tsx", "react"].includes(language) ? "react" : null;
    if (!kind || !code || code.length > MAX_SOURCE_LENGTH) continue;
    if (kind === "html" && !/<(?:!doctype|html|body|main|div|svg|section|style|script|h[1-6]|canvas)\b/i.test(code)) continue;
    if (kind === "react" && !/\b(?:export|function|const|class|import)\b/.test(code)) continue;
    const marker = /(?:<!--|\/\/)\s*artifact:\s*([a-zA-Z0-9][\w.-]{0,79})/.exec(code)?.[1];
    const supplied = attribute(info, "artifact") ?? marker;
    const explicit = !!supplied && /^[a-zA-Z0-9][\w.-]{0,79}$/.test(supplied);
    const authored = attribute(info, "title") ?? (kind === "html" ? /<title[^>]*>([^<]+)<\/title>/i.exec(code)?.[1] : void 0);
    const label = kind === "html" ? "HTML" : "React", index = found.length + 1;
    const title = extractedTitle(authored, `${label} artifact ${index}`, `${label} \uC544\uD2F0\uD329\uD2B8 ${index}`, locale);
    found.push({ id: explicit ? supplied : `${sourceId}:${found.length}`, ...title, kind, code, complete: !!end, explicit, sourceRange: [match2.index, end ? close.lastIndex : text.length] });
  }
  const xml = /<(antArtifact|artifact)\b([^>]*)>/gi;
  while ((match2 = xml.exec(text)) && found.length < 12) {
    if (fencedRanges.some((range) => match2.index >= range[0] && match2.index < range[1])) continue;
    const info = match2[2], mime = attribute(info, "type")?.toLowerCase();
    const kind = mime === "application/vnd.ant.react" || mime === "react" ? "react" : ["text/html", "image/svg+xml", "html", "svg"].includes(mime ?? "") ? "html" : null;
    if (!kind) continue;
    const close = new RegExp(`</${match2[1]}\\s*>`, "gi");
    close.lastIndex = xml.lastIndex;
    const end = close.exec(text), raw = text.slice(xml.lastIndex, end?.index ?? text.length).trim();
    const code = raw.replace(/^```(?:html|tsx|jsx|react|svg)?[^\n]*\n([\s\S]*?)\n```$/, "$1");
    const id2 = attribute(info, "identifier") ?? attribute(info, "id"), explicit = !!id2 && /^[a-zA-Z0-9][\w.-]{0,79}$/.test(id2);
    if (code && code.length <= MAX_SOURCE_LENGTH) {
      const range = [match2.index, end ? close.lastIndex : text.length];
      for (let i = found.length - 1; i >= 0; i--) if (found[i].sourceRange && found[i].sourceRange[0] >= range[0] && found[i].sourceRange[1] <= range[1]) found.splice(i, 1);
      const title = extractedTitle(attribute(info, "title"), "Artifact", "\uC544\uD2F0\uD329\uD2B8", locale);
      found.push({ id: explicit ? id2 : `${sourceId}:xml:${found.length}`, ...title, kind, code, complete: !!end, explicit, sourceRange: range });
    }
    xml.lastIndex = end ? close.lastIndex : text.length;
  }
  return found.sort((a, b) => (a.sourceRange?.[0] ?? 0) - (b.sourceRange?.[0] ?? 0));
}

// server/card-placements.ts
var publishNames = /* @__PURE__ */ new Set(["paseo.artifact_publish", "mcp__paseo__artifact_publish", "artifact_publish"]);
function object(value) {
  return value !== null && typeof value === "object" ? value : void 0;
}
function collect(entry, requests, live) {
  const { item } = entry;
  const turn = entry.turnId ?? void 0;
  if (item.type === "user_message") return { type: "user" };
  if (item.type === "plugin" && item.pluginId === "paseo-artifact-viewer" && item.kind === "artifact" && item.version === 1 && object(item.data)?.placement === "live") {
    live.add(item.id);
  }
  if (item.type === "assistant_message") {
    const blocks = extractArtifacts(item.text, item.messageId ?? "").map((block) => block.complete ? contentHash(block.code) : "");
    return { type: "reply", turn, reply: { id: item.messageId, textHash: fingerprint(item.text), blocks } };
  }
  if (item.type !== "tool_call" || item.status !== "completed" || item.detail.type !== "unknown" || !publishNames.has(item.name)) return;
  const id2 = object(item.detail.input)?.requestId;
  const card = typeof id2 === "string" && requests.get(id2);
  if (!card) return;
  const output = object(item.detail.output);
  const result = object(output?.structuredContent);
  if (output?.isError === true || result?.status === "conflict") return;
  if (result?.artifactId && (typeof result.artifactId !== "string" || typeof result.version !== "number" || card !== noticeId(result.artifactId, result.version))) return;
  return { type: "publish", card, turn };
}
function remember(index, key, candidate) {
  if (!index.has(key)) index.set(key, candidate);
  else if (index.get(key) !== candidate) index.set(key, null);
}
function indexReplies(events, currentTurnRunning) {
  const byId = /* @__PURE__ */ new Map(), byTurn = /* @__PURE__ */ new Map(), byCall = /* @__PURE__ */ new Map();
  let completed = !currentTurnRunning;
  let next2 = null;
  let nextTurn;
  let answers = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    const event2 = events[i];
    if (event2.type === "user") {
      completed = true;
      answers = 0;
      next2 = null;
      nextTurn = void 0;
    } else if (event2.type === "reply") {
      if (event2.reply.id) remember(byId, event2.reply.id, event2.reply);
      if (!completed) continue;
      answers++;
      next2 = event2.reply;
      nextTurn = event2.turn;
      if (event2.turn) remember(byTurn, event2.turn, next2);
    } else if (completed) {
      const sameTurn = !event2.turn || !nextTurn || event2.turn === nextTurn;
      remember(byCall, event2.card, answers === 1 && sameTurn ? next2 : null);
    }
  }
  return { byId, byTurn, byCall };
}
function locate(source, index) {
  const { id: id2, origin, hash: hash2, fence } = source;
  if (origin.kind === "edit") return;
  const fencedReply = fence?.messageId ? index.byId.get(fence.messageId) : void 0;
  if (fencedReply && fence?.blockIndex !== void 0 && fencedReply.blocks[fence.blockIndex] === hash2) {
    return { reply: fencedReply, blockIndex: fence.blockIndex };
  }
  let reply;
  if (origin.kind === "extract") reply = index.byId.get(origin.messageId ?? "");
  else if (index.byCall.has(id2)) reply = index.byCall.get(id2);
  else reply = index.byTurn.get(origin.turnId ?? "");
  if (!reply?.id || index.byId.get(reply.id) !== reply) return;
  if (origin.blockIndex !== void 0) {
    if (reply.blocks[origin.blockIndex] === hash2) return { reply, blockIndex: origin.blockIndex };
    return;
  }
  const match2 = reply.blocks.indexOf(hash2);
  const uniqueBlock = match2 >= 0 && reply.blocks.lastIndexOf(hash2) === match2;
  return { reply, blockIndex: uniqueBlock ? match2 : void 0 };
}
function resolve2(sources, events, live, sessionId, running) {
  const index = indexReplies(events, running);
  const items = [];
  for (const source of sources) {
    const location = locate(source, index);
    if (!location?.reply.id || live.has(source.id) && location.blockIndex === void 0) continue;
    const { reply, blockIndex } = location;
    items.push({ sessionId, messageId: location.reply.id, textHash: reply.textHash, notice: source.notice, blockIndex });
  }
  return items;
}
async function readCardPlacements(repo, sessionId, timeline) {
  const sources = repo.placementSources(sessionId);
  if (!sources.length) return [];
  const requests = repo.publishRequests(sessionId);
  const live = /* @__PURE__ */ new Set();
  const pages = [];
  let epoch = "";
  let end;
  let running = false;
  for await (const page2 of timelinePages(timeline)) {
    if (pages.length === 0) {
      if (page2.agent?.status === "initializing" || page2.agent && !page2.entries.length && !page2.hasOlder) {
        throw new Error("Conversation history is not ready to locate saved cards");
      }
      epoch = page2.epoch;
      end = page2.endCursor;
      running = page2.agent?.status === "running";
    }
    pages.push(page2.entries.flatMap((entry) => collect(entry, requests, live) ?? []));
  }
  if (pages.length > 1) {
    const tail = await timeline.refetch({ direction: "tail", limit: 1 });
    checkTimelinePage(tail, epoch);
    if (JSON.stringify(tail.endCursor) !== JSON.stringify(end)) {
      throw new Error("Conversation changed while locating artifact cards");
    }
  }
  return resolve2(sources, pages.reverse().flat(), live, sessionId, running);
}

// server/placement-queries.ts
var PlacementQueries = class {
  constructor(catalog) {
    this.catalog = catalog;
    this.verified = /* @__PURE__ */ new Map();
    this.pending = /* @__PURE__ */ new Map();
    this.invalidated = /* @__PURE__ */ new Set();
    this.listeners = /* @__PURE__ */ new Set();
    this.closed = false;
  }
  subscribe(push, signal) {
    if (signal.aborted || this.closed) return;
    this.listeners.add(push);
    signal.addEventListener("abort", () => this.listeners.delete(push), { once: true });
  }
  invalidate(sessionId) {
    if (this.closed) return;
    this.verified.delete(sessionId);
    if (this.pending.has(sessionId)) this.invalidated.add(sessionId);
    if (this.catalog.hasNotices(sessionId)) {
      for (const push of this.listeners) {
        void Promise.resolve().then(() => push({ sessionId })).catch(() => {
        });
      }
    }
  }
  async read(sessionId, paseo) {
    if (this.closed) throw new Error("Artifact placement queries have stopped");
    if (!sessionId) return { items: [...this.verified.values()].flat(), sessions: this.catalog.noticeSessions() };
    let read = this.pending.get(sessionId);
    if (!read) {
      read = this.verify(sessionId, paseo.agents.ref(sessionId).timeline);
      this.pending.set(sessionId, read);
    }
    return { items: await read };
  }
  async verify(sessionId, timeline) {
    try {
      do {
        this.invalidated.delete(sessionId);
        try {
          const items = await readCardPlacements(this.catalog, sessionId, timeline);
          if (!this.invalidated.has(sessionId)) {
            if (!this.closed) this.verified.set(sessionId, items);
            return items;
          }
        } catch (error) {
          if (!this.invalidated.has(sessionId)) throw error;
        }
      } while (!this.closed);
      throw new Error("Artifact placement queries have stopped");
    } finally {
      this.pending.delete(sessionId);
      this.invalidated.delete(sessionId);
    }
  }
  async stop() {
    this.closed = true;
    this.listeners.clear();
    await Promise.allSettled(this.pending.values());
    this.verified.clear();
  }
};

// server/service.ts
import { z as z2 } from "zod";

// server/linked-files.ts
import { posix, win32 } from "node:path";
import { fileURLToPath } from "node:url";
var artifactWord = /아티팩트|아티펙트|\bartifacts?\b/i;
function fileKey(value, cwd) {
  const paths = /^[a-z]:[/\\]|^\\\\/i.test(cwd || value) ? win32 : posix;
  const path = paths.isAbsolute(value) || !cwd ? paths.normalize(value) : paths.resolve(cwd, value);
  return paths === win32 ? path.replaceAll("\\", "/").toLowerCase() : path;
}
function linkTarget(raw) {
  const name = raw.trim().replace(/^<|>$/g, "").replace(/#L\d+(?:-L?\d+)?$/i, "");
  try {
    if (/^file:\/\//i.test(name)) return fileURLToPath(name);
    if (/^[a-z][\w+.-]*:/i.test(name) && !/^[a-z]:[/\\]/i.test(name)) return null;
    return decodeURIComponent(name);
  } catch {
    return null;
  }
}
function formatOf(path) {
  if (/\.html?$/i.test(path)) return "html";
  if (/\.svg$/i.test(path)) return "svg";
  if (/\.[jt]sx$/i.test(path)) return "react";
}
var LinkedFiles = class {
  constructor(cwd) {
    this.cwd = cwd;
    this.snapshots = /* @__PURE__ */ new Map();
    this.askedForArtifact = false;
  }
  observe(item) {
    if (item.type === "user_message") {
      this.snapshots.clear();
      this.askedForArtifact = artifactWord.test(item.text);
      return;
    }
    if (item.type !== "tool_call" || item.status !== "completed") return;
    const d = item.detail;
    if (d.type !== "edit" && d.type !== "write") return;
    const path = fileKey(d.filePath, this.cwd), format = formatOf(path);
    if (!format) return;
    const before = this.snapshots.get(path)?.content;
    this.snapshots.delete(path);
    let content = d.type === "write" ? d.content : d.newString;
    if (content === void 0 || content.length > MAX_SOURCE_LENGTH || !content && (d.type !== "edit" || !d.oldString)) return;
    if (d.type === "edit" && d.oldString) {
      if (!before || before.indexOf(d.oldString) < 0 || before.indexOf(d.oldString) !== before.lastIndexOf(d.oldString)) return;
      const replacement = content;
      content = before.replace(d.oldString, () => replacement);
    } else if (d.type === "edit") {
      if (d.unifiedDiff || !(format === "html" ? /^\s*(?:<!doctype\s+html\b|<html\b)/i.test(content) && /<\/html>\s*$/i.test(content) : format === "svg" ? /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(content) && /(?:<\/svg>|\/>)\s*$/i.test(content) : /\bexport\s+default\b/.test(content))) return;
    }
    if (content && content.length <= MAX_SOURCE_LENGTH) this.snapshots.set(path, { path, content, format, callId: item.callId });
  }
  deliveries(reply) {
    const files = /* @__PURE__ */ new Map();
    if (!this.snapshots.size) return [];
    for (const match2 of reply.matchAll(/\[([^\]\n]+)\]\((<[^>\n]+>|(?:[^()\n]|\([^()\n]*\))+)\)/g)) {
      const [, label, raw] = match2;
      if (!this.askedForArtifact && !artifactWord.test(label)) continue;
      const name = linkTarget(raw);
      const file = name && this.snapshots.get(fileKey(name, this.cwd));
      if (!file) continue;
      const docTitle = file.format !== "react" && /<title\b[^>]*>([^<]+)<\/title>/i.exec(file.content)?.[1];
      const title = (docTitle || label).trim().slice(0, 100) || posix.basename(file.path).slice(0, 100);
      files.set(file.path, { ...file, title });
    }
    return [...files.values()];
  }
};

// server/import-history.ts
async function importHistory(repository, sessionId, handle, ending, currentTurn, stopped, log) {
  const turnToken = ending?.token ?? null;
  const providerTurnId = ending?.providerId ?? null;
  const waitingForTurnEnd = () => !ending && !!currentTurn();
  if (stopped() || waitingForTurnEnd()) return { committed: 0, conflicts: 0, truncated: false };
  const entries = [];
  let epoch = "", truncated = false;
  for await (const page2 of timelinePages(handle.timeline, 5, repository.hostLocale)) {
    epoch = page2.epoch;
    truncated = !!page2.hasOlder;
    entries.push(...page2.entries);
  }
  entries.sort((a, b) => a.seqStart - b.seqStart);
  const start = ending ? entries.findLastIndex((entry) => entry.item.type === "user_message") + 1 : 0;
  let committed = 0, conflicts = 0;
  let cwd = handle.cwd;
  if (!cwd && entries.some(({ item }) => item.type === "tool_call" && (item.detail.type === "edit" || item.detail.type === "write"))) {
    cwd = (await handle.refresh?.().catch(() => null))?.agent.cwd ?? null;
  }
  if (stopped() || waitingForTurnEnd()) return { committed: 0, conflicts: 0, truncated };
  const active = currentTurn();
  const overlapsNewTurn = ending !== void 0 && active !== void 0 && active.token !== turnToken;
  const linked = new LinkedFiles(cwd);
  const last = entries.at(-1);
  const through = last ? repository.replayThrough(sessionId, epoch, last.seqStart) : 0;
  function commit(input2) {
    const result = repository.commit(input2);
    if (result.status === "ok") {
      committed++;
    } else if (result.reason !== "staleSource") {
      conflicts++;
      const label = input2.inferredKey ? "File delivery" : "Artifact extraction";
      const block = input2.origin.blockIndex === void 0 ? "" : `, block=${input2.origin.blockIndex}`;
      log(`${label} conflict(${result.reason}): session=${sessionId}, message=${input2.origin.messageId}${block}`);
    }
  }
  for (const [entryIndex, entry] of entries.entries()) {
    const item = entry.item;
    linked.observe(item);
    if (item.type !== "assistant_message") continue;
    if (overlapsNewTurn && (!providerTurnId || entry.turnId !== providerTurnId)) continue;
    const messageId = item.messageId ?? `seq:${epoch}:${entry.seqStart}`;
    const source = item.messageId ? `msg:${item.messageId}` : `seq:${entry.seqStart}`;
    const blocks = extractArtifacts(item.text, source, repository.hostLocale);
    const replay = item.messageId == null && blocks.length ? {
      epoch,
      seq: entry.seqStart,
      textHash: hash(item.text),
      timestamp: entry.timestamp,
      through
    } : void 0;
    const fallbackTurn = ending !== void 0 && entryIndex >= start && active?.token === turnToken ? turnToken : null;
    const safeTurn = entry.turnId ? entry.turnId === providerTurnId ? turnToken : entry.turnId : fallbackTurn;
    for (const [blockIndex, artifact2] of blocks.entries()) {
      if (!artifact2.complete) continue;
      const format = artifact2.kind === "react" ? "react" : /^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(artifact2.code) ? "svg" : "html";
      const key = artifact2.explicit ? artifact2.id : void 0;
      const request = { content: artifact2.code, format, title: artifact2.legacyDefaultTitle ?? artifact2.title, key: key ?? null, artifactId: null };
      const idemKey = replay ? requestKey("anonymous-extract", sessionId, messageId, blockIndex, replay.textHash) : requestKey("extract", sessionId, messageId, blockIndex);
      commit({
        sessionId,
        key,
        historyOnly: true,
        title: artifact2.title,
        format,
        content: artifact2.code,
        sourceTimestamp: entry.timestamp,
        idemKey,
        replay,
        request,
        origin: { kind: "extract", turnId: safeTurn, messageId, blockIndex, legacyId: artifact2.id }
      });
    }
    for (const file of linked.deliveries(item.text)) {
      if (blocks.some((block) => block.complete && block.code.trim() === file.content.trim())) continue;
      const key = "file-" + hash(file.path).slice(0, 32);
      commit({
        sessionId,
        key,
        historyOnly: !fallbackTurn,
        inferredKey: true,
        title: file.title,
        format: file.format,
        content: file.content,
        sourceTimestamp: entry.timestamp,
        idemKey: requestKey("file-delivery", sessionId, file.callId, file.path),
        request: { path: file.path, content: file.content },
        origin: { kind: "extract", turnId: safeTurn, messageId }
      });
    }
  }
  return { committed, conflicts, truncated };
}

// shared/contracts.ts
import { defineRpc, defineSubscription } from "@getpaseo/plugin";
import { z } from "zod";
var sessionSchema = z.string().min(1).max(256);
var formatSchema = z.enum(["html", "svg", "react"]);
var contentSchema = z.string().min(1).max(MAX_SOURCE_LENGTH);
function artifactKeySchema(locale = "en") {
  return z.string({ error: z.locales[locale]().localeError }).regex(/^[a-zA-Z0-9][\w.-]{0,79}$/, localized(
    locale,
    "Use a key of up to 80 characters starting with a letter or digit. Allowed characters are letters, digits, underscores, periods, and hyphens.",
    "key\uB294 \uC601\uBB38\xB7\uC22B\uC790\uB85C \uC2DC\uC791\uD558\uB294 80\uC790 \uC774\uD558 \uC2DD\uBCC4\uC790\uC5EC\uC57C \uD569\uB2C8\uB2E4. \uC601\uBB38\xB7\uC22B\uC790\xB7\uBC11\uC904\xB7\uB9C8\uCE68\uD45C\xB7\uD558\uC774\uD508\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
  ));
}
var keySchema = artifactKeySchema();
var originSchema = z.object({ restoredFromVersion: z.number().int().positive().optional(), kind: z.enum(["publish", "extract", "edit"]), turnId: z.string().nullable().optional(), messageId: z.string().optional(), blockIndex: z.number().int().nonnegative().optional(), legacyId: z.string().optional() });
var summarySchema = z.object({ artifactId: z.string(), sessionId: sessionSchema, key: keySchema, title: z.string(), format: formatSchema, headVersion: z.number().int().positive(), updatedAt: z.string(), legacyIds: z.array(z.string()), pinned: z.boolean().optional() });
var versionSchema = z.object({ artifactId: z.string(), version: z.number().int().positive(), parentVersion: z.number().int().nonnegative(), title: z.string(), format: formatSchema, content: z.string(), contentHash: z.string(), origin: originSchema, createdAt: z.string() });
var versionMetaSchema = versionSchema.omit({ content: true });
var mutationSchema = z.discriminatedUnion("status", [z.object({ status: z.literal("ok"), artifactId: z.string(), version: z.number().int().positive(), alias: z.boolean() }), z.object({ status: z.literal("conflict"), artifactId: z.string().nullable(), version: z.number().int().nonnegative(), reason: z.enum(["idempotency", "baseVersion", "deleted", "staleSource"]) })]);
var noticeSchema = z.object({ placement: z.enum(["live", "legacy"]).optional(), artifactId: z.string(), artifactVersion: z.number().int().positive(), title: z.string().default(""), format: formatSchema.catch("html"), originKind: originSchema.shape.kind.catch("extract"), deleted: z.boolean().optional(), pinned: z.boolean().optional(), managed: z.boolean().optional() });
var cardPlacementSchema = z.object({
  sessionId: sessionSchema,
  messageId: z.string(),
  textHash: z.string(),
  blockIndex: z.number().int().nonnegative().optional(),
  notice: noticeSchema
});
var artifactCardPlacements = defineRpc({
  name: "artifact.card_placements",
  input: z.object({ sessionId: sessionSchema.optional() }),
  output: z.object({ items: z.array(cardPlacementSchema), sessions: z.array(sessionSchema).optional() })
});
var artifactCardPlacementsChanged = defineSubscription({ name: "artifact.card_placements_changed", input: z.object({}), event: z.object({ sessionId: sessionSchema }) });
var revision = z.number().int().positive();
var requestId = z.string().min(1).max(128);
var target = { sessionId: sessionSchema, artifactId: z.string().min(1) };
var actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pin"), pinned: z.boolean() }),
  z.object({ type: z.literal("rename"), title: z.string().trim().min(1).max(100) }),
  z.object({ type: z.literal("duplicate"), version: revision, requestId }),
  z.object({ type: z.literal("delete") }),
  z.object({ type: z.literal("restore") }),
  z.object({ type: z.literal("web"), version: revision })
]);
var actionResultSchema = z.object({ artifactId: z.string(), url: z.string().url().optional() });
var artifactManage = defineRpc({ name: "artifact.manage", input: z.object({ ...target, action: actionSchema }), output: actionResultSchema });
function toolInputs(locale) {
  const errors = { error: z.locales[locale]().localeError };
  const requiredText = z.string(errors).min(1, errors);
  const version2 = z.number(errors).int(errors).positive(errors).optional();
  const format = z.enum(formatSchema.options, errors).optional();
  const publish = z.strictObject({
    requestId: requiredText.max(128, errors),
    content: requiredText.max(MAX_SOURCE_LENGTH, errors),
    format,
    kind: format.describe(localized(locale, "Compatibility alias for format", "format\uC758 \uD638\uD658 \uBCC4\uCE6D")),
    title: requiredText.max(100, errors),
    key: artifactKeySchema(locale).optional(),
    artifactId: requiredText.optional()
  }, errors).refine((input2) => !!(input2.format ?? input2.kind), localized(locale, "Supply format or kind.", "format \uB610\uB294 kind\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4"));
  return {
    publish,
    read: z.object({ artifactId: requiredText, version: version2 }, errors),
    list: z.object({ cursor: z.string(errors).optional(), limit: z.number(errors).int(errors).min(1, errors).max(100, errors).default(40) }, errors),
    open: z.object({ artifactId: requiredText.max(256, errors).optional(), version: version2 }, errors)
  };
}
var agentToolInputs = { en: toolInputs("en"), ko: toolInputs("ko") };
var publishSchema = agentToolInputs.en.publish;
var pageInput = { sessionId: sessionSchema, ...agentToolInputs.en.list.shape };
var artifactList = defineRpc({ name: "artifact.list", input: z.object(pageInput), output: z.object({ items: z.array(summarySchema), cursor: z.string().nullable(), hidden: z.array(z.string()).optional() }) });
var failedNotices = defineRpc({
  name: "artifact.failed_notices",
  input: z.object(pageInput),
  output: z.object({ items: z.array(z.object({ id: z.string(), artifactId: z.string(), version: revision, attempts: z.number().int().nonnegative() })), cursor: z.string().nullable() })
});
var artifactGet = defineRpc({ name: "artifact.get", input: agentToolInputs.en.read.extend({ sessionId: sessionSchema }), output: z.object({ artifact: summarySchema, version: versionSchema }).nullable() });
var artifactHistory = defineRpc({ name: "artifact.history", input: z.object({ ...pageInput, artifactId: z.string() }), output: z.object({ items: z.array(versionMetaSchema), cursor: z.string().nullable() }) });
var artifactRestoreVersion = defineRpc({
  name: "artifact.restore_version",
  input: z.object({ ...target, version: revision, baseVersion: revision, clientMutationId: requestId }),
  output: mutationSchema
});
var artifactSaveEdit = defineRpc({ name: "artifact.save_edit", input: z.object({ sessionId: sessionSchema, artifactId: z.string(), baseVersion: z.number().int().positive(), content: contentSchema, clientMutationId: z.string().min(1).max(128) }), output: mutationSchema });
var artifactBackfill = defineRpc({ name: "artifact.backfill", input: z.object({ sessionId: sessionSchema }), output: z.object({ committed: z.number().int().nonnegative(), conflicts: z.number().int().nonnegative(), truncated: z.boolean() }) });

// server/service.ts
var ArtifactService = class {
  constructor(repository, log = console.warn) {
    this.repository = repository;
    this.log = log;
    this.clients = /* @__PURE__ */ new Map();
    this.pumps = /* @__PURE__ */ new Map();
    this.queues = /* @__PURE__ */ new Map();
    this.stopped = false;
    this.activeTurns = /* @__PURE__ */ new Map();
    this.placements = new PlacementQueries(repository);
  }
  bind(sessionId, paseo) {
    this.clients.set(sessionId, paseo);
  }
  beginTurn(sessionId, providerTurnId) {
    const active = this.activeTurns.get(sessionId);
    if (providerTurnId && active?.providerTurnId === providerTurnId) return;
    this.repository.resetWindow(sessionId);
    const token = providerTurnId ?? ulid();
    this.repository.beginTurn(sessionId, token);
    this.activeTurns.set(sessionId, { token, providerTurnId, cards: /* @__PURE__ */ new Set() });
  }
  endingToken(sessionId, providerTurnId) {
    const active = this.activeTurns.get(sessionId);
    if (active && (!providerTurnId || !active.providerTurnId)) return active.token;
    return providerTurnId ?? this.repository.currentTurn(sessionId);
  }
  async endTurn(sessionId, token) {
    this.repository.endTurn(sessionId, token);
    if (this.activeTurns.get(sessionId)?.token === token) this.activeTurns.delete(sessionId);
    await this.pumps.get(sessionId);
    await this.flush(void 0, Date.now(), sessionId);
  }
  async publish(sessionId, value, paseo, locale = this.repository.hostLocale ?? "en") {
    this.bind(sessionId, paseo);
    const input2 = agentToolInputs[locale].publish.parse(value), format = input2.format ?? input2.kind;
    if (input2.format && input2.kind && input2.format !== input2.kind) throw new Error(localized(locale, "format and kind must match.", "format\uACFC kind\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4"));
    const request = { content: input2.content, format, title: input2.title, key: input2.key ?? null, artifactId: input2.artifactId ?? null };
    const result = this.repository.commit({ sessionId, ...request, key: input2.key, artifactId: input2.artifactId, idemKey: requestKey("publish", sessionId, input2.requestId), request, origin: { kind: "publish", turnId: this.repository.currentTurn(sessionId) } }, locale);
    if (result.status === "ok" && !result.alias) {
      this.activeTurns.get(sessionId)?.cards.add(noticeId(result.artifactId, result.version));
    }
    await this.flush(void 0, Date.now(), sessionId);
    return result;
  }
  async saveEdit(input2, paseo) {
    this.bind(input2.sessionId, paseo);
    contentSchema.parse(input2.content, { error: z2.locales[this.repository.hostLocale ?? "en"]().localeError });
    const found = this.repository.get(input2.sessionId, input2.artifactId, input2.baseVersion);
    if (!found) throw new Error(localized(this.repository.hostLocale, "Base version not found in this conversation.", "\uC774 \uB300\uD654\uC5D0\uC11C \uAE30\uC900 \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"));
    const request = { artifactId: input2.artifactId, baseVersion: input2.baseVersion, content: input2.content };
    const result = this.repository.commit({ sessionId: input2.sessionId, artifactId: input2.artifactId, title: found.version.title, format: found.version.format, content: input2.content, baseVersion: input2.baseVersion, idemKey: requestKey("edit", input2.sessionId, input2.clientMutationId), request, origin: { kind: "edit" } });
    await this.flush(void 0, Date.now(), input2.sessionId);
    return result;
  }
  async restoreVersion(input2, paseo) {
    this.bind(input2.sessionId, paseo);
    const { sessionId, artifactId, version: version2, baseVersion, clientMutationId } = input2;
    const source = this.repository.get(sessionId, artifactId, version2)?.version;
    if (!source) throw new Error(localized(this.repository.hostLocale, "The version to restore was not found in this conversation.", "\uC774 \uB300\uD654\uC5D0\uC11C \uBCF5\uC6D0\uD560 \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"));
    if (version2 >= baseVersion) throw new Error(localized(this.repository.hostLocale, "Select an earlier version.", "\uC774\uC804 \uBC84\uC804\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694"));
    const result = this.repository.commit({
      sessionId,
      artifactId,
      baseVersion,
      title: source.title,
      format: source.format,
      content: source.content,
      idemKey: requestKey("restore-version", sessionId, clientMutationId),
      request: { artifactId, version: version2, baseVersion },
      origin: { kind: "edit", restoredFromVersion: version2 }
    });
    await this.flush(void 0, Date.now(), sessionId);
    return result;
  }
  async backfill(sessionId, paseo, turnToken = null, currentTurnOnly = false, providerTurnId = turnToken) {
    this.bind(sessionId, paseo);
    const result = await this.serial(sessionId, async () => {
      const ending = currentTurnOnly ? { token: turnToken, providerId: providerTurnId } : void 0;
      return importHistory(
        this.repository,
        sessionId,
        paseo.agents.ref(sessionId),
        ending,
        () => this.activeTurns.get(sessionId),
        () => this.stopped,
        this.log
      );
    });
    await this.flush(void 0, Date.now(), sessionId);
    return result;
  }
  async serial(sessionId, task) {
    const previous = this.queues.get(sessionId) ?? Promise.resolve();
    const current = previous.catch(() => {
    }).then(task);
    this.queues.set(sessionId, current);
    try {
      return await current;
    } finally {
      if (this.queues.get(sessionId) === current) this.queues.delete(sessionId);
    }
  }
  async flush(paseo, now = Date.now(), sessionId) {
    if (this.stopped) return;
    const sessions = sessionId === void 0 ? this.repository.readySessions(now) : [sessionId];
    await Promise.all(sessions.map((id2) => this.flushSession(id2, this.clients.get(id2) ?? paseo, now)));
  }
  async flushSession(sessionId, client, now) {
    const running = this.pumps.get(sessionId);
    if (running) return running;
    if (this.stopped || !client) return;
    const held = [...this.activeTurns.get(sessionId)?.cards ?? []];
    const pending = this.repository.pending(now, 50, held, sessionId);
    if (!pending.length) return;
    const delivery = (async () => {
      for (const item of pending) {
        if (this.stopped) break;
        await this.serial(sessionId, async () => {
          if (this.stopped || !this.repository.isPending(item) || this.activeTurns.get(sessionId)?.cards.has(item.id)) return;
          try {
            const { liveDelivery, ...payload } = item.payload;
            if (!liveDelivery || this.repository.deliveryWindow(sessionId) !== liveDelivery) {
              this.repository.historical(item);
              return;
            }
            await client.agents.ref(sessionId).timeline.append({
              type: "plugin",
              id: item.id,
              kind: "artifact",
              version: 1,
              data: { ...payload, placement: "live" }
            });
            this.repository.delivered(item.id, item.payload);
          } catch (error) {
            const state2 = this.repository.retry(item, now);
            if (state2) this.log("Artifact card " + (state2 === "failed" ? "delivery failed" : "scheduled for retry") + ": " + item.id + ", attempt=" + (item.attempts + 1) + ", " + (error instanceof Error ? error.message : error));
          }
        });
      }
    })().finally(() => {
      this.pumps.delete(sessionId);
    });
    this.pumps.set(sessionId, delivery);
    return delivery;
  }
  async stop() {
    this.stopped = true;
    await Promise.allSettled([this.placements.stop(), ...this.pumps.values(), ...this.queues.values()]);
    this.repository.close();
  }
};

// server/register.ts
import { defineAgentTool } from "@getpaseo/plugin/server";

// shared/html-policy.ts
function htmlPolicy(allowExternal, hostFrame = false) {
  const https = allowExternal ? " https:" : "";
  return [
    "default-src 'none'",
    "script-src 'unsafe-inline'" + https,
    "style-src 'unsafe-inline'" + https,
    "img-src data: blob:" + https,
    "font-src data:" + https,
    "connect-src 'none'",
    hostFrame ? "frame-src 'self' about:" : "frame-src 'none'",
    "worker-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
    "object-src 'none'"
  ].join("; ");
}
var offlineMarkupScript = String.raw`(function offlineMarkup(source) {
  if (!/https:\/\/|(?:src|href)\s*=\s*["']\/\//i.test(source)) return source;
  const template = document.createElement("template");
  template.innerHTML = source;
  const passiveHtml = new Set("a address article aside b blockquote br caption cite code dd del details div dl dt em figcaption figure footer h1 h2 h3 h4 h5 h6 header hr i kbd li main mark nav ol p pre s samp section small span strong sub summary sup table tbody td tfoot th thead time tr u ul var".split(" "));
  const passiveSvg = new Set("svg g a path circle ellipse rect line polygon polyline text tspan title desc".split(" "));
  const svgAttrs = new Set("viewBox preserveAspectRatio width height x y dx dy cx cy rx ry r x1 y1 x2 y2 d points transform opacity stroke-width text-anchor font-size".split(" "));
  const htmlAttrs = new Set("id class lang dir role aria-label colspan rowspan open".split(" "));
  const output = document.createElement("template");
  const doc = output.content.ownerDocument;
  function copy(node, parent) {
    if (node.nodeType === 3) { parent.appendChild(doc.createTextNode(node.data)); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (["script","style","link","meta","iframe","object","embed","template","noscript","base","title"].includes(tag)) return;
    const svg = node.namespaceURI === "http://www.w3.org/2000/svg";
    const keep = svg ? passiveSvg.has(tag) : passiveHtml.has(tag);
    let target = parent;
    if (keep) {
      target = svg ? doc.createElementNS(node.namespaceURI, tag) : doc.createElement(tag);
      for (const {name,value} of node.attributes) {
        if (htmlAttrs.has(name) || (tag === "a" && (name === "href" || (svg && name === "xlink:href")) && value[0] === "#") || (svg && (svgAttrs.has(name) ||
            ((name === "fill" || name === "stroke") && /^(?:#[0-9a-f]{3,8}|[a-z]+)$/i.test(value))))) target.setAttribute(name, value);
      }
      parent.appendChild(target);
    } else if (tag === "img" && node.alt) {
      parent.appendChild(doc.createTextNode(node.alt));
    }
    for (const child of node.childNodes) copy(child, target);
  }
  for (const node of template.content.childNodes) copy(node, output.content);
  return output.innerHTML;
})`;
var hashLinkScript = String.raw`(function artifactHashLinks() {
  const decode = text => { try { return decodeURIComponent(text); } catch (_) { return text; } };
  function jump(hash) {
    const raw = hash.slice(1), id = decode(raw);
    const find = name => name ? document.getElementById(name) || document.getElementsByName(name)[0] : null;
    const target = find(raw) || find(id);
    try { location.hash = hash; } catch (_) { /* the scroll below still runs */ }
    if (target) target.scrollIntoView();
    else if (!id || id.toLowerCase() === "top") scrollTo(0, 0);
  }
  addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
    const link = event.target.closest("a, area");
    const href = link && (link.getAttribute("href") ?? link.getAttribute("xlink:href"));
    if (typeof href !== "string" || href[0] !== "#") return;
    event.preventDefault();
    jump(href);
  });
})`;
var blockedResourceScript = String.raw`(function artifactBlockedResources(report) {
  const directives = /^(?:script-src|style-src|img-src|font-src)(?:-elem|-attr)?$/;
  addEventListener("securitypolicyviolation", event => {
    if (directives.test(event.effectiveDirective || "") && /^https:/i.test(event.blockedURI || "")) report();
  });
})`;

// server/web-document.ts
var TEXT = {
  en: {
    title: "Artifact document",
    region: "External resource consent",
    htmlOff: "Offline preview. External scripts, styles, images and fonts are blocked. Documents that reference external URLs first show static content.",
    htmlOn: "External HTTPS resources are allowed in this view.",
    htmlAllow: "Allow external resources",
    htmlBlock: "Block external resources",
    reactOff: "This React preview loads libraries from esm.sh. Nothing is loaded until you allow it.",
    reactOn: "Libraries are loaded from esm.sh in this view.",
    reactAllow: "Allow esm.sh and run",
    reactBlock: "Unload preview",
    idle: "Preview not loaded."
  },
  ko: {
    title: "\uC544\uD2F0\uD329\uD2B8 \uBB38\uC11C",
    region: "\uC678\uBD80 \uB9AC\uC18C\uC2A4 \uB3D9\uC758",
    htmlOff: "\uC624\uD504\uB77C\uC778 \uBBF8\uB9AC\uBCF4\uAE30\uC785\uB2C8\uB2E4. \uC678\uBD80 \uC2A4\uD06C\uB9BD\uD2B8, \uC2A4\uD0C0\uC77C, \uC774\uBBF8\uC9C0, \uAE00\uAF34\uC740 \uCC28\uB2E8\uB429\uB2C8\uB2E4. \uC678\uBD80 URL\uC744 \uCC38\uC870\uD558\uB294 \uBB38\uC11C\uB294 \uCC98\uC74C\uC5D0 \uC815\uC801 \uB0B4\uC6A9\uB9CC \uD45C\uC2DC\uB429\uB2C8\uB2E4.",
    htmlOn: "\uC774 \uD654\uBA74\uC5D0\uC11C \uC678\uBD80 HTTPS \uB9AC\uC18C\uC2A4\uB97C \uD5C8\uC6A9\uD588\uC2B5\uB2C8\uB2E4.",
    htmlAllow: "\uC678\uBD80 \uB9AC\uC18C\uC2A4 \uD5C8\uC6A9",
    htmlBlock: "\uC678\uBD80 \uB9AC\uC18C\uC2A4 \uCC28\uB2E8",
    reactOff: "\uC774 React \uBBF8\uB9AC\uBCF4\uAE30\uB294 esm.sh\uC5D0\uC11C \uB77C\uC774\uBE0C\uB7EC\uB9AC\uB97C \uBD88\uB7EC\uC635\uB2C8\uB2E4. \uD5C8\uC6A9\uD558\uAE30 \uC804\uC5D0\uB294 \uC544\uBB34\uAC83\uB3C4 \uBD88\uB7EC\uC624\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    reactOn: "\uC774 \uD654\uBA74\uC5D0\uC11C esm.sh \uB77C\uC774\uBE0C\uB7EC\uB9AC\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4.",
    reactAllow: "esm.sh \uD5C8\uC6A9 \uD6C4 \uC2E4\uD589",
    reactBlock: "\uBBF8\uB9AC\uBCF4\uAE30 \uB0B4\uB9AC\uAE30",
    idle: "\uBBF8\uB9AC\uBCF4\uAE30\uAC00 \uB85C\uB4DC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."
  }
};
var js = (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
var attr = (s) => s.replace(/[&"'<>]/g, (c) => `&#${c.charCodeAt(0)};`);
function split(source) {
  const text = source.replace(/^﻿/, "");
  const doctype = /^\s*<!doctype[^>]*>/i.exec(text);
  return doctype ? { pre: doctype[0], post: text.slice(doctype[0].length) } : { pre: "", post: text };
}
var STYLE = `*{box-sizing:border-box}html,body{height:100%;margin:0}
body{display:flex;flex-direction:column;font:13px/1.4 system-ui,sans-serif;color-scheme:light dark;background:Canvas;color:CanvasText}
.bar{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:6px 12px;border-bottom:1px solid color-mix(in srgb,CanvasText 20%,transparent)}
.bar p{margin:0}button{font:inherit;padding:4px 12px;cursor:pointer;flex:none}
.stage{position:relative;flex:1;min-height:0;background:#fff}
iframe{display:block;width:100%;height:100%;border:0;background:#fff}
.idle{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#555}
[hidden]{display:none!important}`;
var SCRIPT = `(()=>{const offlineMarkup = ${offlineMarkupScript};
const c=window.__av,f=document.getElementById("f"),b=document.getElementById("b"),m=document.getElementById("m"),i=document.getElementById("i");
let on=false;
const doc=allow=>{const p=allow?c.on:c.off;return c.pre+'<meta http-equiv="Content-Security-Policy" content="'+p+'"><script>'+c.links+'<'+'/script>'+(allow||c.react?c.post:offlineMarkup(c.post))};
const render=()=>{m.textContent=on?c.t.on:c.t.off;b.textContent=on?c.t.block:c.t.allow;
 if(c.react&&!on){f.removeAttribute("srcdoc");f.hidden=true;i.hidden=false;return}
 i.hidden=true;f.hidden=false;f.srcdoc=doc(on)};
b.addEventListener("click",e=>{if(!e.isTrusted)return;on=!on;render()});
render()})();`;
function webDocument(content, format, locale) {
  const t2 = /^ko\b/i.test(String(locale).replace(/_/g, "-")) ? TEXT.ko : TEXT.en;
  const react = format === "react";
  const body = format === "svg" ? { pre: "<!doctype html>", post: `<style>html,body{margin:0}svg{max-width:100%;height:auto}</style>${content.replace(/^﻿?\s*<\?xml[^>]*\?>/i, "")}` } : split(content);
  const consented = htmlPolicy(true).replace("script-src 'unsafe-inline'", react ? "script-src 'unsafe-inline' blob:" : "script-src 'unsafe-inline'");
  const config = {
    ...body,
    react,
    links: "(" + hashLinkScript + ")();",
    off: htmlPolicy(false),
    on: consented,
    t: react ? { off: t2.reactOff, on: t2.reactOn, allow: t2.reactAllow, block: t2.reactBlock } : { off: t2.htmlOff, on: t2.htmlOn, allow: t2.htmlAllow, block: t2.htmlBlock }
  };
  const lang = t2 === TEXT.ko ? "ko" : "en";
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob: https:; style-src 'unsafe-inline' https:; img-src data: blob: https:; font-src data: https:; connect-src 'none'; frame-src about:; base-uri 'none'; form-action 'none'; object-src 'none'"><title>${attr(t2.title)}</title><style>${STYLE}</style></head><body><div class="bar" role="region" aria-label="${attr(t2.region)}"><p id="m" aria-live="polite"></p><button id="b" type="button"></button></div><div class="stage"><iframe id="f" title="${attr(t2.title)}" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe><div id="i" class="idle" hidden>${attr(t2.idle)}</div></div><script>window.__av=${js(config)};${SCRIPT}</script></body></html>`;
}

// server/web-preview.ts
import { createServer } from "node:http";
import { randomBytes as randomBytes2 } from "node:crypto";

// node_modules/sucrase/dist/esm/parser/tokenizer/keywords.js
var ContextualKeyword;
(function(ContextualKeyword2) {
  const NONE = 0;
  ContextualKeyword2[ContextualKeyword2["NONE"] = NONE] = "NONE";
  const _abstract = NONE + 1;
  ContextualKeyword2[ContextualKeyword2["_abstract"] = _abstract] = "_abstract";
  const _accessor = _abstract + 1;
  ContextualKeyword2[ContextualKeyword2["_accessor"] = _accessor] = "_accessor";
  const _as = _accessor + 1;
  ContextualKeyword2[ContextualKeyword2["_as"] = _as] = "_as";
  const _assert = _as + 1;
  ContextualKeyword2[ContextualKeyword2["_assert"] = _assert] = "_assert";
  const _asserts = _assert + 1;
  ContextualKeyword2[ContextualKeyword2["_asserts"] = _asserts] = "_asserts";
  const _async = _asserts + 1;
  ContextualKeyword2[ContextualKeyword2["_async"] = _async] = "_async";
  const _await = _async + 1;
  ContextualKeyword2[ContextualKeyword2["_await"] = _await] = "_await";
  const _checks = _await + 1;
  ContextualKeyword2[ContextualKeyword2["_checks"] = _checks] = "_checks";
  const _constructor = _checks + 1;
  ContextualKeyword2[ContextualKeyword2["_constructor"] = _constructor] = "_constructor";
  const _declare = _constructor + 1;
  ContextualKeyword2[ContextualKeyword2["_declare"] = _declare] = "_declare";
  const _enum = _declare + 1;
  ContextualKeyword2[ContextualKeyword2["_enum"] = _enum] = "_enum";
  const _exports = _enum + 1;
  ContextualKeyword2[ContextualKeyword2["_exports"] = _exports] = "_exports";
  const _from = _exports + 1;
  ContextualKeyword2[ContextualKeyword2["_from"] = _from] = "_from";
  const _get = _from + 1;
  ContextualKeyword2[ContextualKeyword2["_get"] = _get] = "_get";
  const _global = _get + 1;
  ContextualKeyword2[ContextualKeyword2["_global"] = _global] = "_global";
  const _implements = _global + 1;
  ContextualKeyword2[ContextualKeyword2["_implements"] = _implements] = "_implements";
  const _infer = _implements + 1;
  ContextualKeyword2[ContextualKeyword2["_infer"] = _infer] = "_infer";
  const _interface = _infer + 1;
  ContextualKeyword2[ContextualKeyword2["_interface"] = _interface] = "_interface";
  const _is = _interface + 1;
  ContextualKeyword2[ContextualKeyword2["_is"] = _is] = "_is";
  const _keyof = _is + 1;
  ContextualKeyword2[ContextualKeyword2["_keyof"] = _keyof] = "_keyof";
  const _mixins = _keyof + 1;
  ContextualKeyword2[ContextualKeyword2["_mixins"] = _mixins] = "_mixins";
  const _module = _mixins + 1;
  ContextualKeyword2[ContextualKeyword2["_module"] = _module] = "_module";
  const _namespace = _module + 1;
  ContextualKeyword2[ContextualKeyword2["_namespace"] = _namespace] = "_namespace";
  const _of = _namespace + 1;
  ContextualKeyword2[ContextualKeyword2["_of"] = _of] = "_of";
  const _opaque = _of + 1;
  ContextualKeyword2[ContextualKeyword2["_opaque"] = _opaque] = "_opaque";
  const _out = _opaque + 1;
  ContextualKeyword2[ContextualKeyword2["_out"] = _out] = "_out";
  const _override = _out + 1;
  ContextualKeyword2[ContextualKeyword2["_override"] = _override] = "_override";
  const _private = _override + 1;
  ContextualKeyword2[ContextualKeyword2["_private"] = _private] = "_private";
  const _protected = _private + 1;
  ContextualKeyword2[ContextualKeyword2["_protected"] = _protected] = "_protected";
  const _proto = _protected + 1;
  ContextualKeyword2[ContextualKeyword2["_proto"] = _proto] = "_proto";
  const _public = _proto + 1;
  ContextualKeyword2[ContextualKeyword2["_public"] = _public] = "_public";
  const _readonly = _public + 1;
  ContextualKeyword2[ContextualKeyword2["_readonly"] = _readonly] = "_readonly";
  const _require = _readonly + 1;
  ContextualKeyword2[ContextualKeyword2["_require"] = _require] = "_require";
  const _satisfies = _require + 1;
  ContextualKeyword2[ContextualKeyword2["_satisfies"] = _satisfies] = "_satisfies";
  const _set = _satisfies + 1;
  ContextualKeyword2[ContextualKeyword2["_set"] = _set] = "_set";
  const _static = _set + 1;
  ContextualKeyword2[ContextualKeyword2["_static"] = _static] = "_static";
  const _symbol = _static + 1;
  ContextualKeyword2[ContextualKeyword2["_symbol"] = _symbol] = "_symbol";
  const _type = _symbol + 1;
  ContextualKeyword2[ContextualKeyword2["_type"] = _type] = "_type";
  const _unique = _type + 1;
  ContextualKeyword2[ContextualKeyword2["_unique"] = _unique] = "_unique";
  const _using = _unique + 1;
  ContextualKeyword2[ContextualKeyword2["_using"] = _using] = "_using";
})(ContextualKeyword || (ContextualKeyword = {}));

// node_modules/sucrase/dist/esm/parser/tokenizer/types.js
var TokenType;
(function(TokenType2) {
  const PRECEDENCE_MASK = 15;
  TokenType2[TokenType2["PRECEDENCE_MASK"] = PRECEDENCE_MASK] = "PRECEDENCE_MASK";
  const IS_KEYWORD = 1 << 4;
  TokenType2[TokenType2["IS_KEYWORD"] = IS_KEYWORD] = "IS_KEYWORD";
  const IS_ASSIGN = 1 << 5;
  TokenType2[TokenType2["IS_ASSIGN"] = IS_ASSIGN] = "IS_ASSIGN";
  const IS_RIGHT_ASSOCIATIVE = 1 << 6;
  TokenType2[TokenType2["IS_RIGHT_ASSOCIATIVE"] = IS_RIGHT_ASSOCIATIVE] = "IS_RIGHT_ASSOCIATIVE";
  const IS_PREFIX = 1 << 7;
  TokenType2[TokenType2["IS_PREFIX"] = IS_PREFIX] = "IS_PREFIX";
  const IS_POSTFIX = 1 << 8;
  TokenType2[TokenType2["IS_POSTFIX"] = IS_POSTFIX] = "IS_POSTFIX";
  const IS_EXPRESSION_START = 1 << 9;
  TokenType2[TokenType2["IS_EXPRESSION_START"] = IS_EXPRESSION_START] = "IS_EXPRESSION_START";
  const num = 512;
  TokenType2[TokenType2["num"] = num] = "num";
  const bigint = 1536;
  TokenType2[TokenType2["bigint"] = bigint] = "bigint";
  const decimal = 2560;
  TokenType2[TokenType2["decimal"] = decimal] = "decimal";
  const regexp = 3584;
  TokenType2[TokenType2["regexp"] = regexp] = "regexp";
  const string = 4608;
  TokenType2[TokenType2["string"] = string] = "string";
  const name = 5632;
  TokenType2[TokenType2["name"] = name] = "name";
  const eof = 6144;
  TokenType2[TokenType2["eof"] = eof] = "eof";
  const bracketL = 7680;
  TokenType2[TokenType2["bracketL"] = bracketL] = "bracketL";
  const bracketR = 8192;
  TokenType2[TokenType2["bracketR"] = bracketR] = "bracketR";
  const braceL = 9728;
  TokenType2[TokenType2["braceL"] = braceL] = "braceL";
  const braceBarL = 10752;
  TokenType2[TokenType2["braceBarL"] = braceBarL] = "braceBarL";
  const braceR = 11264;
  TokenType2[TokenType2["braceR"] = braceR] = "braceR";
  const braceBarR = 12288;
  TokenType2[TokenType2["braceBarR"] = braceBarR] = "braceBarR";
  const parenL = 13824;
  TokenType2[TokenType2["parenL"] = parenL] = "parenL";
  const parenR = 14336;
  TokenType2[TokenType2["parenR"] = parenR] = "parenR";
  const comma2 = 15360;
  TokenType2[TokenType2["comma"] = comma2] = "comma";
  const semi = 16384;
  TokenType2[TokenType2["semi"] = semi] = "semi";
  const colon = 17408;
  TokenType2[TokenType2["colon"] = colon] = "colon";
  const doubleColon = 18432;
  TokenType2[TokenType2["doubleColon"] = doubleColon] = "doubleColon";
  const dot = 19456;
  TokenType2[TokenType2["dot"] = dot] = "dot";
  const question = 20480;
  TokenType2[TokenType2["question"] = question] = "question";
  const questionDot = 21504;
  TokenType2[TokenType2["questionDot"] = questionDot] = "questionDot";
  const arrow = 22528;
  TokenType2[TokenType2["arrow"] = arrow] = "arrow";
  const template = 23552;
  TokenType2[TokenType2["template"] = template] = "template";
  const ellipsis = 24576;
  TokenType2[TokenType2["ellipsis"] = ellipsis] = "ellipsis";
  const backQuote = 25600;
  TokenType2[TokenType2["backQuote"] = backQuote] = "backQuote";
  const dollarBraceL = 27136;
  TokenType2[TokenType2["dollarBraceL"] = dollarBraceL] = "dollarBraceL";
  const at = 27648;
  TokenType2[TokenType2["at"] = at] = "at";
  const hash2 = 29184;
  TokenType2[TokenType2["hash"] = hash2] = "hash";
  const eq = 29728;
  TokenType2[TokenType2["eq"] = eq] = "eq";
  const assign = 30752;
  TokenType2[TokenType2["assign"] = assign] = "assign";
  const preIncDec = 32640;
  TokenType2[TokenType2["preIncDec"] = preIncDec] = "preIncDec";
  const postIncDec = 33664;
  TokenType2[TokenType2["postIncDec"] = postIncDec] = "postIncDec";
  const bang = 34432;
  TokenType2[TokenType2["bang"] = bang] = "bang";
  const tilde = 35456;
  TokenType2[TokenType2["tilde"] = tilde] = "tilde";
  const pipeline = 35841;
  TokenType2[TokenType2["pipeline"] = pipeline] = "pipeline";
  const nullishCoalescing = 36866;
  TokenType2[TokenType2["nullishCoalescing"] = nullishCoalescing] = "nullishCoalescing";
  const logicalOR = 37890;
  TokenType2[TokenType2["logicalOR"] = logicalOR] = "logicalOR";
  const logicalAND = 38915;
  TokenType2[TokenType2["logicalAND"] = logicalAND] = "logicalAND";
  const bitwiseOR = 39940;
  TokenType2[TokenType2["bitwiseOR"] = bitwiseOR] = "bitwiseOR";
  const bitwiseXOR = 40965;
  TokenType2[TokenType2["bitwiseXOR"] = bitwiseXOR] = "bitwiseXOR";
  const bitwiseAND = 41990;
  TokenType2[TokenType2["bitwiseAND"] = bitwiseAND] = "bitwiseAND";
  const equality = 43015;
  TokenType2[TokenType2["equality"] = equality] = "equality";
  const lessThan = 44040;
  TokenType2[TokenType2["lessThan"] = lessThan] = "lessThan";
  const greaterThan = 45064;
  TokenType2[TokenType2["greaterThan"] = greaterThan] = "greaterThan";
  const relationalOrEqual = 46088;
  TokenType2[TokenType2["relationalOrEqual"] = relationalOrEqual] = "relationalOrEqual";
  const bitShiftL = 47113;
  TokenType2[TokenType2["bitShiftL"] = bitShiftL] = "bitShiftL";
  const bitShiftR = 48137;
  TokenType2[TokenType2["bitShiftR"] = bitShiftR] = "bitShiftR";
  const plus = 49802;
  TokenType2[TokenType2["plus"] = plus] = "plus";
  const minus = 50826;
  TokenType2[TokenType2["minus"] = minus] = "minus";
  const modulo = 51723;
  TokenType2[TokenType2["modulo"] = modulo] = "modulo";
  const star = 52235;
  TokenType2[TokenType2["star"] = star] = "star";
  const slash = 53259;
  TokenType2[TokenType2["slash"] = slash] = "slash";
  const exponent = 54348;
  TokenType2[TokenType2["exponent"] = exponent] = "exponent";
  const jsxName = 55296;
  TokenType2[TokenType2["jsxName"] = jsxName] = "jsxName";
  const jsxText = 56320;
  TokenType2[TokenType2["jsxText"] = jsxText] = "jsxText";
  const jsxEmptyText = 57344;
  TokenType2[TokenType2["jsxEmptyText"] = jsxEmptyText] = "jsxEmptyText";
  const jsxTagStart = 58880;
  TokenType2[TokenType2["jsxTagStart"] = jsxTagStart] = "jsxTagStart";
  const jsxTagEnd = 59392;
  TokenType2[TokenType2["jsxTagEnd"] = jsxTagEnd] = "jsxTagEnd";
  const typeParameterStart = 60928;
  TokenType2[TokenType2["typeParameterStart"] = typeParameterStart] = "typeParameterStart";
  const nonNullAssertion = 61440;
  TokenType2[TokenType2["nonNullAssertion"] = nonNullAssertion] = "nonNullAssertion";
  const _break = 62480;
  TokenType2[TokenType2["_break"] = _break] = "_break";
  const _case = 63504;
  TokenType2[TokenType2["_case"] = _case] = "_case";
  const _catch = 64528;
  TokenType2[TokenType2["_catch"] = _catch] = "_catch";
  const _continue = 65552;
  TokenType2[TokenType2["_continue"] = _continue] = "_continue";
  const _debugger = 66576;
  TokenType2[TokenType2["_debugger"] = _debugger] = "_debugger";
  const _default = 67600;
  TokenType2[TokenType2["_default"] = _default] = "_default";
  const _do = 68624;
  TokenType2[TokenType2["_do"] = _do] = "_do";
  const _else = 69648;
  TokenType2[TokenType2["_else"] = _else] = "_else";
  const _finally = 70672;
  TokenType2[TokenType2["_finally"] = _finally] = "_finally";
  const _for = 71696;
  TokenType2[TokenType2["_for"] = _for] = "_for";
  const _function = 73232;
  TokenType2[TokenType2["_function"] = _function] = "_function";
  const _if = 73744;
  TokenType2[TokenType2["_if"] = _if] = "_if";
  const _return = 74768;
  TokenType2[TokenType2["_return"] = _return] = "_return";
  const _switch = 75792;
  TokenType2[TokenType2["_switch"] = _switch] = "_switch";
  const _throw = 77456;
  TokenType2[TokenType2["_throw"] = _throw] = "_throw";
  const _try = 77840;
  TokenType2[TokenType2["_try"] = _try] = "_try";
  const _var = 78864;
  TokenType2[TokenType2["_var"] = _var] = "_var";
  const _let = 79888;
  TokenType2[TokenType2["_let"] = _let] = "_let";
  const _const = 80912;
  TokenType2[TokenType2["_const"] = _const] = "_const";
  const _while = 81936;
  TokenType2[TokenType2["_while"] = _while] = "_while";
  const _with = 82960;
  TokenType2[TokenType2["_with"] = _with] = "_with";
  const _new = 84496;
  TokenType2[TokenType2["_new"] = _new] = "_new";
  const _this = 85520;
  TokenType2[TokenType2["_this"] = _this] = "_this";
  const _super = 86544;
  TokenType2[TokenType2["_super"] = _super] = "_super";
  const _class = 87568;
  TokenType2[TokenType2["_class"] = _class] = "_class";
  const _extends = 88080;
  TokenType2[TokenType2["_extends"] = _extends] = "_extends";
  const _export = 89104;
  TokenType2[TokenType2["_export"] = _export] = "_export";
  const _import = 90640;
  TokenType2[TokenType2["_import"] = _import] = "_import";
  const _yield = 91664;
  TokenType2[TokenType2["_yield"] = _yield] = "_yield";
  const _null = 92688;
  TokenType2[TokenType2["_null"] = _null] = "_null";
  const _true = 93712;
  TokenType2[TokenType2["_true"] = _true] = "_true";
  const _false = 94736;
  TokenType2[TokenType2["_false"] = _false] = "_false";
  const _in = 95256;
  TokenType2[TokenType2["_in"] = _in] = "_in";
  const _instanceof = 96280;
  TokenType2[TokenType2["_instanceof"] = _instanceof] = "_instanceof";
  const _typeof = 97936;
  TokenType2[TokenType2["_typeof"] = _typeof] = "_typeof";
  const _void = 98960;
  TokenType2[TokenType2["_void"] = _void] = "_void";
  const _delete = 99984;
  TokenType2[TokenType2["_delete"] = _delete] = "_delete";
  const _async = 100880;
  TokenType2[TokenType2["_async"] = _async] = "_async";
  const _get = 101904;
  TokenType2[TokenType2["_get"] = _get] = "_get";
  const _set = 102928;
  TokenType2[TokenType2["_set"] = _set] = "_set";
  const _declare = 103952;
  TokenType2[TokenType2["_declare"] = _declare] = "_declare";
  const _readonly = 104976;
  TokenType2[TokenType2["_readonly"] = _readonly] = "_readonly";
  const _abstract = 106e3;
  TokenType2[TokenType2["_abstract"] = _abstract] = "_abstract";
  const _static = 107024;
  TokenType2[TokenType2["_static"] = _static] = "_static";
  const _public = 107536;
  TokenType2[TokenType2["_public"] = _public] = "_public";
  const _private = 108560;
  TokenType2[TokenType2["_private"] = _private] = "_private";
  const _protected = 109584;
  TokenType2[TokenType2["_protected"] = _protected] = "_protected";
  const _override = 110608;
  TokenType2[TokenType2["_override"] = _override] = "_override";
  const _as = 112144;
  TokenType2[TokenType2["_as"] = _as] = "_as";
  const _enum = 113168;
  TokenType2[TokenType2["_enum"] = _enum] = "_enum";
  const _type = 114192;
  TokenType2[TokenType2["_type"] = _type] = "_type";
  const _implements = 115216;
  TokenType2[TokenType2["_implements"] = _implements] = "_implements";
})(TokenType || (TokenType = {}));
function formatTokenType(tokenType) {
  switch (tokenType) {
    case TokenType.num:
      return "num";
    case TokenType.bigint:
      return "bigint";
    case TokenType.decimal:
      return "decimal";
    case TokenType.regexp:
      return "regexp";
    case TokenType.string:
      return "string";
    case TokenType.name:
      return "name";
    case TokenType.eof:
      return "eof";
    case TokenType.bracketL:
      return "[";
    case TokenType.bracketR:
      return "]";
    case TokenType.braceL:
      return "{";
    case TokenType.braceBarL:
      return "{|";
    case TokenType.braceR:
      return "}";
    case TokenType.braceBarR:
      return "|}";
    case TokenType.parenL:
      return "(";
    case TokenType.parenR:
      return ")";
    case TokenType.comma:
      return ",";
    case TokenType.semi:
      return ";";
    case TokenType.colon:
      return ":";
    case TokenType.doubleColon:
      return "::";
    case TokenType.dot:
      return ".";
    case TokenType.question:
      return "?";
    case TokenType.questionDot:
      return "?.";
    case TokenType.arrow:
      return "=>";
    case TokenType.template:
      return "template";
    case TokenType.ellipsis:
      return "...";
    case TokenType.backQuote:
      return "`";
    case TokenType.dollarBraceL:
      return "${";
    case TokenType.at:
      return "@";
    case TokenType.hash:
      return "#";
    case TokenType.eq:
      return "=";
    case TokenType.assign:
      return "_=";
    case TokenType.preIncDec:
      return "++/--";
    case TokenType.postIncDec:
      return "++/--";
    case TokenType.bang:
      return "!";
    case TokenType.tilde:
      return "~";
    case TokenType.pipeline:
      return "|>";
    case TokenType.nullishCoalescing:
      return "??";
    case TokenType.logicalOR:
      return "||";
    case TokenType.logicalAND:
      return "&&";
    case TokenType.bitwiseOR:
      return "|";
    case TokenType.bitwiseXOR:
      return "^";
    case TokenType.bitwiseAND:
      return "&";
    case TokenType.equality:
      return "==/!=";
    case TokenType.lessThan:
      return "<";
    case TokenType.greaterThan:
      return ">";
    case TokenType.relationalOrEqual:
      return "<=/>=";
    case TokenType.bitShiftL:
      return "<<";
    case TokenType.bitShiftR:
      return ">>/>>>";
    case TokenType.plus:
      return "+";
    case TokenType.minus:
      return "-";
    case TokenType.modulo:
      return "%";
    case TokenType.star:
      return "*";
    case TokenType.slash:
      return "/";
    case TokenType.exponent:
      return "**";
    case TokenType.jsxName:
      return "jsxName";
    case TokenType.jsxText:
      return "jsxText";
    case TokenType.jsxEmptyText:
      return "jsxEmptyText";
    case TokenType.jsxTagStart:
      return "jsxTagStart";
    case TokenType.jsxTagEnd:
      return "jsxTagEnd";
    case TokenType.typeParameterStart:
      return "typeParameterStart";
    case TokenType.nonNullAssertion:
      return "nonNullAssertion";
    case TokenType._break:
      return "break";
    case TokenType._case:
      return "case";
    case TokenType._catch:
      return "catch";
    case TokenType._continue:
      return "continue";
    case TokenType._debugger:
      return "debugger";
    case TokenType._default:
      return "default";
    case TokenType._do:
      return "do";
    case TokenType._else:
      return "else";
    case TokenType._finally:
      return "finally";
    case TokenType._for:
      return "for";
    case TokenType._function:
      return "function";
    case TokenType._if:
      return "if";
    case TokenType._return:
      return "return";
    case TokenType._switch:
      return "switch";
    case TokenType._throw:
      return "throw";
    case TokenType._try:
      return "try";
    case TokenType._var:
      return "var";
    case TokenType._let:
      return "let";
    case TokenType._const:
      return "const";
    case TokenType._while:
      return "while";
    case TokenType._with:
      return "with";
    case TokenType._new:
      return "new";
    case TokenType._this:
      return "this";
    case TokenType._super:
      return "super";
    case TokenType._class:
      return "class";
    case TokenType._extends:
      return "extends";
    case TokenType._export:
      return "export";
    case TokenType._import:
      return "import";
    case TokenType._yield:
      return "yield";
    case TokenType._null:
      return "null";
    case TokenType._true:
      return "true";
    case TokenType._false:
      return "false";
    case TokenType._in:
      return "in";
    case TokenType._instanceof:
      return "instanceof";
    case TokenType._typeof:
      return "typeof";
    case TokenType._void:
      return "void";
    case TokenType._delete:
      return "delete";
    case TokenType._async:
      return "async";
    case TokenType._get:
      return "get";
    case TokenType._set:
      return "set";
    case TokenType._declare:
      return "declare";
    case TokenType._readonly:
      return "readonly";
    case TokenType._abstract:
      return "abstract";
    case TokenType._static:
      return "static";
    case TokenType._public:
      return "public";
    case TokenType._private:
      return "private";
    case TokenType._protected:
      return "protected";
    case TokenType._override:
      return "override";
    case TokenType._as:
      return "as";
    case TokenType._enum:
      return "enum";
    case TokenType._type:
      return "type";
    case TokenType._implements:
      return "implements";
    default:
      return "";
  }
}

// node_modules/sucrase/dist/esm/parser/tokenizer/state.js
var Scope = class {
  constructor(startTokenIndex, endTokenIndex, isFunctionScope) {
    this.startTokenIndex = startTokenIndex;
    this.endTokenIndex = endTokenIndex;
    this.isFunctionScope = isFunctionScope;
  }
};
var StateSnapshot = class {
  constructor(potentialArrowAt, noAnonFunctionType, inDisallowConditionalTypesContext, tokensLength, scopesLength, pos, type, contextualKeyword, start, end, isType, scopeDepth, error) {
    ;
    this.potentialArrowAt = potentialArrowAt;
    this.noAnonFunctionType = noAnonFunctionType;
    this.inDisallowConditionalTypesContext = inDisallowConditionalTypesContext;
    this.tokensLength = tokensLength;
    this.scopesLength = scopesLength;
    this.pos = pos;
    this.type = type;
    this.contextualKeyword = contextualKeyword;
    this.start = start;
    this.end = end;
    this.isType = isType;
    this.scopeDepth = scopeDepth;
    this.error = error;
  }
};
var State = class _State {
  constructor() {
    _State.prototype.__init.call(this);
    _State.prototype.__init2.call(this);
    _State.prototype.__init3.call(this);
    _State.prototype.__init4.call(this);
    _State.prototype.__init5.call(this);
    _State.prototype.__init6.call(this);
    _State.prototype.__init7.call(this);
    _State.prototype.__init8.call(this);
    _State.prototype.__init9.call(this);
    _State.prototype.__init10.call(this);
    _State.prototype.__init11.call(this);
    _State.prototype.__init12.call(this);
    _State.prototype.__init13.call(this);
  }
  // Used to signify the start of a potential arrow function
  __init() {
    this.potentialArrowAt = -1;
  }
  // Used by Flow to handle an edge case involving function type parsing.
  __init2() {
    this.noAnonFunctionType = false;
  }
  // Used by TypeScript to handle ambiguities when parsing conditional types.
  __init3() {
    this.inDisallowConditionalTypesContext = false;
  }
  // Token store.
  __init4() {
    this.tokens = [];
  }
  // Array of all observed scopes, ordered by their ending position.
  __init5() {
    this.scopes = [];
  }
  // The current position of the tokenizer in the input.
  __init6() {
    this.pos = 0;
  }
  // Information about the current token.
  __init7() {
    this.type = TokenType.eof;
  }
  __init8() {
    this.contextualKeyword = ContextualKeyword.NONE;
  }
  __init9() {
    this.start = 0;
  }
  __init10() {
    this.end = 0;
  }
  __init11() {
    this.isType = false;
  }
  __init12() {
    this.scopeDepth = 0;
  }
  /**
   * If the parser is in an error state, then the token is always tt.eof and all functions can
   * keep executing but should be written so they don't get into an infinite loop in this situation.
   *
   * This approach, combined with the ability to snapshot and restore state, allows us to implement
   * backtracking without exceptions and without needing to explicitly propagate error states
   * everywhere.
   */
  __init13() {
    this.error = null;
  }
  snapshot() {
    return new StateSnapshot(
      this.potentialArrowAt,
      this.noAnonFunctionType,
      this.inDisallowConditionalTypesContext,
      this.tokens.length,
      this.scopes.length,
      this.pos,
      this.type,
      this.contextualKeyword,
      this.start,
      this.end,
      this.isType,
      this.scopeDepth,
      this.error
    );
  }
  restoreFromSnapshot(snapshot) {
    this.potentialArrowAt = snapshot.potentialArrowAt;
    this.noAnonFunctionType = snapshot.noAnonFunctionType;
    this.inDisallowConditionalTypesContext = snapshot.inDisallowConditionalTypesContext;
    this.tokens.length = snapshot.tokensLength;
    this.scopes.length = snapshot.scopesLength;
    this.pos = snapshot.pos;
    this.type = snapshot.type;
    this.contextualKeyword = snapshot.contextualKeyword;
    this.start = snapshot.start;
    this.end = snapshot.end;
    this.isType = snapshot.isType;
    this.scopeDepth = snapshot.scopeDepth;
    this.error = snapshot.error;
  }
};

// node_modules/sucrase/dist/esm/parser/util/charcodes.js
var charCodes;
(function(charCodes2) {
  const backSpace = 8;
  charCodes2[charCodes2["backSpace"] = backSpace] = "backSpace";
  const lineFeed = 10;
  charCodes2[charCodes2["lineFeed"] = lineFeed] = "lineFeed";
  const tab = 9;
  charCodes2[charCodes2["tab"] = tab] = "tab";
  const carriageReturn = 13;
  charCodes2[charCodes2["carriageReturn"] = carriageReturn] = "carriageReturn";
  const shiftOut = 14;
  charCodes2[charCodes2["shiftOut"] = shiftOut] = "shiftOut";
  const space = 32;
  charCodes2[charCodes2["space"] = space] = "space";
  const exclamationMark = 33;
  charCodes2[charCodes2["exclamationMark"] = exclamationMark] = "exclamationMark";
  const quotationMark = 34;
  charCodes2[charCodes2["quotationMark"] = quotationMark] = "quotationMark";
  const numberSign = 35;
  charCodes2[charCodes2["numberSign"] = numberSign] = "numberSign";
  const dollarSign = 36;
  charCodes2[charCodes2["dollarSign"] = dollarSign] = "dollarSign";
  const percentSign = 37;
  charCodes2[charCodes2["percentSign"] = percentSign] = "percentSign";
  const ampersand = 38;
  charCodes2[charCodes2["ampersand"] = ampersand] = "ampersand";
  const apostrophe = 39;
  charCodes2[charCodes2["apostrophe"] = apostrophe] = "apostrophe";
  const leftParenthesis = 40;
  charCodes2[charCodes2["leftParenthesis"] = leftParenthesis] = "leftParenthesis";
  const rightParenthesis = 41;
  charCodes2[charCodes2["rightParenthesis"] = rightParenthesis] = "rightParenthesis";
  const asterisk = 42;
  charCodes2[charCodes2["asterisk"] = asterisk] = "asterisk";
  const plusSign = 43;
  charCodes2[charCodes2["plusSign"] = plusSign] = "plusSign";
  const comma2 = 44;
  charCodes2[charCodes2["comma"] = comma2] = "comma";
  const dash = 45;
  charCodes2[charCodes2["dash"] = dash] = "dash";
  const dot = 46;
  charCodes2[charCodes2["dot"] = dot] = "dot";
  const slash = 47;
  charCodes2[charCodes2["slash"] = slash] = "slash";
  const digit0 = 48;
  charCodes2[charCodes2["digit0"] = digit0] = "digit0";
  const digit1 = 49;
  charCodes2[charCodes2["digit1"] = digit1] = "digit1";
  const digit2 = 50;
  charCodes2[charCodes2["digit2"] = digit2] = "digit2";
  const digit3 = 51;
  charCodes2[charCodes2["digit3"] = digit3] = "digit3";
  const digit4 = 52;
  charCodes2[charCodes2["digit4"] = digit4] = "digit4";
  const digit5 = 53;
  charCodes2[charCodes2["digit5"] = digit5] = "digit5";
  const digit6 = 54;
  charCodes2[charCodes2["digit6"] = digit6] = "digit6";
  const digit7 = 55;
  charCodes2[charCodes2["digit7"] = digit7] = "digit7";
  const digit8 = 56;
  charCodes2[charCodes2["digit8"] = digit8] = "digit8";
  const digit9 = 57;
  charCodes2[charCodes2["digit9"] = digit9] = "digit9";
  const colon = 58;
  charCodes2[charCodes2["colon"] = colon] = "colon";
  const semicolon3 = 59;
  charCodes2[charCodes2["semicolon"] = semicolon3] = "semicolon";
  const lessThan = 60;
  charCodes2[charCodes2["lessThan"] = lessThan] = "lessThan";
  const equalsTo = 61;
  charCodes2[charCodes2["equalsTo"] = equalsTo] = "equalsTo";
  const greaterThan = 62;
  charCodes2[charCodes2["greaterThan"] = greaterThan] = "greaterThan";
  const questionMark = 63;
  charCodes2[charCodes2["questionMark"] = questionMark] = "questionMark";
  const atSign = 64;
  charCodes2[charCodes2["atSign"] = atSign] = "atSign";
  const uppercaseA = 65;
  charCodes2[charCodes2["uppercaseA"] = uppercaseA] = "uppercaseA";
  const uppercaseB = 66;
  charCodes2[charCodes2["uppercaseB"] = uppercaseB] = "uppercaseB";
  const uppercaseC = 67;
  charCodes2[charCodes2["uppercaseC"] = uppercaseC] = "uppercaseC";
  const uppercaseD = 68;
  charCodes2[charCodes2["uppercaseD"] = uppercaseD] = "uppercaseD";
  const uppercaseE = 69;
  charCodes2[charCodes2["uppercaseE"] = uppercaseE] = "uppercaseE";
  const uppercaseF = 70;
  charCodes2[charCodes2["uppercaseF"] = uppercaseF] = "uppercaseF";
  const uppercaseG = 71;
  charCodes2[charCodes2["uppercaseG"] = uppercaseG] = "uppercaseG";
  const uppercaseH = 72;
  charCodes2[charCodes2["uppercaseH"] = uppercaseH] = "uppercaseH";
  const uppercaseI = 73;
  charCodes2[charCodes2["uppercaseI"] = uppercaseI] = "uppercaseI";
  const uppercaseJ = 74;
  charCodes2[charCodes2["uppercaseJ"] = uppercaseJ] = "uppercaseJ";
  const uppercaseK = 75;
  charCodes2[charCodes2["uppercaseK"] = uppercaseK] = "uppercaseK";
  const uppercaseL = 76;
  charCodes2[charCodes2["uppercaseL"] = uppercaseL] = "uppercaseL";
  const uppercaseM = 77;
  charCodes2[charCodes2["uppercaseM"] = uppercaseM] = "uppercaseM";
  const uppercaseN = 78;
  charCodes2[charCodes2["uppercaseN"] = uppercaseN] = "uppercaseN";
  const uppercaseO = 79;
  charCodes2[charCodes2["uppercaseO"] = uppercaseO] = "uppercaseO";
  const uppercaseP = 80;
  charCodes2[charCodes2["uppercaseP"] = uppercaseP] = "uppercaseP";
  const uppercaseQ = 81;
  charCodes2[charCodes2["uppercaseQ"] = uppercaseQ] = "uppercaseQ";
  const uppercaseR = 82;
  charCodes2[charCodes2["uppercaseR"] = uppercaseR] = "uppercaseR";
  const uppercaseS = 83;
  charCodes2[charCodes2["uppercaseS"] = uppercaseS] = "uppercaseS";
  const uppercaseT = 84;
  charCodes2[charCodes2["uppercaseT"] = uppercaseT] = "uppercaseT";
  const uppercaseU = 85;
  charCodes2[charCodes2["uppercaseU"] = uppercaseU] = "uppercaseU";
  const uppercaseV = 86;
  charCodes2[charCodes2["uppercaseV"] = uppercaseV] = "uppercaseV";
  const uppercaseW = 87;
  charCodes2[charCodes2["uppercaseW"] = uppercaseW] = "uppercaseW";
  const uppercaseX = 88;
  charCodes2[charCodes2["uppercaseX"] = uppercaseX] = "uppercaseX";
  const uppercaseY = 89;
  charCodes2[charCodes2["uppercaseY"] = uppercaseY] = "uppercaseY";
  const uppercaseZ = 90;
  charCodes2[charCodes2["uppercaseZ"] = uppercaseZ] = "uppercaseZ";
  const leftSquareBracket = 91;
  charCodes2[charCodes2["leftSquareBracket"] = leftSquareBracket] = "leftSquareBracket";
  const backslash = 92;
  charCodes2[charCodes2["backslash"] = backslash] = "backslash";
  const rightSquareBracket = 93;
  charCodes2[charCodes2["rightSquareBracket"] = rightSquareBracket] = "rightSquareBracket";
  const caret = 94;
  charCodes2[charCodes2["caret"] = caret] = "caret";
  const underscore = 95;
  charCodes2[charCodes2["underscore"] = underscore] = "underscore";
  const graveAccent = 96;
  charCodes2[charCodes2["graveAccent"] = graveAccent] = "graveAccent";
  const lowercaseA = 97;
  charCodes2[charCodes2["lowercaseA"] = lowercaseA] = "lowercaseA";
  const lowercaseB = 98;
  charCodes2[charCodes2["lowercaseB"] = lowercaseB] = "lowercaseB";
  const lowercaseC = 99;
  charCodes2[charCodes2["lowercaseC"] = lowercaseC] = "lowercaseC";
  const lowercaseD = 100;
  charCodes2[charCodes2["lowercaseD"] = lowercaseD] = "lowercaseD";
  const lowercaseE = 101;
  charCodes2[charCodes2["lowercaseE"] = lowercaseE] = "lowercaseE";
  const lowercaseF = 102;
  charCodes2[charCodes2["lowercaseF"] = lowercaseF] = "lowercaseF";
  const lowercaseG = 103;
  charCodes2[charCodes2["lowercaseG"] = lowercaseG] = "lowercaseG";
  const lowercaseH = 104;
  charCodes2[charCodes2["lowercaseH"] = lowercaseH] = "lowercaseH";
  const lowercaseI = 105;
  charCodes2[charCodes2["lowercaseI"] = lowercaseI] = "lowercaseI";
  const lowercaseJ = 106;
  charCodes2[charCodes2["lowercaseJ"] = lowercaseJ] = "lowercaseJ";
  const lowercaseK = 107;
  charCodes2[charCodes2["lowercaseK"] = lowercaseK] = "lowercaseK";
  const lowercaseL = 108;
  charCodes2[charCodes2["lowercaseL"] = lowercaseL] = "lowercaseL";
  const lowercaseM = 109;
  charCodes2[charCodes2["lowercaseM"] = lowercaseM] = "lowercaseM";
  const lowercaseN = 110;
  charCodes2[charCodes2["lowercaseN"] = lowercaseN] = "lowercaseN";
  const lowercaseO = 111;
  charCodes2[charCodes2["lowercaseO"] = lowercaseO] = "lowercaseO";
  const lowercaseP = 112;
  charCodes2[charCodes2["lowercaseP"] = lowercaseP] = "lowercaseP";
  const lowercaseQ = 113;
  charCodes2[charCodes2["lowercaseQ"] = lowercaseQ] = "lowercaseQ";
  const lowercaseR = 114;
  charCodes2[charCodes2["lowercaseR"] = lowercaseR] = "lowercaseR";
  const lowercaseS = 115;
  charCodes2[charCodes2["lowercaseS"] = lowercaseS] = "lowercaseS";
  const lowercaseT = 116;
  charCodes2[charCodes2["lowercaseT"] = lowercaseT] = "lowercaseT";
  const lowercaseU = 117;
  charCodes2[charCodes2["lowercaseU"] = lowercaseU] = "lowercaseU";
  const lowercaseV = 118;
  charCodes2[charCodes2["lowercaseV"] = lowercaseV] = "lowercaseV";
  const lowercaseW = 119;
  charCodes2[charCodes2["lowercaseW"] = lowercaseW] = "lowercaseW";
  const lowercaseX = 120;
  charCodes2[charCodes2["lowercaseX"] = lowercaseX] = "lowercaseX";
  const lowercaseY = 121;
  charCodes2[charCodes2["lowercaseY"] = lowercaseY] = "lowercaseY";
  const lowercaseZ = 122;
  charCodes2[charCodes2["lowercaseZ"] = lowercaseZ] = "lowercaseZ";
  const leftCurlyBrace = 123;
  charCodes2[charCodes2["leftCurlyBrace"] = leftCurlyBrace] = "leftCurlyBrace";
  const verticalBar = 124;
  charCodes2[charCodes2["verticalBar"] = verticalBar] = "verticalBar";
  const rightCurlyBrace = 125;
  charCodes2[charCodes2["rightCurlyBrace"] = rightCurlyBrace] = "rightCurlyBrace";
  const tilde = 126;
  charCodes2[charCodes2["tilde"] = tilde] = "tilde";
  const nonBreakingSpace = 160;
  charCodes2[charCodes2["nonBreakingSpace"] = nonBreakingSpace] = "nonBreakingSpace";
  const oghamSpaceMark = 5760;
  charCodes2[charCodes2["oghamSpaceMark"] = oghamSpaceMark] = "oghamSpaceMark";
  const lineSeparator = 8232;
  charCodes2[charCodes2["lineSeparator"] = lineSeparator] = "lineSeparator";
  const paragraphSeparator = 8233;
  charCodes2[charCodes2["paragraphSeparator"] = paragraphSeparator] = "paragraphSeparator";
})(charCodes || (charCodes = {}));

// node_modules/sucrase/dist/esm/parser/traverser/base.js
var isJSXEnabled;
var isTypeScriptEnabled;
var isFlowEnabled;
var state;
var input;
var nextContextId;
function getNextContextId() {
  return nextContextId++;
}
function augmentError(error) {
  if ("pos" in error) {
    const loc = locationForIndex(error.pos);
    error.message += ` (${loc.line}:${loc.column})`;
    error.loc = loc;
  }
  return error;
}
var Loc = class {
  constructor(line, column) {
    this.line = line;
    this.column = column;
  }
};
function locationForIndex(pos) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < pos; i++) {
    if (input.charCodeAt(i) === charCodes.lineFeed) {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return new Loc(line, column);
}
function initParser(inputCode, isJSXEnabledArg, isTypeScriptEnabledArg, isFlowEnabledArg) {
  input = inputCode;
  state = new State();
  nextContextId = 1;
  isJSXEnabled = isJSXEnabledArg;
  isTypeScriptEnabled = isTypeScriptEnabledArg;
  isFlowEnabled = isFlowEnabledArg;
}

// node_modules/sucrase/dist/esm/parser/traverser/util.js
function isContextual(contextualKeyword) {
  return state.contextualKeyword === contextualKeyword;
}
function isLookaheadContextual(contextualKeyword) {
  const l = lookaheadTypeAndKeyword();
  return l.type === TokenType.name && l.contextualKeyword === contextualKeyword;
}
function eatContextual(contextualKeyword) {
  return state.contextualKeyword === contextualKeyword && eat(TokenType.name);
}
function expectContextual(contextualKeyword) {
  if (!eatContextual(contextualKeyword)) {
    unexpected();
  }
}
function canInsertSemicolon() {
  return match(TokenType.eof) || match(TokenType.braceR) || hasPrecedingLineBreak();
}
function hasPrecedingLineBreak() {
  const prevToken = state.tokens[state.tokens.length - 1];
  const lastTokEnd = prevToken ? prevToken.end : 0;
  for (let i = lastTokEnd; i < state.start; i++) {
    const code = input.charCodeAt(i);
    if (code === charCodes.lineFeed || code === charCodes.carriageReturn || code === 8232 || code === 8233) {
      return true;
    }
  }
  return false;
}
function hasFollowingLineBreak() {
  const nextStart = nextTokenStart();
  for (let i = state.end; i < nextStart; i++) {
    const code = input.charCodeAt(i);
    if (code === charCodes.lineFeed || code === charCodes.carriageReturn || code === 8232 || code === 8233) {
      return true;
    }
  }
  return false;
}
function isLineTerminator() {
  return eat(TokenType.semi) || canInsertSemicolon();
}
function semicolon() {
  if (!isLineTerminator()) {
    unexpected('Unexpected token, expected ";"');
  }
}
function expect(type) {
  const matched = eat(type);
  if (!matched) {
    unexpected(`Unexpected token, expected "${formatTokenType(type)}"`);
  }
}
function unexpected(message = "Unexpected token", pos = state.start) {
  if (state.error) {
    return;
  }
  const err = new SyntaxError(message);
  err.pos = pos;
  state.error = err;
  state.pos = input.length;
  finishToken(TokenType.eof);
}

// node_modules/sucrase/dist/esm/parser/util/whitespace.js
var WHITESPACE_CHARS = [
  9,
  11,
  12,
  charCodes.space,
  charCodes.nonBreakingSpace,
  charCodes.oghamSpaceMark,
  8192,
  // EN QUAD
  8193,
  // EM QUAD
  8194,
  // EN SPACE
  8195,
  // EM SPACE
  8196,
  // THREE-PER-EM SPACE
  8197,
  // FOUR-PER-EM SPACE
  8198,
  // SIX-PER-EM SPACE
  8199,
  // FIGURE SPACE
  8200,
  // PUNCTUATION SPACE
  8201,
  // THIN SPACE
  8202,
  // HAIR SPACE
  8239,
  // NARROW NO-BREAK SPACE
  8287,
  // MEDIUM MATHEMATICAL SPACE
  12288,
  // IDEOGRAPHIC SPACE
  65279
  // ZERO WIDTH NO-BREAK SPACE
];
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var IS_WHITESPACE = new Uint8Array(65536);
for (const char of WHITESPACE_CHARS) {
  IS_WHITESPACE[char] = 1;
}

// node_modules/sucrase/dist/esm/parser/util/identifier.js
function computeIsIdentifierChar(code) {
  if (code < 48) return code === 36;
  if (code < 58) return true;
  if (code < 65) return false;
  if (code < 91) return true;
  if (code < 97) return code === 95;
  if (code < 123) return true;
  if (code < 128) return false;
  throw new Error("Should not be called with non-ASCII char code.");
}
var IS_IDENTIFIER_CHAR = new Uint8Array(65536);
for (let i = 0; i < 128; i++) {
  IS_IDENTIFIER_CHAR[i] = computeIsIdentifierChar(i) ? 1 : 0;
}
for (let i = 128; i < 65536; i++) {
  IS_IDENTIFIER_CHAR[i] = 1;
}
for (const whitespaceChar of WHITESPACE_CHARS) {
  IS_IDENTIFIER_CHAR[whitespaceChar] = 0;
}
IS_IDENTIFIER_CHAR[8232] = 0;
IS_IDENTIFIER_CHAR[8233] = 0;
var IS_IDENTIFIER_START = IS_IDENTIFIER_CHAR.slice();
for (let numChar = charCodes.digit0; numChar <= charCodes.digit9; numChar++) {
  IS_IDENTIFIER_START[numChar] = 0;
}

// node_modules/sucrase/dist/esm/parser/tokenizer/readWordTree.js
var READ_WORD_TREE = new Int32Array([
  // ""
  -1,
  27,
  783,
  918,
  1755,
  2376,
  2862,
  3483,
  -1,
  3699,
  -1,
  4617,
  4752,
  4833,
  5130,
  5508,
  5940,
  -1,
  6480,
  6939,
  7749,
  8181,
  8451,
  8613,
  -1,
  8829,
  -1,
  // "a"
  -1,
  -1,
  54,
  243,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  432,
  -1,
  -1,
  -1,
  675,
  -1,
  -1,
  -1,
  // "ab"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  81,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abs"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  108,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abst"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  135,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abstr"
  -1,
  162,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abstra"
  -1,
  -1,
  -1,
  189,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abstrac"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  216,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "abstract"
  ContextualKeyword._abstract << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ac"
  -1,
  -1,
  -1,
  270,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "acc"
  -1,
  -1,
  -1,
  -1,
  -1,
  297,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "acce"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  324,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "acces"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  351,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "access"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  378,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "accesso"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  405,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "accessor"
  ContextualKeyword._accessor << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "as"
  ContextualKeyword._as << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  459,
  -1,
  -1,
  -1,
  -1,
  -1,
  594,
  -1,
  // "ass"
  -1,
  -1,
  -1,
  -1,
  -1,
  486,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "asse"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  513,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "asser"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  540,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "assert"
  ContextualKeyword._assert << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  567,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "asserts"
  ContextualKeyword._asserts << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "asy"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  621,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "asyn"
  -1,
  -1,
  -1,
  648,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "async"
  ContextualKeyword._async << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "aw"
  -1,
  702,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "awa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  729,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "awai"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  756,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "await"
  ContextualKeyword._await << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "b"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  810,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "br"
  -1,
  -1,
  -1,
  -1,
  -1,
  837,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "bre"
  -1,
  864,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "brea"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  891,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "break"
  (TokenType._break << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "c"
  -1,
  945,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1107,
  -1,
  -1,
  -1,
  1242,
  -1,
  -1,
  1350,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ca"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  972,
  1026,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cas"
  -1,
  -1,
  -1,
  -1,
  -1,
  999,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "case"
  (TokenType._case << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cat"
  -1,
  -1,
  -1,
  1053,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "catc"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1080,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "catch"
  (TokenType._catch << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ch"
  -1,
  -1,
  -1,
  -1,
  -1,
  1134,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "che"
  -1,
  -1,
  -1,
  1161,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "chec"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1188,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "check"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1215,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "checks"
  ContextualKeyword._checks << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cl"
  -1,
  1269,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cla"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1296,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "clas"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1323,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "class"
  (TokenType._class << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "co"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1377,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "con"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1404,
  1620,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cons"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1431,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "const"
  (TokenType._const << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1458,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "constr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1485,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "constru"
  -1,
  -1,
  -1,
  1512,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "construc"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1539,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "construct"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1566,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "constructo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1593,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "constructor"
  ContextualKeyword._constructor << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "cont"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1647,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "conti"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1674,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "contin"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1701,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "continu"
  -1,
  -1,
  -1,
  -1,
  -1,
  1728,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "continue"
  (TokenType._continue << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "d"
  -1,
  -1,
  -1,
  -1,
  -1,
  1782,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2349,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "de"
  -1,
  -1,
  1809,
  1971,
  -1,
  -1,
  2106,
  -1,
  -1,
  -1,
  -1,
  -1,
  2241,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "deb"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1836,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "debu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1863,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "debug"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1890,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "debugg"
  -1,
  -1,
  -1,
  -1,
  -1,
  1917,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "debugge"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1944,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "debugger"
  (TokenType._debugger << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "dec"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  1998,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "decl"
  -1,
  2025,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "decla"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2052,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "declar"
  -1,
  -1,
  -1,
  -1,
  -1,
  2079,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "declare"
  ContextualKeyword._declare << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "def"
  -1,
  2133,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "defa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2160,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "defau"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2187,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "defaul"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2214,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "default"
  (TokenType._default << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "del"
  -1,
  -1,
  -1,
  -1,
  -1,
  2268,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "dele"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2295,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "delet"
  -1,
  -1,
  -1,
  -1,
  -1,
  2322,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "delete"
  (TokenType._delete << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "do"
  (TokenType._do << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "e"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2403,
  -1,
  2484,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2565,
  -1,
  -1,
  // "el"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2430,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "els"
  -1,
  -1,
  -1,
  -1,
  -1,
  2457,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "else"
  (TokenType._else << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "en"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2511,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "enu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2538,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "enum"
  ContextualKeyword._enum << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ex"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2592,
  -1,
  -1,
  -1,
  2727,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "exp"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2619,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "expo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2646,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "expor"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2673,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "export"
  (TokenType._export << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2700,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "exports"
  ContextualKeyword._exports << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ext"
  -1,
  -1,
  -1,
  -1,
  -1,
  2754,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "exte"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2781,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "exten"
  -1,
  -1,
  -1,
  -1,
  2808,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "extend"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2835,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "extends"
  (TokenType._extends << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "f"
  -1,
  2889,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2997,
  -1,
  -1,
  -1,
  -1,
  -1,
  3159,
  -1,
  -1,
  3213,
  -1,
  -1,
  3294,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2916,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fal"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2943,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fals"
  -1,
  -1,
  -1,
  -1,
  -1,
  2970,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "false"
  (TokenType._false << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3024,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fin"
  -1,
  3051,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fina"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3078,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "final"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3105,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "finall"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3132,
  -1,
  // "finally"
  (TokenType._finally << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3186,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "for"
  (TokenType._for << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3240,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fro"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3267,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "from"
  ContextualKeyword._from << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3321,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "fun"
  -1,
  -1,
  -1,
  3348,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "func"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3375,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "funct"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3402,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "functi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3429,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "functio"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3456,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "function"
  (TokenType._function << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "g"
  -1,
  -1,
  -1,
  -1,
  -1,
  3510,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3564,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ge"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3537,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "get"
  ContextualKeyword._get << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "gl"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3591,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "glo"
  -1,
  -1,
  3618,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "glob"
  -1,
  3645,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "globa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3672,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "global"
  ContextualKeyword._global << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "i"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3726,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3753,
  4077,
  -1,
  -1,
  -1,
  -1,
  4590,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "if"
  (TokenType._if << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "im"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3780,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "imp"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3807,
  -1,
  -1,
  3996,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "impl"
  -1,
  -1,
  -1,
  -1,
  -1,
  3834,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "imple"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3861,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "implem"
  -1,
  -1,
  -1,
  -1,
  -1,
  3888,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "impleme"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3915,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "implemen"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3942,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "implement"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  3969,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "implements"
  ContextualKeyword._implements << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "impo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4023,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "impor"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4050,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "import"
  (TokenType._import << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "in"
  (TokenType._in << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4104,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4185,
  4401,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "inf"
  -1,
  -1,
  -1,
  -1,
  -1,
  4131,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "infe"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4158,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "infer"
  ContextualKeyword._infer << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ins"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4212,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "inst"
  -1,
  4239,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "insta"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4266,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "instan"
  -1,
  -1,
  -1,
  4293,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "instanc"
  -1,
  -1,
  -1,
  -1,
  -1,
  4320,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "instance"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4347,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "instanceo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4374,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "instanceof"
  (TokenType._instanceof << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "int"
  -1,
  -1,
  -1,
  -1,
  -1,
  4428,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "inte"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4455,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "inter"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4482,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "interf"
  -1,
  4509,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "interfa"
  -1,
  -1,
  -1,
  4536,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "interfac"
  -1,
  -1,
  -1,
  -1,
  -1,
  4563,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "interface"
  ContextualKeyword._interface << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "is"
  ContextualKeyword._is << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "k"
  -1,
  -1,
  -1,
  -1,
  -1,
  4644,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ke"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4671,
  -1,
  // "key"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4698,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "keyo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4725,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "keyof"
  ContextualKeyword._keyof << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "l"
  -1,
  -1,
  -1,
  -1,
  -1,
  4779,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "le"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4806,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "let"
  (TokenType._let << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "m"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4860,
  -1,
  -1,
  -1,
  -1,
  -1,
  4995,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4887,
  -1,
  -1,
  // "mix"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4914,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mixi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4941,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mixin"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  4968,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mixins"
  ContextualKeyword._mixins << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mo"
  -1,
  -1,
  -1,
  -1,
  5022,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "mod"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5049,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "modu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5076,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "modul"
  -1,
  -1,
  -1,
  -1,
  -1,
  5103,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "module"
  ContextualKeyword._module << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "n"
  -1,
  5157,
  -1,
  -1,
  -1,
  5373,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5427,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "na"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5184,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "nam"
  -1,
  -1,
  -1,
  -1,
  -1,
  5211,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "name"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5238,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "names"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5265,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "namesp"
  -1,
  5292,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "namespa"
  -1,
  -1,
  -1,
  5319,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "namespac"
  -1,
  -1,
  -1,
  -1,
  -1,
  5346,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "namespace"
  ContextualKeyword._namespace << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ne"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5400,
  -1,
  -1,
  -1,
  // "new"
  (TokenType._new << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "nu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5454,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "nul"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5481,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "null"
  (TokenType._null << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "o"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5535,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5562,
  -1,
  -1,
  -1,
  -1,
  5697,
  5751,
  -1,
  -1,
  -1,
  -1,
  // "of"
  ContextualKeyword._of << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "op"
  -1,
  5589,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "opa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5616,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "opaq"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5643,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "opaqu"
  -1,
  -1,
  -1,
  -1,
  -1,
  5670,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "opaque"
  ContextualKeyword._opaque << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ou"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5724,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "out"
  ContextualKeyword._out << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ov"
  -1,
  -1,
  -1,
  -1,
  -1,
  5778,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ove"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5805,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "over"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5832,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "overr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5859,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "overri"
  -1,
  -1,
  -1,
  -1,
  5886,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "overrid"
  -1,
  -1,
  -1,
  -1,
  -1,
  5913,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "override"
  ContextualKeyword._override << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "p"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5967,
  -1,
  -1,
  6345,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "pr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  5994,
  -1,
  -1,
  -1,
  -1,
  -1,
  6129,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "pri"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6021,
  -1,
  -1,
  -1,
  -1,
  // "priv"
  -1,
  6048,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "priva"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6075,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "privat"
  -1,
  -1,
  -1,
  -1,
  -1,
  6102,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "private"
  ContextualKeyword._private << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "pro"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6156,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "prot"
  -1,
  -1,
  -1,
  -1,
  -1,
  6183,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6318,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "prote"
  -1,
  -1,
  -1,
  6210,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "protec"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6237,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "protect"
  -1,
  -1,
  -1,
  -1,
  -1,
  6264,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "protecte"
  -1,
  -1,
  -1,
  -1,
  6291,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "protected"
  ContextualKeyword._protected << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "proto"
  ContextualKeyword._proto << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "pu"
  -1,
  -1,
  6372,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "pub"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6399,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "publ"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6426,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "publi"
  -1,
  -1,
  -1,
  6453,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "public"
  ContextualKeyword._public << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "r"
  -1,
  -1,
  -1,
  -1,
  -1,
  6507,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "re"
  -1,
  6534,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6696,
  -1,
  -1,
  6831,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "rea"
  -1,
  -1,
  -1,
  -1,
  6561,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "read"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6588,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "reado"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6615,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "readon"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6642,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "readonl"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6669,
  -1,
  // "readonly"
  ContextualKeyword._readonly << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "req"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6723,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "requ"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6750,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "requi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6777,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "requir"
  -1,
  -1,
  -1,
  -1,
  -1,
  6804,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "require"
  ContextualKeyword._require << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ret"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6858,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "retu"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6885,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "retur"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6912,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "return"
  (TokenType._return << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "s"
  -1,
  6966,
  -1,
  -1,
  -1,
  7182,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7236,
  7371,
  -1,
  7479,
  -1,
  7614,
  -1,
  // "sa"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  6993,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sat"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7020,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sati"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7047,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "satis"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7074,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "satisf"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7101,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "satisfi"
  -1,
  -1,
  -1,
  -1,
  -1,
  7128,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "satisfie"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7155,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "satisfies"
  ContextualKeyword._satisfies << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "se"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7209,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "set"
  ContextualKeyword._set << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "st"
  -1,
  7263,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sta"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7290,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "stat"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7317,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "stati"
  -1,
  -1,
  -1,
  7344,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "static"
  ContextualKeyword._static << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "su"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7398,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sup"
  -1,
  -1,
  -1,
  -1,
  -1,
  7425,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "supe"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7452,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "super"
  (TokenType._super << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sw"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7506,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "swi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7533,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "swit"
  -1,
  -1,
  -1,
  7560,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "switc"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7587,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "switch"
  (TokenType._switch << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sy"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7641,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "sym"
  -1,
  -1,
  7668,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "symb"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7695,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "symbo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7722,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "symbol"
  ContextualKeyword._symbol << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "t"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7776,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7938,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8046,
  -1,
  // "th"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7803,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7857,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "thi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7830,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "this"
  (TokenType._this << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "thr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7884,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "thro"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7911,
  -1,
  -1,
  -1,
  // "throw"
  (TokenType._throw << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "tr"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  7965,
  -1,
  -1,
  -1,
  8019,
  -1,
  // "tru"
  -1,
  -1,
  -1,
  -1,
  -1,
  7992,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "true"
  (TokenType._true << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "try"
  (TokenType._try << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "ty"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8073,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "typ"
  -1,
  -1,
  -1,
  -1,
  -1,
  8100,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "type"
  ContextualKeyword._type << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8127,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "typeo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8154,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "typeof"
  (TokenType._typeof << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "u"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8208,
  -1,
  -1,
  -1,
  -1,
  8343,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "un"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8235,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "uni"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8262,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "uniq"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8289,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "uniqu"
  -1,
  -1,
  -1,
  -1,
  -1,
  8316,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "unique"
  ContextualKeyword._unique << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "us"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8370,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "usi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8397,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "usin"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8424,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "using"
  ContextualKeyword._using << 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "v"
  -1,
  8478,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8532,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "va"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8505,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "var"
  (TokenType._var << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "vo"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8559,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "voi"
  -1,
  -1,
  -1,
  -1,
  8586,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "void"
  (TokenType._void << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "w"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8640,
  8748,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "wh"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8667,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "whi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8694,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "whil"
  -1,
  -1,
  -1,
  -1,
  -1,
  8721,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "while"
  (TokenType._while << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "wi"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8775,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "wit"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8802,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "with"
  (TokenType._with << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "y"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8856,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "yi"
  -1,
  -1,
  -1,
  -1,
  -1,
  8883,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "yie"
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  8910,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "yiel"
  -1,
  -1,
  -1,
  -1,
  8937,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // "yield"
  (TokenType._yield << 1) + 1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
]);

// node_modules/sucrase/dist/esm/parser/tokenizer/readWord.js
function readWord() {
  let treePos = 0;
  let code = 0;
  let pos = state.pos;
  while (pos < input.length) {
    code = input.charCodeAt(pos);
    if (code < charCodes.lowercaseA || code > charCodes.lowercaseZ) {
      break;
    }
    const next2 = READ_WORD_TREE[treePos + (code - charCodes.lowercaseA) + 1];
    if (next2 === -1) {
      break;
    } else {
      treePos = next2;
      pos++;
    }
  }
  const keywordValue = READ_WORD_TREE[treePos];
  if (keywordValue > -1 && !IS_IDENTIFIER_CHAR[code]) {
    state.pos = pos;
    if (keywordValue & 1) {
      finishToken(keywordValue >>> 1);
    } else {
      finishToken(TokenType.name, keywordValue >>> 1);
    }
    return;
  }
  while (pos < input.length) {
    const ch = input.charCodeAt(pos);
    if (IS_IDENTIFIER_CHAR[ch]) {
      pos++;
    } else if (ch === charCodes.backslash) {
      pos += 2;
      if (input.charCodeAt(pos) === charCodes.leftCurlyBrace) {
        while (pos < input.length && input.charCodeAt(pos) !== charCodes.rightCurlyBrace) {
          pos++;
        }
        pos++;
      }
    } else if (ch === charCodes.atSign && input.charCodeAt(pos + 1) === charCodes.atSign) {
      pos += 2;
    } else {
      break;
    }
  }
  state.pos = pos;
  finishToken(TokenType.name);
}

// node_modules/sucrase/dist/esm/parser/tokenizer/index.js
var IdentifierRole;
(function(IdentifierRole2) {
  const Access = 0;
  IdentifierRole2[IdentifierRole2["Access"] = Access] = "Access";
  const ExportAccess = Access + 1;
  IdentifierRole2[IdentifierRole2["ExportAccess"] = ExportAccess] = "ExportAccess";
  const TopLevelDeclaration = ExportAccess + 1;
  IdentifierRole2[IdentifierRole2["TopLevelDeclaration"] = TopLevelDeclaration] = "TopLevelDeclaration";
  const FunctionScopedDeclaration = TopLevelDeclaration + 1;
  IdentifierRole2[IdentifierRole2["FunctionScopedDeclaration"] = FunctionScopedDeclaration] = "FunctionScopedDeclaration";
  const BlockScopedDeclaration = FunctionScopedDeclaration + 1;
  IdentifierRole2[IdentifierRole2["BlockScopedDeclaration"] = BlockScopedDeclaration] = "BlockScopedDeclaration";
  const ObjectShorthandTopLevelDeclaration = BlockScopedDeclaration + 1;
  IdentifierRole2[IdentifierRole2["ObjectShorthandTopLevelDeclaration"] = ObjectShorthandTopLevelDeclaration] = "ObjectShorthandTopLevelDeclaration";
  const ObjectShorthandFunctionScopedDeclaration = ObjectShorthandTopLevelDeclaration + 1;
  IdentifierRole2[IdentifierRole2["ObjectShorthandFunctionScopedDeclaration"] = ObjectShorthandFunctionScopedDeclaration] = "ObjectShorthandFunctionScopedDeclaration";
  const ObjectShorthandBlockScopedDeclaration = ObjectShorthandFunctionScopedDeclaration + 1;
  IdentifierRole2[IdentifierRole2["ObjectShorthandBlockScopedDeclaration"] = ObjectShorthandBlockScopedDeclaration] = "ObjectShorthandBlockScopedDeclaration";
  const ObjectShorthand = ObjectShorthandBlockScopedDeclaration + 1;
  IdentifierRole2[IdentifierRole2["ObjectShorthand"] = ObjectShorthand] = "ObjectShorthand";
  const ImportDeclaration = ObjectShorthand + 1;
  IdentifierRole2[IdentifierRole2["ImportDeclaration"] = ImportDeclaration] = "ImportDeclaration";
  const ObjectKey = ImportDeclaration + 1;
  IdentifierRole2[IdentifierRole2["ObjectKey"] = ObjectKey] = "ObjectKey";
  const ImportAccess = ObjectKey + 1;
  IdentifierRole2[IdentifierRole2["ImportAccess"] = ImportAccess] = "ImportAccess";
})(IdentifierRole || (IdentifierRole = {}));
var JSXRole;
(function(JSXRole2) {
  const NoChildren = 0;
  JSXRole2[JSXRole2["NoChildren"] = NoChildren] = "NoChildren";
  const OneChild = NoChildren + 1;
  JSXRole2[JSXRole2["OneChild"] = OneChild] = "OneChild";
  const StaticChildren = OneChild + 1;
  JSXRole2[JSXRole2["StaticChildren"] = StaticChildren] = "StaticChildren";
  const KeyAfterPropSpread = StaticChildren + 1;
  JSXRole2[JSXRole2["KeyAfterPropSpread"] = KeyAfterPropSpread] = "KeyAfterPropSpread";
})(JSXRole || (JSXRole = {}));
function isDeclaration(token) {
  const role = token.identifierRole;
  return role === IdentifierRole.TopLevelDeclaration || role === IdentifierRole.FunctionScopedDeclaration || role === IdentifierRole.BlockScopedDeclaration || role === IdentifierRole.ObjectShorthandTopLevelDeclaration || role === IdentifierRole.ObjectShorthandFunctionScopedDeclaration || role === IdentifierRole.ObjectShorthandBlockScopedDeclaration;
}
function isNonTopLevelDeclaration(token) {
  const role = token.identifierRole;
  return role === IdentifierRole.FunctionScopedDeclaration || role === IdentifierRole.BlockScopedDeclaration || role === IdentifierRole.ObjectShorthandFunctionScopedDeclaration || role === IdentifierRole.ObjectShorthandBlockScopedDeclaration;
}
function isTopLevelDeclaration(token) {
  const role = token.identifierRole;
  return role === IdentifierRole.TopLevelDeclaration || role === IdentifierRole.ObjectShorthandTopLevelDeclaration || role === IdentifierRole.ImportDeclaration;
}
function isBlockScopedDeclaration(token) {
  const role = token.identifierRole;
  return role === IdentifierRole.TopLevelDeclaration || role === IdentifierRole.BlockScopedDeclaration || role === IdentifierRole.ObjectShorthandTopLevelDeclaration || role === IdentifierRole.ObjectShorthandBlockScopedDeclaration;
}
function isFunctionScopedDeclaration(token) {
  const role = token.identifierRole;
  return role === IdentifierRole.FunctionScopedDeclaration || role === IdentifierRole.ObjectShorthandFunctionScopedDeclaration;
}
function isObjectShorthandDeclaration(token) {
  return token.identifierRole === IdentifierRole.ObjectShorthandTopLevelDeclaration || token.identifierRole === IdentifierRole.ObjectShorthandBlockScopedDeclaration || token.identifierRole === IdentifierRole.ObjectShorthandFunctionScopedDeclaration;
}
var Token = class {
  constructor() {
    this.type = state.type;
    this.contextualKeyword = state.contextualKeyword;
    this.start = state.start;
    this.end = state.end;
    this.scopeDepth = state.scopeDepth;
    this.isType = state.isType;
    this.identifierRole = null;
    this.jsxRole = null;
    this.shadowsGlobal = false;
    this.isAsyncOperation = false;
    this.contextId = null;
    this.rhsEndIndex = null;
    this.isExpression = false;
    this.numNullishCoalesceStarts = 0;
    this.numNullishCoalesceEnds = 0;
    this.isOptionalChainStart = false;
    this.isOptionalChainEnd = false;
    this.subscriptStartIndex = null;
    this.nullishStartIndex = null;
  }
  // Initially false for all tokens, then may be computed in a follow-up step that does scope
  // analysis.
  // Initially false for all tokens, but may be set during transform to mark it as containing an
  // await operation.
  // For assignments, the index of the RHS. For export tokens, the end of the export.
  // For class tokens, records if the class is a class expression or a class statement.
  // Number of times to insert a `nullishCoalesce(` snippet before this token.
  // Number of times to insert a `)` snippet after this token.
  // If true, insert an `optionalChain([` snippet before this token.
  // If true, insert a `])` snippet after this token.
  // Tag for `.`, `?.`, `[`, `?.[`, `(`, and `?.(` to denote the "root" token for this
  // subscript chain. This can be used to determine if this chain is an optional chain.
  // Tag for `??` operators to denote the root token for this nullish coalescing call.
};
function next() {
  state.tokens.push(new Token());
  nextToken();
}
function nextTemplateToken() {
  state.tokens.push(new Token());
  state.start = state.pos;
  readTmplToken();
}
function retokenizeSlashAsRegex() {
  if (state.type === TokenType.assign) {
    --state.pos;
  }
  readRegexp();
}
function pushTypeContext(existingTokensInType) {
  for (let i = state.tokens.length - existingTokensInType; i < state.tokens.length; i++) {
    state.tokens[i].isType = true;
  }
  const oldIsType = state.isType;
  state.isType = true;
  return oldIsType;
}
function popTypeContext(oldIsType) {
  state.isType = oldIsType;
}
function eat(type) {
  if (match(type)) {
    next();
    return true;
  } else {
    return false;
  }
}
function eatTypeToken(tokenType) {
  const oldIsType = state.isType;
  state.isType = true;
  eat(tokenType);
  state.isType = oldIsType;
}
function match(type) {
  return state.type === type;
}
function lookaheadType() {
  const snapshot = state.snapshot();
  next();
  const type = state.type;
  state.restoreFromSnapshot(snapshot);
  return type;
}
var TypeAndKeyword = class {
  constructor(type, contextualKeyword) {
    this.type = type;
    this.contextualKeyword = contextualKeyword;
  }
};
function lookaheadTypeAndKeyword() {
  const snapshot = state.snapshot();
  next();
  const type = state.type;
  const contextualKeyword = state.contextualKeyword;
  state.restoreFromSnapshot(snapshot);
  return new TypeAndKeyword(type, contextualKeyword);
}
function nextTokenStart() {
  return nextTokenStartSince(state.pos);
}
function nextTokenStartSince(pos) {
  skipWhiteSpace.lastIndex = pos;
  const skip = skipWhiteSpace.exec(input);
  return pos + skip[0].length;
}
function lookaheadCharCode() {
  return input.charCodeAt(nextTokenStart());
}
function nextToken() {
  skipSpace();
  state.start = state.pos;
  if (state.pos >= input.length) {
    const tokens = state.tokens;
    if (tokens.length >= 2 && tokens[tokens.length - 1].start >= input.length && tokens[tokens.length - 2].start >= input.length) {
      unexpected("Unexpectedly reached the end of input.");
    }
    finishToken(TokenType.eof);
    return;
  }
  readToken(input.charCodeAt(state.pos));
}
function readToken(code) {
  if (IS_IDENTIFIER_START[code] || code === charCodes.backslash || code === charCodes.atSign && input.charCodeAt(state.pos + 1) === charCodes.atSign) {
    readWord();
  } else {
    getTokenFromCode(code);
  }
}
function skipBlockComment() {
  while (input.charCodeAt(state.pos) !== charCodes.asterisk || input.charCodeAt(state.pos + 1) !== charCodes.slash) {
    state.pos++;
    if (state.pos > input.length) {
      unexpected("Unterminated comment", state.pos - 2);
      return;
    }
  }
  state.pos += 2;
}
function skipLineComment(startSkip) {
  let ch = input.charCodeAt(state.pos += startSkip);
  if (state.pos < input.length) {
    while (ch !== charCodes.lineFeed && ch !== charCodes.carriageReturn && ch !== charCodes.lineSeparator && ch !== charCodes.paragraphSeparator && ++state.pos < input.length) {
      ch = input.charCodeAt(state.pos);
    }
  }
}
function skipSpace() {
  while (state.pos < input.length) {
    const ch = input.charCodeAt(state.pos);
    switch (ch) {
      case charCodes.carriageReturn:
        if (input.charCodeAt(state.pos + 1) === charCodes.lineFeed) {
          ++state.pos;
        }
      case charCodes.lineFeed:
      case charCodes.lineSeparator:
      case charCodes.paragraphSeparator:
        ++state.pos;
        break;
      case charCodes.slash:
        switch (input.charCodeAt(state.pos + 1)) {
          case charCodes.asterisk:
            state.pos += 2;
            skipBlockComment();
            break;
          case charCodes.slash:
            skipLineComment(2);
            break;
          default:
            return;
        }
        break;
      default:
        if (IS_WHITESPACE[ch]) {
          ++state.pos;
        } else {
          return;
        }
    }
  }
}
function finishToken(type, contextualKeyword = ContextualKeyword.NONE) {
  state.end = state.pos;
  state.type = type;
  state.contextualKeyword = contextualKeyword;
}
function readToken_dot() {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar >= charCodes.digit0 && nextChar <= charCodes.digit9) {
    readNumber(true);
    return;
  }
  if (nextChar === charCodes.dot && input.charCodeAt(state.pos + 2) === charCodes.dot) {
    state.pos += 3;
    finishToken(TokenType.ellipsis);
  } else {
    ++state.pos;
    finishToken(TokenType.dot);
  }
}
function readToken_slash() {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.assign, 2);
  } else {
    finishOp(TokenType.slash, 1);
  }
}
function readToken_mult_modulo(code) {
  let tokenType = code === charCodes.asterisk ? TokenType.star : TokenType.modulo;
  let width = 1;
  let nextChar = input.charCodeAt(state.pos + 1);
  if (code === charCodes.asterisk && nextChar === charCodes.asterisk) {
    width++;
    nextChar = input.charCodeAt(state.pos + 2);
    tokenType = TokenType.exponent;
  }
  if (nextChar === charCodes.equalsTo && input.charCodeAt(state.pos + 2) !== charCodes.greaterThan) {
    width++;
    tokenType = TokenType.assign;
  }
  finishOp(tokenType, width);
}
function readToken_pipe_amp(code) {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === code) {
    if (input.charCodeAt(state.pos + 2) === charCodes.equalsTo) {
      finishOp(TokenType.assign, 3);
    } else {
      finishOp(code === charCodes.verticalBar ? TokenType.logicalOR : TokenType.logicalAND, 2);
    }
    return;
  }
  if (code === charCodes.verticalBar) {
    if (nextChar === charCodes.greaterThan) {
      finishOp(TokenType.pipeline, 2);
      return;
    } else if (nextChar === charCodes.rightCurlyBrace && isFlowEnabled) {
      finishOp(TokenType.braceBarR, 2);
      return;
    }
  }
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.assign, 2);
    return;
  }
  finishOp(code === charCodes.verticalBar ? TokenType.bitwiseOR : TokenType.bitwiseAND, 1);
}
function readToken_caret() {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.assign, 2);
  } else {
    finishOp(TokenType.bitwiseXOR, 1);
  }
}
function readToken_plus_min(code) {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === code) {
    finishOp(TokenType.preIncDec, 2);
    return;
  }
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.assign, 2);
  } else if (code === charCodes.plusSign) {
    finishOp(TokenType.plus, 1);
  } else {
    finishOp(TokenType.minus, 1);
  }
}
function readToken_lt() {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === charCodes.lessThan) {
    if (input.charCodeAt(state.pos + 2) === charCodes.equalsTo) {
      finishOp(TokenType.assign, 3);
      return;
    }
    if (state.isType) {
      finishOp(TokenType.lessThan, 1);
    } else {
      finishOp(TokenType.bitShiftL, 2);
    }
    return;
  }
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.relationalOrEqual, 2);
  } else {
    finishOp(TokenType.lessThan, 1);
  }
}
function readToken_gt() {
  if (state.isType) {
    finishOp(TokenType.greaterThan, 1);
    return;
  }
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === charCodes.greaterThan) {
    const size = input.charCodeAt(state.pos + 2) === charCodes.greaterThan ? 3 : 2;
    if (input.charCodeAt(state.pos + size) === charCodes.equalsTo) {
      finishOp(TokenType.assign, size + 1);
      return;
    }
    finishOp(TokenType.bitShiftR, size);
    return;
  }
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.relationalOrEqual, 2);
  } else {
    finishOp(TokenType.greaterThan, 1);
  }
}
function rescan_gt() {
  if (state.type === TokenType.greaterThan) {
    state.pos -= 1;
    readToken_gt();
  }
}
function readToken_eq_excl(code) {
  const nextChar = input.charCodeAt(state.pos + 1);
  if (nextChar === charCodes.equalsTo) {
    finishOp(TokenType.equality, input.charCodeAt(state.pos + 2) === charCodes.equalsTo ? 3 : 2);
    return;
  }
  if (code === charCodes.equalsTo && nextChar === charCodes.greaterThan) {
    state.pos += 2;
    finishToken(TokenType.arrow);
    return;
  }
  finishOp(code === charCodes.equalsTo ? TokenType.eq : TokenType.bang, 1);
}
function readToken_question() {
  const nextChar = input.charCodeAt(state.pos + 1);
  const nextChar2 = input.charCodeAt(state.pos + 2);
  if (nextChar === charCodes.questionMark && // In Flow (but not TypeScript), ??string is a valid type that should be
  // tokenized as two individual ? tokens.
  !(isFlowEnabled && state.isType)) {
    if (nextChar2 === charCodes.equalsTo) {
      finishOp(TokenType.assign, 3);
    } else {
      finishOp(TokenType.nullishCoalescing, 2);
    }
  } else if (nextChar === charCodes.dot && !(nextChar2 >= charCodes.digit0 && nextChar2 <= charCodes.digit9)) {
    state.pos += 2;
    finishToken(TokenType.questionDot);
  } else {
    ++state.pos;
    finishToken(TokenType.question);
  }
}
function getTokenFromCode(code) {
  switch (code) {
    case charCodes.numberSign:
      ++state.pos;
      finishToken(TokenType.hash);
      return;
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case charCodes.dot:
      readToken_dot();
      return;
    // Punctuation tokens.
    case charCodes.leftParenthesis:
      ++state.pos;
      finishToken(TokenType.parenL);
      return;
    case charCodes.rightParenthesis:
      ++state.pos;
      finishToken(TokenType.parenR);
      return;
    case charCodes.semicolon:
      ++state.pos;
      finishToken(TokenType.semi);
      return;
    case charCodes.comma:
      ++state.pos;
      finishToken(TokenType.comma);
      return;
    case charCodes.leftSquareBracket:
      ++state.pos;
      finishToken(TokenType.bracketL);
      return;
    case charCodes.rightSquareBracket:
      ++state.pos;
      finishToken(TokenType.bracketR);
      return;
    case charCodes.leftCurlyBrace:
      if (isFlowEnabled && input.charCodeAt(state.pos + 1) === charCodes.verticalBar) {
        finishOp(TokenType.braceBarL, 2);
      } else {
        ++state.pos;
        finishToken(TokenType.braceL);
      }
      return;
    case charCodes.rightCurlyBrace:
      ++state.pos;
      finishToken(TokenType.braceR);
      return;
    case charCodes.colon:
      if (input.charCodeAt(state.pos + 1) === charCodes.colon) {
        finishOp(TokenType.doubleColon, 2);
      } else {
        ++state.pos;
        finishToken(TokenType.colon);
      }
      return;
    case charCodes.questionMark:
      readToken_question();
      return;
    case charCodes.atSign:
      ++state.pos;
      finishToken(TokenType.at);
      return;
    case charCodes.graveAccent:
      ++state.pos;
      finishToken(TokenType.backQuote);
      return;
    case charCodes.digit0: {
      const nextChar = input.charCodeAt(state.pos + 1);
      if (nextChar === charCodes.lowercaseX || nextChar === charCodes.uppercaseX || nextChar === charCodes.lowercaseO || nextChar === charCodes.uppercaseO || nextChar === charCodes.lowercaseB || nextChar === charCodes.uppercaseB) {
        readRadixNumber();
        return;
      }
    }
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case charCodes.digit1:
    case charCodes.digit2:
    case charCodes.digit3:
    case charCodes.digit4:
    case charCodes.digit5:
    case charCodes.digit6:
    case charCodes.digit7:
    case charCodes.digit8:
    case charCodes.digit9:
      readNumber(false);
      return;
    // Quotes produce strings.
    case charCodes.quotationMark:
    case charCodes.apostrophe:
      readString(code);
      return;
    // Operators are parsed inline in tiny state machines. '=' (charCodes.equalsTo) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case charCodes.slash:
      readToken_slash();
      return;
    case charCodes.percentSign:
    case charCodes.asterisk:
      readToken_mult_modulo(code);
      return;
    case charCodes.verticalBar:
    case charCodes.ampersand:
      readToken_pipe_amp(code);
      return;
    case charCodes.caret:
      readToken_caret();
      return;
    case charCodes.plusSign:
    case charCodes.dash:
      readToken_plus_min(code);
      return;
    case charCodes.lessThan:
      readToken_lt();
      return;
    case charCodes.greaterThan:
      readToken_gt();
      return;
    case charCodes.equalsTo:
    case charCodes.exclamationMark:
      readToken_eq_excl(code);
      return;
    case charCodes.tilde:
      finishOp(TokenType.tilde, 1);
      return;
    default:
      break;
  }
  unexpected(`Unexpected character '${String.fromCharCode(code)}'`, state.pos);
}
function finishOp(type, size) {
  state.pos += size;
  finishToken(type);
}
function readRegexp() {
  const start = state.pos;
  let escaped = false;
  let inClass = false;
  for (; ; ) {
    if (state.pos >= input.length) {
      unexpected("Unterminated regular expression", start);
      return;
    }
    const code = input.charCodeAt(state.pos);
    if (escaped) {
      escaped = false;
    } else {
      if (code === charCodes.leftSquareBracket) {
        inClass = true;
      } else if (code === charCodes.rightSquareBracket && inClass) {
        inClass = false;
      } else if (code === charCodes.slash && !inClass) {
        break;
      }
      escaped = code === charCodes.backslash;
    }
    ++state.pos;
  }
  ++state.pos;
  skipWord();
  finishToken(TokenType.regexp);
}
function readInt() {
  while (true) {
    const code = input.charCodeAt(state.pos);
    if (code >= charCodes.digit0 && code <= charCodes.digit9 || code === charCodes.underscore) {
      state.pos++;
    } else {
      break;
    }
  }
}
function readRadixNumber() {
  state.pos += 2;
  while (true) {
    const code = input.charCodeAt(state.pos);
    if (code >= charCodes.digit0 && code <= charCodes.digit9 || code >= charCodes.lowercaseA && code <= charCodes.lowercaseF || code >= charCodes.uppercaseA && code <= charCodes.uppercaseF || code === charCodes.underscore) {
      state.pos++;
    } else {
      break;
    }
  }
  const nextChar = input.charCodeAt(state.pos);
  if (nextChar === charCodes.lowercaseN) {
    ++state.pos;
    finishToken(TokenType.bigint);
  } else {
    finishToken(TokenType.num);
  }
}
function readNumber(startsWithDot) {
  let isBigInt = false;
  let isDecimal = false;
  if (!startsWithDot) {
    readInt();
  }
  let nextChar = input.charCodeAt(state.pos);
  if (nextChar === charCodes.dot) {
    ++state.pos;
    readInt();
    nextChar = input.charCodeAt(state.pos);
  }
  if (nextChar === charCodes.uppercaseE || nextChar === charCodes.lowercaseE) {
    nextChar = input.charCodeAt(++state.pos);
    if (nextChar === charCodes.plusSign || nextChar === charCodes.dash) {
      ++state.pos;
    }
    readInt();
    nextChar = input.charCodeAt(state.pos);
  }
  if (nextChar === charCodes.lowercaseN) {
    ++state.pos;
    isBigInt = true;
  } else if (nextChar === charCodes.lowercaseM) {
    ++state.pos;
    isDecimal = true;
  }
  if (isBigInt) {
    finishToken(TokenType.bigint);
    return;
  }
  if (isDecimal) {
    finishToken(TokenType.decimal);
    return;
  }
  finishToken(TokenType.num);
}
function readString(quote) {
  state.pos++;
  for (; ; ) {
    if (state.pos >= input.length) {
      unexpected("Unterminated string constant");
      return;
    }
    const ch = input.charCodeAt(state.pos);
    if (ch === charCodes.backslash) {
      state.pos++;
    } else if (ch === quote) {
      break;
    }
    state.pos++;
  }
  state.pos++;
  finishToken(TokenType.string);
}
function readTmplToken() {
  for (; ; ) {
    if (state.pos >= input.length) {
      unexpected("Unterminated template");
      return;
    }
    const ch = input.charCodeAt(state.pos);
    if (ch === charCodes.graveAccent || ch === charCodes.dollarSign && input.charCodeAt(state.pos + 1) === charCodes.leftCurlyBrace) {
      if (state.pos === state.start && match(TokenType.template)) {
        if (ch === charCodes.dollarSign) {
          state.pos += 2;
          finishToken(TokenType.dollarBraceL);
          return;
        } else {
          ++state.pos;
          finishToken(TokenType.backQuote);
          return;
        }
      }
      finishToken(TokenType.template);
      return;
    }
    if (ch === charCodes.backslash) {
      state.pos++;
    }
    state.pos++;
  }
}
function skipWord() {
  while (state.pos < input.length) {
    const ch = input.charCodeAt(state.pos);
    if (IS_IDENTIFIER_CHAR[ch]) {
      state.pos++;
    } else if (ch === charCodes.backslash) {
      state.pos += 2;
      if (input.charCodeAt(state.pos) === charCodes.leftCurlyBrace) {
        while (state.pos < input.length && input.charCodeAt(state.pos) !== charCodes.rightCurlyBrace) {
          state.pos++;
        }
        state.pos++;
      }
    } else {
      break;
    }
  }
}

// node_modules/sucrase/dist/esm/util/getImportExportSpecifierInfo.js
function getImportExportSpecifierInfo(tokens, index = tokens.currentIndex()) {
  let endIndex = index + 1;
  if (isSpecifierEnd(tokens, endIndex)) {
    const name = tokens.identifierNameAtIndex(index);
    return {
      isType: false,
      leftName: name,
      rightName: name,
      endIndex
    };
  }
  endIndex++;
  if (isSpecifierEnd(tokens, endIndex)) {
    return {
      isType: true,
      leftName: null,
      rightName: null,
      endIndex
    };
  }
  endIndex++;
  if (isSpecifierEnd(tokens, endIndex)) {
    return {
      isType: false,
      leftName: tokens.identifierNameAtIndex(index),
      rightName: tokens.identifierNameAtIndex(index + 2),
      endIndex
    };
  }
  endIndex++;
  if (isSpecifierEnd(tokens, endIndex)) {
    return {
      isType: true,
      leftName: null,
      rightName: null,
      endIndex
    };
  }
  throw new Error(`Unexpected import/export specifier at ${index}`);
}
function isSpecifierEnd(tokens, index) {
  const token = tokens.tokens[index];
  return token.type === TokenType.braceR || token.type === TokenType.comma;
}

// node_modules/sucrase/dist/esm/parser/plugins/jsx/xhtml.js
var xhtml_default = /* @__PURE__ */ new Map([
  ["quot", '"'],
  ["amp", "&"],
  ["apos", "'"],
  ["lt", "<"],
  ["gt", ">"],
  ["nbsp", "\xA0"],
  ["iexcl", "\xA1"],
  ["cent", "\xA2"],
  ["pound", "\xA3"],
  ["curren", "\xA4"],
  ["yen", "\xA5"],
  ["brvbar", "\xA6"],
  ["sect", "\xA7"],
  ["uml", "\xA8"],
  ["copy", "\xA9"],
  ["ordf", "\xAA"],
  ["laquo", "\xAB"],
  ["not", "\xAC"],
  ["shy", "\xAD"],
  ["reg", "\xAE"],
  ["macr", "\xAF"],
  ["deg", "\xB0"],
  ["plusmn", "\xB1"],
  ["sup2", "\xB2"],
  ["sup3", "\xB3"],
  ["acute", "\xB4"],
  ["micro", "\xB5"],
  ["para", "\xB6"],
  ["middot", "\xB7"],
  ["cedil", "\xB8"],
  ["sup1", "\xB9"],
  ["ordm", "\xBA"],
  ["raquo", "\xBB"],
  ["frac14", "\xBC"],
  ["frac12", "\xBD"],
  ["frac34", "\xBE"],
  ["iquest", "\xBF"],
  ["Agrave", "\xC0"],
  ["Aacute", "\xC1"],
  ["Acirc", "\xC2"],
  ["Atilde", "\xC3"],
  ["Auml", "\xC4"],
  ["Aring", "\xC5"],
  ["AElig", "\xC6"],
  ["Ccedil", "\xC7"],
  ["Egrave", "\xC8"],
  ["Eacute", "\xC9"],
  ["Ecirc", "\xCA"],
  ["Euml", "\xCB"],
  ["Igrave", "\xCC"],
  ["Iacute", "\xCD"],
  ["Icirc", "\xCE"],
  ["Iuml", "\xCF"],
  ["ETH", "\xD0"],
  ["Ntilde", "\xD1"],
  ["Ograve", "\xD2"],
  ["Oacute", "\xD3"],
  ["Ocirc", "\xD4"],
  ["Otilde", "\xD5"],
  ["Ouml", "\xD6"],
  ["times", "\xD7"],
  ["Oslash", "\xD8"],
  ["Ugrave", "\xD9"],
  ["Uacute", "\xDA"],
  ["Ucirc", "\xDB"],
  ["Uuml", "\xDC"],
  ["Yacute", "\xDD"],
  ["THORN", "\xDE"],
  ["szlig", "\xDF"],
  ["agrave", "\xE0"],
  ["aacute", "\xE1"],
  ["acirc", "\xE2"],
  ["atilde", "\xE3"],
  ["auml", "\xE4"],
  ["aring", "\xE5"],
  ["aelig", "\xE6"],
  ["ccedil", "\xE7"],
  ["egrave", "\xE8"],
  ["eacute", "\xE9"],
  ["ecirc", "\xEA"],
  ["euml", "\xEB"],
  ["igrave", "\xEC"],
  ["iacute", "\xED"],
  ["icirc", "\xEE"],
  ["iuml", "\xEF"],
  ["eth", "\xF0"],
  ["ntilde", "\xF1"],
  ["ograve", "\xF2"],
  ["oacute", "\xF3"],
  ["ocirc", "\xF4"],
  ["otilde", "\xF5"],
  ["ouml", "\xF6"],
  ["divide", "\xF7"],
  ["oslash", "\xF8"],
  ["ugrave", "\xF9"],
  ["uacute", "\xFA"],
  ["ucirc", "\xFB"],
  ["uuml", "\xFC"],
  ["yacute", "\xFD"],
  ["thorn", "\xFE"],
  ["yuml", "\xFF"],
  ["OElig", "\u0152"],
  ["oelig", "\u0153"],
  ["Scaron", "\u0160"],
  ["scaron", "\u0161"],
  ["Yuml", "\u0178"],
  ["fnof", "\u0192"],
  ["circ", "\u02C6"],
  ["tilde", "\u02DC"],
  ["Alpha", "\u0391"],
  ["Beta", "\u0392"],
  ["Gamma", "\u0393"],
  ["Delta", "\u0394"],
  ["Epsilon", "\u0395"],
  ["Zeta", "\u0396"],
  ["Eta", "\u0397"],
  ["Theta", "\u0398"],
  ["Iota", "\u0399"],
  ["Kappa", "\u039A"],
  ["Lambda", "\u039B"],
  ["Mu", "\u039C"],
  ["Nu", "\u039D"],
  ["Xi", "\u039E"],
  ["Omicron", "\u039F"],
  ["Pi", "\u03A0"],
  ["Rho", "\u03A1"],
  ["Sigma", "\u03A3"],
  ["Tau", "\u03A4"],
  ["Upsilon", "\u03A5"],
  ["Phi", "\u03A6"],
  ["Chi", "\u03A7"],
  ["Psi", "\u03A8"],
  ["Omega", "\u03A9"],
  ["alpha", "\u03B1"],
  ["beta", "\u03B2"],
  ["gamma", "\u03B3"],
  ["delta", "\u03B4"],
  ["epsilon", "\u03B5"],
  ["zeta", "\u03B6"],
  ["eta", "\u03B7"],
  ["theta", "\u03B8"],
  ["iota", "\u03B9"],
  ["kappa", "\u03BA"],
  ["lambda", "\u03BB"],
  ["mu", "\u03BC"],
  ["nu", "\u03BD"],
  ["xi", "\u03BE"],
  ["omicron", "\u03BF"],
  ["pi", "\u03C0"],
  ["rho", "\u03C1"],
  ["sigmaf", "\u03C2"],
  ["sigma", "\u03C3"],
  ["tau", "\u03C4"],
  ["upsilon", "\u03C5"],
  ["phi", "\u03C6"],
  ["chi", "\u03C7"],
  ["psi", "\u03C8"],
  ["omega", "\u03C9"],
  ["thetasym", "\u03D1"],
  ["upsih", "\u03D2"],
  ["piv", "\u03D6"],
  ["ensp", "\u2002"],
  ["emsp", "\u2003"],
  ["thinsp", "\u2009"],
  ["zwnj", "\u200C"],
  ["zwj", "\u200D"],
  ["lrm", "\u200E"],
  ["rlm", "\u200F"],
  ["ndash", "\u2013"],
  ["mdash", "\u2014"],
  ["lsquo", "\u2018"],
  ["rsquo", "\u2019"],
  ["sbquo", "\u201A"],
  ["ldquo", "\u201C"],
  ["rdquo", "\u201D"],
  ["bdquo", "\u201E"],
  ["dagger", "\u2020"],
  ["Dagger", "\u2021"],
  ["bull", "\u2022"],
  ["hellip", "\u2026"],
  ["permil", "\u2030"],
  ["prime", "\u2032"],
  ["Prime", "\u2033"],
  ["lsaquo", "\u2039"],
  ["rsaquo", "\u203A"],
  ["oline", "\u203E"],
  ["frasl", "\u2044"],
  ["euro", "\u20AC"],
  ["image", "\u2111"],
  ["weierp", "\u2118"],
  ["real", "\u211C"],
  ["trade", "\u2122"],
  ["alefsym", "\u2135"],
  ["larr", "\u2190"],
  ["uarr", "\u2191"],
  ["rarr", "\u2192"],
  ["darr", "\u2193"],
  ["harr", "\u2194"],
  ["crarr", "\u21B5"],
  ["lArr", "\u21D0"],
  ["uArr", "\u21D1"],
  ["rArr", "\u21D2"],
  ["dArr", "\u21D3"],
  ["hArr", "\u21D4"],
  ["forall", "\u2200"],
  ["part", "\u2202"],
  ["exist", "\u2203"],
  ["empty", "\u2205"],
  ["nabla", "\u2207"],
  ["isin", "\u2208"],
  ["notin", "\u2209"],
  ["ni", "\u220B"],
  ["prod", "\u220F"],
  ["sum", "\u2211"],
  ["minus", "\u2212"],
  ["lowast", "\u2217"],
  ["radic", "\u221A"],
  ["prop", "\u221D"],
  ["infin", "\u221E"],
  ["ang", "\u2220"],
  ["and", "\u2227"],
  ["or", "\u2228"],
  ["cap", "\u2229"],
  ["cup", "\u222A"],
  ["int", "\u222B"],
  ["there4", "\u2234"],
  ["sim", "\u223C"],
  ["cong", "\u2245"],
  ["asymp", "\u2248"],
  ["ne", "\u2260"],
  ["equiv", "\u2261"],
  ["le", "\u2264"],
  ["ge", "\u2265"],
  ["sub", "\u2282"],
  ["sup", "\u2283"],
  ["nsub", "\u2284"],
  ["sube", "\u2286"],
  ["supe", "\u2287"],
  ["oplus", "\u2295"],
  ["otimes", "\u2297"],
  ["perp", "\u22A5"],
  ["sdot", "\u22C5"],
  ["lceil", "\u2308"],
  ["rceil", "\u2309"],
  ["lfloor", "\u230A"],
  ["rfloor", "\u230B"],
  ["lang", "\u2329"],
  ["rang", "\u232A"],
  ["loz", "\u25CA"],
  ["spades", "\u2660"],
  ["clubs", "\u2663"],
  ["hearts", "\u2665"],
  ["diams", "\u2666"]
]);

// node_modules/sucrase/dist/esm/util/getJSXPragmaInfo.js
function getJSXPragmaInfo(options) {
  const [base, suffix] = splitPragma(options.jsxPragma || "React.createElement");
  const [fragmentBase, fragmentSuffix] = splitPragma(options.jsxFragmentPragma || "React.Fragment");
  return { base, suffix, fragmentBase, fragmentSuffix };
}
function splitPragma(pragma) {
  let dotIndex = pragma.indexOf(".");
  if (dotIndex === -1) {
    dotIndex = pragma.length;
  }
  return [pragma.slice(0, dotIndex), pragma.slice(dotIndex)];
}

// node_modules/sucrase/dist/esm/transformers/Transformer.js
var Transformer = class {
  // Return true if anything was processed, false otherwise.
  getPrefixCode() {
    return "";
  }
  getHoistedCode() {
    return "";
  }
  getSuffixCode() {
    return "";
  }
};

// node_modules/sucrase/dist/esm/transformers/JSXTransformer.js
var JSXTransformer = class _JSXTransformer extends Transformer {
  // State for calculating the line number of each JSX tag in development.
  __init() {
    this.lastLineNumber = 1;
  }
  __init2() {
    this.lastIndex = 0;
  }
  // In development, variable name holding the name of the current file.
  __init3() {
    this.filenameVarName = null;
  }
  // Mapping of claimed names for imports in the automatic transform, e,g.
  // {jsx: "_jsx"}. This determines which imports to generate in the prefix.
  __init4() {
    this.esmAutomaticImportNameResolutions = {};
  }
  // When automatically adding imports in CJS mode, we store the variable name
  // holding the imported CJS module so we can require it in the prefix.
  __init5() {
    this.cjsAutomaticModuleNameResolutions = {};
  }
  constructor(rootTransformer, tokens, importProcessor, nameManager, options) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.importProcessor = importProcessor;
    this.nameManager = nameManager;
    this.options = options;
    _JSXTransformer.prototype.__init.call(this);
    _JSXTransformer.prototype.__init2.call(this);
    _JSXTransformer.prototype.__init3.call(this);
    _JSXTransformer.prototype.__init4.call(this);
    _JSXTransformer.prototype.__init5.call(this);
    ;
    this.jsxPragmaInfo = getJSXPragmaInfo(options);
    this.isAutomaticRuntime = options.jsxRuntime === "automatic";
    this.jsxImportSource = options.jsxImportSource || "react";
  }
  process() {
    if (this.tokens.matches1(TokenType.jsxTagStart)) {
      this.processJSXTag();
      return true;
    }
    return false;
  }
  getPrefixCode() {
    let prefix = "";
    if (this.filenameVarName) {
      prefix += `const ${this.filenameVarName} = ${JSON.stringify(this.options.filePath || "")};`;
    }
    if (this.isAutomaticRuntime) {
      if (this.importProcessor) {
        for (const [path, resolvedName] of Object.entries(this.cjsAutomaticModuleNameResolutions)) {
          prefix += `var ${resolvedName} = require("${path}");`;
        }
      } else {
        const { createElement: createElementResolution, ...otherResolutions } = this.esmAutomaticImportNameResolutions;
        if (createElementResolution) {
          prefix += `import {createElement as ${createElementResolution}} from "${this.jsxImportSource}";`;
        }
        const importSpecifiers = Object.entries(otherResolutions).map(([name, resolvedName]) => `${name} as ${resolvedName}`).join(", ");
        if (importSpecifiers) {
          const importPath = this.jsxImportSource + (this.options.production ? "/jsx-runtime" : "/jsx-dev-runtime");
          prefix += `import {${importSpecifiers}} from "${importPath}";`;
        }
      }
    }
    return prefix;
  }
  processJSXTag() {
    const { jsxRole, start } = this.tokens.currentToken();
    const elementLocationCode = this.options.production ? null : this.getElementLocationCode(start);
    if (this.isAutomaticRuntime && jsxRole !== JSXRole.KeyAfterPropSpread) {
      this.transformTagToJSXFunc(elementLocationCode, jsxRole);
    } else {
      this.transformTagToCreateElement(elementLocationCode);
    }
  }
  getElementLocationCode(firstTokenStart) {
    const lineNumber = this.getLineNumberForIndex(firstTokenStart);
    return `lineNumber: ${lineNumber}`;
  }
  /**
   * Get the line number for this source position. This is calculated lazily and
   * must be called in increasing order by index.
   */
  getLineNumberForIndex(index) {
    const code = this.tokens.code;
    while (this.lastIndex < index && this.lastIndex < code.length) {
      if (code[this.lastIndex] === "\n") {
        this.lastLineNumber++;
      }
      this.lastIndex++;
    }
    return this.lastLineNumber;
  }
  /**
   * Convert the current JSX element to a call to jsx, jsxs, or jsxDEV. This is
   * the primary transformation for the automatic transform.
   *
   * Example:
   * <div a={1} key={2}>Hello{x}</div>
   * becomes
   * jsxs('div', {a: 1, children: ["Hello", x]}, 2)
   */
  transformTagToJSXFunc(elementLocationCode, jsxRole) {
    const isStatic = jsxRole === JSXRole.StaticChildren;
    this.tokens.replaceToken(this.getJSXFuncInvocationCode(isStatic));
    let keyCode = null;
    if (this.tokens.matches1(TokenType.jsxTagEnd)) {
      this.tokens.replaceToken(`${this.getFragmentCode()}, {`);
      this.processAutomaticChildrenAndEndProps(jsxRole);
    } else {
      this.processTagIntro();
      this.tokens.appendCode(", {");
      keyCode = this.processProps(true);
      if (this.tokens.matches2(TokenType.slash, TokenType.jsxTagEnd)) {
        this.tokens.appendCode("}");
      } else if (this.tokens.matches1(TokenType.jsxTagEnd)) {
        this.tokens.removeToken();
        this.processAutomaticChildrenAndEndProps(jsxRole);
      } else {
        throw new Error("Expected either /> or > at the end of the tag.");
      }
      if (keyCode) {
        this.tokens.appendCode(`, ${keyCode}`);
      }
    }
    if (!this.options.production) {
      if (keyCode === null) {
        this.tokens.appendCode(", void 0");
      }
      this.tokens.appendCode(`, ${isStatic}, ${this.getDevSource(elementLocationCode)}, this`);
    }
    this.tokens.removeInitialToken();
    while (!this.tokens.matches1(TokenType.jsxTagEnd)) {
      this.tokens.removeToken();
    }
    this.tokens.replaceToken(")");
  }
  /**
   * Convert the current JSX element to a createElement call. In the classic
   * runtime, this is the only case. In the automatic runtime, this is called
   * as a fallback in some situations.
   *
   * Example:
   * <div a={1} key={2}>Hello{x}</div>
   * becomes
   * React.createElement('div', {a: 1, key: 2}, "Hello", x)
   */
  transformTagToCreateElement(elementLocationCode) {
    this.tokens.replaceToken(this.getCreateElementInvocationCode());
    if (this.tokens.matches1(TokenType.jsxTagEnd)) {
      this.tokens.replaceToken(`${this.getFragmentCode()}, null`);
      this.processChildren(true);
    } else {
      this.processTagIntro();
      this.processPropsObjectWithDevInfo(elementLocationCode);
      if (this.tokens.matches2(TokenType.slash, TokenType.jsxTagEnd)) {
      } else if (this.tokens.matches1(TokenType.jsxTagEnd)) {
        this.tokens.removeToken();
        this.processChildren(true);
      } else {
        throw new Error("Expected either /> or > at the end of the tag.");
      }
    }
    this.tokens.removeInitialToken();
    while (!this.tokens.matches1(TokenType.jsxTagEnd)) {
      this.tokens.removeToken();
    }
    this.tokens.replaceToken(")");
  }
  /**
   * Get the code for the relevant function for this context: jsx, jsxs,
   * or jsxDEV. The following open-paren is included as well.
   *
   * These functions are only used for the automatic runtime, so they are always
   * auto-imported, but the auto-import will be either CJS or ESM based on the
   * target module format.
   */
  getJSXFuncInvocationCode(isStatic) {
    if (this.options.production) {
      if (isStatic) {
        return this.claimAutoImportedFuncInvocation("jsxs", "/jsx-runtime");
      } else {
        return this.claimAutoImportedFuncInvocation("jsx", "/jsx-runtime");
      }
    } else {
      return this.claimAutoImportedFuncInvocation("jsxDEV", "/jsx-dev-runtime");
    }
  }
  /**
   * Return the code to use for the createElement function, e.g.
   * `React.createElement`, including the following open-paren.
   *
   * This is the main function to use for the classic runtime. For the
   * automatic runtime, this function is used as a fallback function to
   * preserve behavior when there is a prop spread followed by an explicit
   * key. In that automatic runtime case, the function should be automatically
   * imported.
   */
  getCreateElementInvocationCode() {
    if (this.isAutomaticRuntime) {
      return this.claimAutoImportedFuncInvocation("createElement", "");
    } else {
      const { jsxPragmaInfo } = this;
      const resolvedPragmaBaseName = this.importProcessor ? this.importProcessor.getIdentifierReplacement(jsxPragmaInfo.base) || jsxPragmaInfo.base : jsxPragmaInfo.base;
      return `${resolvedPragmaBaseName}${jsxPragmaInfo.suffix}(`;
    }
  }
  /**
   * Return the code to use as the component when compiling a shorthand
   * fragment, e.g. `React.Fragment`.
   *
   * This may be called from either the classic or automatic runtime, and
   * the value should be auto-imported for the automatic runtime.
   */
  getFragmentCode() {
    if (this.isAutomaticRuntime) {
      return this.claimAutoImportedName(
        "Fragment",
        this.options.production ? "/jsx-runtime" : "/jsx-dev-runtime"
      );
    } else {
      const { jsxPragmaInfo } = this;
      const resolvedFragmentPragmaBaseName = this.importProcessor ? this.importProcessor.getIdentifierReplacement(jsxPragmaInfo.fragmentBase) || jsxPragmaInfo.fragmentBase : jsxPragmaInfo.fragmentBase;
      return resolvedFragmentPragmaBaseName + jsxPragmaInfo.fragmentSuffix;
    }
  }
  /**
   * Return code that invokes the given function.
   *
   * When the imports transform is enabled, use the CJSImportTransformer
   * strategy of using `.call(void 0, ...` to avoid passing a `this` value in a
   * situation that would otherwise look like a method call.
   */
  claimAutoImportedFuncInvocation(funcName, importPathSuffix) {
    const funcCode = this.claimAutoImportedName(funcName, importPathSuffix);
    if (this.importProcessor) {
      return `${funcCode}.call(void 0, `;
    } else {
      return `${funcCode}(`;
    }
  }
  claimAutoImportedName(funcName, importPathSuffix) {
    if (this.importProcessor) {
      const path = this.jsxImportSource + importPathSuffix;
      if (!this.cjsAutomaticModuleNameResolutions[path]) {
        this.cjsAutomaticModuleNameResolutions[path] = this.importProcessor.getFreeIdentifierForPath(path);
      }
      return `${this.cjsAutomaticModuleNameResolutions[path]}.${funcName}`;
    } else {
      if (!this.esmAutomaticImportNameResolutions[funcName]) {
        this.esmAutomaticImportNameResolutions[funcName] = this.nameManager.claimFreeName(
          `_${funcName}`
        );
      }
      return this.esmAutomaticImportNameResolutions[funcName];
    }
  }
  /**
   * Process the first part of a tag, before any props.
   */
  processTagIntro() {
    let introEnd = this.tokens.currentIndex() + 1;
    while (this.tokens.tokens[introEnd].isType || !this.tokens.matches2AtIndex(introEnd - 1, TokenType.jsxName, TokenType.jsxName) && !this.tokens.matches2AtIndex(introEnd - 1, TokenType.greaterThan, TokenType.jsxName) && !this.tokens.matches1AtIndex(introEnd, TokenType.braceL) && !this.tokens.matches1AtIndex(introEnd, TokenType.jsxTagEnd) && !this.tokens.matches2AtIndex(introEnd, TokenType.slash, TokenType.jsxTagEnd)) {
      introEnd++;
    }
    if (introEnd === this.tokens.currentIndex() + 1) {
      const tagName = this.tokens.identifierName();
      if (startsWithLowerCase(tagName)) {
        this.tokens.replaceToken(`'${tagName}'`);
      }
    }
    while (this.tokens.currentIndex() < introEnd) {
      this.rootTransformer.processToken();
    }
  }
  /**
   * Starting at the beginning of the props, add the props argument to
   * React.createElement, including the comma before it.
   */
  processPropsObjectWithDevInfo(elementLocationCode) {
    const devProps = this.options.production ? "" : `__self: this, __source: ${this.getDevSource(elementLocationCode)}`;
    if (!this.tokens.matches1(TokenType.jsxName) && !this.tokens.matches1(TokenType.braceL)) {
      if (devProps) {
        this.tokens.appendCode(`, {${devProps}}`);
      } else {
        this.tokens.appendCode(`, null`);
      }
      return;
    }
    this.tokens.appendCode(`, {`);
    this.processProps(false);
    if (devProps) {
      this.tokens.appendCode(` ${devProps}}`);
    } else {
      this.tokens.appendCode("}");
    }
  }
  /**
   * Transform the core part of the props, assuming that a { has already been
   * inserted before us and that a } will be inserted after us.
   *
   * If extractKeyCode is true (i.e. when using any jsx... function), any prop
   * named "key" has its code captured and returned rather than being emitted to
   * the output code. This shifts line numbers, and emitting the code later will
   * correct line numbers again. If no key is found or if extractKeyCode is
   * false, this function returns null.
   */
  processProps(extractKeyCode) {
    let keyCode = null;
    while (true) {
      if (this.tokens.matches2(TokenType.jsxName, TokenType.eq)) {
        const propName = this.tokens.identifierName();
        if (extractKeyCode && propName === "key") {
          if (keyCode !== null) {
            this.tokens.appendCode(keyCode.replace(/[^\n]/g, ""));
          }
          this.tokens.removeToken();
          this.tokens.removeToken();
          const snapshot = this.tokens.snapshot();
          this.processPropValue();
          keyCode = this.tokens.dangerouslyGetAndRemoveCodeSinceSnapshot(snapshot);
          continue;
        } else {
          this.processPropName(propName);
          this.tokens.replaceToken(": ");
          this.processPropValue();
        }
      } else if (this.tokens.matches1(TokenType.jsxName)) {
        const propName = this.tokens.identifierName();
        this.processPropName(propName);
        this.tokens.appendCode(": true");
      } else if (this.tokens.matches1(TokenType.braceL)) {
        this.tokens.replaceToken("");
        this.rootTransformer.processBalancedCode();
        this.tokens.replaceToken("");
      } else {
        break;
      }
      this.tokens.appendCode(",");
    }
    return keyCode;
  }
  processPropName(propName) {
    if (propName.includes("-")) {
      this.tokens.replaceToken(`'${propName}'`);
    } else {
      this.tokens.copyToken();
    }
  }
  processPropValue() {
    if (this.tokens.matches1(TokenType.braceL)) {
      this.tokens.replaceToken("");
      this.rootTransformer.processBalancedCode();
      this.tokens.replaceToken("");
    } else if (this.tokens.matches1(TokenType.jsxTagStart)) {
      this.processJSXTag();
    } else {
      this.processStringPropValue();
    }
  }
  processStringPropValue() {
    const token = this.tokens.currentToken();
    const valueCode = this.tokens.code.slice(token.start + 1, token.end - 1);
    const replacementCode = formatJSXTextReplacement(valueCode);
    const literalCode = formatJSXStringValueLiteral(valueCode);
    this.tokens.replaceToken(literalCode + replacementCode);
  }
  /**
   * Starting in the middle of the props object literal, produce an additional
   * prop for the children and close the object literal.
   */
  processAutomaticChildrenAndEndProps(jsxRole) {
    if (jsxRole === JSXRole.StaticChildren) {
      this.tokens.appendCode(" children: [");
      this.processChildren(false);
      this.tokens.appendCode("]}");
    } else {
      if (jsxRole === JSXRole.OneChild) {
        this.tokens.appendCode(" children: ");
      }
      this.processChildren(false);
      this.tokens.appendCode("}");
    }
  }
  /**
   * Transform children into a comma-separated list, which will be either
   * arguments to createElement or array elements of a children prop.
   */
  processChildren(needsInitialComma) {
    let needsComma = needsInitialComma;
    while (true) {
      if (this.tokens.matches2(TokenType.jsxTagStart, TokenType.slash)) {
        return;
      }
      let didEmitElement = false;
      if (this.tokens.matches1(TokenType.braceL)) {
        if (this.tokens.matches2(TokenType.braceL, TokenType.braceR)) {
          this.tokens.replaceToken("");
          this.tokens.replaceToken("");
        } else {
          this.tokens.replaceToken(needsComma ? ", " : "");
          this.rootTransformer.processBalancedCode();
          this.tokens.replaceToken("");
          didEmitElement = true;
        }
      } else if (this.tokens.matches1(TokenType.jsxTagStart)) {
        this.tokens.appendCode(needsComma ? ", " : "");
        this.processJSXTag();
        didEmitElement = true;
      } else if (this.tokens.matches1(TokenType.jsxText) || this.tokens.matches1(TokenType.jsxEmptyText)) {
        didEmitElement = this.processChildTextElement(needsComma);
      } else {
        throw new Error("Unexpected token when processing JSX children.");
      }
      if (didEmitElement) {
        needsComma = true;
      }
    }
  }
  /**
   * Turn a JSX text element into a string literal, or nothing at all if the JSX
   * text resolves to the empty string.
   *
   * Returns true if a string literal is emitted, false otherwise.
   */
  processChildTextElement(needsComma) {
    const token = this.tokens.currentToken();
    const valueCode = this.tokens.code.slice(token.start, token.end);
    const replacementCode = formatJSXTextReplacement(valueCode);
    const literalCode = formatJSXTextLiteral(valueCode);
    if (literalCode === '""') {
      this.tokens.replaceToken(replacementCode);
      return false;
    } else {
      this.tokens.replaceToken(`${needsComma ? ", " : ""}${literalCode}${replacementCode}`);
      return true;
    }
  }
  getDevSource(elementLocationCode) {
    return `{fileName: ${this.getFilenameVarName()}, ${elementLocationCode}}`;
  }
  getFilenameVarName() {
    if (!this.filenameVarName) {
      this.filenameVarName = this.nameManager.claimFreeName("_jsxFileName");
    }
    return this.filenameVarName;
  }
};
function startsWithLowerCase(s) {
  const firstChar = s.charCodeAt(0);
  return firstChar >= charCodes.lowercaseA && firstChar <= charCodes.lowercaseZ;
}
function formatJSXTextLiteral(text) {
  let result = "";
  let whitespace = "";
  let isInInitialLineWhitespace = false;
  let seenNonWhitespace = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === " " || c === "	" || c === "\r") {
      if (!isInInitialLineWhitespace) {
        whitespace += c;
      }
    } else if (c === "\n") {
      whitespace = "";
      isInInitialLineWhitespace = true;
    } else {
      if (seenNonWhitespace && isInInitialLineWhitespace) {
        result += " ";
      }
      result += whitespace;
      whitespace = "";
      if (c === "&") {
        const { entity, newI } = processEntity(text, i + 1);
        i = newI - 1;
        result += entity;
      } else {
        result += c;
      }
      seenNonWhitespace = true;
      isInInitialLineWhitespace = false;
    }
  }
  if (!isInInitialLineWhitespace) {
    result += whitespace;
  }
  return JSON.stringify(result);
}
function formatJSXTextReplacement(text) {
  let numNewlines = 0;
  let numSpaces = 0;
  for (const c of text) {
    if (c === "\n") {
      numNewlines++;
      numSpaces = 0;
    } else if (c === " ") {
      numSpaces++;
    }
  }
  return "\n".repeat(numNewlines) + " ".repeat(numSpaces);
}
function formatJSXStringValueLiteral(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "\n") {
      if (/\s/.test(text[i + 1])) {
        result += " ";
        while (i < text.length && /\s/.test(text[i + 1])) {
          i++;
        }
      } else {
        result += "\n";
      }
    } else if (c === "&") {
      const { entity, newI } = processEntity(text, i + 1);
      result += entity;
      i = newI - 1;
    } else {
      result += c;
    }
  }
  return JSON.stringify(result);
}
function processEntity(text, indexAfterAmpersand) {
  let str = "";
  let count = 0;
  let entity;
  let i = indexAfterAmpersand;
  if (text[i] === "#") {
    let radix = 10;
    i++;
    let numStart;
    if (text[i] === "x") {
      radix = 16;
      i++;
      numStart = i;
      while (i < text.length && isHexDigit(text.charCodeAt(i))) {
        i++;
      }
    } else {
      numStart = i;
      while (i < text.length && isDecimalDigit(text.charCodeAt(i))) {
        i++;
      }
    }
    if (text[i] === ";") {
      const numStr = text.slice(numStart, i);
      if (numStr) {
        i++;
        entity = String.fromCodePoint(parseInt(numStr, radix));
      }
    }
  } else {
    while (i < text.length && count++ < 10) {
      const ch = text[i];
      i++;
      if (ch === ";") {
        entity = xhtml_default.get(str);
        break;
      }
      str += ch;
    }
  }
  if (!entity) {
    return { entity: "&", newI: indexAfterAmpersand };
  }
  return { entity, newI: i };
}
function isDecimalDigit(code) {
  return code >= charCodes.digit0 && code <= charCodes.digit9;
}
function isHexDigit(code) {
  return code >= charCodes.digit0 && code <= charCodes.digit9 || code >= charCodes.lowercaseA && code <= charCodes.lowercaseF || code >= charCodes.uppercaseA && code <= charCodes.uppercaseF;
}

// node_modules/sucrase/dist/esm/util/getNonTypeIdentifiers.js
function getNonTypeIdentifiers(tokens, options) {
  const jsxPragmaInfo = getJSXPragmaInfo(options);
  const nonTypeIdentifiers = /* @__PURE__ */ new Set();
  for (let i = 0; i < tokens.tokens.length; i++) {
    const token = tokens.tokens[i];
    if (token.type === TokenType.name && !token.isType && (token.identifierRole === IdentifierRole.Access || token.identifierRole === IdentifierRole.ObjectShorthand || token.identifierRole === IdentifierRole.ExportAccess) && !token.shadowsGlobal) {
      nonTypeIdentifiers.add(tokens.identifierNameForToken(token));
    }
    if (token.type === TokenType.jsxTagStart) {
      nonTypeIdentifiers.add(jsxPragmaInfo.base);
    }
    if (token.type === TokenType.jsxTagStart && i + 1 < tokens.tokens.length && tokens.tokens[i + 1].type === TokenType.jsxTagEnd) {
      nonTypeIdentifiers.add(jsxPragmaInfo.base);
      nonTypeIdentifiers.add(jsxPragmaInfo.fragmentBase);
    }
    if (token.type === TokenType.jsxName && token.identifierRole === IdentifierRole.Access) {
      const identifierName = tokens.identifierNameForToken(token);
      if (!startsWithLowerCase(identifierName) || tokens.tokens[i + 1].type === TokenType.dot) {
        nonTypeIdentifiers.add(tokens.identifierNameForToken(token));
      }
    }
  }
  return nonTypeIdentifiers;
}

// node_modules/sucrase/dist/esm/CJSImportProcessor.js
var CJSImportProcessor = class _CJSImportProcessor {
  __init() {
    this.nonTypeIdentifiers = /* @__PURE__ */ new Set();
  }
  __init2() {
    this.importInfoByPath = /* @__PURE__ */ new Map();
  }
  __init3() {
    this.importsToReplace = /* @__PURE__ */ new Map();
  }
  __init4() {
    this.identifierReplacements = /* @__PURE__ */ new Map();
  }
  __init5() {
    this.exportBindingsByLocalName = /* @__PURE__ */ new Map();
  }
  constructor(nameManager, tokens, enableLegacyTypeScriptModuleInterop, options, isTypeScriptTransformEnabled, keepUnusedImports, helperManager) {
    ;
    this.nameManager = nameManager;
    this.tokens = tokens;
    this.enableLegacyTypeScriptModuleInterop = enableLegacyTypeScriptModuleInterop;
    this.options = options;
    this.isTypeScriptTransformEnabled = isTypeScriptTransformEnabled;
    this.keepUnusedImports = keepUnusedImports;
    this.helperManager = helperManager;
    _CJSImportProcessor.prototype.__init.call(this);
    _CJSImportProcessor.prototype.__init2.call(this);
    _CJSImportProcessor.prototype.__init3.call(this);
    _CJSImportProcessor.prototype.__init4.call(this);
    _CJSImportProcessor.prototype.__init5.call(this);
  }
  preprocessTokens() {
    for (let i = 0; i < this.tokens.tokens.length; i++) {
      if (this.tokens.matches1AtIndex(i, TokenType._import) && !this.tokens.matches3AtIndex(i, TokenType._import, TokenType.name, TokenType.eq)) {
        this.preprocessImportAtIndex(i);
      }
      if (this.tokens.matches1AtIndex(i, TokenType._export) && !this.tokens.matches2AtIndex(i, TokenType._export, TokenType.eq)) {
        this.preprocessExportAtIndex(i);
      }
    }
    this.generateImportReplacements();
  }
  /**
   * In TypeScript, import statements that only import types should be removed.
   * This includes `import {} from 'foo';`, but not `import 'foo';`.
   */
  pruneTypeOnlyImports() {
    this.nonTypeIdentifiers = getNonTypeIdentifiers(this.tokens, this.options);
    for (const [path, importInfo] of this.importInfoByPath.entries()) {
      if (importInfo.hasBareImport || importInfo.hasStarExport || importInfo.exportStarNames.length > 0 || importInfo.namedExports.length > 0) {
        continue;
      }
      const names = [
        ...importInfo.defaultNames,
        ...importInfo.wildcardNames,
        ...importInfo.namedImports.map(({ localName }) => localName)
      ];
      if (names.every((name) => this.shouldAutomaticallyElideImportedName(name))) {
        this.importsToReplace.set(path, "");
      }
    }
  }
  shouldAutomaticallyElideImportedName(name) {
    return this.isTypeScriptTransformEnabled && !this.keepUnusedImports && !this.nonTypeIdentifiers.has(name);
  }
  generateImportReplacements() {
    for (const [path, importInfo] of this.importInfoByPath.entries()) {
      const {
        defaultNames,
        wildcardNames,
        namedImports,
        namedExports,
        exportStarNames,
        hasStarExport
      } = importInfo;
      if (defaultNames.length === 0 && wildcardNames.length === 0 && namedImports.length === 0 && namedExports.length === 0 && exportStarNames.length === 0 && !hasStarExport) {
        this.importsToReplace.set(path, `require('${path}');`);
        continue;
      }
      const primaryImportName = this.getFreeIdentifierForPath(path);
      let secondaryImportName;
      if (this.enableLegacyTypeScriptModuleInterop) {
        secondaryImportName = primaryImportName;
      } else {
        secondaryImportName = wildcardNames.length > 0 ? wildcardNames[0] : this.getFreeIdentifierForPath(path);
      }
      let requireCode = `var ${primaryImportName} = require('${path}');`;
      if (wildcardNames.length > 0) {
        for (const wildcardName of wildcardNames) {
          const moduleExpr = this.enableLegacyTypeScriptModuleInterop ? primaryImportName : `${this.helperManager.getHelperName("interopRequireWildcard")}(${primaryImportName})`;
          requireCode += ` var ${wildcardName} = ${moduleExpr};`;
        }
      } else if (exportStarNames.length > 0 && secondaryImportName !== primaryImportName) {
        requireCode += ` var ${secondaryImportName} = ${this.helperManager.getHelperName(
          "interopRequireWildcard"
        )}(${primaryImportName});`;
      } else if (defaultNames.length > 0 && secondaryImportName !== primaryImportName) {
        requireCode += ` var ${secondaryImportName} = ${this.helperManager.getHelperName(
          "interopRequireDefault"
        )}(${primaryImportName});`;
      }
      for (const { importedName, localName } of namedExports) {
        requireCode += ` ${this.helperManager.getHelperName(
          "createNamedExportFrom"
        )}(${primaryImportName}, '${localName}', '${importedName}');`;
      }
      for (const exportStarName of exportStarNames) {
        requireCode += ` exports.${exportStarName} = ${secondaryImportName};`;
      }
      if (hasStarExport) {
        requireCode += ` ${this.helperManager.getHelperName(
          "createStarExport"
        )}(${primaryImportName});`;
      }
      this.importsToReplace.set(path, requireCode);
      for (const defaultName of defaultNames) {
        this.identifierReplacements.set(defaultName, `${secondaryImportName}.default`);
      }
      for (const { importedName, localName } of namedImports) {
        this.identifierReplacements.set(localName, `${primaryImportName}.${importedName}`);
      }
    }
  }
  getFreeIdentifierForPath(path) {
    const components = path.split("/");
    const lastComponent = components[components.length - 1];
    const baseName = lastComponent.replace(/\W/g, "");
    return this.nameManager.claimFreeName(`_${baseName}`);
  }
  preprocessImportAtIndex(index) {
    const defaultNames = [];
    const wildcardNames = [];
    const namedImports = [];
    index++;
    if ((this.tokens.matchesContextualAtIndex(index, ContextualKeyword._type) || this.tokens.matches1AtIndex(index, TokenType._typeof)) && !this.tokens.matches1AtIndex(index + 1, TokenType.comma) && !this.tokens.matchesContextualAtIndex(index + 1, ContextualKeyword._from)) {
      return;
    }
    if (this.tokens.matches1AtIndex(index, TokenType.parenL)) {
      return;
    }
    if (this.tokens.matches1AtIndex(index, TokenType.name)) {
      defaultNames.push(this.tokens.identifierNameAtIndex(index));
      index++;
      if (this.tokens.matches1AtIndex(index, TokenType.comma)) {
        index++;
      }
    }
    if (this.tokens.matches1AtIndex(index, TokenType.star)) {
      index += 2;
      wildcardNames.push(this.tokens.identifierNameAtIndex(index));
      index++;
    }
    if (this.tokens.matches1AtIndex(index, TokenType.braceL)) {
      const result = this.getNamedImports(index + 1);
      index = result.newIndex;
      for (const namedImport of result.namedImports) {
        if (namedImport.importedName === "default") {
          defaultNames.push(namedImport.localName);
        } else {
          namedImports.push(namedImport);
        }
      }
    }
    if (this.tokens.matchesContextualAtIndex(index, ContextualKeyword._from)) {
      index++;
    }
    if (!this.tokens.matches1AtIndex(index, TokenType.string)) {
      throw new Error("Expected string token at the end of import statement.");
    }
    const path = this.tokens.stringValueAtIndex(index);
    const importInfo = this.getImportInfo(path);
    importInfo.defaultNames.push(...defaultNames);
    importInfo.wildcardNames.push(...wildcardNames);
    importInfo.namedImports.push(...namedImports);
    if (defaultNames.length === 0 && wildcardNames.length === 0 && namedImports.length === 0) {
      importInfo.hasBareImport = true;
    }
  }
  preprocessExportAtIndex(index) {
    if (this.tokens.matches2AtIndex(index, TokenType._export, TokenType._var) || this.tokens.matches2AtIndex(index, TokenType._export, TokenType._let) || this.tokens.matches2AtIndex(index, TokenType._export, TokenType._const)) {
      this.preprocessVarExportAtIndex(index);
    } else if (this.tokens.matches2AtIndex(index, TokenType._export, TokenType._function) || this.tokens.matches2AtIndex(index, TokenType._export, TokenType._class)) {
      const exportName = this.tokens.identifierNameAtIndex(index + 2);
      this.addExportBinding(exportName, exportName);
    } else if (this.tokens.matches3AtIndex(index, TokenType._export, TokenType.name, TokenType._function)) {
      const exportName = this.tokens.identifierNameAtIndex(index + 3);
      this.addExportBinding(exportName, exportName);
    } else if (this.tokens.matches2AtIndex(index, TokenType._export, TokenType.braceL)) {
      this.preprocessNamedExportAtIndex(index);
    } else if (this.tokens.matches2AtIndex(index, TokenType._export, TokenType.star)) {
      this.preprocessExportStarAtIndex(index);
    }
  }
  preprocessVarExportAtIndex(index) {
    let depth = 0;
    for (let i = index + 2; ; i++) {
      if (this.tokens.matches1AtIndex(i, TokenType.braceL) || this.tokens.matches1AtIndex(i, TokenType.dollarBraceL) || this.tokens.matches1AtIndex(i, TokenType.bracketL)) {
        depth++;
      } else if (this.tokens.matches1AtIndex(i, TokenType.braceR) || this.tokens.matches1AtIndex(i, TokenType.bracketR)) {
        depth--;
      } else if (depth === 0 && !this.tokens.matches1AtIndex(i, TokenType.name)) {
        break;
      } else if (this.tokens.matches1AtIndex(1, TokenType.eq)) {
        const endIndex = this.tokens.currentToken().rhsEndIndex;
        if (endIndex == null) {
          throw new Error("Expected = token with an end index.");
        }
        i = endIndex - 1;
      } else {
        const token = this.tokens.tokens[i];
        if (isDeclaration(token)) {
          const exportName = this.tokens.identifierNameAtIndex(i);
          this.identifierReplacements.set(exportName, `exports.${exportName}`);
        }
      }
    }
  }
  /**
   * Walk this export statement just in case it's an export...from statement.
   * If it is, combine it into the import info for that path. Otherwise, just
   * bail out; it'll be handled later.
   */
  preprocessNamedExportAtIndex(index) {
    index += 2;
    const { newIndex, namedImports } = this.getNamedImports(index);
    index = newIndex;
    if (this.tokens.matchesContextualAtIndex(index, ContextualKeyword._from)) {
      index++;
    } else {
      for (const { importedName: localName, localName: exportedName } of namedImports) {
        this.addExportBinding(localName, exportedName);
      }
      return;
    }
    if (!this.tokens.matches1AtIndex(index, TokenType.string)) {
      throw new Error("Expected string token at the end of import statement.");
    }
    const path = this.tokens.stringValueAtIndex(index);
    const importInfo = this.getImportInfo(path);
    importInfo.namedExports.push(...namedImports);
  }
  preprocessExportStarAtIndex(index) {
    let exportedName = null;
    if (this.tokens.matches3AtIndex(index, TokenType._export, TokenType.star, TokenType._as)) {
      index += 3;
      exportedName = this.tokens.identifierNameAtIndex(index);
      index += 2;
    } else {
      index += 3;
    }
    if (!this.tokens.matches1AtIndex(index, TokenType.string)) {
      throw new Error("Expected string token at the end of star export statement.");
    }
    const path = this.tokens.stringValueAtIndex(index);
    const importInfo = this.getImportInfo(path);
    if (exportedName !== null) {
      importInfo.exportStarNames.push(exportedName);
    } else {
      importInfo.hasStarExport = true;
    }
  }
  getNamedImports(index) {
    const namedImports = [];
    while (true) {
      if (this.tokens.matches1AtIndex(index, TokenType.braceR)) {
        index++;
        break;
      }
      const specifierInfo = getImportExportSpecifierInfo(this.tokens, index);
      index = specifierInfo.endIndex;
      if (!specifierInfo.isType) {
        namedImports.push({
          importedName: specifierInfo.leftName,
          localName: specifierInfo.rightName
        });
      }
      if (this.tokens.matches2AtIndex(index, TokenType.comma, TokenType.braceR)) {
        index += 2;
        break;
      } else if (this.tokens.matches1AtIndex(index, TokenType.braceR)) {
        index++;
        break;
      } else if (this.tokens.matches1AtIndex(index, TokenType.comma)) {
        index++;
      } else {
        throw new Error(`Unexpected token: ${JSON.stringify(this.tokens.tokens[index])}`);
      }
    }
    return { newIndex: index, namedImports };
  }
  /**
   * Get a mutable import info object for this path, creating one if it doesn't
   * exist yet.
   */
  getImportInfo(path) {
    const existingInfo = this.importInfoByPath.get(path);
    if (existingInfo) {
      return existingInfo;
    }
    const newInfo = {
      defaultNames: [],
      wildcardNames: [],
      namedImports: [],
      namedExports: [],
      hasBareImport: false,
      exportStarNames: [],
      hasStarExport: false
    };
    this.importInfoByPath.set(path, newInfo);
    return newInfo;
  }
  addExportBinding(localName, exportedName) {
    if (!this.exportBindingsByLocalName.has(localName)) {
      this.exportBindingsByLocalName.set(localName, []);
    }
    this.exportBindingsByLocalName.get(localName).push(exportedName);
  }
  /**
   * Return the code to use for the import for this path, or the empty string if
   * the code has already been "claimed" by a previous import.
   */
  claimImportCode(importPath) {
    const result = this.importsToReplace.get(importPath);
    this.importsToReplace.set(importPath, "");
    return result || "";
  }
  getIdentifierReplacement(identifierName) {
    return this.identifierReplacements.get(identifierName) || null;
  }
  /**
   * Return a string like `exports.foo = exports.bar`.
   */
  resolveExportBinding(assignedName) {
    const exportedNames = this.exportBindingsByLocalName.get(assignedName);
    if (!exportedNames || exportedNames.length === 0) {
      return null;
    }
    return exportedNames.map((exportedName) => `exports.${exportedName}`).join(" = ");
  }
  /**
   * Return all imported/exported names where we might be interested in whether usages of those
   * names are shadowed.
   */
  getGlobalNames() {
    return /* @__PURE__ */ new Set([
      ...this.identifierReplacements.keys(),
      ...this.exportBindingsByLocalName.keys()
    ]);
  }
};

// node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon2 = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
function encodeInteger(builder, num) {
  do {
    let clamped = num & 31;
    num >>>= 5;
    if (num > 0) clamped |= 32;
    builder.write(intToChar[clamped]);
  } while (num > 0);
}
function encodeSign(num) {
  return num < 0 ? -num << 1 | 1 : num << 1;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
  decode(buf) {
    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    return out.toString();
  }
} : {
  decode(buf) {
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }
};
var StringWriter = class {
  constructor() {
    this.pos = 0;
    this.out = "";
    this.buffer = new Uint8Array(bufLength);
  }
  write(v) {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }
  flush() {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
};
function encode(decoded) {
  const writer = new StringWriter();
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) writer.write(semicolon2);
    if (line.length === 0) continue;
    let genColumn = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (j > 0) writer.write(comma);
      encodeInteger(writer, encodeSign(segment[0] - genColumn));
      genColumn = segment[0];
      if (segment.length === 1) continue;
      encodeInteger(writer, encodeSign(segment[1] - sourcesIndex));
      encodeInteger(writer, encodeSign(segment[2] - sourceLine));
      encodeInteger(writer, encodeSign(segment[3] - sourceColumn));
      sourcesIndex = segment[1];
      sourceLine = segment[2];
      sourceColumn = segment[3];
      if (segment.length === 4) continue;
      encodeInteger(writer, encodeSign(segment[4] - namesIndex));
      namesIndex = segment[4];
    }
  }
  return writer.flush();
}

// node_modules/@jridgewell/gen-mapping/dist/gen-mapping.mjs
var SetArray = class {
  constructor() {
    this._indexes = { __proto__: null };
    this.array = [];
  }
};
function cast(set) {
  return set;
}
function get(setarr, key) {
  return cast(setarr)._indexes[key];
}
function put(setarr, key) {
  const index = get(setarr, key);
  if (index !== void 0) return index;
  const { array: array2, _indexes: indexes } = cast(setarr);
  const length = array2.push(key);
  return indexes[key] = length - 1;
}
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
var NO_NAME = -1;
var GenMapping = class {
  constructor({ file, sourceRoot } = {}) {
    this._names = new SetArray();
    this._sources = new SetArray();
    this._sourcesContent = [];
    this._mappings = [];
    this.file = file;
    this.sourceRoot = sourceRoot;
    this._ignoreList = new SetArray();
  }
};
function cast2(map) {
  return map;
}
var maybeAddSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
  return addSegmentInternal(
    true,
    map,
    genLine,
    genColumn,
    source,
    sourceLine,
    sourceColumn,
    name,
    content
  );
};
function toDecodedMap(map) {
  const {
    _mappings: mappings,
    _sources: sources,
    _sourcesContent: sourcesContent,
    _names: names,
    _ignoreList: ignoreList
    // _originalScopes: originalScopes,
    // _generatedRanges: generatedRanges,
  } = cast2(map);
  removeEmptyFinalLines(mappings);
  return {
    version: 3,
    file: map.file || void 0,
    names: names.array,
    sourceRoot: map.sourceRoot || void 0,
    sources: sources.array,
    sourcesContent,
    mappings,
    // originalScopes,
    // generatedRanges,
    ignoreList: ignoreList.array
  };
}
function toEncodedMap(map) {
  const decoded = toDecodedMap(map);
  return Object.assign({}, decoded, {
    // originalScopes: decoded.originalScopes.map((os) => encodeOriginalScopes(os)),
    // generatedRanges: encodeGeneratedRanges(decoded.generatedRanges as GeneratedRange[]),
    mappings: encode(decoded.mappings)
  });
}
function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
  const {
    _mappings: mappings,
    _sources: sources,
    _sourcesContent: sourcesContent,
    _names: names
    // _originalScopes: originalScopes,
  } = cast2(map);
  const line = getIndex(mappings, genLine);
  const index = getColumnIndex(line, genColumn);
  if (!source) {
    if (skipable && skipSourceless(line, index)) return;
    return insert(line, index, [genColumn]);
  }
  assert(sourceLine);
  assert(sourceColumn);
  const sourcesIndex = put(sources, source);
  const namesIndex = name ? put(names, name) : NO_NAME;
  if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content != null ? content : null;
  if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) {
    return;
  }
  return insert(
    line,
    index,
    name ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex] : [genColumn, sourcesIndex, sourceLine, sourceColumn]
  );
}
function assert(_val) {
}
function getIndex(arr, index) {
  for (let i = arr.length; i <= index; i++) {
    arr[i] = [];
  }
  return arr[index];
}
function getColumnIndex(line, genColumn) {
  let index = line.length;
  for (let i = index - 1; i >= 0; index = i--) {
    const current = line[i];
    if (genColumn >= current[COLUMN]) break;
  }
  return index;
}
function insert(array2, index, value) {
  for (let i = array2.length; i > index; i--) {
    array2[i] = array2[i - 1];
  }
  array2[index] = value;
}
function removeEmptyFinalLines(mappings) {
  const { length } = mappings;
  let len = length;
  for (let i = len - 1; i >= 0; len = i, i--) {
    if (mappings[i].length > 0) break;
  }
  if (len < length) mappings.length = len;
}
function skipSourceless(line, index) {
  if (index === 0) return true;
  const prev = line[index - 1];
  return prev.length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
  if (index === 0) return false;
  const prev = line[index - 1];
  if (prev.length === 1) return false;
  return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
}

// node_modules/sucrase/dist/esm/computeSourceMap.js
function computeSourceMap({ code: generatedCode, mappings: rawMappings }, filePath, options, source, tokens) {
  const sourceColumns = computeSourceColumns(source, tokens);
  const map = new GenMapping({ file: options.compiledFilename });
  let tokenIndex = 0;
  let currentMapping = rawMappings[0];
  while (currentMapping === void 0 && tokenIndex < rawMappings.length - 1) {
    tokenIndex++;
    currentMapping = rawMappings[tokenIndex];
  }
  let line = 0;
  let lineStart = 0;
  if (currentMapping !== lineStart) {
    maybeAddSegment(map, line, 0, filePath, line, 0);
  }
  for (let i = 0; i < generatedCode.length; i++) {
    if (i === currentMapping) {
      const genColumn = currentMapping - lineStart;
      const sourceColumn = sourceColumns[tokenIndex];
      maybeAddSegment(map, line, genColumn, filePath, line, sourceColumn);
      while ((currentMapping === i || currentMapping === void 0) && tokenIndex < rawMappings.length - 1) {
        tokenIndex++;
        currentMapping = rawMappings[tokenIndex];
      }
    }
    if (generatedCode.charCodeAt(i) === charCodes.lineFeed) {
      line++;
      lineStart = i + 1;
      if (currentMapping !== lineStart) {
        maybeAddSegment(map, line, 0, filePath, line, 0);
      }
    }
  }
  const { sourceRoot, sourcesContent, ...sourceMap } = toEncodedMap(map);
  return sourceMap;
}
function computeSourceColumns(code, tokens) {
  const sourceColumns = new Array(tokens.length);
  let tokenIndex = 0;
  let currentMapping = tokens[tokenIndex].start;
  let lineStart = 0;
  for (let i = 0; i < code.length; i++) {
    if (i === currentMapping) {
      sourceColumns[tokenIndex] = currentMapping - lineStart;
      tokenIndex++;
      currentMapping = tokens[tokenIndex].start;
    }
    if (code.charCodeAt(i) === charCodes.lineFeed) {
      lineStart = i + 1;
    }
  }
  return sourceColumns;
}

// node_modules/sucrase/dist/esm/HelperManager.js
var HELPERS = {
  require: `
    import {createRequire as CREATE_REQUIRE_NAME} from "module";
    const require = CREATE_REQUIRE_NAME(import.meta.url);
  `,
  interopRequireWildcard: `
    function interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
  `,
  interopRequireDefault: `
    function interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  `,
  createNamedExportFrom: `
    function createNamedExportFrom(obj, localName, importedName) {
      Object.defineProperty(exports, localName, {enumerable: true, configurable: true, get: () => obj[importedName]});
    }
  `,
  // Note that TypeScript and Babel do this differently; TypeScript does a simple existence
  // check in the exports object and does a plain assignment, whereas Babel uses
  // defineProperty and builds an object of explicitly-exported names so that star exports can
  // always take lower precedence. For now, we do the easier TypeScript thing.
  createStarExport: `
    function createStarExport(obj) {
      Object.keys(obj)
        .filter((key) => key !== "default" && key !== "__esModule")
        .forEach((key) => {
          if (exports.hasOwnProperty(key)) {
            return;
          }
          Object.defineProperty(exports, key, {enumerable: true, configurable: true, get: () => obj[key]});
        });
    }
  `,
  nullishCoalesce: `
    function nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }
  `,
  asyncNullishCoalesce: `
    async function asyncNullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return await rhsFn();
      }
    }
  `,
  optionalChain: `
    function optionalChain(ops) {
      let lastAccessLHS = undefined;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
          return undefined;
        }
        if (op === 'access' || op === 'optionalAccess') {
          lastAccessLHS = value;
          value = fn(value);
        } else if (op === 'call' || op === 'optionalCall') {
          value = fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = undefined;
        }
      }
      return value;
    }
  `,
  asyncOptionalChain: `
    async function asyncOptionalChain(ops) {
      let lastAccessLHS = undefined;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
          return undefined;
        }
        if (op === 'access' || op === 'optionalAccess') {
          lastAccessLHS = value;
          value = await fn(value);
        } else if (op === 'call' || op === 'optionalCall') {
          value = await fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = undefined;
        }
      }
      return value;
    }
  `,
  optionalChainDelete: `
    function optionalChainDelete(ops) {
      const result = OPTIONAL_CHAIN_NAME(ops);
      return result == null ? true : result;
    }
  `,
  asyncOptionalChainDelete: `
    async function asyncOptionalChainDelete(ops) {
      const result = await ASYNC_OPTIONAL_CHAIN_NAME(ops);
      return result == null ? true : result;
    }
  `
};
var HelperManager = class _HelperManager {
  __init() {
    this.helperNames = {};
  }
  __init2() {
    this.createRequireName = null;
  }
  constructor(nameManager) {
    ;
    this.nameManager = nameManager;
    _HelperManager.prototype.__init.call(this);
    _HelperManager.prototype.__init2.call(this);
  }
  getHelperName(baseName) {
    let helperName = this.helperNames[baseName];
    if (helperName) {
      return helperName;
    }
    helperName = this.nameManager.claimFreeName(`_${baseName}`);
    this.helperNames[baseName] = helperName;
    return helperName;
  }
  emitHelpers() {
    let resultCode = "";
    if (this.helperNames.optionalChainDelete) {
      this.getHelperName("optionalChain");
    }
    if (this.helperNames.asyncOptionalChainDelete) {
      this.getHelperName("asyncOptionalChain");
    }
    for (const [baseName, helperCodeTemplate] of Object.entries(HELPERS)) {
      const helperName = this.helperNames[baseName];
      let helperCode = helperCodeTemplate;
      if (baseName === "optionalChainDelete") {
        helperCode = helperCode.replace("OPTIONAL_CHAIN_NAME", this.helperNames.optionalChain);
      } else if (baseName === "asyncOptionalChainDelete") {
        helperCode = helperCode.replace(
          "ASYNC_OPTIONAL_CHAIN_NAME",
          this.helperNames.asyncOptionalChain
        );
      } else if (baseName === "require") {
        if (this.createRequireName === null) {
          this.createRequireName = this.nameManager.claimFreeName("_createRequire");
        }
        helperCode = helperCode.replace(/CREATE_REQUIRE_NAME/g, this.createRequireName);
      }
      if (helperName) {
        resultCode += " ";
        resultCode += helperCode.replace(baseName, helperName).replace(/\s+/g, " ").trim();
      }
    }
    return resultCode;
  }
};

// node_modules/sucrase/dist/esm/identifyShadowedGlobals.js
function identifyShadowedGlobals(tokens, scopes, globalNames) {
  if (!hasShadowedGlobals(tokens, globalNames)) {
    return;
  }
  markShadowedGlobals(tokens, scopes, globalNames);
}
function hasShadowedGlobals(tokens, globalNames) {
  for (const token of tokens.tokens) {
    if (token.type === TokenType.name && !token.isType && isNonTopLevelDeclaration(token) && globalNames.has(tokens.identifierNameForToken(token))) {
      return true;
    }
  }
  return false;
}
function markShadowedGlobals(tokens, scopes, globalNames) {
  const scopeStack = [];
  let scopeIndex = scopes.length - 1;
  for (let i = tokens.tokens.length - 1; ; i--) {
    while (scopeStack.length > 0 && scopeStack[scopeStack.length - 1].startTokenIndex === i + 1) {
      scopeStack.pop();
    }
    while (scopeIndex >= 0 && scopes[scopeIndex].endTokenIndex === i + 1) {
      scopeStack.push(scopes[scopeIndex]);
      scopeIndex--;
    }
    if (i < 0) {
      break;
    }
    const token = tokens.tokens[i];
    const name = tokens.identifierNameForToken(token);
    if (scopeStack.length > 1 && !token.isType && token.type === TokenType.name && globalNames.has(name)) {
      if (isBlockScopedDeclaration(token)) {
        markShadowedForScope(scopeStack[scopeStack.length - 1], tokens, name);
      } else if (isFunctionScopedDeclaration(token)) {
        let stackIndex = scopeStack.length - 1;
        while (stackIndex > 0 && !scopeStack[stackIndex].isFunctionScope) {
          stackIndex--;
        }
        if (stackIndex < 0) {
          throw new Error("Did not find parent function scope.");
        }
        markShadowedForScope(scopeStack[stackIndex], tokens, name);
      }
    }
  }
  if (scopeStack.length > 0) {
    throw new Error("Expected empty scope stack after processing file.");
  }
}
function markShadowedForScope(scope, tokens, name) {
  for (let i = scope.startTokenIndex; i < scope.endTokenIndex; i++) {
    const token = tokens.tokens[i];
    if ((token.type === TokenType.name || token.type === TokenType.jsxName) && tokens.identifierNameForToken(token) === name) {
      token.shadowsGlobal = true;
    }
  }
}

// node_modules/sucrase/dist/esm/util/getIdentifierNames.js
function getIdentifierNames(code, tokens) {
  const names = [];
  for (const token of tokens) {
    if (token.type === TokenType.name) {
      names.push(code.slice(token.start, token.end));
    }
  }
  return names;
}

// node_modules/sucrase/dist/esm/NameManager.js
var NameManager = class _NameManager {
  __init() {
    this.usedNames = /* @__PURE__ */ new Set();
  }
  constructor(code, tokens) {
    ;
    _NameManager.prototype.__init.call(this);
    this.usedNames = new Set(getIdentifierNames(code, tokens));
  }
  claimFreeName(name) {
    const newName = this.findFreeName(name);
    this.usedNames.add(newName);
    return newName;
  }
  findFreeName(name) {
    if (!this.usedNames.has(name)) {
      return name;
    }
    let suffixNum = 2;
    while (this.usedNames.has(name + String(suffixNum))) {
      suffixNum++;
    }
    return name + String(suffixNum);
  }
};

// node_modules/sucrase/dist/esm/Options.js
var import_ts_interface_checker = __toESM(require_dist());

// node_modules/sucrase/dist/esm/Options-gen-types.js
var t = __toESM(require_dist());
var Transform = t.union(
  t.lit("jsx"),
  t.lit("typescript"),
  t.lit("flow"),
  t.lit("imports"),
  t.lit("react-hot-loader"),
  t.lit("jest")
);
var SourceMapOptions = t.iface([], {
  compiledFilename: "string"
});
var Options = t.iface([], {
  transforms: t.array("Transform"),
  disableESTransforms: t.opt("boolean"),
  jsxRuntime: t.opt(t.union(t.lit("classic"), t.lit("automatic"), t.lit("preserve"))),
  production: t.opt("boolean"),
  jsxImportSource: t.opt("string"),
  jsxPragma: t.opt("string"),
  jsxFragmentPragma: t.opt("string"),
  keepUnusedImports: t.opt("boolean"),
  preserveDynamicImport: t.opt("boolean"),
  injectCreateRequireForImportRequire: t.opt("boolean"),
  enableLegacyTypeScriptModuleInterop: t.opt("boolean"),
  enableLegacyBabel5ModuleInterop: t.opt("boolean"),
  sourceMapOptions: t.opt("SourceMapOptions"),
  filePath: t.opt("string")
});
var exportedTypeSuite = {
  Transform,
  SourceMapOptions,
  Options
};
var Options_gen_types_default = exportedTypeSuite;

// node_modules/sucrase/dist/esm/Options.js
var { Options: OptionsChecker } = (0, import_ts_interface_checker.createCheckers)(Options_gen_types_default);
function validateOptions(options) {
  OptionsChecker.strictCheck(options);
}

// node_modules/sucrase/dist/esm/parser/traverser/lval.js
function parseSpread() {
  next();
  parseMaybeAssign(false);
}
function parseRest(isBlockScope) {
  next();
  parseBindingAtom(isBlockScope);
}
function parseBindingIdentifier(isBlockScope) {
  parseIdentifier();
  markPriorBindingIdentifier(isBlockScope);
}
function parseImportedIdentifier() {
  parseIdentifier();
  state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportDeclaration;
}
function markPriorBindingIdentifier(isBlockScope) {
  let identifierRole;
  if (state.scopeDepth === 0) {
    identifierRole = IdentifierRole.TopLevelDeclaration;
  } else if (isBlockScope) {
    identifierRole = IdentifierRole.BlockScopedDeclaration;
  } else {
    identifierRole = IdentifierRole.FunctionScopedDeclaration;
  }
  state.tokens[state.tokens.length - 1].identifierRole = identifierRole;
}
function parseBindingAtom(isBlockScope) {
  switch (state.type) {
    case TokenType._this: {
      const oldIsType = pushTypeContext(0);
      next();
      popTypeContext(oldIsType);
      return;
    }
    case TokenType._yield:
    case TokenType.name: {
      state.type = TokenType.name;
      parseBindingIdentifier(isBlockScope);
      return;
    }
    case TokenType.bracketL: {
      next();
      parseBindingList(
        TokenType.bracketR,
        isBlockScope,
        true
        /* allowEmpty */
      );
      return;
    }
    case TokenType.braceL:
      parseObj(true, isBlockScope);
      return;
    default:
      unexpected();
  }
}
function parseBindingList(close, isBlockScope, allowEmpty = false, allowModifiers = false, contextId = 0) {
  let first = true;
  let hasRemovedComma = false;
  const firstItemTokenIndex = state.tokens.length;
  while (!eat(close) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      state.tokens[state.tokens.length - 1].contextId = contextId;
      if (!hasRemovedComma && state.tokens[firstItemTokenIndex].isType) {
        state.tokens[state.tokens.length - 1].isType = true;
        hasRemovedComma = true;
      }
    }
    if (allowEmpty && match(TokenType.comma)) {
    } else if (eat(close)) {
      break;
    } else if (match(TokenType.ellipsis)) {
      parseRest(isBlockScope);
      parseAssignableListItemTypes();
      eat(TokenType.comma);
      expect(close);
      break;
    } else {
      parseAssignableListItem(allowModifiers, isBlockScope);
    }
  }
}
function parseAssignableListItem(allowModifiers, isBlockScope) {
  if (allowModifiers) {
    tsParseModifiers([
      ContextualKeyword._public,
      ContextualKeyword._protected,
      ContextualKeyword._private,
      ContextualKeyword._readonly,
      ContextualKeyword._override
    ]);
  }
  parseMaybeDefault(isBlockScope);
  parseAssignableListItemTypes();
  parseMaybeDefault(
    isBlockScope,
    true
    /* leftAlreadyParsed */
  );
}
function parseAssignableListItemTypes() {
  if (isFlowEnabled) {
    flowParseAssignableListItemTypes();
  } else if (isTypeScriptEnabled) {
    tsParseAssignableListItemTypes();
  }
}
function parseMaybeDefault(isBlockScope, leftAlreadyParsed = false) {
  if (!leftAlreadyParsed) {
    parseBindingAtom(isBlockScope);
  }
  if (!eat(TokenType.eq)) {
    return;
  }
  const eqIndex = state.tokens.length - 1;
  parseMaybeAssign();
  state.tokens[eqIndex].rhsEndIndex = state.tokens.length;
}

// node_modules/sucrase/dist/esm/parser/plugins/typescript.js
function tsIsIdentifier() {
  return match(TokenType.name);
}
function isLiteralPropertyName() {
  return match(TokenType.name) || Boolean(state.type & TokenType.IS_KEYWORD) || match(TokenType.string) || match(TokenType.num) || match(TokenType.bigint) || match(TokenType.decimal);
}
function tsNextTokenCanFollowModifier() {
  const snapshot = state.snapshot();
  next();
  const canFollowModifier = (match(TokenType.bracketL) || match(TokenType.braceL) || match(TokenType.star) || match(TokenType.ellipsis) || match(TokenType.hash) || isLiteralPropertyName()) && !hasPrecedingLineBreak();
  if (canFollowModifier) {
    return true;
  } else {
    state.restoreFromSnapshot(snapshot);
    return false;
  }
}
function tsParseModifiers(allowedModifiers) {
  while (true) {
    const modifier = tsParseModifier(allowedModifiers);
    if (modifier === null) {
      break;
    }
  }
}
function tsParseModifier(allowedModifiers) {
  if (!match(TokenType.name)) {
    return null;
  }
  const modifier = state.contextualKeyword;
  if (allowedModifiers.indexOf(modifier) !== -1 && tsNextTokenCanFollowModifier()) {
    switch (modifier) {
      case ContextualKeyword._readonly:
        state.tokens[state.tokens.length - 1].type = TokenType._readonly;
        break;
      case ContextualKeyword._abstract:
        state.tokens[state.tokens.length - 1].type = TokenType._abstract;
        break;
      case ContextualKeyword._static:
        state.tokens[state.tokens.length - 1].type = TokenType._static;
        break;
      case ContextualKeyword._public:
        state.tokens[state.tokens.length - 1].type = TokenType._public;
        break;
      case ContextualKeyword._private:
        state.tokens[state.tokens.length - 1].type = TokenType._private;
        break;
      case ContextualKeyword._protected:
        state.tokens[state.tokens.length - 1].type = TokenType._protected;
        break;
      case ContextualKeyword._override:
        state.tokens[state.tokens.length - 1].type = TokenType._override;
        break;
      case ContextualKeyword._declare:
        state.tokens[state.tokens.length - 1].type = TokenType._declare;
        break;
      default:
        break;
    }
    return modifier;
  }
  return null;
}
function tsParseEntityName() {
  parseIdentifier();
  while (eat(TokenType.dot)) {
    parseIdentifier();
  }
}
function tsParseTypeReference() {
  tsParseEntityName();
  if (!hasPrecedingLineBreak() && match(TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}
function tsParseThisTypePredicate() {
  next();
  tsParseTypeAnnotation();
}
function tsParseThisTypeNode() {
  next();
}
function tsParseTypeQuery() {
  expect(TokenType._typeof);
  if (match(TokenType._import)) {
    tsParseImportType();
  } else {
    tsParseEntityName();
  }
  if (!hasPrecedingLineBreak() && match(TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}
function tsParseImportType() {
  expect(TokenType._import);
  expect(TokenType.parenL);
  expect(TokenType.string);
  expect(TokenType.parenR);
  if (eat(TokenType.dot)) {
    tsParseEntityName();
  }
  if (match(TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}
function tsParseTypeParameter() {
  eat(TokenType._const);
  const hadIn = eat(TokenType._in);
  const hadOut = eatContextual(ContextualKeyword._out);
  eat(TokenType._const);
  if ((hadIn || hadOut) && !match(TokenType.name)) {
    state.tokens[state.tokens.length - 1].type = TokenType.name;
  } else {
    parseIdentifier();
  }
  if (eat(TokenType._extends)) {
    tsParseType();
  }
  if (eat(TokenType.eq)) {
    tsParseType();
  }
}
function tsTryParseTypeParameters() {
  if (match(TokenType.lessThan)) {
    tsParseTypeParameters();
  }
}
function tsParseTypeParameters() {
  const oldIsType = pushTypeContext(0);
  if (match(TokenType.lessThan) || match(TokenType.typeParameterStart)) {
    next();
  } else {
    unexpected();
  }
  while (!eat(TokenType.greaterThan) && !state.error) {
    tsParseTypeParameter();
    eat(TokenType.comma);
  }
  popTypeContext(oldIsType);
}
function tsFillSignature(returnToken) {
  const returnTokenRequired = returnToken === TokenType.arrow;
  tsTryParseTypeParameters();
  expect(TokenType.parenL);
  state.scopeDepth++;
  tsParseBindingListForSignature(
    false
    /* isBlockScope */
  );
  state.scopeDepth--;
  if (returnTokenRequired) {
    tsParseTypeOrTypePredicateAnnotation(returnToken);
  } else if (match(returnToken)) {
    tsParseTypeOrTypePredicateAnnotation(returnToken);
  }
}
function tsParseBindingListForSignature(isBlockScope) {
  parseBindingList(TokenType.parenR, isBlockScope);
}
function tsParseTypeMemberSemicolon() {
  if (!eat(TokenType.comma)) {
    semicolon();
  }
}
function tsParseSignatureMember() {
  tsFillSignature(TokenType.colon);
  tsParseTypeMemberSemicolon();
}
function tsIsUnambiguouslyIndexSignature() {
  const snapshot = state.snapshot();
  next();
  const isIndexSignature = eat(TokenType.name) && match(TokenType.colon);
  state.restoreFromSnapshot(snapshot);
  return isIndexSignature;
}
function tsTryParseIndexSignature() {
  if (!(match(TokenType.bracketL) && tsIsUnambiguouslyIndexSignature())) {
    return false;
  }
  const oldIsType = pushTypeContext(0);
  expect(TokenType.bracketL);
  parseIdentifier();
  tsParseTypeAnnotation();
  expect(TokenType.bracketR);
  tsTryParseTypeAnnotation();
  tsParseTypeMemberSemicolon();
  popTypeContext(oldIsType);
  return true;
}
function tsParsePropertyOrMethodSignature(isReadonly) {
  eat(TokenType.question);
  if (!isReadonly && (match(TokenType.parenL) || match(TokenType.lessThan))) {
    tsFillSignature(TokenType.colon);
    tsParseTypeMemberSemicolon();
  } else {
    tsTryParseTypeAnnotation();
    tsParseTypeMemberSemicolon();
  }
}
function tsParseTypeMember() {
  if (match(TokenType.parenL) || match(TokenType.lessThan)) {
    tsParseSignatureMember();
    return;
  }
  if (match(TokenType._new)) {
    next();
    if (match(TokenType.parenL) || match(TokenType.lessThan)) {
      tsParseSignatureMember();
    } else {
      tsParsePropertyOrMethodSignature(false);
    }
    return;
  }
  const readonly = !!tsParseModifier([ContextualKeyword._readonly]);
  const found = tsTryParseIndexSignature();
  if (found) {
    return;
  }
  if ((isContextual(ContextualKeyword._get) || isContextual(ContextualKeyword._set)) && tsNextTokenCanFollowModifier()) {
  }
  parsePropertyName(
    -1
    /* Types don't need context IDs. */
  );
  tsParsePropertyOrMethodSignature(readonly);
}
function tsParseTypeLiteral() {
  tsParseObjectTypeMembers();
}
function tsParseObjectTypeMembers() {
  expect(TokenType.braceL);
  while (!eat(TokenType.braceR) && !state.error) {
    tsParseTypeMember();
  }
}
function tsLookaheadIsStartOfMappedType() {
  const snapshot = state.snapshot();
  const isStartOfMappedType = tsIsStartOfMappedType();
  state.restoreFromSnapshot(snapshot);
  return isStartOfMappedType;
}
function tsIsStartOfMappedType() {
  next();
  if (eat(TokenType.plus) || eat(TokenType.minus)) {
    return isContextual(ContextualKeyword._readonly);
  }
  if (isContextual(ContextualKeyword._readonly)) {
    next();
  }
  if (!match(TokenType.bracketL)) {
    return false;
  }
  next();
  if (!tsIsIdentifier()) {
    return false;
  }
  next();
  return match(TokenType._in);
}
function tsParseMappedTypeParameter() {
  parseIdentifier();
  expect(TokenType._in);
  tsParseType();
}
function tsParseMappedType() {
  expect(TokenType.braceL);
  if (match(TokenType.plus) || match(TokenType.minus)) {
    next();
    expectContextual(ContextualKeyword._readonly);
  } else {
    eatContextual(ContextualKeyword._readonly);
  }
  expect(TokenType.bracketL);
  tsParseMappedTypeParameter();
  if (eatContextual(ContextualKeyword._as)) {
    tsParseType();
  }
  expect(TokenType.bracketR);
  if (match(TokenType.plus) || match(TokenType.minus)) {
    next();
    expect(TokenType.question);
  } else {
    eat(TokenType.question);
  }
  tsTryParseType();
  semicolon();
  expect(TokenType.braceR);
}
function tsParseTupleType() {
  expect(TokenType.bracketL);
  while (!eat(TokenType.bracketR) && !state.error) {
    tsParseTupleElementType();
    eat(TokenType.comma);
  }
}
function tsParseTupleElementType() {
  if (eat(TokenType.ellipsis)) {
    tsParseType();
  } else {
    tsParseType();
    eat(TokenType.question);
  }
  if (eat(TokenType.colon)) {
    tsParseType();
  }
}
function tsParseParenthesizedType() {
  expect(TokenType.parenL);
  tsParseType();
  expect(TokenType.parenR);
}
function tsParseTemplateLiteralType() {
  nextTemplateToken();
  nextTemplateToken();
  while (!match(TokenType.backQuote) && !state.error) {
    expect(TokenType.dollarBraceL);
    tsParseType();
    nextTemplateToken();
    nextTemplateToken();
  }
  next();
}
var FunctionType;
(function(FunctionType2) {
  const TSFunctionType = 0;
  FunctionType2[FunctionType2["TSFunctionType"] = TSFunctionType] = "TSFunctionType";
  const TSConstructorType = TSFunctionType + 1;
  FunctionType2[FunctionType2["TSConstructorType"] = TSConstructorType] = "TSConstructorType";
  const TSAbstractConstructorType = TSConstructorType + 1;
  FunctionType2[FunctionType2["TSAbstractConstructorType"] = TSAbstractConstructorType] = "TSAbstractConstructorType";
})(FunctionType || (FunctionType = {}));
function tsParseFunctionOrConstructorType(type) {
  if (type === FunctionType.TSAbstractConstructorType) {
    expectContextual(ContextualKeyword._abstract);
  }
  if (type === FunctionType.TSConstructorType || type === FunctionType.TSAbstractConstructorType) {
    expect(TokenType._new);
  }
  const oldInDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
  state.inDisallowConditionalTypesContext = false;
  tsFillSignature(TokenType.arrow);
  state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
}
function tsParseNonArrayType() {
  switch (state.type) {
    case TokenType.name:
      tsParseTypeReference();
      return;
    case TokenType._void:
    case TokenType._null:
      next();
      return;
    case TokenType.string:
    case TokenType.num:
    case TokenType.bigint:
    case TokenType.decimal:
    case TokenType._true:
    case TokenType._false:
      parseLiteral();
      return;
    case TokenType.minus:
      next();
      parseLiteral();
      return;
    case TokenType._this: {
      tsParseThisTypeNode();
      if (isContextual(ContextualKeyword._is) && !hasPrecedingLineBreak()) {
        tsParseThisTypePredicate();
      }
      return;
    }
    case TokenType._typeof:
      tsParseTypeQuery();
      return;
    case TokenType._import:
      tsParseImportType();
      return;
    case TokenType.braceL:
      if (tsLookaheadIsStartOfMappedType()) {
        tsParseMappedType();
      } else {
        tsParseTypeLiteral();
      }
      return;
    case TokenType.bracketL:
      tsParseTupleType();
      return;
    case TokenType.parenL:
      tsParseParenthesizedType();
      return;
    case TokenType.backQuote:
      tsParseTemplateLiteralType();
      return;
    default:
      if (state.type & TokenType.IS_KEYWORD) {
        next();
        state.tokens[state.tokens.length - 1].type = TokenType.name;
        return;
      }
      break;
  }
  unexpected();
}
function tsParseArrayTypeOrHigher() {
  tsParseNonArrayType();
  while (!hasPrecedingLineBreak() && eat(TokenType.bracketL)) {
    if (!eat(TokenType.bracketR)) {
      tsParseType();
      expect(TokenType.bracketR);
    }
  }
}
function tsParseInferType() {
  expectContextual(ContextualKeyword._infer);
  parseIdentifier();
  if (match(TokenType._extends)) {
    const snapshot = state.snapshot();
    expect(TokenType._extends);
    const oldInDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
    state.inDisallowConditionalTypesContext = true;
    tsParseType();
    state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    if (state.error || !state.inDisallowConditionalTypesContext && match(TokenType.question)) {
      state.restoreFromSnapshot(snapshot);
    }
  }
}
function tsParseTypeOperatorOrHigher() {
  if (isContextual(ContextualKeyword._keyof) || isContextual(ContextualKeyword._unique) || isContextual(ContextualKeyword._readonly)) {
    next();
    tsParseTypeOperatorOrHigher();
  } else if (isContextual(ContextualKeyword._infer)) {
    tsParseInferType();
  } else {
    const oldInDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
    state.inDisallowConditionalTypesContext = false;
    tsParseArrayTypeOrHigher();
    state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
  }
}
function tsParseIntersectionTypeOrHigher() {
  eat(TokenType.bitwiseAND);
  tsParseTypeOperatorOrHigher();
  if (match(TokenType.bitwiseAND)) {
    while (eat(TokenType.bitwiseAND)) {
      tsParseTypeOperatorOrHigher();
    }
  }
}
function tsParseUnionTypeOrHigher() {
  eat(TokenType.bitwiseOR);
  tsParseIntersectionTypeOrHigher();
  if (match(TokenType.bitwiseOR)) {
    while (eat(TokenType.bitwiseOR)) {
      tsParseIntersectionTypeOrHigher();
    }
  }
}
function tsIsStartOfFunctionType() {
  if (match(TokenType.lessThan)) {
    return true;
  }
  return match(TokenType.parenL) && tsLookaheadIsUnambiguouslyStartOfFunctionType();
}
function tsSkipParameterStart() {
  if (match(TokenType.name) || match(TokenType._this)) {
    next();
    return true;
  }
  if (match(TokenType.braceL) || match(TokenType.bracketL)) {
    let depth = 1;
    next();
    while (depth > 0 && !state.error) {
      if (match(TokenType.braceL) || match(TokenType.bracketL)) {
        depth++;
      } else if (match(TokenType.braceR) || match(TokenType.bracketR)) {
        depth--;
      }
      next();
    }
    return true;
  }
  return false;
}
function tsLookaheadIsUnambiguouslyStartOfFunctionType() {
  const snapshot = state.snapshot();
  const isUnambiguouslyStartOfFunctionType = tsIsUnambiguouslyStartOfFunctionType();
  state.restoreFromSnapshot(snapshot);
  return isUnambiguouslyStartOfFunctionType;
}
function tsIsUnambiguouslyStartOfFunctionType() {
  next();
  if (match(TokenType.parenR) || match(TokenType.ellipsis)) {
    return true;
  }
  if (tsSkipParameterStart()) {
    if (match(TokenType.colon) || match(TokenType.comma) || match(TokenType.question) || match(TokenType.eq)) {
      return true;
    }
    if (match(TokenType.parenR)) {
      next();
      if (match(TokenType.arrow)) {
        return true;
      }
    }
  }
  return false;
}
function tsParseTypeOrTypePredicateAnnotation(returnToken) {
  const oldIsType = pushTypeContext(0);
  expect(returnToken);
  const finishedReturn = tsParseTypePredicateOrAssertsPrefix();
  if (!finishedReturn) {
    tsParseType();
  }
  popTypeContext(oldIsType);
}
function tsTryParseTypeOrTypePredicateAnnotation() {
  if (match(TokenType.colon)) {
    tsParseTypeOrTypePredicateAnnotation(TokenType.colon);
  }
}
function tsTryParseTypeAnnotation() {
  if (match(TokenType.colon)) {
    tsParseTypeAnnotation();
  }
}
function tsTryParseType() {
  if (eat(TokenType.colon)) {
    tsParseType();
  }
}
function tsParseTypePredicateOrAssertsPrefix() {
  const snapshot = state.snapshot();
  if (isContextual(ContextualKeyword._asserts)) {
    next();
    if (eatContextual(ContextualKeyword._is)) {
      tsParseType();
      return true;
    } else if (tsIsIdentifier() || match(TokenType._this)) {
      next();
      if (eatContextual(ContextualKeyword._is)) {
        tsParseType();
      }
      return true;
    } else {
      state.restoreFromSnapshot(snapshot);
      return false;
    }
  } else if (tsIsIdentifier() || match(TokenType._this)) {
    next();
    if (isContextual(ContextualKeyword._is) && !hasPrecedingLineBreak()) {
      next();
      tsParseType();
      return true;
    } else {
      state.restoreFromSnapshot(snapshot);
      return false;
    }
  }
  return false;
}
function tsParseTypeAnnotation() {
  const oldIsType = pushTypeContext(0);
  expect(TokenType.colon);
  tsParseType();
  popTypeContext(oldIsType);
}
function tsParseType() {
  tsParseNonConditionalType();
  if (state.inDisallowConditionalTypesContext || hasPrecedingLineBreak() || !eat(TokenType._extends)) {
    return;
  }
  const oldInDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
  state.inDisallowConditionalTypesContext = true;
  tsParseNonConditionalType();
  state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
  expect(TokenType.question);
  tsParseType();
  expect(TokenType.colon);
  tsParseType();
}
function isAbstractConstructorSignature() {
  return isContextual(ContextualKeyword._abstract) && lookaheadType() === TokenType._new;
}
function tsParseNonConditionalType() {
  if (tsIsStartOfFunctionType()) {
    tsParseFunctionOrConstructorType(FunctionType.TSFunctionType);
    return;
  }
  if (match(TokenType._new)) {
    tsParseFunctionOrConstructorType(FunctionType.TSConstructorType);
    return;
  } else if (isAbstractConstructorSignature()) {
    tsParseFunctionOrConstructorType(FunctionType.TSAbstractConstructorType);
    return;
  }
  tsParseUnionTypeOrHigher();
}
function tsParseTypeAssertion() {
  const oldIsType = pushTypeContext(1);
  tsParseType();
  expect(TokenType.greaterThan);
  popTypeContext(oldIsType);
  parseMaybeUnary();
}
function tsTryParseJSXTypeArgument() {
  if (eat(TokenType.jsxTagStart)) {
    state.tokens[state.tokens.length - 1].type = TokenType.typeParameterStart;
    const oldIsType = pushTypeContext(1);
    while (!match(TokenType.greaterThan) && !state.error) {
      tsParseType();
      eat(TokenType.comma);
    }
    nextJSXTagToken();
    popTypeContext(oldIsType);
  }
}
function tsParseHeritageClause() {
  while (!match(TokenType.braceL) && !state.error) {
    tsParseExpressionWithTypeArguments();
    eat(TokenType.comma);
  }
}
function tsParseExpressionWithTypeArguments() {
  tsParseEntityName();
  if (match(TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}
function tsParseInterfaceDeclaration() {
  parseBindingIdentifier(false);
  tsTryParseTypeParameters();
  if (eat(TokenType._extends)) {
    tsParseHeritageClause();
  }
  tsParseObjectTypeMembers();
}
function tsParseTypeAliasDeclaration() {
  parseBindingIdentifier(false);
  tsTryParseTypeParameters();
  expect(TokenType.eq);
  tsParseType();
  semicolon();
}
function tsParseEnumMember() {
  if (match(TokenType.string)) {
    parseLiteral();
  } else {
    parseIdentifier();
  }
  if (eat(TokenType.eq)) {
    const eqIndex = state.tokens.length - 1;
    parseMaybeAssign();
    state.tokens[eqIndex].rhsEndIndex = state.tokens.length;
  }
}
function tsParseEnumDeclaration() {
  parseBindingIdentifier(false);
  expect(TokenType.braceL);
  while (!eat(TokenType.braceR) && !state.error) {
    tsParseEnumMember();
    eat(TokenType.comma);
  }
}
function tsParseModuleBlock() {
  expect(TokenType.braceL);
  parseBlockBody(
    /* end */
    TokenType.braceR
  );
}
function tsParseModuleOrNamespaceDeclaration() {
  parseBindingIdentifier(false);
  if (eat(TokenType.dot)) {
    tsParseModuleOrNamespaceDeclaration();
  } else {
    tsParseModuleBlock();
  }
}
function tsParseAmbientExternalModuleDeclaration() {
  if (isContextual(ContextualKeyword._global)) {
    parseIdentifier();
  } else if (match(TokenType.string)) {
    parseExprAtom();
  } else {
    unexpected();
  }
  if (match(TokenType.braceL)) {
    tsParseModuleBlock();
  } else {
    semicolon();
  }
}
function tsParseImportEqualsDeclaration() {
  parseImportedIdentifier();
  expect(TokenType.eq);
  tsParseModuleReference();
  semicolon();
}
function tsIsExternalModuleReference() {
  return isContextual(ContextualKeyword._require) && lookaheadType() === TokenType.parenL;
}
function tsParseModuleReference() {
  if (tsIsExternalModuleReference()) {
    tsParseExternalModuleReference();
  } else {
    tsParseEntityName();
  }
}
function tsParseExternalModuleReference() {
  expectContextual(ContextualKeyword._require);
  expect(TokenType.parenL);
  if (!match(TokenType.string)) {
    unexpected();
  }
  parseLiteral();
  expect(TokenType.parenR);
}
function tsTryParseDeclare() {
  if (isLineTerminator()) {
    return false;
  }
  switch (state.type) {
    case TokenType._function: {
      const oldIsType = pushTypeContext(1);
      next();
      const functionStart = state.start;
      parseFunction(
        functionStart,
        /* isStatement */
        true
      );
      popTypeContext(oldIsType);
      return true;
    }
    case TokenType._class: {
      const oldIsType = pushTypeContext(1);
      parseClass(
        /* isStatement */
        true,
        /* optionalId */
        false
      );
      popTypeContext(oldIsType);
      return true;
    }
    case TokenType._const: {
      if (match(TokenType._const) && isLookaheadContextual(ContextualKeyword._enum)) {
        const oldIsType = pushTypeContext(1);
        expect(TokenType._const);
        expectContextual(ContextualKeyword._enum);
        state.tokens[state.tokens.length - 1].type = TokenType._enum;
        tsParseEnumDeclaration();
        popTypeContext(oldIsType);
        return true;
      }
    }
    // falls through
    case TokenType._var:
    case TokenType._let: {
      const oldIsType = pushTypeContext(1);
      parseVarStatement(state.type !== TokenType._var);
      popTypeContext(oldIsType);
      return true;
    }
    case TokenType.name: {
      const oldIsType = pushTypeContext(1);
      const contextualKeyword = state.contextualKeyword;
      let matched = false;
      if (contextualKeyword === ContextualKeyword._global) {
        tsParseAmbientExternalModuleDeclaration();
        matched = true;
      } else {
        matched = tsParseDeclaration(
          contextualKeyword,
          /* isBeforeToken */
          true
        );
      }
      popTypeContext(oldIsType);
      return matched;
    }
    default:
      return false;
  }
}
function tsTryParseExportDeclaration() {
  return tsParseDeclaration(
    state.contextualKeyword,
    /* isBeforeToken */
    true
  );
}
function tsParseExpressionStatement(contextualKeyword) {
  switch (contextualKeyword) {
    case ContextualKeyword._declare: {
      const declareTokenIndex = state.tokens.length - 1;
      const matched = tsTryParseDeclare();
      if (matched) {
        state.tokens[declareTokenIndex].type = TokenType._declare;
        return true;
      }
      break;
    }
    case ContextualKeyword._global:
      if (match(TokenType.braceL)) {
        tsParseModuleBlock();
        return true;
      }
      break;
    default:
      return tsParseDeclaration(
        contextualKeyword,
        /* isBeforeToken */
        false
      );
  }
  return false;
}
function tsParseDeclaration(contextualKeyword, isBeforeToken) {
  switch (contextualKeyword) {
    case ContextualKeyword._abstract:
      if (tsCheckLineTerminator(isBeforeToken) && match(TokenType._class)) {
        state.tokens[state.tokens.length - 1].type = TokenType._abstract;
        parseClass(
          /* isStatement */
          true,
          /* optionalId */
          false
        );
        return true;
      }
      break;
    case ContextualKeyword._enum:
      if (tsCheckLineTerminator(isBeforeToken) && match(TokenType.name)) {
        state.tokens[state.tokens.length - 1].type = TokenType._enum;
        tsParseEnumDeclaration();
        return true;
      }
      break;
    case ContextualKeyword._interface:
      if (tsCheckLineTerminator(isBeforeToken) && match(TokenType.name)) {
        const oldIsType = pushTypeContext(isBeforeToken ? 2 : 1);
        tsParseInterfaceDeclaration();
        popTypeContext(oldIsType);
        return true;
      }
      break;
    case ContextualKeyword._module:
      if (tsCheckLineTerminator(isBeforeToken)) {
        if (match(TokenType.string)) {
          const oldIsType = pushTypeContext(isBeforeToken ? 2 : 1);
          tsParseAmbientExternalModuleDeclaration();
          popTypeContext(oldIsType);
          return true;
        } else if (match(TokenType.name)) {
          const oldIsType = pushTypeContext(isBeforeToken ? 2 : 1);
          tsParseModuleOrNamespaceDeclaration();
          popTypeContext(oldIsType);
          return true;
        }
      }
      break;
    case ContextualKeyword._namespace:
      if (tsCheckLineTerminator(isBeforeToken) && match(TokenType.name)) {
        const oldIsType = pushTypeContext(isBeforeToken ? 2 : 1);
        tsParseModuleOrNamespaceDeclaration();
        popTypeContext(oldIsType);
        return true;
      }
      break;
    case ContextualKeyword._type:
      if (tsCheckLineTerminator(isBeforeToken) && match(TokenType.name)) {
        const oldIsType = pushTypeContext(isBeforeToken ? 2 : 1);
        tsParseTypeAliasDeclaration();
        popTypeContext(oldIsType);
        return true;
      }
      break;
    default:
      break;
  }
  return false;
}
function tsCheckLineTerminator(isBeforeToken) {
  if (isBeforeToken) {
    next();
    return true;
  } else {
    return !isLineTerminator();
  }
}
function tsTryParseGenericAsyncArrowFunction() {
  const snapshot = state.snapshot();
  tsParseTypeParameters();
  parseFunctionParams();
  tsTryParseTypeOrTypePredicateAnnotation();
  expect(TokenType.arrow);
  if (state.error) {
    state.restoreFromSnapshot(snapshot);
    return false;
  }
  parseFunctionBody(true);
  return true;
}
function tsParseTypeArgumentsWithPossibleBitshift() {
  if (state.type === TokenType.bitShiftL) {
    state.pos -= 1;
    finishToken(TokenType.lessThan);
  }
  tsParseTypeArguments();
}
function tsParseTypeArguments() {
  const oldIsType = pushTypeContext(0);
  expect(TokenType.lessThan);
  while (!match(TokenType.greaterThan) && !state.error) {
    tsParseType();
    eat(TokenType.comma);
  }
  if (!oldIsType) {
    popTypeContext(oldIsType);
    rescan_gt();
    expect(TokenType.greaterThan);
    state.tokens[state.tokens.length - 1].isType = true;
  } else {
    expect(TokenType.greaterThan);
    popTypeContext(oldIsType);
  }
}
function tsIsDeclarationStart() {
  if (match(TokenType.name)) {
    switch (state.contextualKeyword) {
      case ContextualKeyword._abstract:
      case ContextualKeyword._declare:
      case ContextualKeyword._enum:
      case ContextualKeyword._interface:
      case ContextualKeyword._module:
      case ContextualKeyword._namespace:
      case ContextualKeyword._type:
        return true;
      default:
        break;
    }
  }
  return false;
}
function tsParseFunctionBodyAndFinish(functionStart, funcContextId) {
  if (match(TokenType.colon)) {
    tsParseTypeOrTypePredicateAnnotation(TokenType.colon);
  }
  if (!match(TokenType.braceL) && isLineTerminator()) {
    let i = state.tokens.length - 1;
    while (i >= 0 && (state.tokens[i].start >= functionStart || state.tokens[i].type === TokenType._default || state.tokens[i].type === TokenType._export)) {
      state.tokens[i].isType = true;
      i--;
    }
    return;
  }
  parseFunctionBody(false, funcContextId);
}
function tsParseSubscript(startTokenIndex, noCalls, stopState) {
  if (!hasPrecedingLineBreak() && eat(TokenType.bang)) {
    state.tokens[state.tokens.length - 1].type = TokenType.nonNullAssertion;
    return;
  }
  if (match(TokenType.lessThan) || match(TokenType.bitShiftL)) {
    const snapshot = state.snapshot();
    if (!noCalls && atPossibleAsync()) {
      const asyncArrowFn = tsTryParseGenericAsyncArrowFunction();
      if (asyncArrowFn) {
        return;
      }
    }
    tsParseTypeArgumentsWithPossibleBitshift();
    if (!noCalls && eat(TokenType.parenL)) {
      state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
      parseCallExpressionArguments();
    } else if (match(TokenType.backQuote)) {
      parseTemplate();
    } else if (
      // The remaining possible case is an instantiation expression, e.g.
      // Array<number> . Check for a few cases that would disqualify it and
      // cause us to bail out.
      // a<b>>c is not (a<b>)>c, but a<(b>>c)
      state.type === TokenType.greaterThan || // a<b>c is (a<b)>c
      state.type !== TokenType.parenL && Boolean(state.type & TokenType.IS_EXPRESSION_START) && !hasPrecedingLineBreak()
    ) {
      unexpected();
    }
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
    } else {
      return;
    }
  } else if (!noCalls && match(TokenType.questionDot) && lookaheadType() === TokenType.lessThan) {
    next();
    state.tokens[startTokenIndex].isOptionalChainStart = true;
    state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
    tsParseTypeArguments();
    expect(TokenType.parenL);
    parseCallExpressionArguments();
  }
  baseParseSubscript(startTokenIndex, noCalls, stopState);
}
function tsTryParseExport() {
  if (eat(TokenType._import)) {
    if (isContextual(ContextualKeyword._type) && lookaheadType() !== TokenType.eq) {
      expectContextual(ContextualKeyword._type);
    }
    tsParseImportEqualsDeclaration();
    return true;
  } else if (eat(TokenType.eq)) {
    parseExpression();
    semicolon();
    return true;
  } else if (eatContextual(ContextualKeyword._as)) {
    expectContextual(ContextualKeyword._namespace);
    parseIdentifier();
    semicolon();
    return true;
  } else {
    if (isContextual(ContextualKeyword._type)) {
      const nextType = lookaheadType();
      if (nextType === TokenType.braceL || nextType === TokenType.star) {
        next();
      }
    }
    return false;
  }
}
function tsParseImportSpecifier() {
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportDeclaration;
    return;
  }
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportDeclaration;
    state.tokens[state.tokens.length - 2].isType = true;
    state.tokens[state.tokens.length - 1].isType = true;
    return;
  }
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 3].identifierRole = IdentifierRole.ImportAccess;
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportDeclaration;
    return;
  }
  parseIdentifier();
  state.tokens[state.tokens.length - 3].identifierRole = IdentifierRole.ImportAccess;
  state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportDeclaration;
  state.tokens[state.tokens.length - 4].isType = true;
  state.tokens[state.tokens.length - 3].isType = true;
  state.tokens[state.tokens.length - 2].isType = true;
  state.tokens[state.tokens.length - 1].isType = true;
}
function tsParseExportSpecifier() {
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ExportAccess;
    return;
  }
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ExportAccess;
    state.tokens[state.tokens.length - 2].isType = true;
    state.tokens[state.tokens.length - 1].isType = true;
    return;
  }
  parseIdentifier();
  if (match(TokenType.comma) || match(TokenType.braceR)) {
    state.tokens[state.tokens.length - 3].identifierRole = IdentifierRole.ExportAccess;
    return;
  }
  parseIdentifier();
  state.tokens[state.tokens.length - 3].identifierRole = IdentifierRole.ExportAccess;
  state.tokens[state.tokens.length - 4].isType = true;
  state.tokens[state.tokens.length - 3].isType = true;
  state.tokens[state.tokens.length - 2].isType = true;
  state.tokens[state.tokens.length - 1].isType = true;
}
function tsTryParseExportDefaultExpression() {
  if (isContextual(ContextualKeyword._abstract) && lookaheadType() === TokenType._class) {
    state.type = TokenType._abstract;
    next();
    parseClass(true, true);
    return true;
  }
  if (isContextual(ContextualKeyword._interface)) {
    const oldIsType = pushTypeContext(2);
    tsParseDeclaration(ContextualKeyword._interface, true);
    popTypeContext(oldIsType);
    return true;
  }
  return false;
}
function tsTryParseStatementContent() {
  if (state.type === TokenType._const) {
    const ahead = lookaheadTypeAndKeyword();
    if (ahead.type === TokenType.name && ahead.contextualKeyword === ContextualKeyword._enum) {
      expect(TokenType._const);
      expectContextual(ContextualKeyword._enum);
      state.tokens[state.tokens.length - 1].type = TokenType._enum;
      tsParseEnumDeclaration();
      return true;
    }
  }
  return false;
}
function tsTryParseClassMemberWithIsStatic(isStatic) {
  const memberStartIndexAfterStatic = state.tokens.length;
  tsParseModifiers([
    ContextualKeyword._abstract,
    ContextualKeyword._readonly,
    ContextualKeyword._declare,
    ContextualKeyword._static,
    ContextualKeyword._override
  ]);
  const modifiersEndIndex = state.tokens.length;
  const found = tsTryParseIndexSignature();
  if (found) {
    const memberStartIndex = isStatic ? memberStartIndexAfterStatic - 1 : memberStartIndexAfterStatic;
    for (let i = memberStartIndex; i < modifiersEndIndex; i++) {
      state.tokens[i].isType = true;
    }
    return true;
  }
  return false;
}
function tsParseIdentifierStatement(contextualKeyword) {
  const matched = tsParseExpressionStatement(contextualKeyword);
  if (!matched) {
    semicolon();
  }
}
function tsParseExportDeclaration() {
  const isDeclare = eatContextual(ContextualKeyword._declare);
  if (isDeclare) {
    state.tokens[state.tokens.length - 1].type = TokenType._declare;
  }
  let matchedDeclaration = false;
  if (match(TokenType.name)) {
    if (isDeclare) {
      const oldIsType = pushTypeContext(2);
      matchedDeclaration = tsTryParseExportDeclaration();
      popTypeContext(oldIsType);
    } else {
      matchedDeclaration = tsTryParseExportDeclaration();
    }
  }
  if (!matchedDeclaration) {
    if (isDeclare) {
      const oldIsType = pushTypeContext(2);
      parseStatement(true);
      popTypeContext(oldIsType);
    } else {
      parseStatement(true);
    }
  }
}
function tsAfterParseClassSuper(hasSuper) {
  if (hasSuper && (match(TokenType.lessThan) || match(TokenType.bitShiftL))) {
    tsParseTypeArgumentsWithPossibleBitshift();
  }
  if (eatContextual(ContextualKeyword._implements)) {
    state.tokens[state.tokens.length - 1].type = TokenType._implements;
    const oldIsType = pushTypeContext(1);
    tsParseHeritageClause();
    popTypeContext(oldIsType);
  }
}
function tsStartParseObjPropValue() {
  tsTryParseTypeParameters();
}
function tsStartParseFunctionParams() {
  tsTryParseTypeParameters();
}
function tsAfterParseVarHead() {
  const oldIsType = pushTypeContext(0);
  if (!hasPrecedingLineBreak()) {
    eat(TokenType.bang);
  }
  tsTryParseTypeAnnotation();
  popTypeContext(oldIsType);
}
function tsStartParseAsyncArrowFromCallExpression() {
  if (match(TokenType.colon)) {
    tsParseTypeAnnotation();
  }
}
function tsParseMaybeAssign(noIn, isWithinParens) {
  if (isJSXEnabled) {
    return tsParseMaybeAssignWithJSX(noIn, isWithinParens);
  } else {
    return tsParseMaybeAssignWithoutJSX(noIn, isWithinParens);
  }
}
function tsParseMaybeAssignWithJSX(noIn, isWithinParens) {
  if (!match(TokenType.lessThan)) {
    return baseParseMaybeAssign(noIn, isWithinParens);
  }
  const snapshot = state.snapshot();
  let wasArrow = baseParseMaybeAssign(noIn, isWithinParens);
  if (state.error) {
    state.restoreFromSnapshot(snapshot);
  } else {
    return wasArrow;
  }
  state.type = TokenType.typeParameterStart;
  tsParseTypeParameters();
  wasArrow = baseParseMaybeAssign(noIn, isWithinParens);
  if (!wasArrow) {
    unexpected();
  }
  return wasArrow;
}
function tsParseMaybeAssignWithoutJSX(noIn, isWithinParens) {
  if (!match(TokenType.lessThan)) {
    return baseParseMaybeAssign(noIn, isWithinParens);
  }
  const snapshot = state.snapshot();
  tsParseTypeParameters();
  const wasArrow = baseParseMaybeAssign(noIn, isWithinParens);
  if (!wasArrow) {
    unexpected();
  }
  if (state.error) {
    state.restoreFromSnapshot(snapshot);
  } else {
    return wasArrow;
  }
  return baseParseMaybeAssign(noIn, isWithinParens);
}
function tsParseArrow() {
  if (match(TokenType.colon)) {
    const snapshot = state.snapshot();
    tsParseTypeOrTypePredicateAnnotation(TokenType.colon);
    if (canInsertSemicolon()) unexpected();
    if (!match(TokenType.arrow)) unexpected();
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
    }
  }
  return eat(TokenType.arrow);
}
function tsParseAssignableListItemTypes() {
  const oldIsType = pushTypeContext(0);
  eat(TokenType.question);
  tsTryParseTypeAnnotation();
  popTypeContext(oldIsType);
}
function tsParseMaybeDecoratorArguments() {
  if (match(TokenType.lessThan) || match(TokenType.bitShiftL)) {
    tsParseTypeArgumentsWithPossibleBitshift();
  }
  baseParseMaybeDecoratorArguments();
}

// node_modules/sucrase/dist/esm/parser/plugins/jsx/index.js
function jsxReadToken() {
  let sawNewline = false;
  let sawNonWhitespace = false;
  while (true) {
    if (state.pos >= input.length) {
      unexpected("Unterminated JSX contents");
      return;
    }
    const ch = input.charCodeAt(state.pos);
    if (ch === charCodes.lessThan || ch === charCodes.leftCurlyBrace) {
      if (state.pos === state.start) {
        if (ch === charCodes.lessThan) {
          state.pos++;
          finishToken(TokenType.jsxTagStart);
          return;
        }
        getTokenFromCode(ch);
        return;
      }
      if (sawNewline && !sawNonWhitespace) {
        finishToken(TokenType.jsxEmptyText);
      } else {
        finishToken(TokenType.jsxText);
      }
      return;
    }
    if (ch === charCodes.lineFeed) {
      sawNewline = true;
    } else if (ch !== charCodes.space && ch !== charCodes.carriageReturn && ch !== charCodes.tab) {
      sawNonWhitespace = true;
    }
    state.pos++;
  }
}
function jsxReadString(quote) {
  state.pos++;
  for (; ; ) {
    if (state.pos >= input.length) {
      unexpected("Unterminated string constant");
      return;
    }
    const ch = input.charCodeAt(state.pos);
    if (ch === quote) {
      state.pos++;
      break;
    }
    state.pos++;
  }
  finishToken(TokenType.string);
}
function jsxReadWord() {
  let ch;
  do {
    if (state.pos > input.length) {
      unexpected("Unexpectedly reached the end of input.");
      return;
    }
    ch = input.charCodeAt(++state.pos);
  } while (IS_IDENTIFIER_CHAR[ch] || ch === charCodes.dash);
  finishToken(TokenType.jsxName);
}
function jsxParseIdentifier() {
  nextJSXTagToken();
}
function jsxParseNamespacedName(identifierRole) {
  jsxParseIdentifier();
  if (!eat(TokenType.colon)) {
    state.tokens[state.tokens.length - 1].identifierRole = identifierRole;
    return;
  }
  jsxParseIdentifier();
}
function jsxParseElementName() {
  const firstTokenIndex = state.tokens.length;
  jsxParseNamespacedName(IdentifierRole.Access);
  let hadDot = false;
  while (match(TokenType.dot)) {
    hadDot = true;
    nextJSXTagToken();
    jsxParseIdentifier();
  }
  if (!hadDot) {
    const firstToken = state.tokens[firstTokenIndex];
    const firstChar = input.charCodeAt(firstToken.start);
    if (firstChar >= charCodes.lowercaseA && firstChar <= charCodes.lowercaseZ) {
      firstToken.identifierRole = null;
    }
  }
}
function jsxParseAttributeValue() {
  switch (state.type) {
    case TokenType.braceL:
      next();
      parseExpression();
      nextJSXTagToken();
      return;
    case TokenType.jsxTagStart:
      jsxParseElement();
      nextJSXTagToken();
      return;
    case TokenType.string:
      nextJSXTagToken();
      return;
    default:
      unexpected("JSX value should be either an expression or a quoted JSX text");
  }
}
function jsxParseSpreadChild() {
  expect(TokenType.ellipsis);
  parseExpression();
}
function jsxParseOpeningElement(initialTokenIndex) {
  if (match(TokenType.jsxTagEnd)) {
    return false;
  }
  jsxParseElementName();
  if (isTypeScriptEnabled) {
    tsTryParseJSXTypeArgument();
  }
  let hasSeenPropSpread = false;
  while (!match(TokenType.slash) && !match(TokenType.jsxTagEnd) && !state.error) {
    if (eat(TokenType.braceL)) {
      hasSeenPropSpread = true;
      expect(TokenType.ellipsis);
      parseMaybeAssign();
      nextJSXTagToken();
      continue;
    }
    if (hasSeenPropSpread && state.end - state.start === 3 && input.charCodeAt(state.start) === charCodes.lowercaseK && input.charCodeAt(state.start + 1) === charCodes.lowercaseE && input.charCodeAt(state.start + 2) === charCodes.lowercaseY) {
      state.tokens[initialTokenIndex].jsxRole = JSXRole.KeyAfterPropSpread;
    }
    jsxParseNamespacedName(IdentifierRole.ObjectKey);
    if (match(TokenType.eq)) {
      nextJSXTagToken();
      jsxParseAttributeValue();
    }
  }
  const isSelfClosing = match(TokenType.slash);
  if (isSelfClosing) {
    nextJSXTagToken();
  }
  return isSelfClosing;
}
function jsxParseClosingElement() {
  if (match(TokenType.jsxTagEnd)) {
    return;
  }
  jsxParseElementName();
}
function jsxParseElementAt() {
  const initialTokenIndex = state.tokens.length - 1;
  state.tokens[initialTokenIndex].jsxRole = JSXRole.NoChildren;
  let numExplicitChildren = 0;
  const isSelfClosing = jsxParseOpeningElement(initialTokenIndex);
  if (!isSelfClosing) {
    nextJSXExprToken();
    while (true) {
      switch (state.type) {
        case TokenType.jsxTagStart:
          nextJSXTagToken();
          if (match(TokenType.slash)) {
            nextJSXTagToken();
            jsxParseClosingElement();
            if (state.tokens[initialTokenIndex].jsxRole !== JSXRole.KeyAfterPropSpread) {
              if (numExplicitChildren === 1) {
                state.tokens[initialTokenIndex].jsxRole = JSXRole.OneChild;
              } else if (numExplicitChildren > 1) {
                state.tokens[initialTokenIndex].jsxRole = JSXRole.StaticChildren;
              }
            }
            return;
          }
          numExplicitChildren++;
          jsxParseElementAt();
          nextJSXExprToken();
          break;
        case TokenType.jsxText:
          numExplicitChildren++;
          nextJSXExprToken();
          break;
        case TokenType.jsxEmptyText:
          nextJSXExprToken();
          break;
        case TokenType.braceL:
          next();
          if (match(TokenType.ellipsis)) {
            jsxParseSpreadChild();
            nextJSXExprToken();
            numExplicitChildren += 2;
          } else {
            if (!match(TokenType.braceR)) {
              numExplicitChildren++;
              parseExpression();
            }
            nextJSXExprToken();
          }
          break;
        // istanbul ignore next - should never happen
        default:
          unexpected();
          return;
      }
    }
  }
}
function jsxParseElement() {
  nextJSXTagToken();
  jsxParseElementAt();
}
function nextJSXTagToken() {
  state.tokens.push(new Token());
  skipSpace();
  state.start = state.pos;
  const code = input.charCodeAt(state.pos);
  if (IS_IDENTIFIER_START[code]) {
    jsxReadWord();
  } else if (code === charCodes.quotationMark || code === charCodes.apostrophe) {
    jsxReadString(code);
  } else {
    ++state.pos;
    switch (code) {
      case charCodes.greaterThan:
        finishToken(TokenType.jsxTagEnd);
        break;
      case charCodes.lessThan:
        finishToken(TokenType.jsxTagStart);
        break;
      case charCodes.slash:
        finishToken(TokenType.slash);
        break;
      case charCodes.equalsTo:
        finishToken(TokenType.eq);
        break;
      case charCodes.leftCurlyBrace:
        finishToken(TokenType.braceL);
        break;
      case charCodes.dot:
        finishToken(TokenType.dot);
        break;
      case charCodes.colon:
        finishToken(TokenType.colon);
        break;
      default:
        unexpected();
    }
  }
}
function nextJSXExprToken() {
  state.tokens.push(new Token());
  state.start = state.pos;
  jsxReadToken();
}

// node_modules/sucrase/dist/esm/parser/plugins/types.js
function typedParseConditional(noIn) {
  if (match(TokenType.question)) {
    const nextType = lookaheadType();
    if (nextType === TokenType.colon || nextType === TokenType.comma || nextType === TokenType.parenR) {
      return;
    }
  }
  baseParseConditional(noIn);
}
function typedParseParenItem() {
  eatTypeToken(TokenType.question);
  if (match(TokenType.colon)) {
    if (isTypeScriptEnabled) {
      tsParseTypeAnnotation();
    } else if (isFlowEnabled) {
      flowParseTypeAnnotation();
    }
  }
}

// node_modules/sucrase/dist/esm/parser/traverser/expression.js
var StopState = class {
  constructor(stop) {
    this.stop = stop;
  }
};
function parseExpression(noIn = false) {
  parseMaybeAssign(noIn);
  if (match(TokenType.comma)) {
    while (eat(TokenType.comma)) {
      parseMaybeAssign(noIn);
    }
  }
}
function parseMaybeAssign(noIn = false, isWithinParens = false) {
  if (isTypeScriptEnabled) {
    return tsParseMaybeAssign(noIn, isWithinParens);
  } else if (isFlowEnabled) {
    return flowParseMaybeAssign(noIn, isWithinParens);
  } else {
    return baseParseMaybeAssign(noIn, isWithinParens);
  }
}
function baseParseMaybeAssign(noIn, isWithinParens) {
  if (match(TokenType._yield)) {
    parseYield();
    return false;
  }
  if (match(TokenType.parenL) || match(TokenType.name) || match(TokenType._yield)) {
    state.potentialArrowAt = state.start;
  }
  const wasArrow = parseMaybeConditional(noIn);
  if (isWithinParens) {
    parseParenItem();
  }
  if (state.type & TokenType.IS_ASSIGN) {
    next();
    parseMaybeAssign(noIn);
    return false;
  }
  return wasArrow;
}
function parseMaybeConditional(noIn) {
  const wasArrow = parseExprOps(noIn);
  if (wasArrow) {
    return true;
  }
  parseConditional(noIn);
  return false;
}
function parseConditional(noIn) {
  if (isTypeScriptEnabled || isFlowEnabled) {
    typedParseConditional(noIn);
  } else {
    baseParseConditional(noIn);
  }
}
function baseParseConditional(noIn) {
  if (eat(TokenType.question)) {
    parseMaybeAssign();
    expect(TokenType.colon);
    parseMaybeAssign(noIn);
  }
}
function parseExprOps(noIn) {
  const startTokenIndex = state.tokens.length;
  const wasArrow = parseMaybeUnary();
  if (wasArrow) {
    return true;
  }
  parseExprOp(startTokenIndex, -1, noIn);
  return false;
}
function parseExprOp(startTokenIndex, minPrec, noIn) {
  if (isTypeScriptEnabled && (TokenType._in & TokenType.PRECEDENCE_MASK) > minPrec && !hasPrecedingLineBreak() && (eatContextual(ContextualKeyword._as) || eatContextual(ContextualKeyword._satisfies))) {
    const oldIsType = pushTypeContext(1);
    tsParseType();
    popTypeContext(oldIsType);
    rescan_gt();
    parseExprOp(startTokenIndex, minPrec, noIn);
    return;
  }
  const prec = state.type & TokenType.PRECEDENCE_MASK;
  if (prec > 0 && (!noIn || !match(TokenType._in))) {
    if (prec > minPrec) {
      const op = state.type;
      next();
      if (op === TokenType.nullishCoalescing) {
        state.tokens[state.tokens.length - 1].nullishStartIndex = startTokenIndex;
      }
      const rhsStartTokenIndex = state.tokens.length;
      parseMaybeUnary();
      parseExprOp(rhsStartTokenIndex, op & TokenType.IS_RIGHT_ASSOCIATIVE ? prec - 1 : prec, noIn);
      if (op === TokenType.nullishCoalescing) {
        state.tokens[startTokenIndex].numNullishCoalesceStarts++;
        state.tokens[state.tokens.length - 1].numNullishCoalesceEnds++;
      }
      parseExprOp(startTokenIndex, minPrec, noIn);
    }
  }
}
function parseMaybeUnary() {
  if (isTypeScriptEnabled && !isJSXEnabled && eat(TokenType.lessThan)) {
    tsParseTypeAssertion();
    return false;
  }
  if (isContextual(ContextualKeyword._module) && lookaheadCharCode() === charCodes.leftCurlyBrace && !hasFollowingLineBreak()) {
    parseModuleExpression();
    return false;
  }
  if (state.type & TokenType.IS_PREFIX) {
    next();
    parseMaybeUnary();
    return false;
  }
  const wasArrow = parseExprSubscripts();
  if (wasArrow) {
    return true;
  }
  while (state.type & TokenType.IS_POSTFIX && !canInsertSemicolon()) {
    if (state.type === TokenType.preIncDec) {
      state.type = TokenType.postIncDec;
    }
    next();
  }
  return false;
}
function parseExprSubscripts() {
  const startTokenIndex = state.tokens.length;
  const wasArrow = parseExprAtom();
  if (wasArrow) {
    return true;
  }
  parseSubscripts(startTokenIndex);
  if (state.tokens.length > startTokenIndex && state.tokens[startTokenIndex].isOptionalChainStart) {
    state.tokens[state.tokens.length - 1].isOptionalChainEnd = true;
  }
  return false;
}
function parseSubscripts(startTokenIndex, noCalls = false) {
  if (isFlowEnabled) {
    flowParseSubscripts(startTokenIndex, noCalls);
  } else {
    baseParseSubscripts(startTokenIndex, noCalls);
  }
}
function baseParseSubscripts(startTokenIndex, noCalls = false) {
  const stopState = new StopState(false);
  do {
    parseSubscript(startTokenIndex, noCalls, stopState);
  } while (!stopState.stop && !state.error);
}
function parseSubscript(startTokenIndex, noCalls, stopState) {
  if (isTypeScriptEnabled) {
    tsParseSubscript(startTokenIndex, noCalls, stopState);
  } else if (isFlowEnabled) {
    flowParseSubscript(startTokenIndex, noCalls, stopState);
  } else {
    baseParseSubscript(startTokenIndex, noCalls, stopState);
  }
}
function baseParseSubscript(startTokenIndex, noCalls, stopState) {
  if (!noCalls && eat(TokenType.doubleColon)) {
    parseNoCallExpr();
    stopState.stop = true;
    parseSubscripts(startTokenIndex, noCalls);
  } else if (match(TokenType.questionDot)) {
    state.tokens[startTokenIndex].isOptionalChainStart = true;
    if (noCalls && lookaheadType() === TokenType.parenL) {
      stopState.stop = true;
      return;
    }
    next();
    state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
    if (eat(TokenType.bracketL)) {
      parseExpression();
      expect(TokenType.bracketR);
    } else if (eat(TokenType.parenL)) {
      parseCallExpressionArguments();
    } else {
      parseMaybePrivateName();
    }
  } else if (eat(TokenType.dot)) {
    state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
    parseMaybePrivateName();
  } else if (eat(TokenType.bracketL)) {
    state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
    parseExpression();
    expect(TokenType.bracketR);
  } else if (!noCalls && match(TokenType.parenL)) {
    if (atPossibleAsync()) {
      const snapshot = state.snapshot();
      const asyncStartTokenIndex = state.tokens.length;
      next();
      state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
      const callContextId = getNextContextId();
      state.tokens[state.tokens.length - 1].contextId = callContextId;
      parseCallExpressionArguments();
      state.tokens[state.tokens.length - 1].contextId = callContextId;
      if (shouldParseAsyncArrow()) {
        state.restoreFromSnapshot(snapshot);
        stopState.stop = true;
        state.scopeDepth++;
        parseFunctionParams();
        parseAsyncArrowFromCallExpression(asyncStartTokenIndex);
      }
    } else {
      next();
      state.tokens[state.tokens.length - 1].subscriptStartIndex = startTokenIndex;
      const callContextId = getNextContextId();
      state.tokens[state.tokens.length - 1].contextId = callContextId;
      parseCallExpressionArguments();
      state.tokens[state.tokens.length - 1].contextId = callContextId;
    }
  } else if (match(TokenType.backQuote)) {
    parseTemplate();
  } else {
    stopState.stop = true;
  }
}
function atPossibleAsync() {
  return state.tokens[state.tokens.length - 1].contextualKeyword === ContextualKeyword._async && !canInsertSemicolon();
}
function parseCallExpressionArguments() {
  let first = true;
  while (!eat(TokenType.parenR) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      if (eat(TokenType.parenR)) {
        break;
      }
    }
    parseExprListItem(false);
  }
}
function shouldParseAsyncArrow() {
  return match(TokenType.colon) || match(TokenType.arrow);
}
function parseAsyncArrowFromCallExpression(startTokenIndex) {
  if (isTypeScriptEnabled) {
    tsStartParseAsyncArrowFromCallExpression();
  } else if (isFlowEnabled) {
    flowStartParseAsyncArrowFromCallExpression();
  }
  expect(TokenType.arrow);
  parseArrowExpression(startTokenIndex);
}
function parseNoCallExpr() {
  const startTokenIndex = state.tokens.length;
  parseExprAtom();
  parseSubscripts(startTokenIndex, true);
}
function parseExprAtom() {
  if (eat(TokenType.modulo)) {
    parseIdentifier();
    return false;
  }
  if (match(TokenType.jsxText) || match(TokenType.jsxEmptyText)) {
    parseLiteral();
    return false;
  } else if (match(TokenType.lessThan) && isJSXEnabled) {
    state.type = TokenType.jsxTagStart;
    jsxParseElement();
    next();
    return false;
  }
  const canBeArrow = state.potentialArrowAt === state.start;
  switch (state.type) {
    case TokenType.slash:
    case TokenType.assign:
      retokenizeSlashAsRegex();
    // Fall through.
    case TokenType._super:
    case TokenType._this:
    case TokenType.regexp:
    case TokenType.num:
    case TokenType.bigint:
    case TokenType.decimal:
    case TokenType.string:
    case TokenType._null:
    case TokenType._true:
    case TokenType._false:
      next();
      return false;
    case TokenType._import:
      next();
      if (match(TokenType.dot)) {
        state.tokens[state.tokens.length - 1].type = TokenType.name;
        next();
        parseIdentifier();
      }
      return false;
    case TokenType.name: {
      const startTokenIndex = state.tokens.length;
      const functionStart = state.start;
      const contextualKeyword = state.contextualKeyword;
      parseIdentifier();
      if (contextualKeyword === ContextualKeyword._await) {
        parseAwait();
        return false;
      } else if (contextualKeyword === ContextualKeyword._async && match(TokenType._function) && !canInsertSemicolon()) {
        next();
        parseFunction(functionStart, false);
        return false;
      } else if (canBeArrow && contextualKeyword === ContextualKeyword._async && !canInsertSemicolon() && match(TokenType.name)) {
        state.scopeDepth++;
        parseBindingIdentifier(false);
        expect(TokenType.arrow);
        parseArrowExpression(startTokenIndex);
        return true;
      } else if (match(TokenType._do) && !canInsertSemicolon()) {
        next();
        parseBlock();
        return false;
      }
      if (canBeArrow && !canInsertSemicolon() && match(TokenType.arrow)) {
        state.scopeDepth++;
        markPriorBindingIdentifier(false);
        expect(TokenType.arrow);
        parseArrowExpression(startTokenIndex);
        return true;
      }
      state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.Access;
      return false;
    }
    case TokenType._do: {
      next();
      parseBlock();
      return false;
    }
    case TokenType.parenL: {
      const wasArrow = parseParenAndDistinguishExpression(canBeArrow);
      return wasArrow;
    }
    case TokenType.bracketL:
      next();
      parseExprList(TokenType.bracketR, true);
      return false;
    case TokenType.braceL:
      parseObj(false, false);
      return false;
    case TokenType._function:
      parseFunctionExpression();
      return false;
    case TokenType.at:
      parseDecorators();
    // Fall through.
    case TokenType._class:
      parseClass(false);
      return false;
    case TokenType._new:
      parseNew();
      return false;
    case TokenType.backQuote:
      parseTemplate();
      return false;
    case TokenType.doubleColon: {
      next();
      parseNoCallExpr();
      return false;
    }
    case TokenType.hash: {
      const code = lookaheadCharCode();
      if (IS_IDENTIFIER_START[code] || code === charCodes.backslash) {
        parseMaybePrivateName();
      } else {
        next();
      }
      return false;
    }
    default:
      unexpected();
      return false;
  }
}
function parseMaybePrivateName() {
  eat(TokenType.hash);
  parseIdentifier();
}
function parseFunctionExpression() {
  const functionStart = state.start;
  parseIdentifier();
  if (eat(TokenType.dot)) {
    parseIdentifier();
  }
  parseFunction(functionStart, false);
}
function parseLiteral() {
  next();
}
function parseParenExpression() {
  expect(TokenType.parenL);
  parseExpression();
  expect(TokenType.parenR);
}
function parseParenAndDistinguishExpression(canBeArrow) {
  const snapshot = state.snapshot();
  const startTokenIndex = state.tokens.length;
  expect(TokenType.parenL);
  let first = true;
  while (!match(TokenType.parenR) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      if (match(TokenType.parenR)) {
        break;
      }
    }
    if (match(TokenType.ellipsis)) {
      parseRest(
        false
        /* isBlockScope */
      );
      parseParenItem();
      break;
    } else {
      parseMaybeAssign(false, true);
    }
  }
  expect(TokenType.parenR);
  if (canBeArrow && shouldParseArrow()) {
    const wasArrow = parseArrow();
    if (wasArrow) {
      state.restoreFromSnapshot(snapshot);
      state.scopeDepth++;
      parseFunctionParams();
      parseArrow();
      parseArrowExpression(startTokenIndex);
      if (state.error) {
        state.restoreFromSnapshot(snapshot);
        parseParenAndDistinguishExpression(false);
        return false;
      }
      return true;
    }
  }
  return false;
}
function shouldParseArrow() {
  return match(TokenType.colon) || !canInsertSemicolon();
}
function parseArrow() {
  if (isTypeScriptEnabled) {
    return tsParseArrow();
  } else if (isFlowEnabled) {
    return flowParseArrow();
  } else {
    return eat(TokenType.arrow);
  }
}
function parseParenItem() {
  if (isTypeScriptEnabled || isFlowEnabled) {
    typedParseParenItem();
  }
}
function parseNew() {
  expect(TokenType._new);
  if (eat(TokenType.dot)) {
    parseIdentifier();
    return;
  }
  parseNewCallee();
  if (isFlowEnabled) {
    flowStartParseNewArguments();
  }
  if (eat(TokenType.parenL)) {
    parseExprList(TokenType.parenR);
  }
}
function parseNewCallee() {
  parseNoCallExpr();
  eat(TokenType.questionDot);
}
function parseTemplate() {
  nextTemplateToken();
  nextTemplateToken();
  while (!match(TokenType.backQuote) && !state.error) {
    expect(TokenType.dollarBraceL);
    parseExpression();
    nextTemplateToken();
    nextTemplateToken();
  }
  next();
}
function parseObj(isPattern, isBlockScope) {
  const contextId = getNextContextId();
  let first = true;
  next();
  state.tokens[state.tokens.length - 1].contextId = contextId;
  while (!eat(TokenType.braceR) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      if (eat(TokenType.braceR)) {
        break;
      }
    }
    let isGenerator = false;
    if (match(TokenType.ellipsis)) {
      const previousIndex = state.tokens.length;
      parseSpread();
      if (isPattern) {
        if (state.tokens.length === previousIndex + 2) {
          markPriorBindingIdentifier(isBlockScope);
        }
        if (eat(TokenType.braceR)) {
          break;
        }
      }
      continue;
    }
    if (!isPattern) {
      isGenerator = eat(TokenType.star);
    }
    if (!isPattern && isContextual(ContextualKeyword._async)) {
      if (isGenerator) unexpected();
      parseIdentifier();
      if (match(TokenType.colon) || match(TokenType.parenL) || match(TokenType.braceR) || match(TokenType.eq) || match(TokenType.comma)) {
      } else {
        if (match(TokenType.star)) {
          next();
          isGenerator = true;
        }
        parsePropertyName(contextId);
      }
    } else {
      parsePropertyName(contextId);
    }
    parseObjPropValue(isPattern, isBlockScope, contextId);
  }
  state.tokens[state.tokens.length - 1].contextId = contextId;
}
function isGetterOrSetterMethod(isPattern) {
  return !isPattern && (match(TokenType.string) || // get "string"() {}
  match(TokenType.num) || // get 1() {}
  match(TokenType.bracketL) || // get ["string"]() {}
  match(TokenType.name) || // get foo() {}
  !!(state.type & TokenType.IS_KEYWORD));
}
function parseObjectMethod(isPattern, objectContextId) {
  const functionStart = state.start;
  if (match(TokenType.parenL)) {
    if (isPattern) unexpected();
    parseMethod(
      functionStart,
      /* isConstructor */
      false
    );
    return true;
  }
  if (isGetterOrSetterMethod(isPattern)) {
    parsePropertyName(objectContextId);
    parseMethod(
      functionStart,
      /* isConstructor */
      false
    );
    return true;
  }
  return false;
}
function parseObjectProperty(isPattern, isBlockScope) {
  if (eat(TokenType.colon)) {
    if (isPattern) {
      parseMaybeDefault(isBlockScope);
    } else {
      parseMaybeAssign(false);
    }
    return;
  }
  let identifierRole;
  if (isPattern) {
    if (state.scopeDepth === 0) {
      identifierRole = IdentifierRole.ObjectShorthandTopLevelDeclaration;
    } else if (isBlockScope) {
      identifierRole = IdentifierRole.ObjectShorthandBlockScopedDeclaration;
    } else {
      identifierRole = IdentifierRole.ObjectShorthandFunctionScopedDeclaration;
    }
  } else {
    identifierRole = IdentifierRole.ObjectShorthand;
  }
  state.tokens[state.tokens.length - 1].identifierRole = identifierRole;
  parseMaybeDefault(isBlockScope, true);
}
function parseObjPropValue(isPattern, isBlockScope, objectContextId) {
  if (isTypeScriptEnabled) {
    tsStartParseObjPropValue();
  } else if (isFlowEnabled) {
    flowStartParseObjPropValue();
  }
  const wasMethod = parseObjectMethod(isPattern, objectContextId);
  if (!wasMethod) {
    parseObjectProperty(isPattern, isBlockScope);
  }
}
function parsePropertyName(objectContextId) {
  if (isFlowEnabled) {
    flowParseVariance();
  }
  if (eat(TokenType.bracketL)) {
    state.tokens[state.tokens.length - 1].contextId = objectContextId;
    parseMaybeAssign();
    expect(TokenType.bracketR);
    state.tokens[state.tokens.length - 1].contextId = objectContextId;
  } else {
    if (match(TokenType.num) || match(TokenType.string) || match(TokenType.bigint) || match(TokenType.decimal)) {
      parseExprAtom();
    } else {
      parseMaybePrivateName();
    }
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ObjectKey;
    state.tokens[state.tokens.length - 1].contextId = objectContextId;
  }
}
function parseMethod(functionStart, isConstructor) {
  const funcContextId = getNextContextId();
  state.scopeDepth++;
  const startTokenIndex = state.tokens.length;
  const allowModifiers = isConstructor;
  parseFunctionParams(allowModifiers, funcContextId);
  parseFunctionBodyAndFinish(functionStart, funcContextId);
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, true));
  state.scopeDepth--;
}
function parseArrowExpression(startTokenIndex) {
  parseFunctionBody(true);
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, true));
  state.scopeDepth--;
}
function parseFunctionBodyAndFinish(functionStart, funcContextId = 0) {
  if (isTypeScriptEnabled) {
    tsParseFunctionBodyAndFinish(functionStart, funcContextId);
  } else if (isFlowEnabled) {
    flowParseFunctionBodyAndFinish(funcContextId);
  } else {
    parseFunctionBody(false, funcContextId);
  }
}
function parseFunctionBody(allowExpression, funcContextId = 0) {
  const isExpression = allowExpression && !match(TokenType.braceL);
  if (isExpression) {
    parseMaybeAssign();
  } else {
    parseBlock(true, funcContextId);
  }
}
function parseExprList(close, allowEmpty = false) {
  let first = true;
  while (!eat(close) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      if (eat(close)) break;
    }
    parseExprListItem(allowEmpty);
  }
}
function parseExprListItem(allowEmpty) {
  if (allowEmpty && match(TokenType.comma)) {
  } else if (match(TokenType.ellipsis)) {
    parseSpread();
    parseParenItem();
  } else if (match(TokenType.question)) {
    next();
  } else {
    parseMaybeAssign(false, true);
  }
}
function parseIdentifier() {
  next();
  state.tokens[state.tokens.length - 1].type = TokenType.name;
}
function parseAwait() {
  parseMaybeUnary();
}
function parseYield() {
  next();
  if (!match(TokenType.semi) && !canInsertSemicolon()) {
    eat(TokenType.star);
    parseMaybeAssign();
  }
}
function parseModuleExpression() {
  expectContextual(ContextualKeyword._module);
  expect(TokenType.braceL);
  parseBlockBody(TokenType.braceR);
}

// node_modules/sucrase/dist/esm/parser/plugins/flow.js
function isMaybeDefaultImport(lookahead) {
  return (lookahead.type === TokenType.name || !!(lookahead.type & TokenType.IS_KEYWORD)) && lookahead.contextualKeyword !== ContextualKeyword._from;
}
function flowParseTypeInitialiser(tok) {
  const oldIsType = pushTypeContext(0);
  expect(tok || TokenType.colon);
  flowParseType();
  popTypeContext(oldIsType);
}
function flowParsePredicate() {
  expect(TokenType.modulo);
  expectContextual(ContextualKeyword._checks);
  if (eat(TokenType.parenL)) {
    parseExpression();
    expect(TokenType.parenR);
  }
}
function flowParseTypeAndPredicateInitialiser() {
  const oldIsType = pushTypeContext(0);
  expect(TokenType.colon);
  if (match(TokenType.modulo)) {
    flowParsePredicate();
  } else {
    flowParseType();
    if (match(TokenType.modulo)) {
      flowParsePredicate();
    }
  }
  popTypeContext(oldIsType);
}
function flowParseDeclareClass() {
  next();
  flowParseInterfaceish(
    /* isClass */
    true
  );
}
function flowParseDeclareFunction() {
  next();
  parseIdentifier();
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
  }
  expect(TokenType.parenL);
  flowParseFunctionTypeParams();
  expect(TokenType.parenR);
  flowParseTypeAndPredicateInitialiser();
  semicolon();
}
function flowParseDeclare() {
  if (match(TokenType._class)) {
    flowParseDeclareClass();
  } else if (match(TokenType._function)) {
    flowParseDeclareFunction();
  } else if (match(TokenType._var)) {
    flowParseDeclareVariable();
  } else if (eatContextual(ContextualKeyword._module)) {
    if (eat(TokenType.dot)) {
      flowParseDeclareModuleExports();
    } else {
      flowParseDeclareModule();
    }
  } else if (isContextual(ContextualKeyword._type)) {
    flowParseDeclareTypeAlias();
  } else if (isContextual(ContextualKeyword._opaque)) {
    flowParseDeclareOpaqueType();
  } else if (isContextual(ContextualKeyword._interface)) {
    flowParseDeclareInterface();
  } else if (match(TokenType._export)) {
    flowParseDeclareExportDeclaration();
  } else {
    unexpected();
  }
}
function flowParseDeclareVariable() {
  next();
  flowParseTypeAnnotatableIdentifier();
  semicolon();
}
function flowParseDeclareModule() {
  if (match(TokenType.string)) {
    parseExprAtom();
  } else {
    parseIdentifier();
  }
  expect(TokenType.braceL);
  while (!match(TokenType.braceR) && !state.error) {
    if (match(TokenType._import)) {
      next();
      parseImport();
    } else {
      unexpected();
    }
  }
  expect(TokenType.braceR);
}
function flowParseDeclareExportDeclaration() {
  expect(TokenType._export);
  if (eat(TokenType._default)) {
    if (match(TokenType._function) || match(TokenType._class)) {
      flowParseDeclare();
    } else {
      flowParseType();
      semicolon();
    }
  } else if (match(TokenType._var) || // declare export var ...
  match(TokenType._function) || // declare export function ...
  match(TokenType._class) || // declare export class ...
  isContextual(ContextualKeyword._opaque)) {
    flowParseDeclare();
  } else if (match(TokenType.star) || // declare export * from ''
  match(TokenType.braceL) || // declare export {} ...
  isContextual(ContextualKeyword._interface) || // declare export interface ...
  isContextual(ContextualKeyword._type) || // declare export type ...
  isContextual(ContextualKeyword._opaque)) {
    parseExport();
  } else {
    unexpected();
  }
}
function flowParseDeclareModuleExports() {
  expectContextual(ContextualKeyword._exports);
  flowParseTypeAnnotation();
  semicolon();
}
function flowParseDeclareTypeAlias() {
  next();
  flowParseTypeAlias();
}
function flowParseDeclareOpaqueType() {
  next();
  flowParseOpaqueType(true);
}
function flowParseDeclareInterface() {
  next();
  flowParseInterfaceish();
}
function flowParseInterfaceish(isClass = false) {
  flowParseRestrictedIdentifier();
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
  }
  if (eat(TokenType._extends)) {
    do {
      flowParseInterfaceExtends();
    } while (!isClass && eat(TokenType.comma));
  }
  if (isContextual(ContextualKeyword._mixins)) {
    next();
    do {
      flowParseInterfaceExtends();
    } while (eat(TokenType.comma));
  }
  if (isContextual(ContextualKeyword._implements)) {
    next();
    do {
      flowParseInterfaceExtends();
    } while (eat(TokenType.comma));
  }
  flowParseObjectType(isClass, false, isClass);
}
function flowParseInterfaceExtends() {
  flowParseQualifiedTypeIdentifier(false);
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterInstantiation();
  }
}
function flowParseInterface() {
  flowParseInterfaceish();
}
function flowParseRestrictedIdentifier() {
  parseIdentifier();
}
function flowParseTypeAlias() {
  flowParseRestrictedIdentifier();
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
  }
  flowParseTypeInitialiser(TokenType.eq);
  semicolon();
}
function flowParseOpaqueType(declare) {
  expectContextual(ContextualKeyword._type);
  flowParseRestrictedIdentifier();
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
  }
  if (match(TokenType.colon)) {
    flowParseTypeInitialiser(TokenType.colon);
  }
  if (!declare) {
    flowParseTypeInitialiser(TokenType.eq);
  }
  semicolon();
}
function flowParseTypeParameter() {
  flowParseVariance();
  flowParseTypeAnnotatableIdentifier();
  if (eat(TokenType.eq)) {
    flowParseType();
  }
}
function flowParseTypeParameterDeclaration() {
  const oldIsType = pushTypeContext(0);
  if (match(TokenType.lessThan) || match(TokenType.typeParameterStart)) {
    next();
  } else {
    unexpected();
  }
  do {
    flowParseTypeParameter();
    if (!match(TokenType.greaterThan)) {
      expect(TokenType.comma);
    }
  } while (!match(TokenType.greaterThan) && !state.error);
  expect(TokenType.greaterThan);
  popTypeContext(oldIsType);
}
function flowParseTypeParameterInstantiation() {
  const oldIsType = pushTypeContext(0);
  expect(TokenType.lessThan);
  while (!match(TokenType.greaterThan) && !state.error) {
    flowParseType();
    if (!match(TokenType.greaterThan)) {
      expect(TokenType.comma);
    }
  }
  expect(TokenType.greaterThan);
  popTypeContext(oldIsType);
}
function flowParseInterfaceType() {
  expectContextual(ContextualKeyword._interface);
  if (eat(TokenType._extends)) {
    do {
      flowParseInterfaceExtends();
    } while (eat(TokenType.comma));
  }
  flowParseObjectType(false, false, false);
}
function flowParseObjectPropertyKey() {
  if (match(TokenType.num) || match(TokenType.string)) {
    parseExprAtom();
  } else {
    parseIdentifier();
  }
}
function flowParseObjectTypeIndexer() {
  if (lookaheadType() === TokenType.colon) {
    flowParseObjectPropertyKey();
    flowParseTypeInitialiser();
  } else {
    flowParseType();
  }
  expect(TokenType.bracketR);
  flowParseTypeInitialiser();
}
function flowParseObjectTypeInternalSlot() {
  flowParseObjectPropertyKey();
  expect(TokenType.bracketR);
  expect(TokenType.bracketR);
  if (match(TokenType.lessThan) || match(TokenType.parenL)) {
    flowParseObjectTypeMethodish();
  } else {
    eat(TokenType.question);
    flowParseTypeInitialiser();
  }
}
function flowParseObjectTypeMethodish() {
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
  }
  expect(TokenType.parenL);
  while (!match(TokenType.parenR) && !match(TokenType.ellipsis) && !state.error) {
    flowParseFunctionTypeParam();
    if (!match(TokenType.parenR)) {
      expect(TokenType.comma);
    }
  }
  if (eat(TokenType.ellipsis)) {
    flowParseFunctionTypeParam();
  }
  expect(TokenType.parenR);
  flowParseTypeInitialiser();
}
function flowParseObjectTypeCallProperty() {
  flowParseObjectTypeMethodish();
}
function flowParseObjectType(allowStatic, allowExact, allowProto) {
  let endDelim;
  if (allowExact && match(TokenType.braceBarL)) {
    expect(TokenType.braceBarL);
    endDelim = TokenType.braceBarR;
  } else {
    expect(TokenType.braceL);
    endDelim = TokenType.braceR;
  }
  while (!match(endDelim) && !state.error) {
    if (allowProto && isContextual(ContextualKeyword._proto)) {
      const lookahead = lookaheadType();
      if (lookahead !== TokenType.colon && lookahead !== TokenType.question) {
        next();
        allowStatic = false;
      }
    }
    if (allowStatic && isContextual(ContextualKeyword._static)) {
      const lookahead = lookaheadType();
      if (lookahead !== TokenType.colon && lookahead !== TokenType.question) {
        next();
      }
    }
    flowParseVariance();
    if (eat(TokenType.bracketL)) {
      if (eat(TokenType.bracketL)) {
        flowParseObjectTypeInternalSlot();
      } else {
        flowParseObjectTypeIndexer();
      }
    } else if (match(TokenType.parenL) || match(TokenType.lessThan)) {
      flowParseObjectTypeCallProperty();
    } else {
      if (isContextual(ContextualKeyword._get) || isContextual(ContextualKeyword._set)) {
        const lookahead = lookaheadType();
        if (lookahead === TokenType.name || lookahead === TokenType.string || lookahead === TokenType.num) {
          next();
        }
      }
      flowParseObjectTypeProperty();
    }
    flowObjectTypeSemicolon();
  }
  expect(endDelim);
}
function flowParseObjectTypeProperty() {
  if (match(TokenType.ellipsis)) {
    expect(TokenType.ellipsis);
    if (!eat(TokenType.comma)) {
      eat(TokenType.semi);
    }
    if (match(TokenType.braceR)) {
      return;
    }
    flowParseType();
  } else {
    flowParseObjectPropertyKey();
    if (match(TokenType.lessThan) || match(TokenType.parenL)) {
      flowParseObjectTypeMethodish();
    } else {
      eat(TokenType.question);
      flowParseTypeInitialiser();
    }
  }
}
function flowObjectTypeSemicolon() {
  if (!eat(TokenType.semi) && !eat(TokenType.comma) && !match(TokenType.braceR) && !match(TokenType.braceBarR)) {
    unexpected();
  }
}
function flowParseQualifiedTypeIdentifier(initialIdAlreadyParsed) {
  if (!initialIdAlreadyParsed) {
    parseIdentifier();
  }
  while (eat(TokenType.dot)) {
    parseIdentifier();
  }
}
function flowParseGenericType() {
  flowParseQualifiedTypeIdentifier(true);
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterInstantiation();
  }
}
function flowParseTypeofType() {
  expect(TokenType._typeof);
  flowParsePrimaryType();
}
function flowParseTupleType() {
  expect(TokenType.bracketL);
  while (state.pos < input.length && !match(TokenType.bracketR)) {
    flowParseType();
    if (match(TokenType.bracketR)) {
      break;
    }
    expect(TokenType.comma);
  }
  expect(TokenType.bracketR);
}
function flowParseFunctionTypeParam() {
  const lookahead = lookaheadType();
  if (lookahead === TokenType.colon || lookahead === TokenType.question) {
    parseIdentifier();
    eat(TokenType.question);
    flowParseTypeInitialiser();
  } else {
    flowParseType();
  }
}
function flowParseFunctionTypeParams() {
  while (!match(TokenType.parenR) && !match(TokenType.ellipsis) && !state.error) {
    flowParseFunctionTypeParam();
    if (!match(TokenType.parenR)) {
      expect(TokenType.comma);
    }
  }
  if (eat(TokenType.ellipsis)) {
    flowParseFunctionTypeParam();
  }
}
function flowParsePrimaryType() {
  let isGroupedType = false;
  const oldNoAnonFunctionType = state.noAnonFunctionType;
  switch (state.type) {
    case TokenType.name: {
      if (isContextual(ContextualKeyword._interface)) {
        flowParseInterfaceType();
        return;
      }
      parseIdentifier();
      flowParseGenericType();
      return;
    }
    case TokenType.braceL:
      flowParseObjectType(false, false, false);
      return;
    case TokenType.braceBarL:
      flowParseObjectType(false, true, false);
      return;
    case TokenType.bracketL:
      flowParseTupleType();
      return;
    case TokenType.lessThan:
      flowParseTypeParameterDeclaration();
      expect(TokenType.parenL);
      flowParseFunctionTypeParams();
      expect(TokenType.parenR);
      expect(TokenType.arrow);
      flowParseType();
      return;
    case TokenType.parenL:
      next();
      if (!match(TokenType.parenR) && !match(TokenType.ellipsis)) {
        if (match(TokenType.name)) {
          const token = lookaheadType();
          isGroupedType = token !== TokenType.question && token !== TokenType.colon;
        } else {
          isGroupedType = true;
        }
      }
      if (isGroupedType) {
        state.noAnonFunctionType = false;
        flowParseType();
        state.noAnonFunctionType = oldNoAnonFunctionType;
        if (state.noAnonFunctionType || !(match(TokenType.comma) || match(TokenType.parenR) && lookaheadType() === TokenType.arrow)) {
          expect(TokenType.parenR);
          return;
        } else {
          eat(TokenType.comma);
        }
      }
      flowParseFunctionTypeParams();
      expect(TokenType.parenR);
      expect(TokenType.arrow);
      flowParseType();
      return;
    case TokenType.minus:
      next();
      parseLiteral();
      return;
    case TokenType.string:
    case TokenType.num:
    case TokenType._true:
    case TokenType._false:
    case TokenType._null:
    case TokenType._this:
    case TokenType._void:
    case TokenType.star:
      next();
      return;
    default:
      if (state.type === TokenType._typeof) {
        flowParseTypeofType();
        return;
      } else if (state.type & TokenType.IS_KEYWORD) {
        next();
        state.tokens[state.tokens.length - 1].type = TokenType.name;
        return;
      }
  }
  unexpected();
}
function flowParsePostfixType() {
  flowParsePrimaryType();
  while (!canInsertSemicolon() && (match(TokenType.bracketL) || match(TokenType.questionDot))) {
    eat(TokenType.questionDot);
    expect(TokenType.bracketL);
    if (eat(TokenType.bracketR)) {
    } else {
      flowParseType();
      expect(TokenType.bracketR);
    }
  }
}
function flowParsePrefixType() {
  if (eat(TokenType.question)) {
    flowParsePrefixType();
  } else {
    flowParsePostfixType();
  }
}
function flowParseAnonFunctionWithoutParens() {
  flowParsePrefixType();
  if (!state.noAnonFunctionType && eat(TokenType.arrow)) {
    flowParseType();
  }
}
function flowParseIntersectionType() {
  eat(TokenType.bitwiseAND);
  flowParseAnonFunctionWithoutParens();
  while (eat(TokenType.bitwiseAND)) {
    flowParseAnonFunctionWithoutParens();
  }
}
function flowParseUnionType() {
  eat(TokenType.bitwiseOR);
  flowParseIntersectionType();
  while (eat(TokenType.bitwiseOR)) {
    flowParseIntersectionType();
  }
}
function flowParseType() {
  flowParseUnionType();
}
function flowParseTypeAnnotation() {
  flowParseTypeInitialiser();
}
function flowParseTypeAnnotatableIdentifier() {
  parseIdentifier();
  if (match(TokenType.colon)) {
    flowParseTypeAnnotation();
  }
}
function flowParseVariance() {
  if (match(TokenType.plus) || match(TokenType.minus)) {
    next();
    state.tokens[state.tokens.length - 1].isType = true;
  }
}
function flowParseFunctionBodyAndFinish(funcContextId) {
  if (match(TokenType.colon)) {
    flowParseTypeAndPredicateInitialiser();
  }
  parseFunctionBody(false, funcContextId);
}
function flowParseSubscript(startTokenIndex, noCalls, stopState) {
  if (match(TokenType.questionDot) && lookaheadType() === TokenType.lessThan) {
    if (noCalls) {
      stopState.stop = true;
      return;
    }
    next();
    flowParseTypeParameterInstantiation();
    expect(TokenType.parenL);
    parseCallExpressionArguments();
    return;
  } else if (!noCalls && match(TokenType.lessThan)) {
    const snapshot = state.snapshot();
    flowParseTypeParameterInstantiation();
    expect(TokenType.parenL);
    parseCallExpressionArguments();
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
    } else {
      return;
    }
  }
  baseParseSubscript(startTokenIndex, noCalls, stopState);
}
function flowStartParseNewArguments() {
  if (match(TokenType.lessThan)) {
    const snapshot = state.snapshot();
    flowParseTypeParameterInstantiation();
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
    }
  }
}
function flowTryParseStatement() {
  if (match(TokenType.name) && state.contextualKeyword === ContextualKeyword._interface) {
    const oldIsType = pushTypeContext(0);
    next();
    flowParseInterface();
    popTypeContext(oldIsType);
    return true;
  } else if (isContextual(ContextualKeyword._enum)) {
    flowParseEnumDeclaration();
    return true;
  }
  return false;
}
function flowTryParseExportDefaultExpression() {
  if (isContextual(ContextualKeyword._enum)) {
    flowParseEnumDeclaration();
    return true;
  }
  return false;
}
function flowParseIdentifierStatement(contextualKeyword) {
  if (contextualKeyword === ContextualKeyword._declare) {
    if (match(TokenType._class) || match(TokenType.name) || match(TokenType._function) || match(TokenType._var) || match(TokenType._export)) {
      const oldIsType = pushTypeContext(1);
      flowParseDeclare();
      popTypeContext(oldIsType);
    }
  } else if (match(TokenType.name)) {
    if (contextualKeyword === ContextualKeyword._interface) {
      const oldIsType = pushTypeContext(1);
      flowParseInterface();
      popTypeContext(oldIsType);
    } else if (contextualKeyword === ContextualKeyword._type) {
      const oldIsType = pushTypeContext(1);
      flowParseTypeAlias();
      popTypeContext(oldIsType);
    } else if (contextualKeyword === ContextualKeyword._opaque) {
      const oldIsType = pushTypeContext(1);
      flowParseOpaqueType(false);
      popTypeContext(oldIsType);
    }
  }
  semicolon();
}
function flowShouldParseExportDeclaration() {
  return isContextual(ContextualKeyword._type) || isContextual(ContextualKeyword._interface) || isContextual(ContextualKeyword._opaque) || isContextual(ContextualKeyword._enum);
}
function flowShouldDisallowExportDefaultSpecifier() {
  return match(TokenType.name) && (state.contextualKeyword === ContextualKeyword._type || state.contextualKeyword === ContextualKeyword._interface || state.contextualKeyword === ContextualKeyword._opaque || state.contextualKeyword === ContextualKeyword._enum);
}
function flowParseExportDeclaration() {
  if (isContextual(ContextualKeyword._type)) {
    const oldIsType = pushTypeContext(1);
    next();
    if (match(TokenType.braceL)) {
      parseExportSpecifiers();
      parseExportFrom();
    } else {
      flowParseTypeAlias();
    }
    popTypeContext(oldIsType);
  } else if (isContextual(ContextualKeyword._opaque)) {
    const oldIsType = pushTypeContext(1);
    next();
    flowParseOpaqueType(false);
    popTypeContext(oldIsType);
  } else if (isContextual(ContextualKeyword._interface)) {
    const oldIsType = pushTypeContext(1);
    next();
    flowParseInterface();
    popTypeContext(oldIsType);
  } else {
    parseStatement(true);
  }
}
function flowShouldParseExportStar() {
  return match(TokenType.star) || isContextual(ContextualKeyword._type) && lookaheadType() === TokenType.star;
}
function flowParseExportStar() {
  if (eatContextual(ContextualKeyword._type)) {
    const oldIsType = pushTypeContext(2);
    baseParseExportStar();
    popTypeContext(oldIsType);
  } else {
    baseParseExportStar();
  }
}
function flowAfterParseClassSuper(hasSuper) {
  if (hasSuper && match(TokenType.lessThan)) {
    flowParseTypeParameterInstantiation();
  }
  if (isContextual(ContextualKeyword._implements)) {
    const oldIsType = pushTypeContext(0);
    next();
    state.tokens[state.tokens.length - 1].type = TokenType._implements;
    do {
      flowParseRestrictedIdentifier();
      if (match(TokenType.lessThan)) {
        flowParseTypeParameterInstantiation();
      }
    } while (eat(TokenType.comma));
    popTypeContext(oldIsType);
  }
}
function flowStartParseObjPropValue() {
  if (match(TokenType.lessThan)) {
    flowParseTypeParameterDeclaration();
    if (!match(TokenType.parenL)) unexpected();
  }
}
function flowParseAssignableListItemTypes() {
  const oldIsType = pushTypeContext(0);
  eat(TokenType.question);
  if (match(TokenType.colon)) {
    flowParseTypeAnnotation();
  }
  popTypeContext(oldIsType);
}
function flowStartParseImportSpecifiers() {
  if (match(TokenType._typeof) || isContextual(ContextualKeyword._type)) {
    const lh = lookaheadTypeAndKeyword();
    if (isMaybeDefaultImport(lh) || lh.type === TokenType.braceL || lh.type === TokenType.star) {
      next();
    }
  }
}
function flowParseImportSpecifier() {
  const isTypeKeyword = state.contextualKeyword === ContextualKeyword._type || state.type === TokenType._typeof;
  if (isTypeKeyword) {
    next();
  } else {
    parseIdentifier();
  }
  if (isContextual(ContextualKeyword._as) && !isLookaheadContextual(ContextualKeyword._as)) {
    parseIdentifier();
    if (isTypeKeyword && !match(TokenType.name) && !(state.type & TokenType.IS_KEYWORD)) {
    } else {
      parseIdentifier();
    }
  } else {
    if (isTypeKeyword && (match(TokenType.name) || !!(state.type & TokenType.IS_KEYWORD))) {
      parseIdentifier();
    }
    if (eatContextual(ContextualKeyword._as)) {
      parseIdentifier();
    }
  }
}
function flowStartParseFunctionParams() {
  if (match(TokenType.lessThan)) {
    const oldIsType = pushTypeContext(0);
    flowParseTypeParameterDeclaration();
    popTypeContext(oldIsType);
  }
}
function flowAfterParseVarHead() {
  if (match(TokenType.colon)) {
    flowParseTypeAnnotation();
  }
}
function flowStartParseAsyncArrowFromCallExpression() {
  if (match(TokenType.colon)) {
    const oldNoAnonFunctionType = state.noAnonFunctionType;
    state.noAnonFunctionType = true;
    flowParseTypeAnnotation();
    state.noAnonFunctionType = oldNoAnonFunctionType;
  }
}
function flowParseMaybeAssign(noIn, isWithinParens) {
  if (match(TokenType.lessThan)) {
    const snapshot = state.snapshot();
    let wasArrow = baseParseMaybeAssign(noIn, isWithinParens);
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
      state.type = TokenType.typeParameterStart;
    } else {
      return wasArrow;
    }
    const oldIsType = pushTypeContext(0);
    flowParseTypeParameterDeclaration();
    popTypeContext(oldIsType);
    wasArrow = baseParseMaybeAssign(noIn, isWithinParens);
    if (wasArrow) {
      return true;
    }
    unexpected();
  }
  return baseParseMaybeAssign(noIn, isWithinParens);
}
function flowParseArrow() {
  if (match(TokenType.colon)) {
    const oldIsType = pushTypeContext(0);
    const snapshot = state.snapshot();
    const oldNoAnonFunctionType = state.noAnonFunctionType;
    state.noAnonFunctionType = true;
    flowParseTypeAndPredicateInitialiser();
    state.noAnonFunctionType = oldNoAnonFunctionType;
    if (canInsertSemicolon()) unexpected();
    if (!match(TokenType.arrow)) unexpected();
    if (state.error) {
      state.restoreFromSnapshot(snapshot);
    }
    popTypeContext(oldIsType);
  }
  return eat(TokenType.arrow);
}
function flowParseSubscripts(startTokenIndex, noCalls = false) {
  if (state.tokens[state.tokens.length - 1].contextualKeyword === ContextualKeyword._async && match(TokenType.lessThan)) {
    const snapshot = state.snapshot();
    const wasArrow = parseAsyncArrowWithTypeParameters();
    if (wasArrow && !state.error) {
      return;
    }
    state.restoreFromSnapshot(snapshot);
  }
  baseParseSubscripts(startTokenIndex, noCalls);
}
function parseAsyncArrowWithTypeParameters() {
  state.scopeDepth++;
  const startTokenIndex = state.tokens.length;
  parseFunctionParams();
  if (!parseArrow()) {
    return false;
  }
  parseArrowExpression(startTokenIndex);
  return true;
}
function flowParseEnumDeclaration() {
  expectContextual(ContextualKeyword._enum);
  state.tokens[state.tokens.length - 1].type = TokenType._enum;
  parseIdentifier();
  flowParseEnumBody();
}
function flowParseEnumBody() {
  if (eatContextual(ContextualKeyword._of)) {
    next();
  }
  expect(TokenType.braceL);
  flowParseEnumMembers();
  expect(TokenType.braceR);
}
function flowParseEnumMembers() {
  while (!match(TokenType.braceR) && !state.error) {
    if (eat(TokenType.ellipsis)) {
      break;
    }
    flowParseEnumMember();
    if (!match(TokenType.braceR)) {
      expect(TokenType.comma);
    }
  }
}
function flowParseEnumMember() {
  parseIdentifier();
  if (eat(TokenType.eq)) {
    next();
  }
}

// node_modules/sucrase/dist/esm/parser/traverser/statement.js
function parseTopLevel() {
  parseBlockBody(TokenType.eof);
  state.scopes.push(new Scope(0, state.tokens.length, true));
  if (state.scopeDepth !== 0) {
    throw new Error(`Invalid scope depth at end of file: ${state.scopeDepth}`);
  }
  return new File(state.tokens, state.scopes);
}
function parseStatement(declaration) {
  if (isFlowEnabled) {
    if (flowTryParseStatement()) {
      return;
    }
  }
  if (match(TokenType.at)) {
    parseDecorators();
  }
  parseStatementContent(declaration);
}
function parseStatementContent(declaration) {
  if (isTypeScriptEnabled) {
    if (tsTryParseStatementContent()) {
      return;
    }
  }
  const starttype = state.type;
  switch (starttype) {
    case TokenType._break:
    case TokenType._continue:
      parseBreakContinueStatement();
      return;
    case TokenType._debugger:
      parseDebuggerStatement();
      return;
    case TokenType._do:
      parseDoStatement();
      return;
    case TokenType._for:
      parseForStatement();
      return;
    case TokenType._function:
      if (lookaheadType() === TokenType.dot) break;
      if (!declaration) unexpected();
      parseFunctionStatement();
      return;
    case TokenType._class:
      if (!declaration) unexpected();
      parseClass(true);
      return;
    case TokenType._if:
      parseIfStatement();
      return;
    case TokenType._return:
      parseReturnStatement();
      return;
    case TokenType._switch:
      parseSwitchStatement();
      return;
    case TokenType._throw:
      parseThrowStatement();
      return;
    case TokenType._try:
      parseTryStatement();
      return;
    case TokenType._let:
    case TokenType._const:
      if (!declaration) unexpected();
    // NOTE: falls through to _var
    case TokenType._var:
      parseVarStatement(starttype !== TokenType._var);
      return;
    case TokenType._while:
      parseWhileStatement();
      return;
    case TokenType.braceL:
      parseBlock();
      return;
    case TokenType.semi:
      parseEmptyStatement();
      return;
    case TokenType._export:
    case TokenType._import: {
      const nextType = lookaheadType();
      if (nextType === TokenType.parenL || nextType === TokenType.dot) {
        break;
      }
      next();
      if (starttype === TokenType._import) {
        parseImport();
      } else {
        parseExport();
      }
      return;
    }
    case TokenType.name:
      if (state.contextualKeyword === ContextualKeyword._async) {
        const functionStart = state.start;
        const snapshot = state.snapshot();
        next();
        if (match(TokenType._function) && !canInsertSemicolon()) {
          expect(TokenType._function);
          parseFunction(functionStart, true);
          return;
        } else {
          state.restoreFromSnapshot(snapshot);
        }
      } else if (state.contextualKeyword === ContextualKeyword._using && !hasFollowingLineBreak() && // Statements like `using[0]` and `using in foo` aren't actual using
      // declarations.
      lookaheadType() === TokenType.name) {
        parseVarStatement(true);
        return;
      } else if (startsAwaitUsing()) {
        expectContextual(ContextualKeyword._await);
        parseVarStatement(true);
        return;
      }
    default:
      break;
  }
  const initialTokensLength = state.tokens.length;
  parseExpression();
  let simpleName = null;
  if (state.tokens.length === initialTokensLength + 1) {
    const token = state.tokens[state.tokens.length - 1];
    if (token.type === TokenType.name) {
      simpleName = token.contextualKeyword;
    }
  }
  if (simpleName == null) {
    semicolon();
    return;
  }
  if (eat(TokenType.colon)) {
    parseLabeledStatement();
  } else {
    parseIdentifierStatement(simpleName);
  }
}
function startsAwaitUsing() {
  if (!isContextual(ContextualKeyword._await)) {
    return false;
  }
  const snapshot = state.snapshot();
  next();
  if (!isContextual(ContextualKeyword._using) || hasPrecedingLineBreak()) {
    state.restoreFromSnapshot(snapshot);
    return false;
  }
  next();
  if (!match(TokenType.name) || hasPrecedingLineBreak()) {
    state.restoreFromSnapshot(snapshot);
    return false;
  }
  state.restoreFromSnapshot(snapshot);
  return true;
}
function parseDecorators() {
  while (match(TokenType.at)) {
    parseDecorator();
  }
}
function parseDecorator() {
  next();
  if (eat(TokenType.parenL)) {
    parseExpression();
    expect(TokenType.parenR);
  } else {
    parseIdentifier();
    while (eat(TokenType.dot)) {
      parseIdentifier();
    }
    parseMaybeDecoratorArguments();
  }
}
function parseMaybeDecoratorArguments() {
  if (isTypeScriptEnabled) {
    tsParseMaybeDecoratorArguments();
  } else {
    baseParseMaybeDecoratorArguments();
  }
}
function baseParseMaybeDecoratorArguments() {
  if (eat(TokenType.parenL)) {
    parseCallExpressionArguments();
  }
}
function parseBreakContinueStatement() {
  next();
  if (!isLineTerminator()) {
    parseIdentifier();
    semicolon();
  }
}
function parseDebuggerStatement() {
  next();
  semicolon();
}
function parseDoStatement() {
  next();
  parseStatement(false);
  expect(TokenType._while);
  parseParenExpression();
  eat(TokenType.semi);
}
function parseForStatement() {
  state.scopeDepth++;
  const startTokenIndex = state.tokens.length;
  parseAmbiguousForStatement();
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, false));
  state.scopeDepth--;
}
function isUsingInLoop() {
  if (!isContextual(ContextualKeyword._using)) {
    return false;
  }
  if (isLookaheadContextual(ContextualKeyword._of)) {
    return false;
  }
  return true;
}
function parseAmbiguousForStatement() {
  next();
  let forAwait = false;
  if (isContextual(ContextualKeyword._await)) {
    forAwait = true;
    next();
  }
  expect(TokenType.parenL);
  if (match(TokenType.semi)) {
    if (forAwait) {
      unexpected();
    }
    parseFor();
    return;
  }
  const isAwaitUsing = startsAwaitUsing();
  if (isAwaitUsing || match(TokenType._var) || match(TokenType._let) || match(TokenType._const) || isUsingInLoop()) {
    if (isAwaitUsing) {
      expectContextual(ContextualKeyword._await);
    }
    next();
    parseVar(true, state.type !== TokenType._var);
    if (match(TokenType._in) || isContextual(ContextualKeyword._of)) {
      parseForIn(forAwait);
      return;
    }
    parseFor();
    return;
  }
  parseExpression(true);
  if (match(TokenType._in) || isContextual(ContextualKeyword._of)) {
    parseForIn(forAwait);
    return;
  }
  if (forAwait) {
    unexpected();
  }
  parseFor();
}
function parseFunctionStatement() {
  const functionStart = state.start;
  next();
  parseFunction(functionStart, true);
}
function parseIfStatement() {
  next();
  parseParenExpression();
  parseStatement(false);
  if (eat(TokenType._else)) {
    parseStatement(false);
  }
}
function parseReturnStatement() {
  next();
  if (!isLineTerminator()) {
    parseExpression();
    semicolon();
  }
}
function parseSwitchStatement() {
  next();
  parseParenExpression();
  state.scopeDepth++;
  const startTokenIndex = state.tokens.length;
  expect(TokenType.braceL);
  while (!match(TokenType.braceR) && !state.error) {
    if (match(TokenType._case) || match(TokenType._default)) {
      const isCase = match(TokenType._case);
      next();
      if (isCase) {
        parseExpression();
      }
      expect(TokenType.colon);
    } else {
      parseStatement(true);
    }
  }
  next();
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, false));
  state.scopeDepth--;
}
function parseThrowStatement() {
  next();
  parseExpression();
  semicolon();
}
function parseCatchClauseParam() {
  parseBindingAtom(
    true
    /* isBlockScope */
  );
  if (isTypeScriptEnabled) {
    tsTryParseTypeAnnotation();
  }
}
function parseTryStatement() {
  next();
  parseBlock();
  if (match(TokenType._catch)) {
    next();
    let catchBindingStartTokenIndex = null;
    if (match(TokenType.parenL)) {
      state.scopeDepth++;
      catchBindingStartTokenIndex = state.tokens.length;
      expect(TokenType.parenL);
      parseCatchClauseParam();
      expect(TokenType.parenR);
    }
    parseBlock();
    if (catchBindingStartTokenIndex != null) {
      const endTokenIndex = state.tokens.length;
      state.scopes.push(new Scope(catchBindingStartTokenIndex, endTokenIndex, false));
      state.scopeDepth--;
    }
  }
  if (eat(TokenType._finally)) {
    parseBlock();
  }
}
function parseVarStatement(isBlockScope) {
  next();
  parseVar(false, isBlockScope);
  semicolon();
}
function parseWhileStatement() {
  next();
  parseParenExpression();
  parseStatement(false);
}
function parseEmptyStatement() {
  next();
}
function parseLabeledStatement() {
  parseStatement(true);
}
function parseIdentifierStatement(contextualKeyword) {
  if (isTypeScriptEnabled) {
    tsParseIdentifierStatement(contextualKeyword);
  } else if (isFlowEnabled) {
    flowParseIdentifierStatement(contextualKeyword);
  } else {
    semicolon();
  }
}
function parseBlock(isFunctionScope = false, contextId = 0) {
  const startTokenIndex = state.tokens.length;
  state.scopeDepth++;
  expect(TokenType.braceL);
  if (contextId) {
    state.tokens[state.tokens.length - 1].contextId = contextId;
  }
  parseBlockBody(TokenType.braceR);
  if (contextId) {
    state.tokens[state.tokens.length - 1].contextId = contextId;
  }
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, isFunctionScope));
  state.scopeDepth--;
}
function parseBlockBody(end) {
  while (!eat(end) && !state.error) {
    parseStatement(true);
  }
}
function parseFor() {
  expect(TokenType.semi);
  if (!match(TokenType.semi)) {
    parseExpression();
  }
  expect(TokenType.semi);
  if (!match(TokenType.parenR)) {
    parseExpression();
  }
  expect(TokenType.parenR);
  parseStatement(false);
}
function parseForIn(forAwait) {
  if (forAwait) {
    eatContextual(ContextualKeyword._of);
  } else {
    next();
  }
  parseExpression();
  expect(TokenType.parenR);
  parseStatement(false);
}
function parseVar(isFor, isBlockScope) {
  while (true) {
    parseVarHead(isBlockScope);
    if (eat(TokenType.eq)) {
      const eqIndex = state.tokens.length - 1;
      parseMaybeAssign(isFor);
      state.tokens[eqIndex].rhsEndIndex = state.tokens.length;
    }
    if (!eat(TokenType.comma)) {
      break;
    }
  }
}
function parseVarHead(isBlockScope) {
  parseBindingAtom(isBlockScope);
  if (isTypeScriptEnabled) {
    tsAfterParseVarHead();
  } else if (isFlowEnabled) {
    flowAfterParseVarHead();
  }
}
function parseFunction(functionStart, isStatement, optionalId = false) {
  if (match(TokenType.star)) {
    next();
  }
  if (isStatement && !optionalId && !match(TokenType.name) && !match(TokenType._yield)) {
    unexpected();
  }
  let nameScopeStartTokenIndex = null;
  if (match(TokenType.name)) {
    if (!isStatement) {
      nameScopeStartTokenIndex = state.tokens.length;
      state.scopeDepth++;
    }
    parseBindingIdentifier(false);
  }
  const startTokenIndex = state.tokens.length;
  state.scopeDepth++;
  parseFunctionParams();
  parseFunctionBodyAndFinish(functionStart);
  const endTokenIndex = state.tokens.length;
  state.scopes.push(new Scope(startTokenIndex, endTokenIndex, true));
  state.scopeDepth--;
  if (nameScopeStartTokenIndex !== null) {
    state.scopes.push(new Scope(nameScopeStartTokenIndex, endTokenIndex, true));
    state.scopeDepth--;
  }
}
function parseFunctionParams(allowModifiers = false, funcContextId = 0) {
  if (isTypeScriptEnabled) {
    tsStartParseFunctionParams();
  } else if (isFlowEnabled) {
    flowStartParseFunctionParams();
  }
  expect(TokenType.parenL);
  if (funcContextId) {
    state.tokens[state.tokens.length - 1].contextId = funcContextId;
  }
  parseBindingList(
    TokenType.parenR,
    false,
    false,
    allowModifiers,
    funcContextId
  );
  if (funcContextId) {
    state.tokens[state.tokens.length - 1].contextId = funcContextId;
  }
}
function parseClass(isStatement, optionalId = false) {
  const contextId = getNextContextId();
  next();
  state.tokens[state.tokens.length - 1].contextId = contextId;
  state.tokens[state.tokens.length - 1].isExpression = !isStatement;
  let nameScopeStartTokenIndex = null;
  if (!isStatement) {
    nameScopeStartTokenIndex = state.tokens.length;
    state.scopeDepth++;
  }
  parseClassId(isStatement, optionalId);
  parseClassSuper();
  const openBraceIndex = state.tokens.length;
  parseClassBody(contextId);
  if (state.error) {
    return;
  }
  state.tokens[openBraceIndex].contextId = contextId;
  state.tokens[state.tokens.length - 1].contextId = contextId;
  if (nameScopeStartTokenIndex !== null) {
    const endTokenIndex = state.tokens.length;
    state.scopes.push(new Scope(nameScopeStartTokenIndex, endTokenIndex, false));
    state.scopeDepth--;
  }
}
function isClassProperty() {
  return match(TokenType.eq) || match(TokenType.semi) || match(TokenType.braceR) || match(TokenType.bang) || match(TokenType.colon);
}
function isClassMethod() {
  return match(TokenType.parenL) || match(TokenType.lessThan);
}
function parseClassBody(classContextId) {
  expect(TokenType.braceL);
  while (!eat(TokenType.braceR) && !state.error) {
    if (eat(TokenType.semi)) {
      continue;
    }
    if (match(TokenType.at)) {
      parseDecorator();
      continue;
    }
    const memberStart = state.start;
    parseClassMember(memberStart, classContextId);
  }
}
function parseClassMember(memberStart, classContextId) {
  if (isTypeScriptEnabled) {
    tsParseModifiers([
      ContextualKeyword._declare,
      ContextualKeyword._public,
      ContextualKeyword._protected,
      ContextualKeyword._private,
      ContextualKeyword._override
    ]);
  }
  let isStatic = false;
  if (match(TokenType.name) && state.contextualKeyword === ContextualKeyword._static) {
    parseIdentifier();
    if (isClassMethod()) {
      parseClassMethod(
        memberStart,
        /* isConstructor */
        false
      );
      return;
    } else if (isClassProperty()) {
      parseClassProperty();
      return;
    }
    state.tokens[state.tokens.length - 1].type = TokenType._static;
    isStatic = true;
    if (match(TokenType.braceL)) {
      state.tokens[state.tokens.length - 1].contextId = classContextId;
      parseBlock();
      return;
    }
  }
  parseClassMemberWithIsStatic(memberStart, isStatic, classContextId);
}
function parseClassMemberWithIsStatic(memberStart, isStatic, classContextId) {
  if (isTypeScriptEnabled) {
    if (tsTryParseClassMemberWithIsStatic(isStatic)) {
      return;
    }
  }
  if (eat(TokenType.star)) {
    parseClassPropertyName(classContextId);
    parseClassMethod(
      memberStart,
      /* isConstructor */
      false
    );
    return;
  }
  parseClassPropertyName(classContextId);
  let isConstructor = false;
  const token = state.tokens[state.tokens.length - 1];
  if (token.contextualKeyword === ContextualKeyword._constructor) {
    isConstructor = true;
  }
  parsePostMemberNameModifiers();
  if (isClassMethod()) {
    parseClassMethod(memberStart, isConstructor);
  } else if (isClassProperty()) {
    parseClassProperty();
  } else if (token.contextualKeyword === ContextualKeyword._async && !isLineTerminator()) {
    state.tokens[state.tokens.length - 1].type = TokenType._async;
    const isGenerator = match(TokenType.star);
    if (isGenerator) {
      next();
    }
    parseClassPropertyName(classContextId);
    parsePostMemberNameModifiers();
    parseClassMethod(
      memberStart,
      false
      /* isConstructor */
    );
  } else if ((token.contextualKeyword === ContextualKeyword._get || token.contextualKeyword === ContextualKeyword._set) && !(isLineTerminator() && match(TokenType.star))) {
    if (token.contextualKeyword === ContextualKeyword._get) {
      state.tokens[state.tokens.length - 1].type = TokenType._get;
    } else {
      state.tokens[state.tokens.length - 1].type = TokenType._set;
    }
    parseClassPropertyName(classContextId);
    parseClassMethod(
      memberStart,
      /* isConstructor */
      false
    );
  } else if (token.contextualKeyword === ContextualKeyword._accessor && !isLineTerminator()) {
    parseClassPropertyName(classContextId);
    parseClassProperty();
  } else if (isLineTerminator()) {
    parseClassProperty();
  } else {
    unexpected();
  }
}
function parseClassMethod(functionStart, isConstructor) {
  if (isTypeScriptEnabled) {
    tsTryParseTypeParameters();
  } else if (isFlowEnabled) {
    if (match(TokenType.lessThan)) {
      flowParseTypeParameterDeclaration();
    }
  }
  parseMethod(functionStart, isConstructor);
}
function parseClassPropertyName(classContextId) {
  parsePropertyName(classContextId);
}
function parsePostMemberNameModifiers() {
  if (isTypeScriptEnabled) {
    const oldIsType = pushTypeContext(0);
    eat(TokenType.question);
    popTypeContext(oldIsType);
  }
}
function parseClassProperty() {
  if (isTypeScriptEnabled) {
    eatTypeToken(TokenType.bang);
    tsTryParseTypeAnnotation();
  } else if (isFlowEnabled) {
    if (match(TokenType.colon)) {
      flowParseTypeAnnotation();
    }
  }
  if (match(TokenType.eq)) {
    const equalsTokenIndex = state.tokens.length;
    next();
    parseMaybeAssign();
    state.tokens[equalsTokenIndex].rhsEndIndex = state.tokens.length;
  }
  semicolon();
}
function parseClassId(isStatement, optionalId = false) {
  if (isTypeScriptEnabled && (!isStatement || optionalId) && isContextual(ContextualKeyword._implements)) {
    return;
  }
  if (match(TokenType.name)) {
    parseBindingIdentifier(true);
  }
  if (isTypeScriptEnabled) {
    tsTryParseTypeParameters();
  } else if (isFlowEnabled) {
    if (match(TokenType.lessThan)) {
      flowParseTypeParameterDeclaration();
    }
  }
}
function parseClassSuper() {
  let hasSuper = false;
  if (eat(TokenType._extends)) {
    parseExprSubscripts();
    hasSuper = true;
  } else {
    hasSuper = false;
  }
  if (isTypeScriptEnabled) {
    tsAfterParseClassSuper(hasSuper);
  } else if (isFlowEnabled) {
    flowAfterParseClassSuper(hasSuper);
  }
}
function parseExport() {
  const exportIndex = state.tokens.length - 1;
  if (isTypeScriptEnabled) {
    if (tsTryParseExport()) {
      return;
    }
  }
  if (shouldParseExportStar()) {
    parseExportStar();
  } else if (isExportDefaultSpecifier()) {
    parseIdentifier();
    if (match(TokenType.comma) && lookaheadType() === TokenType.star) {
      expect(TokenType.comma);
      expect(TokenType.star);
      expectContextual(ContextualKeyword._as);
      parseIdentifier();
    } else {
      parseExportSpecifiersMaybe();
    }
    parseExportFrom();
  } else if (eat(TokenType._default)) {
    parseExportDefaultExpression();
  } else if (shouldParseExportDeclaration()) {
    parseExportDeclaration();
  } else {
    parseExportSpecifiers();
    parseExportFrom();
  }
  state.tokens[exportIndex].rhsEndIndex = state.tokens.length;
}
function parseExportDefaultExpression() {
  if (isTypeScriptEnabled) {
    if (tsTryParseExportDefaultExpression()) {
      return;
    }
  }
  if (isFlowEnabled) {
    if (flowTryParseExportDefaultExpression()) {
      return;
    }
  }
  const functionStart = state.start;
  if (eat(TokenType._function)) {
    parseFunction(functionStart, true, true);
  } else if (isContextual(ContextualKeyword._async) && lookaheadType() === TokenType._function) {
    eatContextual(ContextualKeyword._async);
    eat(TokenType._function);
    parseFunction(functionStart, true, true);
  } else if (match(TokenType._class)) {
    parseClass(true, true);
  } else if (match(TokenType.at)) {
    parseDecorators();
    parseClass(true, true);
  } else {
    parseMaybeAssign();
    semicolon();
  }
}
function parseExportDeclaration() {
  if (isTypeScriptEnabled) {
    tsParseExportDeclaration();
  } else if (isFlowEnabled) {
    flowParseExportDeclaration();
  } else {
    parseStatement(true);
  }
}
function isExportDefaultSpecifier() {
  if (isTypeScriptEnabled && tsIsDeclarationStart()) {
    return false;
  } else if (isFlowEnabled && flowShouldDisallowExportDefaultSpecifier()) {
    return false;
  }
  if (match(TokenType.name)) {
    return state.contextualKeyword !== ContextualKeyword._async;
  }
  if (!match(TokenType._default)) {
    return false;
  }
  const _next = nextTokenStart();
  const lookahead = lookaheadTypeAndKeyword();
  const hasFrom = lookahead.type === TokenType.name && lookahead.contextualKeyword === ContextualKeyword._from;
  if (lookahead.type === TokenType.comma) {
    return true;
  }
  if (hasFrom) {
    const nextAfterFrom = input.charCodeAt(nextTokenStartSince(_next + 4));
    return nextAfterFrom === charCodes.quotationMark || nextAfterFrom === charCodes.apostrophe;
  }
  return false;
}
function parseExportSpecifiersMaybe() {
  if (eat(TokenType.comma)) {
    parseExportSpecifiers();
  }
}
function parseExportFrom() {
  if (eatContextual(ContextualKeyword._from)) {
    parseExprAtom();
    maybeParseImportAttributes();
  }
  semicolon();
}
function shouldParseExportStar() {
  if (isFlowEnabled) {
    return flowShouldParseExportStar();
  } else {
    return match(TokenType.star);
  }
}
function parseExportStar() {
  if (isFlowEnabled) {
    flowParseExportStar();
  } else {
    baseParseExportStar();
  }
}
function baseParseExportStar() {
  expect(TokenType.star);
  if (isContextual(ContextualKeyword._as)) {
    parseExportNamespace();
  } else {
    parseExportFrom();
  }
}
function parseExportNamespace() {
  next();
  state.tokens[state.tokens.length - 1].type = TokenType._as;
  parseIdentifier();
  parseExportSpecifiersMaybe();
  parseExportFrom();
}
function shouldParseExportDeclaration() {
  return isTypeScriptEnabled && tsIsDeclarationStart() || isFlowEnabled && flowShouldParseExportDeclaration() || state.type === TokenType._var || state.type === TokenType._const || state.type === TokenType._let || state.type === TokenType._function || state.type === TokenType._class || isContextual(ContextualKeyword._async) || match(TokenType.at);
}
function parseExportSpecifiers() {
  let first = true;
  expect(TokenType.braceL);
  while (!eat(TokenType.braceR) && !state.error) {
    if (first) {
      first = false;
    } else {
      expect(TokenType.comma);
      if (eat(TokenType.braceR)) {
        break;
      }
    }
    parseExportSpecifier();
  }
}
function parseExportSpecifier() {
  if (isTypeScriptEnabled) {
    tsParseExportSpecifier();
    return;
  }
  parseIdentifier();
  state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ExportAccess;
  if (eatContextual(ContextualKeyword._as)) {
    parseIdentifier();
  }
}
function isImportReflection() {
  const snapshot = state.snapshot();
  expectContextual(ContextualKeyword._module);
  if (eatContextual(ContextualKeyword._from)) {
    if (isContextual(ContextualKeyword._from)) {
      state.restoreFromSnapshot(snapshot);
      return true;
    } else {
      state.restoreFromSnapshot(snapshot);
      return false;
    }
  } else if (match(TokenType.comma)) {
    state.restoreFromSnapshot(snapshot);
    return false;
  } else {
    state.restoreFromSnapshot(snapshot);
    return true;
  }
}
function parseMaybeImportReflection() {
  if (isContextual(ContextualKeyword._module) && isImportReflection()) {
    next();
  }
}
function parseImport() {
  if (isTypeScriptEnabled && match(TokenType.name) && lookaheadType() === TokenType.eq) {
    tsParseImportEqualsDeclaration();
    return;
  }
  if (isTypeScriptEnabled && isContextual(ContextualKeyword._type)) {
    const lookahead = lookaheadTypeAndKeyword();
    if (lookahead.type === TokenType.name && lookahead.contextualKeyword !== ContextualKeyword._from) {
      expectContextual(ContextualKeyword._type);
      if (lookaheadType() === TokenType.eq) {
        tsParseImportEqualsDeclaration();
        return;
      }
    } else if (lookahead.type === TokenType.star || lookahead.type === TokenType.braceL) {
      expectContextual(ContextualKeyword._type);
    }
  }
  if (match(TokenType.string)) {
    parseExprAtom();
  } else {
    parseMaybeImportReflection();
    parseImportSpecifiers();
    expectContextual(ContextualKeyword._from);
    parseExprAtom();
  }
  maybeParseImportAttributes();
  semicolon();
}
function shouldParseDefaultImport() {
  return match(TokenType.name);
}
function parseImportSpecifierLocal() {
  parseImportedIdentifier();
}
function parseImportSpecifiers() {
  if (isFlowEnabled) {
    flowStartParseImportSpecifiers();
  }
  let first = true;
  if (shouldParseDefaultImport()) {
    parseImportSpecifierLocal();
    if (!eat(TokenType.comma)) return;
  }
  if (match(TokenType.star)) {
    next();
    expectContextual(ContextualKeyword._as);
    parseImportSpecifierLocal();
    return;
  }
  expect(TokenType.braceL);
  while (!eat(TokenType.braceR) && !state.error) {
    if (first) {
      first = false;
    } else {
      if (eat(TokenType.colon)) {
        unexpected(
          "ES2015 named imports do not destructure. Use another statement for destructuring after the import."
        );
      }
      expect(TokenType.comma);
      if (eat(TokenType.braceR)) {
        break;
      }
    }
    parseImportSpecifier();
  }
}
function parseImportSpecifier() {
  if (isTypeScriptEnabled) {
    tsParseImportSpecifier();
    return;
  }
  if (isFlowEnabled) {
    flowParseImportSpecifier();
    return;
  }
  parseImportedIdentifier();
  if (isContextual(ContextualKeyword._as)) {
    state.tokens[state.tokens.length - 1].identifierRole = IdentifierRole.ImportAccess;
    next();
    parseImportedIdentifier();
  }
}
function maybeParseImportAttributes() {
  if (match(TokenType._with) || isContextual(ContextualKeyword._assert) && !hasPrecedingLineBreak()) {
    next();
    parseObj(false, false);
  }
}

// node_modules/sucrase/dist/esm/parser/traverser/index.js
function parseFile() {
  if (state.pos === 0 && input.charCodeAt(0) === charCodes.numberSign && input.charCodeAt(1) === charCodes.exclamationMark) {
    skipLineComment(2);
  }
  nextToken();
  return parseTopLevel();
}

// node_modules/sucrase/dist/esm/parser/index.js
var File = class {
  constructor(tokens, scopes) {
    this.tokens = tokens;
    this.scopes = scopes;
  }
};
function parse(input2, isJSXEnabled2, isTypeScriptEnabled2, isFlowEnabled2) {
  if (isFlowEnabled2 && isTypeScriptEnabled2) {
    throw new Error("Cannot combine flow and typescript plugins.");
  }
  initParser(input2, isJSXEnabled2, isTypeScriptEnabled2, isFlowEnabled2);
  const result = parseFile();
  if (state.error) {
    throw augmentError(state.error);
  }
  return result;
}

// node_modules/sucrase/dist/esm/util/isAsyncOperation.js
function isAsyncOperation(tokens) {
  let index = tokens.currentIndex();
  let depth = 0;
  const startToken = tokens.currentToken();
  do {
    const token = tokens.tokens[index];
    if (token.isOptionalChainStart) {
      depth++;
    }
    if (token.isOptionalChainEnd) {
      depth--;
    }
    depth += token.numNullishCoalesceStarts;
    depth -= token.numNullishCoalesceEnds;
    if (token.contextualKeyword === ContextualKeyword._await && token.identifierRole == null && token.scopeDepth === startToken.scopeDepth) {
      return true;
    }
    index += 1;
  } while (depth > 0 && index < tokens.tokens.length);
  return false;
}

// node_modules/sucrase/dist/esm/TokenProcessor.js
var TokenProcessor = class _TokenProcessor {
  __init() {
    this.resultCode = "";
  }
  // Array mapping input token index to optional string index position in the
  // output code.
  __init2() {
    this.resultMappings = new Array(this.tokens.length);
  }
  __init3() {
    this.tokenIndex = 0;
  }
  constructor(code, tokens, isFlowEnabled2, disableESTransforms, helperManager) {
    ;
    this.code = code;
    this.tokens = tokens;
    this.isFlowEnabled = isFlowEnabled2;
    this.disableESTransforms = disableESTransforms;
    this.helperManager = helperManager;
    _TokenProcessor.prototype.__init.call(this);
    _TokenProcessor.prototype.__init2.call(this);
    _TokenProcessor.prototype.__init3.call(this);
  }
  /**
   * Snapshot the token state in a way that can be restored later, useful for
   * things like lookahead.
   *
   * resultMappings do not need to be copied since in all use cases, they will
   * be overwritten anyway after restore.
   */
  snapshot() {
    return {
      resultCode: this.resultCode,
      tokenIndex: this.tokenIndex
    };
  }
  restoreToSnapshot(snapshot) {
    this.resultCode = snapshot.resultCode;
    this.tokenIndex = snapshot.tokenIndex;
  }
  /**
   * Remove and return the code generated since the snapshot, leaving the
   * current token position in-place. Unlike most TokenProcessor operations,
   * this operation can result in input/output line number mismatches because
   * the removed code may contain newlines, so this operation should be used
   * sparingly.
   */
  dangerouslyGetAndRemoveCodeSinceSnapshot(snapshot) {
    const result = this.resultCode.slice(snapshot.resultCode.length);
    this.resultCode = snapshot.resultCode;
    return result;
  }
  reset() {
    this.resultCode = "";
    this.resultMappings = new Array(this.tokens.length);
    this.tokenIndex = 0;
  }
  matchesContextualAtIndex(index, contextualKeyword) {
    return this.matches1AtIndex(index, TokenType.name) && this.tokens[index].contextualKeyword === contextualKeyword;
  }
  identifierNameAtIndex(index) {
    return this.identifierNameForToken(this.tokens[index]);
  }
  identifierNameAtRelativeIndex(relativeIndex) {
    return this.identifierNameForToken(this.tokenAtRelativeIndex(relativeIndex));
  }
  identifierName() {
    return this.identifierNameForToken(this.currentToken());
  }
  identifierNameForToken(token) {
    return this.code.slice(token.start, token.end);
  }
  rawCodeForToken(token) {
    return this.code.slice(token.start, token.end);
  }
  stringValueAtIndex(index) {
    return this.stringValueForToken(this.tokens[index]);
  }
  stringValue() {
    return this.stringValueForToken(this.currentToken());
  }
  stringValueForToken(token) {
    return this.code.slice(token.start + 1, token.end - 1);
  }
  matches1AtIndex(index, t1) {
    return this.tokens[index].type === t1;
  }
  matches2AtIndex(index, t1, t2) {
    return this.tokens[index].type === t1 && this.tokens[index + 1].type === t2;
  }
  matches3AtIndex(index, t1, t2, t3) {
    return this.tokens[index].type === t1 && this.tokens[index + 1].type === t2 && this.tokens[index + 2].type === t3;
  }
  matches1(t1) {
    return this.tokens[this.tokenIndex].type === t1;
  }
  matches2(t1, t2) {
    return this.tokens[this.tokenIndex].type === t1 && this.tokens[this.tokenIndex + 1].type === t2;
  }
  matches3(t1, t2, t3) {
    return this.tokens[this.tokenIndex].type === t1 && this.tokens[this.tokenIndex + 1].type === t2 && this.tokens[this.tokenIndex + 2].type === t3;
  }
  matches4(t1, t2, t3, t4) {
    return this.tokens[this.tokenIndex].type === t1 && this.tokens[this.tokenIndex + 1].type === t2 && this.tokens[this.tokenIndex + 2].type === t3 && this.tokens[this.tokenIndex + 3].type === t4;
  }
  matches5(t1, t2, t3, t4, t5) {
    return this.tokens[this.tokenIndex].type === t1 && this.tokens[this.tokenIndex + 1].type === t2 && this.tokens[this.tokenIndex + 2].type === t3 && this.tokens[this.tokenIndex + 3].type === t4 && this.tokens[this.tokenIndex + 4].type === t5;
  }
  matchesContextual(contextualKeyword) {
    return this.matchesContextualAtIndex(this.tokenIndex, contextualKeyword);
  }
  matchesContextIdAndLabel(type, contextId) {
    return this.matches1(type) && this.currentToken().contextId === contextId;
  }
  previousWhitespaceAndComments() {
    let whitespaceAndComments = this.code.slice(
      this.tokenIndex > 0 ? this.tokens[this.tokenIndex - 1].end : 0,
      this.tokenIndex < this.tokens.length ? this.tokens[this.tokenIndex].start : this.code.length
    );
    if (this.isFlowEnabled) {
      whitespaceAndComments = whitespaceAndComments.replace(/@flow/g, "");
    }
    return whitespaceAndComments;
  }
  replaceToken(newCode) {
    this.resultCode += this.previousWhitespaceAndComments();
    this.appendTokenPrefix();
    this.resultMappings[this.tokenIndex] = this.resultCode.length;
    this.resultCode += newCode;
    this.appendTokenSuffix();
    this.tokenIndex++;
  }
  replaceTokenTrimmingLeftWhitespace(newCode) {
    this.resultCode += this.previousWhitespaceAndComments().replace(/[^\r\n]/g, "");
    this.appendTokenPrefix();
    this.resultMappings[this.tokenIndex] = this.resultCode.length;
    this.resultCode += newCode;
    this.appendTokenSuffix();
    this.tokenIndex++;
  }
  removeInitialToken() {
    this.replaceToken("");
  }
  removeToken() {
    this.replaceTokenTrimmingLeftWhitespace("");
  }
  /**
   * Remove all code until the next }, accounting for balanced braces.
   */
  removeBalancedCode() {
    let braceDepth = 0;
    while (!this.isAtEnd()) {
      if (this.matches1(TokenType.braceL)) {
        braceDepth++;
      } else if (this.matches1(TokenType.braceR)) {
        if (braceDepth === 0) {
          return;
        }
        braceDepth--;
      }
      this.removeToken();
    }
  }
  copyExpectedToken(tokenType) {
    if (this.tokens[this.tokenIndex].type !== tokenType) {
      throw new Error(`Expected token ${tokenType}`);
    }
    this.copyToken();
  }
  copyToken() {
    this.resultCode += this.previousWhitespaceAndComments();
    this.appendTokenPrefix();
    this.resultMappings[this.tokenIndex] = this.resultCode.length;
    this.resultCode += this.code.slice(
      this.tokens[this.tokenIndex].start,
      this.tokens[this.tokenIndex].end
    );
    this.appendTokenSuffix();
    this.tokenIndex++;
  }
  copyTokenWithPrefix(prefix) {
    this.resultCode += this.previousWhitespaceAndComments();
    this.appendTokenPrefix();
    this.resultCode += prefix;
    this.resultMappings[this.tokenIndex] = this.resultCode.length;
    this.resultCode += this.code.slice(
      this.tokens[this.tokenIndex].start,
      this.tokens[this.tokenIndex].end
    );
    this.appendTokenSuffix();
    this.tokenIndex++;
  }
  appendTokenPrefix() {
    const token = this.currentToken();
    if (token.numNullishCoalesceStarts || token.isOptionalChainStart) {
      token.isAsyncOperation = isAsyncOperation(this);
    }
    if (this.disableESTransforms) {
      return;
    }
    if (token.numNullishCoalesceStarts) {
      for (let i = 0; i < token.numNullishCoalesceStarts; i++) {
        if (token.isAsyncOperation) {
          this.resultCode += "await ";
          this.resultCode += this.helperManager.getHelperName("asyncNullishCoalesce");
        } else {
          this.resultCode += this.helperManager.getHelperName("nullishCoalesce");
        }
        this.resultCode += "(";
      }
    }
    if (token.isOptionalChainStart) {
      if (token.isAsyncOperation) {
        this.resultCode += "await ";
      }
      if (this.tokenIndex > 0 && this.tokenAtRelativeIndex(-1).type === TokenType._delete) {
        if (token.isAsyncOperation) {
          this.resultCode += this.helperManager.getHelperName("asyncOptionalChainDelete");
        } else {
          this.resultCode += this.helperManager.getHelperName("optionalChainDelete");
        }
      } else if (token.isAsyncOperation) {
        this.resultCode += this.helperManager.getHelperName("asyncOptionalChain");
      } else {
        this.resultCode += this.helperManager.getHelperName("optionalChain");
      }
      this.resultCode += "([";
    }
  }
  appendTokenSuffix() {
    const token = this.currentToken();
    if (token.isOptionalChainEnd && !this.disableESTransforms) {
      this.resultCode += "])";
    }
    if (token.numNullishCoalesceEnds && !this.disableESTransforms) {
      for (let i = 0; i < token.numNullishCoalesceEnds; i++) {
        this.resultCode += "))";
      }
    }
  }
  appendCode(code) {
    this.resultCode += code;
  }
  currentToken() {
    return this.tokens[this.tokenIndex];
  }
  currentTokenCode() {
    const token = this.currentToken();
    return this.code.slice(token.start, token.end);
  }
  tokenAtRelativeIndex(relativeIndex) {
    return this.tokens[this.tokenIndex + relativeIndex];
  }
  currentIndex() {
    return this.tokenIndex;
  }
  /**
   * Move to the next token. Only suitable in preprocessing steps. When
   * generating new code, you should use copyToken or removeToken.
   */
  nextToken() {
    if (this.tokenIndex === this.tokens.length) {
      throw new Error("Unexpectedly reached end of input.");
    }
    this.tokenIndex++;
  }
  previousToken() {
    this.tokenIndex--;
  }
  finish() {
    if (this.tokenIndex !== this.tokens.length) {
      throw new Error("Tried to finish processing tokens before reaching the end.");
    }
    this.resultCode += this.previousWhitespaceAndComments();
    return { code: this.resultCode, mappings: this.resultMappings };
  }
  isAtEnd() {
    return this.tokenIndex === this.tokens.length;
  }
};

// node_modules/sucrase/dist/esm/util/getClassInfo.js
function getClassInfo(rootTransformer, tokens, nameManager, disableESTransforms) {
  const snapshot = tokens.snapshot();
  const headerInfo = processClassHeader(tokens);
  let constructorInitializerStatements = [];
  const instanceInitializerNames = [];
  const staticInitializerNames = [];
  let constructorInsertPos = null;
  const fields = [];
  const rangesToRemove = [];
  const classContextId = tokens.currentToken().contextId;
  if (classContextId == null) {
    throw new Error("Expected non-null class context ID on class open-brace.");
  }
  tokens.nextToken();
  while (!tokens.matchesContextIdAndLabel(TokenType.braceR, classContextId)) {
    if (tokens.matchesContextual(ContextualKeyword._constructor) && !tokens.currentToken().isType) {
      ({ constructorInitializerStatements, constructorInsertPos } = processConstructor(tokens));
    } else if (tokens.matches1(TokenType.semi)) {
      if (!disableESTransforms) {
        rangesToRemove.push({ start: tokens.currentIndex(), end: tokens.currentIndex() + 1 });
      }
      tokens.nextToken();
    } else if (tokens.currentToken().isType) {
      tokens.nextToken();
    } else {
      const statementStartIndex = tokens.currentIndex();
      let isStatic = false;
      let isESPrivate = false;
      let isDeclareOrAbstract = false;
      while (isAccessModifier(tokens.currentToken())) {
        if (tokens.matches1(TokenType._static)) {
          isStatic = true;
        }
        if (tokens.matches1(TokenType.hash)) {
          isESPrivate = true;
        }
        if (tokens.matches1(TokenType._declare) || tokens.matches1(TokenType._abstract)) {
          isDeclareOrAbstract = true;
        }
        tokens.nextToken();
      }
      if (isStatic && tokens.matches1(TokenType.braceL)) {
        skipToNextClassElement(tokens, classContextId);
        continue;
      }
      if (isESPrivate) {
        skipToNextClassElement(tokens, classContextId);
        continue;
      }
      if (tokens.matchesContextual(ContextualKeyword._constructor) && !tokens.currentToken().isType) {
        ({ constructorInitializerStatements, constructorInsertPos } = processConstructor(tokens));
        continue;
      }
      const nameStartIndex = tokens.currentIndex();
      skipFieldName(tokens);
      if (tokens.matches1(TokenType.lessThan) || tokens.matches1(TokenType.parenL)) {
        skipToNextClassElement(tokens, classContextId);
        continue;
      }
      while (tokens.currentToken().isType) {
        tokens.nextToken();
      }
      if (tokens.matches1(TokenType.eq)) {
        const equalsIndex = tokens.currentIndex();
        const valueEnd = tokens.currentToken().rhsEndIndex;
        if (valueEnd == null) {
          throw new Error("Expected rhsEndIndex on class field assignment.");
        }
        tokens.nextToken();
        while (tokens.currentIndex() < valueEnd) {
          rootTransformer.processToken();
        }
        let initializerName;
        if (isStatic) {
          initializerName = nameManager.claimFreeName("__initStatic");
          staticInitializerNames.push(initializerName);
        } else {
          initializerName = nameManager.claimFreeName("__init");
          instanceInitializerNames.push(initializerName);
        }
        fields.push({
          initializerName,
          equalsIndex,
          start: nameStartIndex,
          end: tokens.currentIndex()
        });
      } else if (!disableESTransforms || isDeclareOrAbstract) {
        rangesToRemove.push({ start: statementStartIndex, end: tokens.currentIndex() });
      }
    }
  }
  tokens.restoreToSnapshot(snapshot);
  if (disableESTransforms) {
    return {
      headerInfo,
      constructorInitializerStatements,
      instanceInitializerNames: [],
      staticInitializerNames: [],
      constructorInsertPos,
      fields: [],
      rangesToRemove
    };
  } else {
    return {
      headerInfo,
      constructorInitializerStatements,
      instanceInitializerNames,
      staticInitializerNames,
      constructorInsertPos,
      fields,
      rangesToRemove
    };
  }
}
function skipToNextClassElement(tokens, classContextId) {
  tokens.nextToken();
  while (tokens.currentToken().contextId !== classContextId) {
    tokens.nextToken();
  }
  while (isAccessModifier(tokens.tokenAtRelativeIndex(-1))) {
    tokens.previousToken();
  }
}
function processClassHeader(tokens) {
  const classToken = tokens.currentToken();
  const contextId = classToken.contextId;
  if (contextId == null) {
    throw new Error("Expected context ID on class token.");
  }
  const isExpression = classToken.isExpression;
  if (isExpression == null) {
    throw new Error("Expected isExpression on class token.");
  }
  let className = null;
  let hasSuperclass = false;
  tokens.nextToken();
  if (tokens.matches1(TokenType.name)) {
    className = tokens.identifierName();
  }
  while (!tokens.matchesContextIdAndLabel(TokenType.braceL, contextId)) {
    if (tokens.matches1(TokenType._extends) && !tokens.currentToken().isType) {
      hasSuperclass = true;
    }
    tokens.nextToken();
  }
  return { isExpression, className, hasSuperclass };
}
function processConstructor(tokens) {
  const constructorInitializerStatements = [];
  tokens.nextToken();
  const constructorContextId = tokens.currentToken().contextId;
  if (constructorContextId == null) {
    throw new Error("Expected context ID on open-paren starting constructor params.");
  }
  while (!tokens.matchesContextIdAndLabel(TokenType.parenR, constructorContextId)) {
    if (tokens.currentToken().contextId === constructorContextId) {
      tokens.nextToken();
      if (isAccessModifier(tokens.currentToken())) {
        tokens.nextToken();
        while (isAccessModifier(tokens.currentToken())) {
          tokens.nextToken();
        }
        const token = tokens.currentToken();
        if (token.type !== TokenType.name) {
          throw new Error("Expected identifier after access modifiers in constructor arg.");
        }
        const name = tokens.identifierNameForToken(token);
        constructorInitializerStatements.push(`this.${name} = ${name}`);
      }
    } else {
      tokens.nextToken();
    }
  }
  tokens.nextToken();
  while (tokens.currentToken().isType) {
    tokens.nextToken();
  }
  let constructorInsertPos = tokens.currentIndex();
  let foundSuperCall = false;
  while (!tokens.matchesContextIdAndLabel(TokenType.braceR, constructorContextId)) {
    if (!foundSuperCall && tokens.matches2(TokenType._super, TokenType.parenL)) {
      tokens.nextToken();
      const superCallContextId = tokens.currentToken().contextId;
      if (superCallContextId == null) {
        throw new Error("Expected a context ID on the super call");
      }
      while (!tokens.matchesContextIdAndLabel(TokenType.parenR, superCallContextId)) {
        tokens.nextToken();
      }
      constructorInsertPos = tokens.currentIndex();
      foundSuperCall = true;
    }
    tokens.nextToken();
  }
  tokens.nextToken();
  return { constructorInitializerStatements, constructorInsertPos };
}
function isAccessModifier(token) {
  return [
    TokenType._async,
    TokenType._get,
    TokenType._set,
    TokenType.plus,
    TokenType.minus,
    TokenType._readonly,
    TokenType._static,
    TokenType._public,
    TokenType._private,
    TokenType._protected,
    TokenType._override,
    TokenType._abstract,
    TokenType.star,
    TokenType._declare,
    TokenType.hash
  ].includes(token.type);
}
function skipFieldName(tokens) {
  if (tokens.matches1(TokenType.bracketL)) {
    const startToken = tokens.currentToken();
    const classContextId = startToken.contextId;
    if (classContextId == null) {
      throw new Error("Expected class context ID on computed name open bracket.");
    }
    while (!tokens.matchesContextIdAndLabel(TokenType.bracketR, classContextId)) {
      tokens.nextToken();
    }
    tokens.nextToken();
  } else {
    tokens.nextToken();
  }
}

// node_modules/sucrase/dist/esm/util/elideImportEquals.js
function elideImportEquals(tokens) {
  tokens.removeInitialToken();
  tokens.removeToken();
  tokens.removeToken();
  tokens.removeToken();
  if (tokens.matches1(TokenType.parenL)) {
    tokens.removeToken();
    tokens.removeToken();
    tokens.removeToken();
  } else {
    while (tokens.matches1(TokenType.dot)) {
      tokens.removeToken();
      tokens.removeToken();
    }
  }
}

// node_modules/sucrase/dist/esm/util/getDeclarationInfo.js
var EMPTY_DECLARATION_INFO = {
  typeDeclarations: /* @__PURE__ */ new Set(),
  valueDeclarations: /* @__PURE__ */ new Set()
};
function getDeclarationInfo(tokens) {
  const typeDeclarations = /* @__PURE__ */ new Set();
  const valueDeclarations = /* @__PURE__ */ new Set();
  for (let i = 0; i < tokens.tokens.length; i++) {
    const token = tokens.tokens[i];
    if (token.type === TokenType.name && isTopLevelDeclaration(token)) {
      if (token.isType) {
        typeDeclarations.add(tokens.identifierNameForToken(token));
      } else {
        valueDeclarations.add(tokens.identifierNameForToken(token));
      }
    }
  }
  return { typeDeclarations, valueDeclarations };
}

// node_modules/sucrase/dist/esm/util/isExportFrom.js
function isExportFrom(tokens) {
  let closeBraceIndex = tokens.currentIndex();
  while (!tokens.matches1AtIndex(closeBraceIndex, TokenType.braceR)) {
    closeBraceIndex++;
  }
  return tokens.matchesContextualAtIndex(closeBraceIndex + 1, ContextualKeyword._from) && tokens.matches1AtIndex(closeBraceIndex + 2, TokenType.string);
}

// node_modules/sucrase/dist/esm/util/removeMaybeImportAttributes.js
function removeMaybeImportAttributes(tokens) {
  if (tokens.matches2(TokenType._with, TokenType.braceL) || tokens.matches2(TokenType.name, TokenType.braceL) && tokens.matchesContextual(ContextualKeyword._assert)) {
    tokens.removeToken();
    tokens.removeToken();
    tokens.removeBalancedCode();
    tokens.removeToken();
  }
}

// node_modules/sucrase/dist/esm/util/shouldElideDefaultExport.js
function shouldElideDefaultExport(isTypeScriptTransformEnabled, keepUnusedImports, tokens, declarationInfo) {
  if (!isTypeScriptTransformEnabled || keepUnusedImports) {
    return false;
  }
  const exportToken = tokens.currentToken();
  if (exportToken.rhsEndIndex == null) {
    throw new Error("Expected non-null rhsEndIndex on export token.");
  }
  const numTokens = exportToken.rhsEndIndex - tokens.currentIndex();
  if (numTokens !== 3 && !(numTokens === 4 && tokens.matches1AtIndex(exportToken.rhsEndIndex - 1, TokenType.semi))) {
    return false;
  }
  const identifierToken = tokens.tokenAtRelativeIndex(2);
  if (identifierToken.type !== TokenType.name) {
    return false;
  }
  const exportedName = tokens.identifierNameForToken(identifierToken);
  return declarationInfo.typeDeclarations.has(exportedName) && !declarationInfo.valueDeclarations.has(exportedName);
}

// node_modules/sucrase/dist/esm/transformers/CJSImportTransformer.js
var CJSImportTransformer = class _CJSImportTransformer extends Transformer {
  __init() {
    this.hadExport = false;
  }
  __init2() {
    this.hadNamedExport = false;
  }
  __init3() {
    this.hadDefaultExport = false;
  }
  constructor(rootTransformer, tokens, importProcessor, nameManager, helperManager, reactHotLoaderTransformer, enableLegacyBabel5ModuleInterop, enableLegacyTypeScriptModuleInterop, isTypeScriptTransformEnabled, isFlowTransformEnabled, preserveDynamicImport, keepUnusedImports) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.importProcessor = importProcessor;
    this.nameManager = nameManager;
    this.helperManager = helperManager;
    this.reactHotLoaderTransformer = reactHotLoaderTransformer;
    this.enableLegacyBabel5ModuleInterop = enableLegacyBabel5ModuleInterop;
    this.enableLegacyTypeScriptModuleInterop = enableLegacyTypeScriptModuleInterop;
    this.isTypeScriptTransformEnabled = isTypeScriptTransformEnabled;
    this.isFlowTransformEnabled = isFlowTransformEnabled;
    this.preserveDynamicImport = preserveDynamicImport;
    this.keepUnusedImports = keepUnusedImports;
    _CJSImportTransformer.prototype.__init.call(this);
    _CJSImportTransformer.prototype.__init2.call(this);
    _CJSImportTransformer.prototype.__init3.call(this);
    ;
    this.declarationInfo = isTypeScriptTransformEnabled ? getDeclarationInfo(tokens) : EMPTY_DECLARATION_INFO;
  }
  getPrefixCode() {
    let prefix = "";
    if (this.hadExport) {
      prefix += 'Object.defineProperty(exports, "__esModule", {value: true});';
    }
    return prefix;
  }
  getSuffixCode() {
    if (this.enableLegacyBabel5ModuleInterop && this.hadDefaultExport && !this.hadNamedExport) {
      return "\nmodule.exports = exports.default;\n";
    }
    return "";
  }
  process() {
    if (this.tokens.matches3(TokenType._import, TokenType.name, TokenType.eq)) {
      return this.processImportEquals();
    }
    if (this.tokens.matches1(TokenType._import)) {
      this.processImport();
      return true;
    }
    if (this.tokens.matches2(TokenType._export, TokenType.eq)) {
      this.tokens.replaceToken("module.exports");
      return true;
    }
    if (this.tokens.matches1(TokenType._export) && !this.tokens.currentToken().isType) {
      this.hadExport = true;
      return this.processExport();
    }
    if (this.tokens.matches2(TokenType.name, TokenType.postIncDec)) {
      if (this.processPostIncDec()) {
        return true;
      }
    }
    if (this.tokens.matches1(TokenType.name) || this.tokens.matches1(TokenType.jsxName)) {
      return this.processIdentifier();
    }
    if (this.tokens.matches1(TokenType.eq)) {
      return this.processAssignment();
    }
    if (this.tokens.matches1(TokenType.assign)) {
      return this.processComplexAssignment();
    }
    if (this.tokens.matches1(TokenType.preIncDec)) {
      return this.processPreIncDec();
    }
    return false;
  }
  processImportEquals() {
    const importName = this.tokens.identifierNameAtIndex(this.tokens.currentIndex() + 1);
    if (this.importProcessor.shouldAutomaticallyElideImportedName(importName)) {
      elideImportEquals(this.tokens);
    } else {
      this.tokens.replaceToken("const");
    }
    return true;
  }
  /**
   * Transform this:
   * import foo, {bar} from 'baz';
   * into
   * var _baz = require('baz'); var _baz2 = _interopRequireDefault(_baz);
   *
   * The import code was already generated in the import preprocessing step, so
   * we just need to look it up.
   */
  processImport() {
    if (this.tokens.matches2(TokenType._import, TokenType.parenL)) {
      if (this.preserveDynamicImport) {
        this.tokens.copyToken();
        return;
      }
      const requireWrapper = this.enableLegacyTypeScriptModuleInterop ? "" : `${this.helperManager.getHelperName("interopRequireWildcard")}(`;
      this.tokens.replaceToken(`Promise.resolve().then(() => ${requireWrapper}require`);
      const contextId = this.tokens.currentToken().contextId;
      if (contextId == null) {
        throw new Error("Expected context ID on dynamic import invocation.");
      }
      this.tokens.copyToken();
      while (!this.tokens.matchesContextIdAndLabel(TokenType.parenR, contextId)) {
        this.rootTransformer.processToken();
      }
      this.tokens.replaceToken(requireWrapper ? ")))" : "))");
      return;
    }
    const shouldElideImport = this.removeImportAndDetectIfShouldElide();
    if (shouldElideImport) {
      this.tokens.removeToken();
    } else {
      const path = this.tokens.stringValue();
      this.tokens.replaceTokenTrimmingLeftWhitespace(this.importProcessor.claimImportCode(path));
      this.tokens.appendCode(this.importProcessor.claimImportCode(path));
    }
    removeMaybeImportAttributes(this.tokens);
    if (this.tokens.matches1(TokenType.semi)) {
      this.tokens.removeToken();
    }
  }
  /**
   * Erase this import (since any CJS output would be completely different), and
   * return true if this import is should be elided due to being a type-only
   * import. Such imports will not be emitted at all to avoid side effects.
   *
   * Import elision only happens with the TypeScript or Flow transforms enabled.
   *
   * TODO: This function has some awkward overlap with
   *  CJSImportProcessor.pruneTypeOnlyImports , and the two should be unified.
   *  That function handles TypeScript implicit import name elision, and removes
   *  an import if all typical imported names (without `type`) are removed due
   *  to being type-only imports. This function handles Flow import removal and
   *  properly distinguishes `import 'foo'` from `import {} from 'foo'` for TS
   *  purposes.
   *
   * The position should end at the import string.
   */
  removeImportAndDetectIfShouldElide() {
    this.tokens.removeInitialToken();
    if (this.tokens.matchesContextual(ContextualKeyword._type) && !this.tokens.matches1AtIndex(this.tokens.currentIndex() + 1, TokenType.comma) && !this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 1, ContextualKeyword._from)) {
      this.removeRemainingImport();
      return true;
    }
    if (this.tokens.matches1(TokenType.name) || this.tokens.matches1(TokenType.star)) {
      this.removeRemainingImport();
      return false;
    }
    if (this.tokens.matches1(TokenType.string)) {
      return false;
    }
    let foundNonTypeImport = false;
    let foundAnyNamedImport = false;
    while (!this.tokens.matches1(TokenType.string)) {
      if (!foundNonTypeImport && this.tokens.matches1(TokenType.braceL) || this.tokens.matches1(TokenType.comma)) {
        this.tokens.removeToken();
        if (!this.tokens.matches1(TokenType.braceR)) {
          foundAnyNamedImport = true;
        }
        if (this.tokens.matches2(TokenType.name, TokenType.comma) || this.tokens.matches2(TokenType.name, TokenType.braceR) || this.tokens.matches4(TokenType.name, TokenType.name, TokenType.name, TokenType.comma) || this.tokens.matches4(TokenType.name, TokenType.name, TokenType.name, TokenType.braceR)) {
          foundNonTypeImport = true;
        }
      }
      this.tokens.removeToken();
    }
    if (this.keepUnusedImports) {
      return false;
    }
    if (this.isTypeScriptTransformEnabled) {
      return !foundNonTypeImport;
    } else if (this.isFlowTransformEnabled) {
      return foundAnyNamedImport && !foundNonTypeImport;
    } else {
      return false;
    }
  }
  removeRemainingImport() {
    while (!this.tokens.matches1(TokenType.string)) {
      this.tokens.removeToken();
    }
  }
  processIdentifier() {
    const token = this.tokens.currentToken();
    if (token.shadowsGlobal) {
      return false;
    }
    if (token.identifierRole === IdentifierRole.ObjectShorthand) {
      return this.processObjectShorthand();
    }
    if (token.identifierRole !== IdentifierRole.Access) {
      return false;
    }
    const replacement = this.importProcessor.getIdentifierReplacement(
      this.tokens.identifierNameForToken(token)
    );
    if (!replacement) {
      return false;
    }
    let possibleOpenParenIndex = this.tokens.currentIndex() + 1;
    while (possibleOpenParenIndex < this.tokens.tokens.length && this.tokens.tokens[possibleOpenParenIndex].type === TokenType.parenR) {
      possibleOpenParenIndex++;
    }
    if (this.tokens.tokens[possibleOpenParenIndex].type === TokenType.parenL) {
      if (this.tokens.tokenAtRelativeIndex(1).type === TokenType.parenL && this.tokens.tokenAtRelativeIndex(-1).type !== TokenType._new) {
        this.tokens.replaceToken(`${replacement}.call(void 0, `);
        this.tokens.removeToken();
        this.rootTransformer.processBalancedCode();
        this.tokens.copyExpectedToken(TokenType.parenR);
      } else {
        this.tokens.replaceToken(`(0, ${replacement})`);
      }
    } else {
      this.tokens.replaceToken(replacement);
    }
    return true;
  }
  processObjectShorthand() {
    const identifier = this.tokens.identifierName();
    const replacement = this.importProcessor.getIdentifierReplacement(identifier);
    if (!replacement) {
      return false;
    }
    this.tokens.replaceToken(`${identifier}: ${replacement}`);
    return true;
  }
  processExport() {
    if (this.tokens.matches2(TokenType._export, TokenType._enum) || this.tokens.matches3(TokenType._export, TokenType._const, TokenType._enum)) {
      this.hadNamedExport = true;
      return false;
    }
    if (this.tokens.matches2(TokenType._export, TokenType._default)) {
      if (this.tokens.matches3(TokenType._export, TokenType._default, TokenType._enum)) {
        this.hadDefaultExport = true;
        return false;
      }
      this.processExportDefault();
      return true;
    } else if (this.tokens.matches2(TokenType._export, TokenType.braceL)) {
      this.processExportBindings();
      return true;
    } else if (this.tokens.matches2(TokenType._export, TokenType.name) && this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 1, ContextualKeyword._type)) {
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      if (this.tokens.matches1(TokenType.braceL)) {
        while (!this.tokens.matches1(TokenType.braceR)) {
          this.tokens.removeToken();
        }
        this.tokens.removeToken();
      } else {
        this.tokens.removeToken();
        if (this.tokens.matches1(TokenType._as)) {
          this.tokens.removeToken();
          this.tokens.removeToken();
        }
      }
      if (this.tokens.matchesContextual(ContextualKeyword._from) && this.tokens.matches1AtIndex(this.tokens.currentIndex() + 1, TokenType.string)) {
        this.tokens.removeToken();
        this.tokens.removeToken();
        removeMaybeImportAttributes(this.tokens);
      }
      return true;
    }
    this.hadNamedExport = true;
    if (this.tokens.matches2(TokenType._export, TokenType._var) || this.tokens.matches2(TokenType._export, TokenType._let) || this.tokens.matches2(TokenType._export, TokenType._const)) {
      this.processExportVar();
      return true;
    } else if (this.tokens.matches2(TokenType._export, TokenType._function) || // export async function
    this.tokens.matches3(TokenType._export, TokenType.name, TokenType._function)) {
      this.processExportFunction();
      return true;
    } else if (this.tokens.matches2(TokenType._export, TokenType._class) || this.tokens.matches3(TokenType._export, TokenType._abstract, TokenType._class) || this.tokens.matches2(TokenType._export, TokenType.at)) {
      this.processExportClass();
      return true;
    } else if (this.tokens.matches2(TokenType._export, TokenType.star)) {
      this.processExportStar();
      return true;
    } else {
      throw new Error("Unrecognized export syntax.");
    }
  }
  processAssignment() {
    const index = this.tokens.currentIndex();
    const identifierToken = this.tokens.tokens[index - 1];
    if (identifierToken.isType || identifierToken.type !== TokenType.name) {
      return false;
    }
    if (identifierToken.shadowsGlobal) {
      return false;
    }
    if (index >= 2 && this.tokens.matches1AtIndex(index - 2, TokenType.dot)) {
      return false;
    }
    if (index >= 2 && [TokenType._var, TokenType._let, TokenType._const].includes(this.tokens.tokens[index - 2].type)) {
      return false;
    }
    const assignmentSnippet = this.importProcessor.resolveExportBinding(
      this.tokens.identifierNameForToken(identifierToken)
    );
    if (!assignmentSnippet) {
      return false;
    }
    this.tokens.copyToken();
    this.tokens.appendCode(` ${assignmentSnippet} =`);
    return true;
  }
  /**
   * Process something like `a += 3`, where `a` might be an exported value.
   */
  processComplexAssignment() {
    const index = this.tokens.currentIndex();
    const identifierToken = this.tokens.tokens[index - 1];
    if (identifierToken.type !== TokenType.name) {
      return false;
    }
    if (identifierToken.shadowsGlobal) {
      return false;
    }
    if (index >= 2 && this.tokens.matches1AtIndex(index - 2, TokenType.dot)) {
      return false;
    }
    const assignmentSnippet = this.importProcessor.resolveExportBinding(
      this.tokens.identifierNameForToken(identifierToken)
    );
    if (!assignmentSnippet) {
      return false;
    }
    this.tokens.appendCode(` = ${assignmentSnippet}`);
    this.tokens.copyToken();
    return true;
  }
  /**
   * Process something like `++a`, where `a` might be an exported value.
   */
  processPreIncDec() {
    const index = this.tokens.currentIndex();
    const identifierToken = this.tokens.tokens[index + 1];
    if (identifierToken.type !== TokenType.name) {
      return false;
    }
    if (identifierToken.shadowsGlobal) {
      return false;
    }
    if (index + 2 < this.tokens.tokens.length && (this.tokens.matches1AtIndex(index + 2, TokenType.dot) || this.tokens.matches1AtIndex(index + 2, TokenType.bracketL) || this.tokens.matches1AtIndex(index + 2, TokenType.parenL))) {
      return false;
    }
    const identifierName = this.tokens.identifierNameForToken(identifierToken);
    const assignmentSnippet = this.importProcessor.resolveExportBinding(identifierName);
    if (!assignmentSnippet) {
      return false;
    }
    this.tokens.appendCode(`${assignmentSnippet} = `);
    this.tokens.copyToken();
    return true;
  }
  /**
   * Process something like `a++`, where `a` might be an exported value.
   * This starts at the `a`, not at the `++`.
   */
  processPostIncDec() {
    const index = this.tokens.currentIndex();
    const identifierToken = this.tokens.tokens[index];
    const operatorToken = this.tokens.tokens[index + 1];
    if (identifierToken.type !== TokenType.name) {
      return false;
    }
    if (identifierToken.shadowsGlobal) {
      return false;
    }
    if (index >= 1 && this.tokens.matches1AtIndex(index - 1, TokenType.dot)) {
      return false;
    }
    const identifierName = this.tokens.identifierNameForToken(identifierToken);
    const assignmentSnippet = this.importProcessor.resolveExportBinding(identifierName);
    if (!assignmentSnippet) {
      return false;
    }
    const operatorCode = this.tokens.rawCodeForToken(operatorToken);
    const base = this.importProcessor.getIdentifierReplacement(identifierName) || identifierName;
    if (operatorCode === "++") {
      this.tokens.replaceToken(`(${base} = ${assignmentSnippet} = ${base} + 1, ${base} - 1)`);
    } else if (operatorCode === "--") {
      this.tokens.replaceToken(`(${base} = ${assignmentSnippet} = ${base} - 1, ${base} + 1)`);
    } else {
      throw new Error(`Unexpected operator: ${operatorCode}`);
    }
    this.tokens.removeToken();
    return true;
  }
  processExportDefault() {
    let exportedRuntimeValue = true;
    if (this.tokens.matches4(TokenType._export, TokenType._default, TokenType._function, TokenType.name) || // export default async function
    this.tokens.matches5(TokenType._export, TokenType._default, TokenType.name, TokenType._function, TokenType.name) && this.tokens.matchesContextualAtIndex(
      this.tokens.currentIndex() + 2,
      ContextualKeyword._async
    )) {
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      const name = this.processNamedFunction();
      this.tokens.appendCode(` exports.default = ${name};`);
    } else if (this.tokens.matches4(TokenType._export, TokenType._default, TokenType._class, TokenType.name) || this.tokens.matches5(TokenType._export, TokenType._default, TokenType._abstract, TokenType._class, TokenType.name) || this.tokens.matches3(TokenType._export, TokenType._default, TokenType.at)) {
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      this.copyDecorators();
      if (this.tokens.matches1(TokenType._abstract)) {
        this.tokens.removeToken();
      }
      const name = this.rootTransformer.processNamedClass();
      this.tokens.appendCode(` exports.default = ${name};`);
    } else if (shouldElideDefaultExport(
      this.isTypeScriptTransformEnabled,
      this.keepUnusedImports,
      this.tokens,
      this.declarationInfo
    )) {
      exportedRuntimeValue = false;
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      this.tokens.removeToken();
    } else if (this.reactHotLoaderTransformer) {
      const defaultVarName = this.nameManager.claimFreeName("_default");
      this.tokens.replaceToken(`let ${defaultVarName}; exports.`);
      this.tokens.copyToken();
      this.tokens.appendCode(` = ${defaultVarName} =`);
      this.reactHotLoaderTransformer.setExtractedDefaultExportName(defaultVarName);
    } else {
      this.tokens.replaceToken("exports.");
      this.tokens.copyToken();
      this.tokens.appendCode(" =");
    }
    if (exportedRuntimeValue) {
      this.hadDefaultExport = true;
    }
  }
  copyDecorators() {
    while (this.tokens.matches1(TokenType.at)) {
      this.tokens.copyToken();
      if (this.tokens.matches1(TokenType.parenL)) {
        this.tokens.copyExpectedToken(TokenType.parenL);
        this.rootTransformer.processBalancedCode();
        this.tokens.copyExpectedToken(TokenType.parenR);
      } else {
        this.tokens.copyExpectedToken(TokenType.name);
        while (this.tokens.matches1(TokenType.dot)) {
          this.tokens.copyExpectedToken(TokenType.dot);
          this.tokens.copyExpectedToken(TokenType.name);
        }
        if (this.tokens.matches1(TokenType.parenL)) {
          this.tokens.copyExpectedToken(TokenType.parenL);
          this.rootTransformer.processBalancedCode();
          this.tokens.copyExpectedToken(TokenType.parenR);
        }
      }
    }
  }
  /**
   * Transform a declaration like `export var`, `export let`, or `export const`.
   */
  processExportVar() {
    if (this.isSimpleExportVar()) {
      this.processSimpleExportVar();
    } else {
      this.processComplexExportVar();
    }
  }
  /**
   * Determine if the export is of the form:
   * export var/let/const [varName] = [expr];
   * In other words, determine if function name inference might apply.
   */
  isSimpleExportVar() {
    let tokenIndex = this.tokens.currentIndex();
    tokenIndex++;
    tokenIndex++;
    if (!this.tokens.matches1AtIndex(tokenIndex, TokenType.name)) {
      return false;
    }
    tokenIndex++;
    while (tokenIndex < this.tokens.tokens.length && this.tokens.tokens[tokenIndex].isType) {
      tokenIndex++;
    }
    if (!this.tokens.matches1AtIndex(tokenIndex, TokenType.eq)) {
      return false;
    }
    return true;
  }
  /**
   * Transform an `export var` declaration initializing a single variable.
   *
   * For example, this:
   * export const f = () => {};
   * becomes this:
   * const f = () => {}; exports.f = f;
   *
   * The variable is unused (e.g. exports.f has the true value of the export).
   * We need to produce an assignment of this form so that the function will
   * have an inferred name of "f", which wouldn't happen in the more general
   * case below.
   */
  processSimpleExportVar() {
    this.tokens.removeInitialToken();
    this.tokens.copyToken();
    const varName = this.tokens.identifierName();
    while (!this.tokens.matches1(TokenType.eq)) {
      this.rootTransformer.processToken();
    }
    const endIndex = this.tokens.currentToken().rhsEndIndex;
    if (endIndex == null) {
      throw new Error("Expected = token with an end index.");
    }
    while (this.tokens.currentIndex() < endIndex) {
      this.rootTransformer.processToken();
    }
    this.tokens.appendCode(`; exports.${varName} = ${varName}`);
  }
  /**
   * Transform normal declaration exports, including handling destructuring.
   * For example, this:
   * export const {x: [a = 2, b], c} = d;
   * becomes this:
   * ({x: [exports.a = 2, exports.b], c: exports.c} = d;)
   */
  processComplexExportVar() {
    this.tokens.removeInitialToken();
    this.tokens.removeToken();
    const needsParens = this.tokens.matches1(TokenType.braceL);
    if (needsParens) {
      this.tokens.appendCode("(");
    }
    let depth = 0;
    while (true) {
      if (this.tokens.matches1(TokenType.braceL) || this.tokens.matches1(TokenType.dollarBraceL) || this.tokens.matches1(TokenType.bracketL)) {
        depth++;
        this.tokens.copyToken();
      } else if (this.tokens.matches1(TokenType.braceR) || this.tokens.matches1(TokenType.bracketR)) {
        depth--;
        this.tokens.copyToken();
      } else if (depth === 0 && !this.tokens.matches1(TokenType.name) && !this.tokens.currentToken().isType) {
        break;
      } else if (this.tokens.matches1(TokenType.eq)) {
        const endIndex = this.tokens.currentToken().rhsEndIndex;
        if (endIndex == null) {
          throw new Error("Expected = token with an end index.");
        }
        while (this.tokens.currentIndex() < endIndex) {
          this.rootTransformer.processToken();
        }
      } else {
        const token = this.tokens.currentToken();
        if (isDeclaration(token)) {
          const name = this.tokens.identifierName();
          let replacement = this.importProcessor.getIdentifierReplacement(name);
          if (replacement === null) {
            throw new Error(`Expected a replacement for ${name} in \`export var\` syntax.`);
          }
          if (isObjectShorthandDeclaration(token)) {
            replacement = `${name}: ${replacement}`;
          }
          this.tokens.replaceToken(replacement);
        } else {
          this.rootTransformer.processToken();
        }
      }
    }
    if (needsParens) {
      const endIndex = this.tokens.currentToken().rhsEndIndex;
      if (endIndex == null) {
        throw new Error("Expected = token with an end index.");
      }
      while (this.tokens.currentIndex() < endIndex) {
        this.rootTransformer.processToken();
      }
      this.tokens.appendCode(")");
    }
  }
  /**
   * Transform this:
   * export function foo() {}
   * into this:
   * function foo() {} exports.foo = foo;
   */
  processExportFunction() {
    this.tokens.replaceToken("");
    const name = this.processNamedFunction();
    this.tokens.appendCode(` exports.${name} = ${name};`);
  }
  /**
   * Skip past a function with a name and return that name.
   */
  processNamedFunction() {
    if (this.tokens.matches1(TokenType._function)) {
      this.tokens.copyToken();
    } else if (this.tokens.matches2(TokenType.name, TokenType._function)) {
      if (!this.tokens.matchesContextual(ContextualKeyword._async)) {
        throw new Error("Expected async keyword in function export.");
      }
      this.tokens.copyToken();
      this.tokens.copyToken();
    }
    if (this.tokens.matches1(TokenType.star)) {
      this.tokens.copyToken();
    }
    if (!this.tokens.matches1(TokenType.name)) {
      throw new Error("Expected identifier for exported function name.");
    }
    const name = this.tokens.identifierName();
    this.tokens.copyToken();
    if (this.tokens.currentToken().isType) {
      this.tokens.removeInitialToken();
      while (this.tokens.currentToken().isType) {
        this.tokens.removeToken();
      }
    }
    this.tokens.copyExpectedToken(TokenType.parenL);
    this.rootTransformer.processBalancedCode();
    this.tokens.copyExpectedToken(TokenType.parenR);
    this.rootTransformer.processPossibleTypeRange();
    this.tokens.copyExpectedToken(TokenType.braceL);
    this.rootTransformer.processBalancedCode();
    this.tokens.copyExpectedToken(TokenType.braceR);
    return name;
  }
  /**
   * Transform this:
   * export class A {}
   * into this:
   * class A {} exports.A = A;
   */
  processExportClass() {
    this.tokens.removeInitialToken();
    this.copyDecorators();
    if (this.tokens.matches1(TokenType._abstract)) {
      this.tokens.removeToken();
    }
    const name = this.rootTransformer.processNamedClass();
    this.tokens.appendCode(` exports.${name} = ${name};`);
  }
  /**
   * Transform this:
   * export {a, b as c};
   * into this:
   * exports.a = a; exports.c = b;
   *
   * OR
   *
   * Transform this:
   * export {a, b as c} from './foo';
   * into the pre-generated Object.defineProperty code from the ImportProcessor.
   *
   * For the first case, if the TypeScript transform is enabled, we need to skip
   * exports that are only defined as types.
   */
  processExportBindings() {
    this.tokens.removeInitialToken();
    this.tokens.removeToken();
    const isReExport = isExportFrom(this.tokens);
    const exportStatements = [];
    while (true) {
      if (this.tokens.matches1(TokenType.braceR)) {
        this.tokens.removeToken();
        break;
      }
      const specifierInfo = getImportExportSpecifierInfo(this.tokens);
      while (this.tokens.currentIndex() < specifierInfo.endIndex) {
        this.tokens.removeToken();
      }
      const shouldRemoveExport = specifierInfo.isType || !isReExport && this.shouldElideExportedIdentifier(specifierInfo.leftName);
      if (!shouldRemoveExport) {
        const exportedName = specifierInfo.rightName;
        if (exportedName === "default") {
          this.hadDefaultExport = true;
        } else {
          this.hadNamedExport = true;
        }
        const localName = specifierInfo.leftName;
        const newLocalName = this.importProcessor.getIdentifierReplacement(localName);
        exportStatements.push(`exports.${exportedName} = ${newLocalName || localName};`);
      }
      if (this.tokens.matches1(TokenType.braceR)) {
        this.tokens.removeToken();
        break;
      }
      if (this.tokens.matches2(TokenType.comma, TokenType.braceR)) {
        this.tokens.removeToken();
        this.tokens.removeToken();
        break;
      } else if (this.tokens.matches1(TokenType.comma)) {
        this.tokens.removeToken();
      } else {
        throw new Error(`Unexpected token: ${JSON.stringify(this.tokens.currentToken())}`);
      }
    }
    if (this.tokens.matchesContextual(ContextualKeyword._from)) {
      this.tokens.removeToken();
      const path = this.tokens.stringValue();
      this.tokens.replaceTokenTrimmingLeftWhitespace(this.importProcessor.claimImportCode(path));
      removeMaybeImportAttributes(this.tokens);
    } else {
      this.tokens.appendCode(exportStatements.join(" "));
    }
    if (this.tokens.matches1(TokenType.semi)) {
      this.tokens.removeToken();
    }
  }
  processExportStar() {
    this.tokens.removeInitialToken();
    while (!this.tokens.matches1(TokenType.string)) {
      this.tokens.removeToken();
    }
    const path = this.tokens.stringValue();
    this.tokens.replaceTokenTrimmingLeftWhitespace(this.importProcessor.claimImportCode(path));
    removeMaybeImportAttributes(this.tokens);
    if (this.tokens.matches1(TokenType.semi)) {
      this.tokens.removeToken();
    }
  }
  shouldElideExportedIdentifier(name) {
    return this.isTypeScriptTransformEnabled && !this.keepUnusedImports && !this.declarationInfo.valueDeclarations.has(name);
  }
};

// node_modules/sucrase/dist/esm/transformers/ESMImportTransformer.js
var ESMImportTransformer = class extends Transformer {
  constructor(tokens, nameManager, helperManager, reactHotLoaderTransformer, isTypeScriptTransformEnabled, isFlowTransformEnabled, keepUnusedImports, options) {
    super();
    this.tokens = tokens;
    this.nameManager = nameManager;
    this.helperManager = helperManager;
    this.reactHotLoaderTransformer = reactHotLoaderTransformer;
    this.isTypeScriptTransformEnabled = isTypeScriptTransformEnabled;
    this.isFlowTransformEnabled = isFlowTransformEnabled;
    this.keepUnusedImports = keepUnusedImports;
    ;
    this.nonTypeIdentifiers = isTypeScriptTransformEnabled && !keepUnusedImports ? getNonTypeIdentifiers(tokens, options) : /* @__PURE__ */ new Set();
    this.declarationInfo = isTypeScriptTransformEnabled && !keepUnusedImports ? getDeclarationInfo(tokens) : EMPTY_DECLARATION_INFO;
    this.injectCreateRequireForImportRequire = Boolean(options.injectCreateRequireForImportRequire);
  }
  process() {
    if (this.tokens.matches3(TokenType._import, TokenType.name, TokenType.eq)) {
      return this.processImportEquals();
    }
    if (this.tokens.matches4(TokenType._import, TokenType.name, TokenType.name, TokenType.eq) && this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 1, ContextualKeyword._type)) {
      this.tokens.removeInitialToken();
      for (let i = 0; i < 7; i++) {
        this.tokens.removeToken();
      }
      return true;
    }
    if (this.tokens.matches2(TokenType._export, TokenType.eq)) {
      this.tokens.replaceToken("module.exports");
      return true;
    }
    if (this.tokens.matches5(TokenType._export, TokenType._import, TokenType.name, TokenType.name, TokenType.eq) && this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 2, ContextualKeyword._type)) {
      this.tokens.removeInitialToken();
      for (let i = 0; i < 8; i++) {
        this.tokens.removeToken();
      }
      return true;
    }
    if (this.tokens.matches1(TokenType._import)) {
      return this.processImport();
    }
    if (this.tokens.matches2(TokenType._export, TokenType._default)) {
      return this.processExportDefault();
    }
    if (this.tokens.matches2(TokenType._export, TokenType.braceL)) {
      return this.processNamedExports();
    }
    if (this.tokens.matches2(TokenType._export, TokenType.name) && this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 1, ContextualKeyword._type)) {
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      if (this.tokens.matches1(TokenType.braceL)) {
        while (!this.tokens.matches1(TokenType.braceR)) {
          this.tokens.removeToken();
        }
        this.tokens.removeToken();
      } else {
        this.tokens.removeToken();
        if (this.tokens.matches1(TokenType._as)) {
          this.tokens.removeToken();
          this.tokens.removeToken();
        }
      }
      if (this.tokens.matchesContextual(ContextualKeyword._from) && this.tokens.matches1AtIndex(this.tokens.currentIndex() + 1, TokenType.string)) {
        this.tokens.removeToken();
        this.tokens.removeToken();
        removeMaybeImportAttributes(this.tokens);
      }
      return true;
    }
    return false;
  }
  processImportEquals() {
    const importName = this.tokens.identifierNameAtIndex(this.tokens.currentIndex() + 1);
    if (this.shouldAutomaticallyElideImportedName(importName)) {
      elideImportEquals(this.tokens);
    } else if (this.injectCreateRequireForImportRequire) {
      this.tokens.replaceToken("const");
      this.tokens.copyToken();
      this.tokens.copyToken();
      this.tokens.replaceToken(this.helperManager.getHelperName("require"));
    } else {
      this.tokens.replaceToken("const");
    }
    return true;
  }
  processImport() {
    if (this.tokens.matches2(TokenType._import, TokenType.parenL)) {
      return false;
    }
    const snapshot = this.tokens.snapshot();
    const allImportsRemoved = this.removeImportTypeBindings();
    if (allImportsRemoved) {
      this.tokens.restoreToSnapshot(snapshot);
      while (!this.tokens.matches1(TokenType.string)) {
        this.tokens.removeToken();
      }
      this.tokens.removeToken();
      removeMaybeImportAttributes(this.tokens);
      if (this.tokens.matches1(TokenType.semi)) {
        this.tokens.removeToken();
      }
    }
    return true;
  }
  /**
   * Remove type bindings from this import, leaving the rest of the import intact.
   *
   * Return true if this import was ONLY types, and thus is eligible for removal. This will bail out
   * of the replacement operation, so we can return early here.
   */
  removeImportTypeBindings() {
    this.tokens.copyExpectedToken(TokenType._import);
    if (this.tokens.matchesContextual(ContextualKeyword._type) && !this.tokens.matches1AtIndex(this.tokens.currentIndex() + 1, TokenType.comma) && !this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 1, ContextualKeyword._from)) {
      return true;
    }
    if (this.tokens.matches1(TokenType.string)) {
      this.tokens.copyToken();
      return false;
    }
    if (this.tokens.matchesContextual(ContextualKeyword._module) && this.tokens.matchesContextualAtIndex(this.tokens.currentIndex() + 2, ContextualKeyword._from)) {
      this.tokens.copyToken();
    }
    let foundNonTypeImport = false;
    let foundAnyNamedImport = false;
    let needsComma = false;
    if (this.tokens.matches1(TokenType.name)) {
      if (this.shouldAutomaticallyElideImportedName(this.tokens.identifierName())) {
        this.tokens.removeToken();
        if (this.tokens.matches1(TokenType.comma)) {
          this.tokens.removeToken();
        }
      } else {
        foundNonTypeImport = true;
        this.tokens.copyToken();
        if (this.tokens.matches1(TokenType.comma)) {
          needsComma = true;
          this.tokens.removeToken();
        }
      }
    }
    if (this.tokens.matches1(TokenType.star)) {
      if (this.shouldAutomaticallyElideImportedName(this.tokens.identifierNameAtRelativeIndex(2))) {
        this.tokens.removeToken();
        this.tokens.removeToken();
        this.tokens.removeToken();
      } else {
        if (needsComma) {
          this.tokens.appendCode(",");
        }
        foundNonTypeImport = true;
        this.tokens.copyExpectedToken(TokenType.star);
        this.tokens.copyExpectedToken(TokenType.name);
        this.tokens.copyExpectedToken(TokenType.name);
      }
    } else if (this.tokens.matches1(TokenType.braceL)) {
      if (needsComma) {
        this.tokens.appendCode(",");
      }
      this.tokens.copyToken();
      while (!this.tokens.matches1(TokenType.braceR)) {
        foundAnyNamedImport = true;
        const specifierInfo = getImportExportSpecifierInfo(this.tokens);
        if (specifierInfo.isType || this.shouldAutomaticallyElideImportedName(specifierInfo.rightName)) {
          while (this.tokens.currentIndex() < specifierInfo.endIndex) {
            this.tokens.removeToken();
          }
          if (this.tokens.matches1(TokenType.comma)) {
            this.tokens.removeToken();
          }
        } else {
          foundNonTypeImport = true;
          while (this.tokens.currentIndex() < specifierInfo.endIndex) {
            this.tokens.copyToken();
          }
          if (this.tokens.matches1(TokenType.comma)) {
            this.tokens.copyToken();
          }
        }
      }
      this.tokens.copyExpectedToken(TokenType.braceR);
    }
    if (this.keepUnusedImports) {
      return false;
    }
    if (this.isTypeScriptTransformEnabled) {
      return !foundNonTypeImport;
    } else if (this.isFlowTransformEnabled) {
      return foundAnyNamedImport && !foundNonTypeImport;
    } else {
      return false;
    }
  }
  shouldAutomaticallyElideImportedName(name) {
    return this.isTypeScriptTransformEnabled && !this.keepUnusedImports && !this.nonTypeIdentifiers.has(name);
  }
  processExportDefault() {
    if (shouldElideDefaultExport(
      this.isTypeScriptTransformEnabled,
      this.keepUnusedImports,
      this.tokens,
      this.declarationInfo
    )) {
      this.tokens.removeInitialToken();
      this.tokens.removeToken();
      this.tokens.removeToken();
      return true;
    }
    const alreadyHasName = this.tokens.matches4(TokenType._export, TokenType._default, TokenType._function, TokenType.name) || // export default async function
    this.tokens.matches5(TokenType._export, TokenType._default, TokenType.name, TokenType._function, TokenType.name) && this.tokens.matchesContextualAtIndex(
      this.tokens.currentIndex() + 2,
      ContextualKeyword._async
    ) || this.tokens.matches4(TokenType._export, TokenType._default, TokenType._class, TokenType.name) || this.tokens.matches5(TokenType._export, TokenType._default, TokenType._abstract, TokenType._class, TokenType.name);
    if (!alreadyHasName && this.reactHotLoaderTransformer) {
      const defaultVarName = this.nameManager.claimFreeName("_default");
      this.tokens.replaceToken(`let ${defaultVarName}; export`);
      this.tokens.copyToken();
      this.tokens.appendCode(` ${defaultVarName} =`);
      this.reactHotLoaderTransformer.setExtractedDefaultExportName(defaultVarName);
      return true;
    }
    return false;
  }
  /**
   * Handle a statement with one of these forms:
   * export {a, type b};
   * export {c, type d} from 'foo';
   *
   * In both cases, any explicit type exports should be removed. In the first
   * case, we also need to handle implicit export elision for names declared as
   * types. In the second case, we must NOT do implicit named export elision,
   * but we must remove the runtime import if all exports are type exports.
   */
  processNamedExports() {
    if (!this.isTypeScriptTransformEnabled) {
      return false;
    }
    this.tokens.copyExpectedToken(TokenType._export);
    this.tokens.copyExpectedToken(TokenType.braceL);
    const isReExport = isExportFrom(this.tokens);
    let foundNonTypeExport = false;
    while (!this.tokens.matches1(TokenType.braceR)) {
      const specifierInfo = getImportExportSpecifierInfo(this.tokens);
      if (specifierInfo.isType || !isReExport && this.shouldElideExportedName(specifierInfo.leftName)) {
        while (this.tokens.currentIndex() < specifierInfo.endIndex) {
          this.tokens.removeToken();
        }
        if (this.tokens.matches1(TokenType.comma)) {
          this.tokens.removeToken();
        }
      } else {
        foundNonTypeExport = true;
        while (this.tokens.currentIndex() < specifierInfo.endIndex) {
          this.tokens.copyToken();
        }
        if (this.tokens.matches1(TokenType.comma)) {
          this.tokens.copyToken();
        }
      }
    }
    this.tokens.copyExpectedToken(TokenType.braceR);
    if (!this.keepUnusedImports && isReExport && !foundNonTypeExport) {
      this.tokens.removeToken();
      this.tokens.removeToken();
      removeMaybeImportAttributes(this.tokens);
    }
    return true;
  }
  /**
   * ESM elides all imports with the rule that we only elide if we see that it's
   * a type and never see it as a value. This is in contrast to CJS, which
   * elides imports that are completely unknown.
   */
  shouldElideExportedName(name) {
    return this.isTypeScriptTransformEnabled && !this.keepUnusedImports && this.declarationInfo.typeDeclarations.has(name) && !this.declarationInfo.valueDeclarations.has(name);
  }
};

// node_modules/sucrase/dist/esm/transformers/FlowTransformer.js
var FlowTransformer = class extends Transformer {
  constructor(rootTransformer, tokens, isImportsTransformEnabled) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.isImportsTransformEnabled = isImportsTransformEnabled;
    ;
  }
  process() {
    if (this.rootTransformer.processPossibleArrowParamEnd() || this.rootTransformer.processPossibleAsyncArrowWithTypeParams() || this.rootTransformer.processPossibleTypeRange()) {
      return true;
    }
    if (this.tokens.matches1(TokenType._enum)) {
      this.processEnum();
      return true;
    }
    if (this.tokens.matches2(TokenType._export, TokenType._enum)) {
      this.processNamedExportEnum();
      return true;
    }
    if (this.tokens.matches3(TokenType._export, TokenType._default, TokenType._enum)) {
      this.processDefaultExportEnum();
      return true;
    }
    return false;
  }
  /**
   * Handle a declaration like:
   * export enum E ...
   *
   * With this imports transform, this becomes:
   * const E = [[enum]]; exports.E = E;
   *
   * otherwise, it becomes:
   * export const E = [[enum]];
   */
  processNamedExportEnum() {
    if (this.isImportsTransformEnabled) {
      this.tokens.removeInitialToken();
      const enumName = this.tokens.identifierNameAtRelativeIndex(1);
      this.processEnum();
      this.tokens.appendCode(` exports.${enumName} = ${enumName};`);
    } else {
      this.tokens.copyToken();
      this.processEnum();
    }
  }
  /**
   * Handle a declaration like:
   * export default enum E
   *
   * With the imports transform, this becomes:
   * const E = [[enum]]; exports.default = E;
   *
   * otherwise, it becomes:
   * const E = [[enum]]; export default E;
   */
  processDefaultExportEnum() {
    this.tokens.removeInitialToken();
    this.tokens.removeToken();
    const enumName = this.tokens.identifierNameAtRelativeIndex(1);
    this.processEnum();
    if (this.isImportsTransformEnabled) {
      this.tokens.appendCode(` exports.default = ${enumName};`);
    } else {
      this.tokens.appendCode(` export default ${enumName};`);
    }
  }
  /**
   * Transpile flow enums to invoke the "flow-enums-runtime" library.
   *
   * Currently, the transpiled code always uses `require("flow-enums-runtime")`,
   * but if future flexibility is needed, we could expose a config option for
   * this string (similar to configurable JSX). Even when targeting ESM, the
   * default behavior of babel-plugin-transform-flow-enums is to use require
   * rather than injecting an import.
   *
   * Flow enums are quite a bit simpler than TS enums and have some convenient
   * constraints:
   * - Element initializers must be either always present or always absent. That
   *   means that we can use fixed lookahead on the first element (if any) and
   *   assume that all elements are like that.
   * - The right-hand side of an element initializer must be a literal value,
   *   not a complex expression and not referencing other elements. That means
   *   we can simply copy a single token.
   *
   * Enums can be broken up into three basic cases:
   *
   * Mirrored enums:
   * enum E {A, B}
   *   ->
   * const E = require("flow-enums-runtime").Mirrored(["A", "B"]);
   *
   * Initializer enums:
   * enum E {A = 1, B = 2}
   *   ->
   * const E = require("flow-enums-runtime")({A: 1, B: 2});
   *
   * Symbol enums:
   * enum E of symbol {A, B}
   *   ->
   * const E = require("flow-enums-runtime")({A: Symbol("A"), B: Symbol("B")});
   *
   * We can statically detect which of the three cases this is by looking at the
   * "of" declaration (if any) and seeing if the first element has an initializer.
   * Since the other transform details are so similar between the three cases, we
   * use a single implementation and vary the transform within processEnumElement
   * based on case.
   */
  processEnum() {
    this.tokens.replaceToken("const");
    this.tokens.copyExpectedToken(TokenType.name);
    let isSymbolEnum = false;
    if (this.tokens.matchesContextual(ContextualKeyword._of)) {
      this.tokens.removeToken();
      isSymbolEnum = this.tokens.matchesContextual(ContextualKeyword._symbol);
      this.tokens.removeToken();
    }
    const hasInitializers = this.tokens.matches3(TokenType.braceL, TokenType.name, TokenType.eq);
    this.tokens.appendCode(' = require("flow-enums-runtime")');
    const isMirrored = !isSymbolEnum && !hasInitializers;
    this.tokens.replaceTokenTrimmingLeftWhitespace(isMirrored ? ".Mirrored([" : "({");
    while (!this.tokens.matches1(TokenType.braceR)) {
      if (this.tokens.matches1(TokenType.ellipsis)) {
        this.tokens.removeToken();
        break;
      }
      this.processEnumElement(isSymbolEnum, hasInitializers);
      if (this.tokens.matches1(TokenType.comma)) {
        this.tokens.copyToken();
      }
    }
    this.tokens.replaceToken(isMirrored ? "]);" : "});");
  }
  /**
   * Process an individual enum element, producing either an array element or an
   * object element based on what type of enum this is.
   */
  processEnumElement(isSymbolEnum, hasInitializers) {
    if (isSymbolEnum) {
      const elementName = this.tokens.identifierName();
      this.tokens.copyToken();
      this.tokens.appendCode(`: Symbol("${elementName}")`);
    } else if (hasInitializers) {
      this.tokens.copyToken();
      this.tokens.replaceTokenTrimmingLeftWhitespace(":");
      this.tokens.copyToken();
    } else {
      this.tokens.replaceToken(`"${this.tokens.identifierName()}"`);
    }
  }
};

// node_modules/sucrase/dist/esm/transformers/JestHoistTransformer.js
function _optionalChain(ops) {
  let lastAccessLHS = void 0;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return void 0;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = void 0;
    }
  }
  return value;
}
var JEST_GLOBAL_NAME = "jest";
var HOISTED_METHODS = ["mock", "unmock", "enableAutomock", "disableAutomock"];
var JestHoistTransformer = class _JestHoistTransformer extends Transformer {
  __init() {
    this.hoistedFunctionNames = [];
  }
  constructor(rootTransformer, tokens, nameManager, importProcessor) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.nameManager = nameManager;
    this.importProcessor = importProcessor;
    _JestHoistTransformer.prototype.__init.call(this);
    ;
  }
  process() {
    if (this.tokens.currentToken().scopeDepth === 0 && this.tokens.matches4(TokenType.name, TokenType.dot, TokenType.name, TokenType.parenL) && this.tokens.identifierName() === JEST_GLOBAL_NAME) {
      if (_optionalChain([this, "access", (_) => _.importProcessor, "optionalAccess", (_2) => _2.getGlobalNames, "call", (_3) => _3(), "optionalAccess", (_4) => _4.has, "call", (_5) => _5(JEST_GLOBAL_NAME)])) {
        return false;
      }
      return this.extractHoistedCalls();
    }
    return false;
  }
  getHoistedCode() {
    if (this.hoistedFunctionNames.length > 0) {
      return this.hoistedFunctionNames.map((name) => `${name}();`).join("");
    }
    return "";
  }
  /**
   * Extracts any methods calls on the jest-object that should be hoisted.
   *
   * According to the jest docs, https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options,
   * mock, unmock, enableAutomock, disableAutomock, are the methods that should be hoisted.
   *
   * We do not apply the same checks of the arguments as babel-plugin-jest-hoist does.
   */
  extractHoistedCalls() {
    this.tokens.removeToken();
    let followsNonHoistedJestCall = false;
    while (this.tokens.matches3(TokenType.dot, TokenType.name, TokenType.parenL)) {
      const methodName = this.tokens.identifierNameAtIndex(this.tokens.currentIndex() + 1);
      const shouldHoist = HOISTED_METHODS.includes(methodName);
      if (shouldHoist) {
        const hoistedFunctionName = this.nameManager.claimFreeName("__jestHoist");
        this.hoistedFunctionNames.push(hoistedFunctionName);
        this.tokens.replaceToken(`function ${hoistedFunctionName}(){${JEST_GLOBAL_NAME}.`);
        this.tokens.copyToken();
        this.tokens.copyToken();
        this.rootTransformer.processBalancedCode();
        this.tokens.copyExpectedToken(TokenType.parenR);
        this.tokens.appendCode(";}");
        followsNonHoistedJestCall = false;
      } else {
        if (followsNonHoistedJestCall) {
          this.tokens.copyToken();
        } else {
          this.tokens.replaceToken(`${JEST_GLOBAL_NAME}.`);
        }
        this.tokens.copyToken();
        this.tokens.copyToken();
        this.rootTransformer.processBalancedCode();
        this.tokens.copyExpectedToken(TokenType.parenR);
        followsNonHoistedJestCall = true;
      }
    }
    return true;
  }
};

// node_modules/sucrase/dist/esm/transformers/NumericSeparatorTransformer.js
var NumericSeparatorTransformer = class extends Transformer {
  constructor(tokens) {
    super();
    this.tokens = tokens;
    ;
  }
  process() {
    if (this.tokens.matches1(TokenType.num)) {
      const code = this.tokens.currentTokenCode();
      if (code.includes("_")) {
        this.tokens.replaceToken(code.replace(/_/g, ""));
        return true;
      }
    }
    return false;
  }
};

// node_modules/sucrase/dist/esm/transformers/OptionalCatchBindingTransformer.js
var OptionalCatchBindingTransformer = class extends Transformer {
  constructor(tokens, nameManager) {
    super();
    this.tokens = tokens;
    this.nameManager = nameManager;
    ;
  }
  process() {
    if (this.tokens.matches2(TokenType._catch, TokenType.braceL)) {
      this.tokens.copyToken();
      this.tokens.appendCode(` (${this.nameManager.claimFreeName("e")})`);
      return true;
    }
    return false;
  }
};

// node_modules/sucrase/dist/esm/transformers/OptionalChainingNullishTransformer.js
var OptionalChainingNullishTransformer = class extends Transformer {
  constructor(tokens, nameManager) {
    super();
    this.tokens = tokens;
    this.nameManager = nameManager;
    ;
  }
  process() {
    if (this.tokens.matches1(TokenType.nullishCoalescing)) {
      const token2 = this.tokens.currentToken();
      if (this.tokens.tokens[token2.nullishStartIndex].isAsyncOperation) {
        this.tokens.replaceTokenTrimmingLeftWhitespace(", async () => (");
      } else {
        this.tokens.replaceTokenTrimmingLeftWhitespace(", () => (");
      }
      return true;
    }
    if (this.tokens.matches1(TokenType._delete)) {
      const nextToken2 = this.tokens.tokenAtRelativeIndex(1);
      if (nextToken2.isOptionalChainStart) {
        this.tokens.removeInitialToken();
        return true;
      }
    }
    const token = this.tokens.currentToken();
    const chainStart = token.subscriptStartIndex;
    if (chainStart != null && this.tokens.tokens[chainStart].isOptionalChainStart && // Super subscripts can't be optional (since super is never null/undefined), and the syntax
    // relies on the subscript being intact, so leave this token alone.
    this.tokens.tokenAtRelativeIndex(-1).type !== TokenType._super) {
      const param = this.nameManager.claimFreeName("_");
      let arrowStartSnippet;
      if (chainStart > 0 && this.tokens.matches1AtIndex(chainStart - 1, TokenType._delete) && this.isLastSubscriptInChain()) {
        arrowStartSnippet = `${param} => delete ${param}`;
      } else {
        arrowStartSnippet = `${param} => ${param}`;
      }
      if (this.tokens.tokens[chainStart].isAsyncOperation) {
        arrowStartSnippet = `async ${arrowStartSnippet}`;
      }
      if (this.tokens.matches2(TokenType.questionDot, TokenType.parenL) || this.tokens.matches2(TokenType.questionDot, TokenType.lessThan)) {
        if (this.justSkippedSuper()) {
          this.tokens.appendCode(".bind(this)");
        }
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'optionalCall', ${arrowStartSnippet}`);
      } else if (this.tokens.matches2(TokenType.questionDot, TokenType.bracketL)) {
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'optionalAccess', ${arrowStartSnippet}`);
      } else if (this.tokens.matches1(TokenType.questionDot)) {
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'optionalAccess', ${arrowStartSnippet}.`);
      } else if (this.tokens.matches1(TokenType.dot)) {
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'access', ${arrowStartSnippet}.`);
      } else if (this.tokens.matches1(TokenType.bracketL)) {
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'access', ${arrowStartSnippet}[`);
      } else if (this.tokens.matches1(TokenType.parenL)) {
        if (this.justSkippedSuper()) {
          this.tokens.appendCode(".bind(this)");
        }
        this.tokens.replaceTokenTrimmingLeftWhitespace(`, 'call', ${arrowStartSnippet}(`);
      } else {
        throw new Error("Unexpected subscript operator in optional chain.");
      }
      return true;
    }
    return false;
  }
  /**
   * Determine if the current token is the last of its chain, so that we know whether it's eligible
   * to have a delete op inserted.
   *
   * We can do this by walking forward until we determine one way or another. Each
   * isOptionalChainStart token must be paired with exactly one isOptionalChainEnd token after it in
   * a nesting way, so we can track depth and walk to the end of the chain (the point where the
   * depth goes negative) and see if any other subscript token is after us in the chain.
   */
  isLastSubscriptInChain() {
    let depth = 0;
    for (let i = this.tokens.currentIndex() + 1; ; i++) {
      if (i >= this.tokens.tokens.length) {
        throw new Error("Reached the end of the code while finding the end of the access chain.");
      }
      if (this.tokens.tokens[i].isOptionalChainStart) {
        depth++;
      } else if (this.tokens.tokens[i].isOptionalChainEnd) {
        depth--;
      }
      if (depth < 0) {
        return true;
      }
      if (depth === 0 && this.tokens.tokens[i].subscriptStartIndex != null) {
        return false;
      }
    }
  }
  /**
   * Determine if we are the open-paren in an expression like super.a()?.b.
   *
   * We can do this by walking backward to find the previous subscript. If that subscript was
   * preceded by a super, then we must be the subscript after it, so if this is a call expression,
   * we'll need to attach the right context.
   */
  justSkippedSuper() {
    let depth = 0;
    let index = this.tokens.currentIndex() - 1;
    while (true) {
      if (index < 0) {
        throw new Error(
          "Reached the start of the code while finding the start of the access chain."
        );
      }
      if (this.tokens.tokens[index].isOptionalChainStart) {
        depth--;
      } else if (this.tokens.tokens[index].isOptionalChainEnd) {
        depth++;
      }
      if (depth < 0) {
        return false;
      }
      if (depth === 0 && this.tokens.tokens[index].subscriptStartIndex != null) {
        return this.tokens.tokens[index - 1].type === TokenType._super;
      }
      index--;
    }
  }
};

// node_modules/sucrase/dist/esm/transformers/ReactDisplayNameTransformer.js
var ReactDisplayNameTransformer = class extends Transformer {
  constructor(rootTransformer, tokens, importProcessor, options) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.importProcessor = importProcessor;
    this.options = options;
    ;
  }
  process() {
    const startIndex = this.tokens.currentIndex();
    if (this.tokens.identifierName() === "createReactClass") {
      const newName = this.importProcessor && this.importProcessor.getIdentifierReplacement("createReactClass");
      if (newName) {
        this.tokens.replaceToken(`(0, ${newName})`);
      } else {
        this.tokens.copyToken();
      }
      this.tryProcessCreateClassCall(startIndex);
      return true;
    }
    if (this.tokens.matches3(TokenType.name, TokenType.dot, TokenType.name) && this.tokens.identifierName() === "React" && this.tokens.identifierNameAtIndex(this.tokens.currentIndex() + 2) === "createClass") {
      const newName = this.importProcessor ? this.importProcessor.getIdentifierReplacement("React") || "React" : "React";
      if (newName) {
        this.tokens.replaceToken(newName);
        this.tokens.copyToken();
        this.tokens.copyToken();
      } else {
        this.tokens.copyToken();
        this.tokens.copyToken();
        this.tokens.copyToken();
      }
      this.tryProcessCreateClassCall(startIndex);
      return true;
    }
    return false;
  }
  /**
   * This is called with the token position at the open-paren.
   */
  tryProcessCreateClassCall(startIndex) {
    const displayName2 = this.findDisplayName(startIndex);
    if (!displayName2) {
      return;
    }
    if (this.classNeedsDisplayName()) {
      this.tokens.copyExpectedToken(TokenType.parenL);
      this.tokens.copyExpectedToken(TokenType.braceL);
      this.tokens.appendCode(`displayName: '${displayName2}',`);
      this.rootTransformer.processBalancedCode();
      this.tokens.copyExpectedToken(TokenType.braceR);
      this.tokens.copyExpectedToken(TokenType.parenR);
    }
  }
  findDisplayName(startIndex) {
    if (startIndex < 2) {
      return null;
    }
    if (this.tokens.matches2AtIndex(startIndex - 2, TokenType.name, TokenType.eq)) {
      return this.tokens.identifierNameAtIndex(startIndex - 2);
    }
    if (startIndex >= 2 && this.tokens.tokens[startIndex - 2].identifierRole === IdentifierRole.ObjectKey) {
      return this.tokens.identifierNameAtIndex(startIndex - 2);
    }
    if (this.tokens.matches2AtIndex(startIndex - 2, TokenType._export, TokenType._default)) {
      return this.getDisplayNameFromFilename();
    }
    return null;
  }
  getDisplayNameFromFilename() {
    const filePath = this.options.filePath || "unknown";
    const pathSegments = filePath.split("/");
    const filename = pathSegments[pathSegments.length - 1];
    const dotIndex = filename.lastIndexOf(".");
    const baseFilename = dotIndex === -1 ? filename : filename.slice(0, dotIndex);
    if (baseFilename === "index" && pathSegments[pathSegments.length - 2]) {
      return pathSegments[pathSegments.length - 2];
    } else {
      return baseFilename;
    }
  }
  /**
   * We only want to add a display name when this is a function call containing
   * one argument, which is an object literal without `displayName` as an
   * existing key.
   */
  classNeedsDisplayName() {
    let index = this.tokens.currentIndex();
    if (!this.tokens.matches2(TokenType.parenL, TokenType.braceL)) {
      return false;
    }
    const objectStartIndex = index + 1;
    const objectContextId = this.tokens.tokens[objectStartIndex].contextId;
    if (objectContextId == null) {
      throw new Error("Expected non-null context ID on object open-brace.");
    }
    for (; index < this.tokens.tokens.length; index++) {
      const token = this.tokens.tokens[index];
      if (token.type === TokenType.braceR && token.contextId === objectContextId) {
        index++;
        break;
      }
      if (this.tokens.identifierNameAtIndex(index) === "displayName" && this.tokens.tokens[index].identifierRole === IdentifierRole.ObjectKey && token.contextId === objectContextId) {
        return false;
      }
    }
    if (index === this.tokens.tokens.length) {
      throw new Error("Unexpected end of input when processing React class.");
    }
    return this.tokens.matches1AtIndex(index, TokenType.parenR) || this.tokens.matches2AtIndex(index, TokenType.comma, TokenType.parenR);
  }
};

// node_modules/sucrase/dist/esm/transformers/ReactHotLoaderTransformer.js
var ReactHotLoaderTransformer = class _ReactHotLoaderTransformer extends Transformer {
  __init() {
    this.extractedDefaultExportName = null;
  }
  constructor(tokens, filePath) {
    super();
    this.tokens = tokens;
    this.filePath = filePath;
    _ReactHotLoaderTransformer.prototype.__init.call(this);
    ;
  }
  setExtractedDefaultExportName(extractedDefaultExportName) {
    this.extractedDefaultExportName = extractedDefaultExportName;
  }
  getPrefixCode() {
    return `
      (function () {
        var enterModule = require('react-hot-loader').enterModule;
        enterModule && enterModule(module);
      })();`.replace(/\s+/g, " ").trim();
  }
  getSuffixCode() {
    const topLevelNames = /* @__PURE__ */ new Set();
    for (const token of this.tokens.tokens) {
      if (!token.isType && isTopLevelDeclaration(token) && token.identifierRole !== IdentifierRole.ImportDeclaration) {
        topLevelNames.add(this.tokens.identifierNameForToken(token));
      }
    }
    const namesToRegister = Array.from(topLevelNames).map((name) => ({
      variableName: name,
      uniqueLocalName: name
    }));
    if (this.extractedDefaultExportName) {
      namesToRegister.push({
        variableName: this.extractedDefaultExportName,
        uniqueLocalName: "default"
      });
    }
    return `
;(function () {
  var reactHotLoader = require('react-hot-loader').default;
  var leaveModule = require('react-hot-loader').leaveModule;
  if (!reactHotLoader) {
    return;
  }
${namesToRegister.map(
      ({ variableName, uniqueLocalName }) => `  reactHotLoader.register(${variableName}, "${uniqueLocalName}", ${JSON.stringify(
        this.filePath || ""
      )});`
    ).join("\n")}
  leaveModule(module);
})();`;
  }
  process() {
    return false;
  }
};

// node_modules/sucrase/dist/esm/util/isIdentifier.js
var RESERVED_WORDS = /* @__PURE__ */ new Set([
  // Reserved keywords as of ECMAScript 2015
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  // Future reserved keywords
  "enum",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "await",
  // Literals that cannot be used as identifiers
  "false",
  "null",
  "true"
]);
function isIdentifier(name) {
  if (name.length === 0) {
    return false;
  }
  if (!IS_IDENTIFIER_START[name.charCodeAt(0)]) {
    return false;
  }
  for (let i = 1; i < name.length; i++) {
    if (!IS_IDENTIFIER_CHAR[name.charCodeAt(i)]) {
      return false;
    }
  }
  return !RESERVED_WORDS.has(name);
}

// node_modules/sucrase/dist/esm/transformers/TypeScriptTransformer.js
var TypeScriptTransformer = class extends Transformer {
  constructor(rootTransformer, tokens, isImportsTransformEnabled) {
    super();
    this.rootTransformer = rootTransformer;
    this.tokens = tokens;
    this.isImportsTransformEnabled = isImportsTransformEnabled;
    ;
  }
  process() {
    if (this.rootTransformer.processPossibleArrowParamEnd() || this.rootTransformer.processPossibleAsyncArrowWithTypeParams() || this.rootTransformer.processPossibleTypeRange()) {
      return true;
    }
    if (this.tokens.matches1(TokenType._public) || this.tokens.matches1(TokenType._protected) || this.tokens.matches1(TokenType._private) || this.tokens.matches1(TokenType._abstract) || this.tokens.matches1(TokenType._readonly) || this.tokens.matches1(TokenType._override) || this.tokens.matches1(TokenType.nonNullAssertion)) {
      this.tokens.removeInitialToken();
      return true;
    }
    if (this.tokens.matches1(TokenType._enum) || this.tokens.matches2(TokenType._const, TokenType._enum)) {
      this.processEnum();
      return true;
    }
    if (this.tokens.matches2(TokenType._export, TokenType._enum) || this.tokens.matches3(TokenType._export, TokenType._const, TokenType._enum)) {
      this.processEnum(true);
      return true;
    }
    return false;
  }
  processEnum(isExport = false) {
    this.tokens.removeInitialToken();
    while (this.tokens.matches1(TokenType._const) || this.tokens.matches1(TokenType._enum)) {
      this.tokens.removeToken();
    }
    const enumName = this.tokens.identifierName();
    this.tokens.removeToken();
    if (isExport && !this.isImportsTransformEnabled) {
      this.tokens.appendCode("export ");
    }
    this.tokens.appendCode(`var ${enumName}; (function (${enumName})`);
    this.tokens.copyExpectedToken(TokenType.braceL);
    this.processEnumBody(enumName);
    this.tokens.copyExpectedToken(TokenType.braceR);
    if (isExport && this.isImportsTransformEnabled) {
      this.tokens.appendCode(`)(${enumName} || (exports.${enumName} = ${enumName} = {}));`);
    } else {
      this.tokens.appendCode(`)(${enumName} || (${enumName} = {}));`);
    }
  }
  /**
   * Transform an enum into equivalent JS. This has complexity in a few places:
   * - TS allows string enums, numeric enums, and a mix of the two styles within an enum.
   * - Enum keys are allowed to be referenced in later enum values.
   * - Enum keys are allowed to be strings.
   * - When enum values are omitted, they should follow an auto-increment behavior.
   */
  processEnumBody(enumName) {
    let previousValueCode = null;
    while (true) {
      if (this.tokens.matches1(TokenType.braceR)) {
        break;
      }
      const { nameStringCode, variableName } = this.extractEnumKeyInfo(this.tokens.currentToken());
      this.tokens.removeInitialToken();
      if (this.tokens.matches3(TokenType.eq, TokenType.string, TokenType.comma) || this.tokens.matches3(TokenType.eq, TokenType.string, TokenType.braceR)) {
        this.processStringLiteralEnumMember(enumName, nameStringCode, variableName);
      } else if (this.tokens.matches1(TokenType.eq)) {
        this.processExplicitValueEnumMember(enumName, nameStringCode, variableName);
      } else {
        this.processImplicitValueEnumMember(
          enumName,
          nameStringCode,
          variableName,
          previousValueCode
        );
      }
      if (this.tokens.matches1(TokenType.comma)) {
        this.tokens.removeToken();
      }
      if (variableName != null) {
        previousValueCode = variableName;
      } else {
        previousValueCode = `${enumName}[${nameStringCode}]`;
      }
    }
  }
  /**
   * Detect name information about this enum key, which will be used to determine which code to emit
   * and whether we should declare a variable as part of this declaration.
   *
   * Some cases to keep in mind:
   * - Enum keys can be implicitly referenced later, e.g. `X = 1, Y = X`. In Sucrase, we implement
   *   this by declaring a variable `X` so that later expressions can use it.
   * - In addition to the usual identifier key syntax, enum keys are allowed to be string literals,
   *   e.g. `"hello world" = 3,`. Template literal syntax is NOT allowed.
   * - Even if the enum key is defined as a string literal, it may still be referenced by identifier
   *   later, e.g. `"X" = 1, Y = X`. That means that we need to detect whether or not a string
   *   literal is identifier-like and emit a variable if so, even if the declaration did not use an
   *   identifier.
   * - Reserved keywords like `break` are valid enum keys, but are not valid to be referenced later
   *   and would be a syntax error if we emitted a variable, so we need to skip the variable
   *   declaration in those cases.
   *
   * The variableName return value captures these nuances: if non-null, we can and must emit a
   * variable declaration, and if null, we can't and shouldn't.
   */
  extractEnumKeyInfo(nameToken) {
    if (nameToken.type === TokenType.name) {
      const name = this.tokens.identifierNameForToken(nameToken);
      return {
        nameStringCode: `"${name}"`,
        variableName: isIdentifier(name) ? name : null
      };
    } else if (nameToken.type === TokenType.string) {
      const name = this.tokens.stringValueForToken(nameToken);
      return {
        nameStringCode: this.tokens.code.slice(nameToken.start, nameToken.end),
        variableName: isIdentifier(name) ? name : null
      };
    } else {
      throw new Error("Expected name or string at beginning of enum element.");
    }
  }
  /**
   * Handle an enum member where the RHS is just a string literal (not omitted, not a number, and
   * not a complex expression). This is the typical form for TS string enums, and in this case, we
   * do *not* create a reverse mapping.
   *
   * This is called after deleting the key token, when the token processor is at the equals sign.
   *
   * Example 1:
   * someKey = "some value"
   * ->
   * const someKey = "some value"; MyEnum["someKey"] = someKey;
   *
   * Example 2:
   * "some key" = "some value"
   * ->
   * MyEnum["some key"] = "some value";
   */
  processStringLiteralEnumMember(enumName, nameStringCode, variableName) {
    if (variableName != null) {
      this.tokens.appendCode(`const ${variableName}`);
      this.tokens.copyToken();
      this.tokens.copyToken();
      this.tokens.appendCode(`; ${enumName}[${nameStringCode}] = ${variableName};`);
    } else {
      this.tokens.appendCode(`${enumName}[${nameStringCode}]`);
      this.tokens.copyToken();
      this.tokens.copyToken();
      this.tokens.appendCode(";");
    }
  }
  /**
   * Handle an enum member initialized with an expression on the right-hand side (other than a
   * string literal). In these cases, we should transform the expression and emit code that sets up
   * a reverse mapping.
   *
   * The TypeScript implementation of this operation distinguishes between expressions that can be
   * "constant folded" at compile time (i.e. consist of number literals and simple math operations
   * on those numbers) and ones that are dynamic. For constant expressions, it emits the resolved
   * numeric value, and auto-incrementing is only allowed in that case. Evaluating expressions at
   * compile time would add significant complexity to Sucrase, so Sucrase instead leaves the
   * expression as-is, and will later emit something like `MyEnum["previousKey"] + 1` to implement
   * auto-incrementing.
   *
   * This is called after deleting the key token, when the token processor is at the equals sign.
   *
   * Example 1:
   * someKey = 1 + 1
   * ->
   * const someKey = 1 + 1; MyEnum[MyEnum["someKey"] = someKey] = "someKey";
   *
   * Example 2:
   * "some key" = 1 + 1
   * ->
   * MyEnum[MyEnum["some key"] = 1 + 1] = "some key";
   */
  processExplicitValueEnumMember(enumName, nameStringCode, variableName) {
    const rhsEndIndex = this.tokens.currentToken().rhsEndIndex;
    if (rhsEndIndex == null) {
      throw new Error("Expected rhsEndIndex on enum assign.");
    }
    if (variableName != null) {
      this.tokens.appendCode(`const ${variableName}`);
      this.tokens.copyToken();
      while (this.tokens.currentIndex() < rhsEndIndex) {
        this.rootTransformer.processToken();
      }
      this.tokens.appendCode(
        `; ${enumName}[${enumName}[${nameStringCode}] = ${variableName}] = ${nameStringCode};`
      );
    } else {
      this.tokens.appendCode(`${enumName}[${enumName}[${nameStringCode}]`);
      this.tokens.copyToken();
      while (this.tokens.currentIndex() < rhsEndIndex) {
        this.rootTransformer.processToken();
      }
      this.tokens.appendCode(`] = ${nameStringCode};`);
    }
  }
  /**
   * Handle an enum member with no right-hand side expression. In this case, the value is the
   * previous value plus 1, or 0 if there was no previous value. We should also always emit a
   * reverse mapping.
   *
   * Example 1:
   * someKey2
   * ->
   * const someKey2 = someKey1 + 1; MyEnum[MyEnum["someKey2"] = someKey2] = "someKey2";
   *
   * Example 2:
   * "some key 2"
   * ->
   * MyEnum[MyEnum["some key 2"] = someKey1 + 1] = "some key 2";
   */
  processImplicitValueEnumMember(enumName, nameStringCode, variableName, previousValueCode) {
    let valueCode = previousValueCode != null ? `${previousValueCode} + 1` : "0";
    if (variableName != null) {
      this.tokens.appendCode(`const ${variableName} = ${valueCode}; `);
      valueCode = variableName;
    }
    this.tokens.appendCode(
      `${enumName}[${enumName}[${nameStringCode}] = ${valueCode}] = ${nameStringCode};`
    );
  }
};

// node_modules/sucrase/dist/esm/transformers/RootTransformer.js
var RootTransformer = class _RootTransformer {
  __init() {
    this.transformers = [];
  }
  __init2() {
    this.generatedVariables = [];
  }
  constructor(sucraseContext, transforms, enableLegacyBabel5ModuleInterop, options) {
    ;
    _RootTransformer.prototype.__init.call(this);
    _RootTransformer.prototype.__init2.call(this);
    this.nameManager = sucraseContext.nameManager;
    this.helperManager = sucraseContext.helperManager;
    const { tokenProcessor, importProcessor } = sucraseContext;
    this.tokens = tokenProcessor;
    this.isImportsTransformEnabled = transforms.includes("imports");
    this.isReactHotLoaderTransformEnabled = transforms.includes("react-hot-loader");
    this.disableESTransforms = Boolean(options.disableESTransforms);
    if (!options.disableESTransforms) {
      this.transformers.push(
        new OptionalChainingNullishTransformer(tokenProcessor, this.nameManager)
      );
      this.transformers.push(new NumericSeparatorTransformer(tokenProcessor));
      this.transformers.push(new OptionalCatchBindingTransformer(tokenProcessor, this.nameManager));
    }
    if (transforms.includes("jsx")) {
      if (options.jsxRuntime !== "preserve") {
        this.transformers.push(
          new JSXTransformer(this, tokenProcessor, importProcessor, this.nameManager, options)
        );
      }
      this.transformers.push(
        new ReactDisplayNameTransformer(this, tokenProcessor, importProcessor, options)
      );
    }
    let reactHotLoaderTransformer = null;
    if (transforms.includes("react-hot-loader")) {
      if (!options.filePath) {
        throw new Error("filePath is required when using the react-hot-loader transform.");
      }
      reactHotLoaderTransformer = new ReactHotLoaderTransformer(tokenProcessor, options.filePath);
      this.transformers.push(reactHotLoaderTransformer);
    }
    if (transforms.includes("imports")) {
      if (importProcessor === null) {
        throw new Error("Expected non-null importProcessor with imports transform enabled.");
      }
      this.transformers.push(
        new CJSImportTransformer(
          this,
          tokenProcessor,
          importProcessor,
          this.nameManager,
          this.helperManager,
          reactHotLoaderTransformer,
          enableLegacyBabel5ModuleInterop,
          Boolean(options.enableLegacyTypeScriptModuleInterop),
          transforms.includes("typescript"),
          transforms.includes("flow"),
          Boolean(options.preserveDynamicImport),
          Boolean(options.keepUnusedImports)
        )
      );
    } else {
      this.transformers.push(
        new ESMImportTransformer(
          tokenProcessor,
          this.nameManager,
          this.helperManager,
          reactHotLoaderTransformer,
          transforms.includes("typescript"),
          transforms.includes("flow"),
          Boolean(options.keepUnusedImports),
          options
        )
      );
    }
    if (transforms.includes("flow")) {
      this.transformers.push(
        new FlowTransformer(this, tokenProcessor, transforms.includes("imports"))
      );
    }
    if (transforms.includes("typescript")) {
      this.transformers.push(
        new TypeScriptTransformer(this, tokenProcessor, transforms.includes("imports"))
      );
    }
    if (transforms.includes("jest")) {
      this.transformers.push(
        new JestHoistTransformer(this, tokenProcessor, this.nameManager, importProcessor)
      );
    }
  }
  transform() {
    this.tokens.reset();
    this.processBalancedCode();
    const shouldAddUseStrict = this.isImportsTransformEnabled;
    let prefix = shouldAddUseStrict ? '"use strict";' : "";
    for (const transformer of this.transformers) {
      prefix += transformer.getPrefixCode();
    }
    prefix += this.helperManager.emitHelpers();
    prefix += this.generatedVariables.map((v) => ` var ${v};`).join("");
    for (const transformer of this.transformers) {
      prefix += transformer.getHoistedCode();
    }
    let suffix = "";
    for (const transformer of this.transformers) {
      suffix += transformer.getSuffixCode();
    }
    const result = this.tokens.finish();
    let { code } = result;
    if (code.startsWith("#!")) {
      let newlineIndex = code.indexOf("\n");
      if (newlineIndex === -1) {
        newlineIndex = code.length;
        code += "\n";
      }
      return {
        code: code.slice(0, newlineIndex + 1) + prefix + code.slice(newlineIndex + 1) + suffix,
        // The hashbang line has no tokens, so shifting the tokens to account
        // for prefix can happen normally.
        mappings: this.shiftMappings(result.mappings, prefix.length)
      };
    } else {
      return {
        code: prefix + code + suffix,
        mappings: this.shiftMappings(result.mappings, prefix.length)
      };
    }
  }
  processBalancedCode() {
    let braceDepth = 0;
    let parenDepth = 0;
    while (!this.tokens.isAtEnd()) {
      if (this.tokens.matches1(TokenType.braceL) || this.tokens.matches1(TokenType.dollarBraceL)) {
        braceDepth++;
      } else if (this.tokens.matches1(TokenType.braceR)) {
        if (braceDepth === 0) {
          return;
        }
        braceDepth--;
      }
      if (this.tokens.matches1(TokenType.parenL)) {
        parenDepth++;
      } else if (this.tokens.matches1(TokenType.parenR)) {
        if (parenDepth === 0) {
          return;
        }
        parenDepth--;
      }
      this.processToken();
    }
  }
  processToken() {
    if (this.tokens.matches1(TokenType._class)) {
      this.processClass();
      return;
    }
    for (const transformer of this.transformers) {
      const wasProcessed = transformer.process();
      if (wasProcessed) {
        return;
      }
    }
    this.tokens.copyToken();
  }
  /**
   * Skip past a class with a name and return that name.
   */
  processNamedClass() {
    if (!this.tokens.matches2(TokenType._class, TokenType.name)) {
      throw new Error("Expected identifier for exported class name.");
    }
    const name = this.tokens.identifierNameAtIndex(this.tokens.currentIndex() + 1);
    this.processClass();
    return name;
  }
  processClass() {
    const classInfo = getClassInfo(this, this.tokens, this.nameManager, this.disableESTransforms);
    const needsCommaExpression = (classInfo.headerInfo.isExpression || !classInfo.headerInfo.className) && classInfo.staticInitializerNames.length + classInfo.instanceInitializerNames.length > 0;
    let className = classInfo.headerInfo.className;
    if (needsCommaExpression) {
      className = this.nameManager.claimFreeName("_class");
      this.generatedVariables.push(className);
      this.tokens.appendCode(` (${className} =`);
    }
    const classToken = this.tokens.currentToken();
    const contextId = classToken.contextId;
    if (contextId == null) {
      throw new Error("Expected class to have a context ID.");
    }
    this.tokens.copyExpectedToken(TokenType._class);
    while (!this.tokens.matchesContextIdAndLabel(TokenType.braceL, contextId)) {
      this.processToken();
    }
    this.processClassBody(classInfo, className);
    const staticInitializerStatements = classInfo.staticInitializerNames.map(
      (name) => `${className}.${name}()`
    );
    if (needsCommaExpression) {
      this.tokens.appendCode(
        `, ${staticInitializerStatements.map((s) => `${s}, `).join("")}${className})`
      );
    } else if (classInfo.staticInitializerNames.length > 0) {
      this.tokens.appendCode(` ${staticInitializerStatements.map((s) => `${s};`).join(" ")}`);
    }
  }
  /**
   * We want to just handle class fields in all contexts, since TypeScript supports them. Later,
   * when some JS implementations support class fields, this should be made optional.
   */
  processClassBody(classInfo, className) {
    const {
      headerInfo,
      constructorInsertPos,
      constructorInitializerStatements,
      fields,
      instanceInitializerNames,
      rangesToRemove
    } = classInfo;
    let fieldIndex = 0;
    let rangeToRemoveIndex = 0;
    const classContextId = this.tokens.currentToken().contextId;
    if (classContextId == null) {
      throw new Error("Expected non-null context ID on class.");
    }
    this.tokens.copyExpectedToken(TokenType.braceL);
    if (this.isReactHotLoaderTransformEnabled) {
      this.tokens.appendCode(
        "__reactstandin__regenerateByEval(key, code) {this[key] = eval(code);}"
      );
    }
    const needsConstructorInit = constructorInitializerStatements.length + instanceInitializerNames.length > 0;
    if (constructorInsertPos === null && needsConstructorInit) {
      const constructorInitializersCode = this.makeConstructorInitCode(
        constructorInitializerStatements,
        instanceInitializerNames,
        className
      );
      if (headerInfo.hasSuperclass) {
        const argsName = this.nameManager.claimFreeName("args");
        this.tokens.appendCode(
          `constructor(...${argsName}) { super(...${argsName}); ${constructorInitializersCode}; }`
        );
      } else {
        this.tokens.appendCode(`constructor() { ${constructorInitializersCode}; }`);
      }
    }
    while (!this.tokens.matchesContextIdAndLabel(TokenType.braceR, classContextId)) {
      if (fieldIndex < fields.length && this.tokens.currentIndex() === fields[fieldIndex].start) {
        let needsCloseBrace = false;
        if (this.tokens.matches1(TokenType.bracketL)) {
          this.tokens.copyTokenWithPrefix(`${fields[fieldIndex].initializerName}() {this`);
        } else if (this.tokens.matches1(TokenType.string) || this.tokens.matches1(TokenType.num)) {
          this.tokens.copyTokenWithPrefix(`${fields[fieldIndex].initializerName}() {this[`);
          needsCloseBrace = true;
        } else {
          this.tokens.copyTokenWithPrefix(`${fields[fieldIndex].initializerName}() {this.`);
        }
        while (this.tokens.currentIndex() < fields[fieldIndex].end) {
          if (needsCloseBrace && this.tokens.currentIndex() === fields[fieldIndex].equalsIndex) {
            this.tokens.appendCode("]");
          }
          this.processToken();
        }
        this.tokens.appendCode("}");
        fieldIndex++;
      } else if (rangeToRemoveIndex < rangesToRemove.length && this.tokens.currentIndex() >= rangesToRemove[rangeToRemoveIndex].start) {
        if (this.tokens.currentIndex() < rangesToRemove[rangeToRemoveIndex].end) {
          this.tokens.removeInitialToken();
        }
        while (this.tokens.currentIndex() < rangesToRemove[rangeToRemoveIndex].end) {
          this.tokens.removeToken();
        }
        rangeToRemoveIndex++;
      } else if (this.tokens.currentIndex() === constructorInsertPos) {
        this.tokens.copyToken();
        if (needsConstructorInit) {
          this.tokens.appendCode(
            `;${this.makeConstructorInitCode(
              constructorInitializerStatements,
              instanceInitializerNames,
              className
            )};`
          );
        }
        this.processToken();
      } else {
        this.processToken();
      }
    }
    this.tokens.copyExpectedToken(TokenType.braceR);
  }
  makeConstructorInitCode(constructorInitializerStatements, instanceInitializerNames, className) {
    return [
      ...constructorInitializerStatements,
      ...instanceInitializerNames.map((name) => `${className}.prototype.${name}.call(this)`)
    ].join(";");
  }
  /**
   * Normally it's ok to simply remove type tokens, but we need to be more careful when dealing with
   * arrow function return types since they can confuse the parser. In that case, we want to move
   * the close-paren to the same line as the arrow.
   *
   * See https://github.com/alangpierce/sucrase/issues/391 for more details.
   */
  processPossibleArrowParamEnd() {
    if (this.tokens.matches2(TokenType.parenR, TokenType.colon) && this.tokens.tokenAtRelativeIndex(1).isType) {
      let nextNonTypeIndex = this.tokens.currentIndex() + 1;
      while (this.tokens.tokens[nextNonTypeIndex].isType) {
        nextNonTypeIndex++;
      }
      if (this.tokens.matches1AtIndex(nextNonTypeIndex, TokenType.arrow)) {
        this.tokens.removeInitialToken();
        while (this.tokens.currentIndex() < nextNonTypeIndex) {
          this.tokens.removeToken();
        }
        this.tokens.replaceTokenTrimmingLeftWhitespace(") =>");
        return true;
      }
    }
    return false;
  }
  /**
   * An async arrow function might be of the form:
   *
   * async <
   *   T
   * >() => {}
   *
   * in which case, removing the type parameters will cause a syntax error. Detect this case and
   * move the open-paren earlier.
   */
  processPossibleAsyncArrowWithTypeParams() {
    if (!this.tokens.matchesContextual(ContextualKeyword._async) && !this.tokens.matches1(TokenType._async)) {
      return false;
    }
    const nextToken2 = this.tokens.tokenAtRelativeIndex(1);
    if (nextToken2.type !== TokenType.lessThan || !nextToken2.isType) {
      return false;
    }
    let nextNonTypeIndex = this.tokens.currentIndex() + 1;
    while (this.tokens.tokens[nextNonTypeIndex].isType) {
      nextNonTypeIndex++;
    }
    if (this.tokens.matches1AtIndex(nextNonTypeIndex, TokenType.parenL)) {
      this.tokens.replaceToken("async (");
      this.tokens.removeInitialToken();
      while (this.tokens.currentIndex() < nextNonTypeIndex) {
        this.tokens.removeToken();
      }
      this.tokens.removeToken();
      this.processBalancedCode();
      this.processToken();
      return true;
    }
    return false;
  }
  processPossibleTypeRange() {
    if (this.tokens.currentToken().isType) {
      this.tokens.removeInitialToken();
      while (this.tokens.currentToken().isType) {
        this.tokens.removeToken();
      }
      return true;
    }
    return false;
  }
  shiftMappings(mappings, prefixLength) {
    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      if (mapping !== void 0) {
        mappings[i] = mapping + prefixLength;
      }
    }
    return mappings;
  }
};

// node_modules/sucrase/dist/esm/util/formatTokens.js
var import_lines_and_columns = __toESM(require_build());

// node_modules/sucrase/dist/esm/util/getTSImportedNames.js
function getTSImportedNames(tokens) {
  const importedNames = /* @__PURE__ */ new Set();
  for (let i = 0; i < tokens.tokens.length; i++) {
    if (tokens.matches1AtIndex(i, TokenType._import) && !tokens.matches3AtIndex(i, TokenType._import, TokenType.name, TokenType.eq)) {
      collectNamesForImport(tokens, i, importedNames);
    }
  }
  return importedNames;
}
function collectNamesForImport(tokens, index, importedNames) {
  index++;
  if (tokens.matches1AtIndex(index, TokenType.parenL)) {
    return;
  }
  if (tokens.matches1AtIndex(index, TokenType.name)) {
    importedNames.add(tokens.identifierNameAtIndex(index));
    index++;
    if (tokens.matches1AtIndex(index, TokenType.comma)) {
      index++;
    }
  }
  if (tokens.matches1AtIndex(index, TokenType.star)) {
    index += 2;
    importedNames.add(tokens.identifierNameAtIndex(index));
    index++;
  }
  if (tokens.matches1AtIndex(index, TokenType.braceL)) {
    index++;
    collectNamesForNamedImport(tokens, index, importedNames);
  }
}
function collectNamesForNamedImport(tokens, index, importedNames) {
  while (true) {
    if (tokens.matches1AtIndex(index, TokenType.braceR)) {
      return;
    }
    const specifierInfo = getImportExportSpecifierInfo(tokens, index);
    index = specifierInfo.endIndex;
    if (!specifierInfo.isType) {
      importedNames.add(specifierInfo.rightName);
    }
    if (tokens.matches2AtIndex(index, TokenType.comma, TokenType.braceR)) {
      return;
    } else if (tokens.matches1AtIndex(index, TokenType.braceR)) {
      return;
    } else if (tokens.matches1AtIndex(index, TokenType.comma)) {
      index++;
    } else {
      throw new Error(`Unexpected token: ${JSON.stringify(tokens.tokens[index])}`);
    }
  }
}

// node_modules/sucrase/dist/esm/index.js
function transform(code, options) {
  validateOptions(options);
  try {
    const sucraseContext = getSucraseContext(code, options);
    const transformer = new RootTransformer(
      sucraseContext,
      options.transforms,
      Boolean(options.enableLegacyBabel5ModuleInterop),
      options
    );
    const transformerResult = transformer.transform();
    let result = { code: transformerResult.code };
    if (options.sourceMapOptions) {
      if (!options.filePath) {
        throw new Error("filePath must be specified when generating a source map.");
      }
      result = {
        ...result,
        sourceMap: computeSourceMap(
          transformerResult,
          options.filePath,
          options.sourceMapOptions,
          code,
          sucraseContext.tokenProcessor.tokens
        )
      };
    }
    return result;
  } catch (e) {
    if (options.filePath) {
      e.message = `Error transforming ${options.filePath}: ${e.message}`;
    }
    throw e;
  }
}
function getSucraseContext(code, options) {
  const isJSXEnabled2 = options.transforms.includes("jsx");
  const isTypeScriptEnabled2 = options.transforms.includes("typescript");
  const isFlowEnabled2 = options.transforms.includes("flow");
  const disableESTransforms = options.disableESTransforms === true;
  const file = parse(code, isJSXEnabled2, isTypeScriptEnabled2, isFlowEnabled2);
  const tokens = file.tokens;
  const scopes = file.scopes;
  const nameManager = new NameManager(code, tokens);
  const helperManager = new HelperManager(nameManager);
  const tokenProcessor = new TokenProcessor(
    code,
    tokens,
    isFlowEnabled2,
    disableESTransforms,
    helperManager
  );
  const enableLegacyTypeScriptModuleInterop = Boolean(options.enableLegacyTypeScriptModuleInterop);
  let importProcessor = null;
  if (options.transforms.includes("imports")) {
    importProcessor = new CJSImportProcessor(
      nameManager,
      tokenProcessor,
      enableLegacyTypeScriptModuleInterop,
      options,
      options.transforms.includes("typescript"),
      Boolean(options.keepUnusedImports),
      helperManager
    );
    importProcessor.preprocessTokens();
    identifyShadowedGlobals(tokenProcessor, scopes, importProcessor.getGlobalNames());
    if (options.transforms.includes("typescript") && !options.keepUnusedImports) {
      importProcessor.pruneTypeOnlyImports();
    }
  } else if (options.transforms.includes("typescript") && !options.keepUnusedImports) {
    identifyShadowedGlobals(tokenProcessor, scopes, getTSImportedNames(tokenProcessor));
  }
  return { tokenProcessor, scopes, nameManager, importProcessor, helperManager };
}

// server/web-preview.ts
var ttl = 10 * 6e4;
var policy = "sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' blob: https:; style-src 'unsafe-inline' https:; img-src https: data: blob:; font-src https: data:; connect-src 'none'; worker-src 'none'; frame-src 'self' about:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
var imports = {
  react: "https://esm.sh/react@18.3.1",
  "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
  "react-dom": "https://esm.sh/react-dom@18.3.1?external=react",
  "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?external=react",
  "lucide-react": "https://esm.sh/lucide-react@0.468.0?external=react",
  recharts: "https://esm.sh/recharts@2.15.4?external=react,react-dom"
};
var scriptString = (s) => JSON.stringify(s).replace(/</g, "\\u003c");
function page(version2, locale) {
  if (version2.format !== "react") return webDocument(version2.content, version2.format, locale);
  let source = version2.content;
  if (!/\bexport\s+default\b/.test(source) && /\b(?:function|class|const|let)\s+App\b/.test(source)) source += "\nexport default App;";
  const { code } = transform(source, { transforms: ["typescript", "jsx"], jsxPragma: "__avReact.createElement", jsxFragmentPragma: "__avReact.Fragment" });
  const moduleSource = 'import __avReact from "react";\n' + code;
  const document = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="importmap">${JSON.stringify({ imports })}</script>
    <script type="module">const root=document.getElementById("root");try {
      const moduleURL=URL.createObjectURL(new Blob([${scriptString(moduleSource)}],{type:"text/javascript"}));
      const [React,DOM,App]=await Promise.all([import("react"),import("react-dom/client"),import(moduleURL)]);
      DOM.createRoot(root).render(React.createElement(App.default));
    } catch (error) { root.textContent=${scriptString(locale === "ko" ? "React \uBBF8\uB9AC\uBCF4\uAE30 \uC624\uB958: " : "React preview error: ")}+error.message; }</script>`;
  return webDocument(document, "react", locale);
}
var LocalWebPreview = class {
  constructor(repo) {
    this.repo = repo;
    this.tickets = /* @__PURE__ */ new Map();
    this.stopped = false;
  }
  async open(session, artifact2, revision2, locale = "en") {
    if (this.stopped || !this.repo.get(session, artifact2, revision2)) throw new Error(locale === "ko" ? "\uC774 \uBC84\uC804\uC744 \uC5F4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." : "This version cannot be opened.");
    const port = await (this.starting ??= this.listen().catch((error) => {
      this.starting = void 0;
      throw error;
    }));
    if (this.stopped) throw new Error(locale === "ko" ? "\uBBF8\uB9AC\uBCF4\uAE30 \uC11C\uBC84\uAC00 \uC885\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." : "The preview server has stopped.");
    const now = Date.now();
    for (const [key2, item] of this.tickets) if (item.expires <= now) this.tickets.delete(key2);
    if (this.tickets.size >= 128) this.tickets.delete(this.tickets.keys().next().value);
    const key = randomBytes2(24).toString("base64url");
    this.tickets.set(key, { session, artifact: artifact2, revision: revision2, locale, expires: now + ttl });
    return `http://127.0.0.1:${port}/${key}`;
  }
  listen() {
    return new Promise((resolve5, reject) => {
      const server = this.server = createServer((req, res) => {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Content-Security-Policy", policy);
        const ticket = this.tickets.get(req.url?.slice(1) ?? "");
        const valid = req.method === "GET" && req.headers.host === `127.0.0.1:${req.socket.localPort}` && ticket && ticket.expires > Date.now();
        try {
          const stored = valid && this.repo.get(ticket.session, ticket.artifact, ticket.revision);
          if (!stored) {
            res.writeHead(404);
            res.end();
            return;
          }
          const body = page(stored.version, ticket.locale);
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(body);
        } catch {
          res.writeHead(422, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(ticket?.locale === "ko" ? "\uC120\uD0DD\uD55C \uBC84\uC804\uC744 \uD45C\uC2DC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." : "The selected version could not be displayed.");
        }
      });
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (!address || typeof address === "string") {
          reject(new Error("Could not resolve the local preview address."));
          return;
        }
        server.unref();
        resolve5(address.port);
      });
    });
  }
  async close() {
    this.stopped = true;
    this.tickets.clear();
    await this.starting?.catch(() => {
    });
    const server = this.server;
    if (server?.listening) await new Promise((done) => {
      server.close(() => done());
      server.closeAllConnections();
    });
  }
};

// shared/sidebar.ts
import { defineRpc as defineRpc2, defineSubscription as defineSubscription2 } from "@getpaseo/plugin";
import { z as z3 } from "zod";
var id = z3.string().min(1).max(256);
var version = z3.number().int().positive();
var target2 = z3.object({ requestId: id, sessionId: id, artifactId: id, version });
var foregroundIssue = z3.enum(["not_foreground", "foreground_unknown"]);
var receipt = target2.extend({
  claimToken: id.optional(),
  outcome: z3.union([foregroundIssue, z3.enum(["waiting_not_foreground", "waiting_foreground_unknown", "release_not_foreground", "release_foreground_unknown", "opening", "refreshed", "unchanged", "closed"])]).optional()
});
var event = target2.extend({
  workspaceId: id,
  expiresAt: z3.number().int(),
  foregroundRetry: z3.literal(true).optional(),
  deferAfterReply: z3.literal(true).optional(),
  dismissed: z3.literal(true).optional(),
  recoverableClaim: z3.literal(true).optional()
});
var sidebarRequests = defineSubscription2({ name: "artifact.sidebar_requests", input: z3.object({}), event });
var sidebarPending = defineRpc2({ name: "artifact.sidebar_pending", input: z3.object({}), output: z3.object({ items: z3.array(event) }) });
var sidebarRefreshRequests = defineSubscription2({ name: "artifact.sidebar_refresh_requests", input: z3.object({}), event });
var sidebarAck = defineRpc2({ name: "artifact.sidebar_ack", input: receipt, output: z3.object({ accepted: z3.boolean() }) });
var openInput = agentToolInputs.en.open;
var openResult = z3.object({
  status: z3.union([foregroundIssue, z3.enum(["opened", "deferred", "no_client", "unconfirmed", "cancelled"])]),
  reason: foregroundIssue.optional(),
  expiresAt: z3.number().int().optional(),
  artifactId: id,
  version
});
var sidebarOpen = defineRpc2({ name: "artifact.open", input: openInput.extend({ sessionId: id }), output: openResult });

// server/sidebar.ts
import { randomUUID } from "node:crypto";
var SidebarBroker = class _SidebarBroker {
  constructor(readOutcome, timeoutMs, foregroundWaitMs, queueMs) {
    this.readOutcome = readOutcome;
    this.timeoutMs = timeoutMs;
    this.foregroundWaitMs = foregroundWaitMs;
    this.queueMs = queueMs;
    this.subscribers = /* @__PURE__ */ new Set();
    this.pending = /* @__PURE__ */ new Map();
  }
  static forOpen(timeoutMs = 5e3, foregroundWaitMs = 2e4, queueMs = 3e5) {
    return new _SidebarBroker((receipt2) => receipt2.outcome === void 0 ? "opened" : void 0, timeoutMs, foregroundWaitMs, queueMs);
  }
  static forRefresh(timeoutMs = 5e3) {
    return new _SidebarBroker(({ outcome }) => outcome === "refreshed" || outcome === "unchanged" || outcome === "closed" ? outcome : void 0, timeoutMs, 0, 0);
  }
  subscribe(push, signal) {
    if (signal.aborted) return;
    this.subscribers.add(push);
    signal.addEventListener("abort", () => this.subscribers.delete(push), { once: true });
    for (const { event: event2, queued, owner } of this.pending.values()) {
      if (queued && !owner && event2.expiresAt > Date.now()) void Promise.resolve().then(() => push(event2)).catch(() => {
      });
    }
  }
  queuedOpen(sessionId, artifactId) {
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && req.event.artifactId === artifactId && req.queued && req.queued.expiresAt > Date.now()) return req.queued;
    }
  }
  outstanding() {
    const now = Date.now();
    return Array.from(this.pending.values()).filter((req) => req.event.recoverableClaim && !req.owner && req.event.expiresAt > now).map((req) => req.event);
  }
  cancelArtifact(sessionId, artifactId) {
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && req.event.artifactId === artifactId) req.finish("cancelled");
    }
  }
  ack(receipt2) {
    const req = this.pending.get(receipt2.requestId);
    if (!req || req.event.expiresAt <= Date.now() || req.event.sessionId !== receipt2.sessionId || req.event.artifactId !== receipt2.artifactId || req.event.version !== receipt2.version) return false;
    if (receipt2.outcome === "opening") return req.claim(receipt2.claimToken);
    if (receipt2.outcome === "release_not_foreground" || receipt2.outcome === "release_foreground_unknown") {
      return !!receipt2.claimToken && req.release(receipt2.claimToken, receipt2.outcome === "release_not_foreground" ? "not_foreground" : "foreground_unknown");
    }
    if (receipt2.outcome === "waiting_not_foreground" || receipt2.outcome === "waiting_foreground_unknown") {
      if (!req.event.deferAfterReply) return false;
      return req.reportForeground(receipt2.outcome === "waiting_not_foreground" ? "not_foreground" : "foreground_unknown", true);
    }
    if (receipt2.outcome === "not_foreground" || receipt2.outcome === "foreground_unknown") {
      req.reportForeground(receipt2.outcome);
      return true;
    }
    const outcome = this.readOutcome(receipt2);
    if (!outcome) return false;
    if (outcome === "opened" && (typeof req.owner === "string" || receipt2.claimToken) && req.owner !== receipt2.claimToken) return false;
    req.acknowledge(outcome);
    return true;
  }
  async request(sessionId, workspaceId, artifactId, version2, signal, carry) {
    const target3 = { artifactId, version: version2 };
    if (signal?.aborted) return { ...target3, status: "cancelled" };
    if (!workspaceId) return { ...target3, status: "no_client" };
    const allowDeferredOpen = this.foregroundWaitMs > 0;
    for (const req of this.pending.values()) {
      if (req.event.sessionId === sessionId && (allowDeferredOpen || req.event.artifactId === artifactId)) req.finish("cancelled");
    }
    if (!this.subscribers.size && !carry) return { ...target3, status: "no_client" };
    const event2 = {
      sessionId,
      workspaceId,
      artifactId,
      version: version2,
      requestId: randomUUID(),
      expiresAt: carry?.expiresAt ?? Date.now() + Math.max(this.timeoutMs, this.queueMs)
    };
    if (allowDeferredOpen) {
      event2.foregroundRetry = true;
      event2.deferAfterReply = true;
      event2.recoverableClaim = true;
    }
    const subscribers = [...this.subscribers];
    const reply = await new Promise((resolve5) => {
      const cancel = () => finish("cancelled");
      const finish = (value) => {
        if (!this.pending.delete(event2.requestId)) return;
        clearTimeout(timer);
        signal?.removeEventListener("abort", cancel);
        resolve5({ status: value });
        if (wasQueued) {
          const dismissed = { ...event2, expiresAt: 0, dismissed: true };
          for (const push of this.subscribers) void Promise.resolve().then(() => push(dismissed)).catch(() => {
          });
        }
      };
      let observed;
      let foregroundIssue2;
      let wasQueued = false;
      const legacyDeadline = Date.now() + this.foregroundWaitMs;
      const timeout = () => finish(observed ?? foregroundIssue2 ?? "unconfirmed");
      let timer = setTimeout(timeout, this.timeoutMs);
      const reportForeground = (issue, keep = false) => {
        if (pending.owner) return false;
        foregroundIssue2 = issue;
        if (!allowDeferredOpen) {
          if (subscribers.length === 1) finish(issue);
          return true;
        }
        if (keep) {
          wasQueued = true;
          pending.queued = { reason: issue, expiresAt: event2.expiresAt };
          signal?.removeEventListener("abort", cancel);
          resolve5({ status: "deferred", ...pending.queued });
        }
        clearTimeout(timer);
        const remaining = Math.max(0, event2.expiresAt - Date.now());
        timer = setTimeout(timeout, wasQueued ? remaining : Math.max(0, Math.min(remaining, legacyDeadline - Date.now())));
        return true;
      };
      const claim = (token) => {
        if (!allowDeferredOpen) return false;
        if (pending.owner) return token !== void 0 && pending.owner === token;
        pending.owner = token ?? true;
        if (!token) pending.queued = void 0;
        foregroundIssue2 = void 0;
        clearTimeout(timer);
        timer = setTimeout(timeout, Math.min(this.timeoutMs, Math.max(0, event2.expiresAt - Date.now())));
        return true;
      };
      const release = (token, reason) => {
        if (pending.owner !== token) return false;
        const carry2 = { reason, expiresAt: event2.expiresAt };
        wasQueued = true;
        resolve5({ status: "deferred", ...carry2 });
        finish("cancelled");
        void this.request(sessionId, workspaceId, artifactId, version2, void 0, carry2);
        return true;
      };
      const acknowledge = (outcome) => {
        if (subscribers.length === 1 || outcome === "refreshed" || outcome === "opened") finish(outcome);
        else if (!observed || outcome === "unchanged") observed = outcome;
      };
      const pending = { event: event2, acknowledge, reportForeground, claim, release, finish };
      this.pending.set(event2.requestId, pending);
      signal?.addEventListener("abort", cancel, { once: true });
      if (carry) reportForeground(carry.reason, true);
      void Promise.allSettled(subscribers.map((push) => Promise.resolve().then(() => push(event2)))).then((results) => {
        if (results.length && results.every((result) => result.status === "rejected")) {
          if (carry) reportForeground(carry.reason, true);
          else finish("no_client");
        }
      });
    });
    return { ...target3, ...reply };
  }
  close() {
    this.subscribers.clear();
    for (const req of this.pending.values()) req.finish("cancelled");
  }
};

// shared/library.ts
import { defineRpc as defineRpc3 } from "@getpaseo/plugin";
import { z as z4 } from "zod";
var artifact = summarySchema.omit({ legacyIds: true }).extend({ sessionId: z4.string().nullable() });
var libraryItem = artifact.omit({ key: true }).extend({
  sessionTitle: z4.string(),
  sessionTitleStatus: z4.enum(["untitled", "deleted", "unavailable"]).optional(),
  workspaceName: z4.string().nullable(),
  thumbnail: z4.string().nullable()
});
var artifactLibraryList = defineRpc3({
  name: "artifact.library_list",
  input: z4.object({
    query: z4.string().trim().max(256).default(""),
    pinnedOnly: z4.boolean().optional(),
    pinnedFirst: z4.boolean().optional(),
    offset: z4.number().int().nonnegative().default(0),
    limit: z4.number().int().min(1).max(100).default(40)
  }),
  output: z4.object({ items: z4.array(libraryItem), nextOffset: z4.number().int().nullable() })
});
var artifactLibraryGet = defineRpc3({
  name: "artifact.library_get",
  input: z4.object({ artifactId: z4.string().min(1), version: z4.number().int().positive().optional() }),
  output: z4.object({ artifact, version: versionSchema }).nullable()
});

// shared/agent-guide.ts
var ARTIFACT_GUIDE_MARKER = "[paseo-artifact-viewer]";
var koreanGuide = `${ARTIFACT_GUIDE_MARKER}
\uC0AC\uC6A9\uC790\uAC00 \uC544\uD2F0\uD329\uD2B8\uB97C \uC694\uCCAD\uD558\uAC70\uB098 \uB300\uD654\uC5D0\uC11C \uC5F4\uC5B4 \uB2E4\uC2DC \uC4F8 \uB3C5\uB9BD \uC2E4\uD589\uD615 \uACB0\uACFC\uBB3C(\uACC4\uC0B0\uAE30, \uC2DC\uBBAC\uB808\uC774\uD130, \uC2DC\uAC01\uD654 \uB4F1)\uC744 \uC6D0\uD558\uBA74 Paseo \uC544\uD2F0\uD329\uD2B8\uB85C \uC804\uB2EC\uD55C\uB2E4. \uC77C\uBC18 \uC9C8\uBB38\uC5D0\uB294 \uADF8\uB300\uB85C \uB2F5\uD558\uACE0, \uAE30\uC874 \uC571\uC758 \uCF54\uB4DC \uC218\uC815\uC774\uB098 \uD30C\uC77C\uB9CC \uC694\uCCAD\uD55C \uACBD\uC6B0\uC5D0\uB294 \uADF8 \uC694\uCCAD\uC744 \uB530\uB978\uB2E4.

\uB9CC\uB4E4\uAE30: \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uB3C4\uAD6C\uC5D0\uC11C artifact_publish\uB97C \uCC3E\uC544 \uD638\uCD9C\uD55C\uB2E4. format\uC740 html, svg, react \uC911 \uD558\uB098\uC774\uBA70, title\uACFC content(\uC2E4\uD589 \uAC00\uB2A5\uD55C \uB2E8\uC77C \uD30C\uC77C \uC804\uCCB4), \uC0C8 requestId\uB97C \uC804\uB2EC\uD55C\uB2E4. \uC608\uB97C \uB4E4\uC5B4 \u201C\uC0C9\uC0C1 \uC2E4\uD5D8\uC2E4 \uB9CC\uB4E4\uC5B4\uC918\u201D\uC5D0\uB294 \uC0C9\uC744 \uBC14\uAFB8\uB294 \uBC84\uD2BC\uC774 \uC791\uB3D9\uD558\uB294 HTML \uBCF8\uBB38\uC744 \uBC1C\uD589\uD55C\uB2E4. React\uB294 default export\uB97C \uC0AC\uC6A9\uD558\uBA70 react, react-dom, lucide-react, recharts\uB97C \uC9C0\uC6D0\uD55C\uB2E4. \uD30C\uC77C\uB3C4 \uC694\uCCAD\uBC1B\uC558\uB2E4\uBA74 \uD30C\uC77C \uC800\uC7A5\uACFC \uC544\uD2F0\uD329\uD2B8 \uBC1C\uD589\uC744 \uBAA8\uB450 \uC218\uD589\uD55C\uB2E4.
\uC218\uC815\uD558\uAE30: \u201C\uC0C9 \uD558\uB098 \uB354 \uCD94\uAC00\uD574\uC918\u201D\uCC98\uB7FC \uAE30\uC874 \uACB0\uACFC\uB97C \uACE0\uCE58\uB294 \uC694\uCCAD\uC740 \uD604\uC7AC \uB300\uD654\uC758 artifactId\uB97C \uC0AC\uC6A9\uD55C\uB2E4. \uB300\uC0C1\uC774 \uBD88\uBD84\uBA85\uD558\uBA74 artifact_list\uB85C \uCC3E\uACE0 artifact_read\uB85C \uCD5C\uC2E0 \uBCF8\uBB38\uC744 \uC77D\uB294\uB2E4. \uC218\uC815\uD55C \uC804\uCCB4 \uBCF8\uBB38\uC744 \uAC19\uC740 artifactId\uB85C \uBC1C\uD589\uD574 \uB2E4\uC74C \uBC84\uC804\uC744 \uB9CC\uB4E0\uB2E4. \uAC19\uC740 \uD638\uCD9C\uC758 \uC7AC\uC2DC\uB3C4\uC5D0\uB294 \uB3D9\uC77C\uD55C requestId\uC640 \uC785\uB825\uC744 \uC4F0\uACE0, \uC0C8\uB85C\uC6B4 \uC218\uC815\uC5D0\uB294 \uC0C8 requestId\uB97C \uC4F4\uB2E4.
\uC5F4\uAE30: \u201C\uB2E4\uC2DC \uC5F4\uC5B4\uC918\u201D\uC5D0\uB294 artifact_open\uC744 \uC0AC\uC6A9\uD55C\uB2E4. \uD2B9\uC815 \uBC84\uC804\uC744 \uC6D0\uD558\uBA74 version\uB3C4 \uC9C0\uC815\uD55C\uB2E4. \uBC1C\uD589 \uC131\uACF5\uC740 status\uAC00 ok\uC778\uC9C0 \uD655\uC778\uD55C \uB4A4 \uC54C\uB9B0\uB2E4. \uC5F4\uAE30\uB294 opened\uC77C \uB54C\uB9CC \uC5F4\uB838\uB2E4\uACE0 \uD558\uACE0 deferred\uC774\uBA74 \uB300\uD654\uB85C \uB3CC\uC544\uC62C \uB54C \uC5F4\uAE30 \uB300\uAE30 \uC911\uC774\uB77C\uACE0 \uC54C\uB9B0\uB2E4. \uBC1C\uD589\uC5D0 \uC131\uACF5\uD558\uBA74 \uB2F5\uBCC0\uC740 \uC9E7\uAC8C \uB9C8\uCE5C\uB2E4. \uB300\uD654 \uCE74\uB4DC\uC640 artifact_open\uC740 \uB300\uD654 \uC606 \uD328\uB110\uC5D0 \uC5F0\uB2E4. \uC67C\uCABD \uC544\uD2F0\uD329\uD2B8 \uBCF4\uAD00\uD568\uC5D0\uC11C \uACB0\uACFC\uBB3C\uC744 \uB204\uB974\uBA74 \uBA54\uC778 \uC601\uC5ED \uC804\uCCB4\uC5D0 \uC5F4\uB9B0\uB2E4.
\uB3C4\uAD6C\uAC00 \uC81C\uACF5\uB418\uC9C0 \uC54A\uB294 \uB300\uD654\uC5D0\uC11C\uB294 \uC644\uC131\uD55C \uBCF8\uBB38\uC744 html, svg \uB610\uB294 tsx \uCF54\uB4DC \uBE14\uB85D\uC73C\uB85C \uB2F5\uD55C\uB2E4. \uC608\uB97C \uB4E4\uC5B4 \uC0C9\uC0C1 \uC2E4\uD5D8\uC2E4\uC758 \uC5EC\uB294 \uC904\uC740 html artifact="color-lab" title="\uC0C9\uC0C1 \uC2E4\uD5D8\uC2E4"\uB85C \uC801\uACE0, \uC218\uC815 \uC2DC \uAC19\uC740 \uD0A4\uB97C \uC720\uC9C0\uD55C\uB2E4.`;
var englishGuide = `${ARTIFACT_GUIDE_MARKER}
When the user asks for an artifact or a standalone result they can open and use in the conversation, such as a calculator, simulation, or visualization, deliver it as a Paseo artifact. Answer ordinary questions directly. Follow requests to edit an existing app or deliver only a file.

Create: Call artifact_publish with format html, svg, or react, a title, the complete runnable single-file content, and a new requestId. For example, a color lab should include a working color button. For React, use a default export. Supported packages are react, react-dom, lucide-react, and recharts. If the user also requests a file, save the file and publish the artifact.
Edit: To change an existing result, use its artifactId in the current conversation. If needed, find it with artifact_list and read the latest content with artifact_read. Publish the complete revised content using the same artifactId to create the next version. Retry the same operation using the same requestId and input. Use a new requestId for a new edit.
Open: Use artifact_open to reopen a result. Include version when a particular revision is requested. Confirm publication only after status is ok. Report that the artifact opened only for opened. For deferred, tell the user it is waiting for them to return to the conversation. Keep the reply short after publishing. Conversation cards and artifact_open display the result beside the conversation. Selecting an artifact in the library opens it in the main area.
If the tools are unavailable, return the complete content in an html, svg, or tsx code fence. For example, open the color lab fence with html artifact="color-lab" title="Color lab". Keep the same key for edits.`;
function getArtifactGuide(locale) {
  return artifactLocale(locale) === "ko" ? koreanGuide : englishGuide;
}

// shared/locale.ts
import { defineRpc as defineRpc4 } from "@getpaseo/plugin";
import { z as z5 } from "zod";
var artifactSetLocale = defineRpc4({
  name: "artifact.set_locale",
  input: z5.object({ locale: z5.string().trim().min(1).max(128) }),
  output: z5.object({ locale: z5.enum(["en", "ko"]) })
});

// server/register.ts
var guideLocaleKey = "paseo-artifact-viewer.guideLocale";
function registerServer(server, service) {
  let fallback;
  const bind = (sessionId, paseo) => {
    fallback = paseo;
    service.bind(sessionId, paseo);
  };
  server.handle(artifactSetLocale, ({ locale }) => ({ locale: service.repository.setHostLocale(locale) }));
  server.handle(artifactLibraryList, async ({ query, offset, limit, pinnedOnly, pinnedFirst }, { paseo }) => {
    const page2 = service.repository.libraryList(query, offset, limit, pinnedOnly, pinnedFirst);
    return { items: await withSourceNames(page2.items, paseo, service.repository.hostLocale), nextOffset: page2.nextOffset };
  });
  server.handle(artifactLibraryGet, ({ artifactId, version: version2 }) => service.repository.libraryGet(artifactId, version2));
  server.handle(artifactList, (input2, { paseo }) => {
    bind(input2.sessionId, paseo);
    return service.repository.list(input2.sessionId, input2.cursor, input2.limit);
  });
  server.handle(artifactGet, (input2, { paseo }) => {
    bind(input2.sessionId, paseo);
    return service.repository.get(input2.sessionId, input2.artifactId, input2.version);
  });
  server.handle(failedNotices, (input2) => service.repository.failedNotices(input2.sessionId, input2.cursor, input2.limit));
  server.handle(artifactHistory, (input2, { paseo }) => {
    bind(input2.sessionId, paseo);
    return service.repository.history(input2.sessionId, input2.artifactId, input2.cursor, input2.limit);
  });
  server.handle(artifactRestoreVersion, (input2, { paseo }) => service.restoreVersion(input2, paseo));
  server.handle(artifactSaveEdit, (input2, { paseo }) => service.saveEdit(input2, paseo));
  server.handle(artifactCardPlacementsChanged, (_, { push, signal }) => service.placements.subscribe(push, signal));
  server.handle(artifactCardPlacements, ({ sessionId }, { paseo }) => service.placements.read(sessionId, paseo));
  server.handle(artifactBackfill, (input2, { paseo }) => service.backfill(input2.sessionId, paseo));
  const web = new LocalWebPreview(service.repository);
  const sidebar = SidebarBroker.forOpen();
  const refresh = SidebarBroker.forRefresh();
  server.handle(artifactManage, async ({ sessionId, artifactId, action }, { paseo }) => {
    bind(sessionId, paseo);
    if (action.type === "web") return { artifactId, url: await web.open(sessionId, artifactId, action.version, service.repository.hostLocale) };
    const result = service.repository.manage(sessionId, artifactId, action);
    if (action.type === "delete") {
      sidebar.cancelArtifact(sessionId, artifactId);
      refresh.cancelArtifact(sessionId, artifactId);
    }
    await service.flush(paseo, Date.now(), sessionId);
    service.placements.invalidate(sessionId);
    return result;
  });
  const open = async (sessionId, workspaceId, input2, locale = service.repository.hostLocale, signal) => {
    const id2 = input2.artifactId ?? service.repository.latestId(sessionId);
    const stored = id2 && service.repository.get(sessionId, id2, input2.version);
    if (!stored) throw new Error(localized(locale, "No matching artifact or version to open in this conversation.", "\uC774 \uB300\uD654\uC5D0 \uC5F4 \uC218 \uC788\uB294 \uC544\uD2F0\uD329\uD2B8 \uB610\uB294 \uBC84\uC804\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."));
    return sidebar.request(sessionId, workspaceId, stored.artifact.artifactId, stored.version.version, signal);
  };
  server.handle(sidebarRequests, (_, { push, signal }) => {
    sidebar.subscribe(push, signal);
  });
  server.handle(sidebarPending, () => ({ items: sidebar.outstanding() }));
  server.handle(sidebarRefreshRequests, (_, { push, signal }) => {
    refresh.subscribe(push, signal);
  });
  server.handle(sidebarAck, (receipt2) => ({ accepted: sidebar.ack(receipt2) || refresh.ack(receipt2) }));
  server.handle(sidebarOpen, async (input2, { paseo }) => {
    const agent = paseo.agents.ref(input2.sessionId);
    const workspaceId = agent.workspaceId ?? (await agent.refresh())?.agent.workspaceId ?? null;
    return open(input2.sessionId, workspaceId, input2);
  });
  const toolsFor = (locale) => [
    defineAgentTool({
      name: "artifact_publish",
      title: localized(locale, "Publish artifact", "\uC544\uD2F0\uD329\uD2B8 \uBC1C\uD589"),
      input: agentToolInputs[locale].publish,
      description: localized(locale, "Publish the complete HTML, SVG, or React content when asked to create an artifact. If you also created a file, publish the same content. This adds a conversation card and saves a library entry. Publishing updates the displayed latest version. Use artifact_open for open requests. Retry with the same requestId and input.", "\uC0AC\uC6A9\uC790\uAC00 \uC544\uD2F0\uD329\uD2B8\uB97C \uB9CC\uB4E4\uC5B4 \uB2EC\uB77C\uACE0 \uD558\uBA74 \uC644\uC131\uD55C HTML/SVG/React \uBCF8\uBB38\uC744 \uC774 \uB3C4\uAD6C\uB85C \uBC1C\uD589\uD558\uC138\uC694. \uD30C\uC77C\uB3C4 \uB9CC\uB4E4\uC5C8\uB2E4\uBA74 \uAC19\uC740 \uBCF8\uBB38\uC73C\uB85C \uBC1C\uD589\uD558\uC138\uC694. \uB300\uD654\uC5D0 \uD074\uB9AD \uAC00\uB2A5\uD55C \uC544\uD2F0\uD329\uD2B8 \uCE74\uB4DC\uAC00 \uC0DD\uAE30\uACE0 \uBCF4\uAD00\uD568\uC5D0 \uC800\uC7A5\uB429\uB2C8\uB2E4. \uBCF4\uACE0 \uC788\uB294 \uCD5C\uC2E0 \uBC84\uC804\uC740 \uAC31\uC2E0\uB429\uB2C8\uB2E4. \uC5F4\uAE30 \uC694\uCCAD\uC5D0\uB294 artifact_open\uC744 \uC0AC\uC6A9\uD558\uACE0, \uBC1C\uD589 \uC7AC\uC2DC\uB3C4\uC5D0\uB294 \uB3D9\uC77C requestId\uC640 \uC785\uB825\uC744 \uC720\uC9C0\uD558\uC138\uC694."),
      async execute(input2, { agent, paseo, signal }) {
        signal.throwIfAborted();
        const result = await service.publish(agent.id, input2, paseo, locale);
        if (result.status === "conflict") {
          const message = result.reason === "deleted" ? localized(locale, "This artifact was deleted. Restore it or publish a new artifact with a different key.", "\uC0AD\uC81C\uB41C \uC544\uD2F0\uD329\uD2B8\uC785\uB2C8\uB2E4. \uC0AD\uC81C\uB97C \uB418\uB3CC\uB9AC\uAC70\uB098 \uB2E4\uB978 key\uB85C \uC0C8 \uC544\uD2F0\uD329\uD2B8\uB97C \uBC1C\uD589\uD558\uC138\uC694.") : void 0;
          return { structuredContent: { ...result, ...message ? { message } : {} }, isError: true };
        }
        if (result.version !== service.repository.headVersion(agent.id, result.artifactId)) {
          return { structuredContent: { ...result, sidebar: "unchanged" }, isError: false };
        }
        const carry = sidebar.queuedOpen(agent.id, result.artifactId);
        if (!carry && result.version === 1) {
          return { structuredContent: { ...result, sidebar: "closed" }, isError: false };
        }
        const broker = carry ? sidebar : refresh;
        const { status, ...display } = await broker.request(agent.id, agent.workspaceId, result.artifactId, result.version, signal, carry);
        return { structuredContent: { ...result, ...display, sidebar: status }, isError: false };
      }
    }),
    defineAgentTool({ name: "artifact_read", title: localized(locale, "Read artifact", "\uC544\uD2F0\uD329\uD2B8 \uC77D\uAE30"), description: localized(locale, "Read the latest content or a specific version of an artifact saved in this conversation.", "\uD604\uC7AC \uB300\uD654\uC5D0 \uC18D\uD55C \uC800\uC7A5\uB41C \uC544\uD2F0\uD329\uD2B8\uC758 \uD2B9\uC815 \uBC84\uC804 \uB610\uB294 \uCD5C\uC2E0 \uBCF8\uBB38\uC744 \uC77D\uC2B5\uB2C8\uB2E4."), input: agentToolInputs[locale].read, async execute(input2, { agent, signal }) {
      signal.throwIfAborted();
      return { structuredContent: service.repository.get(agent.id, input2.artifactId, input2.version) };
    } }),
    defineAgentTool({ name: "artifact_list", title: localized(locale, "List artifacts", "\uC544\uD2F0\uD329\uD2B8 \uBAA9\uB85D"), description: localized(locale, "List the artifacts saved in this conversation, one page at a time.", "\uD604\uC7AC \uB300\uD654\uC5D0 \uC800\uC7A5\uB41C \uC544\uD2F0\uD329\uD2B8 \uBAA9\uB85D\uC744 \uD398\uC774\uC9C0\uB85C \uC77D\uC2B5\uB2C8\uB2E4."), input: agentToolInputs[locale].list, async execute(input2, { agent, signal }) {
      signal.throwIfAborted();
      return { structuredContent: service.repository.list(agent.id, input2.cursor, input2.limit) };
    } }),
    defineAgentTool({
      name: "artifact_open",
      title: localized(locale, "Open artifact beside conversation", "\uB300\uD654 \uC606\uC5D0\uC11C \uC544\uD2F0\uD329\uD2B8 \uC5F4\uAE30"),
      input: agentToolInputs[locale].open,
      description: localized(locale, "Open a saved artifact in the right panel of this conversation. Omit the ID to open the latest result. The opened status confirms display. The deferred status means it is waiting until expiresAt, up to five minutes, for the user to return to the conversation. The artifact can open without republishing.", "\uD604\uC7AC \uB300\uD654\uC758 \uAE30\uC874 \uC544\uD2F0\uD329\uD2B8\uB97C \uB300\uD654\uC758 \uC624\uB978\uCABD \uD328\uB110\uC5D0\uC11C \uC5FD\uB2C8\uB2E4. \uB300\uD654\uB97C \uBCF4\uBA74\uC11C \uC544\uD2F0\uD329\uD2B8\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. ID\uB97C \uC0DD\uB7B5\uD558\uBA74 \uCD5C\uC2E0 \uACB0\uACFC\uBB3C\uC744 \uC5FD\uB2C8\uB2E4. opened\uB294 \uD45C\uC2DC \uD655\uC778\uC785\uB2C8\uB2E4. deferred\uB294 \uC544\uC9C1 \uC5F4\uB9AC\uC9C0 \uC54A\uC558\uC73C\uBA70 expiresAt\uAE4C\uC9C0 \uB300\uAE30\uD55C\uB2E4\uB294 \uB73B\uC785\uB2C8\uB2E4. \uC0AC\uC6A9\uC790\uAC00 \uD574\uB2F9 \uB300\uD654\uB85C \uB3CC\uC544\uC624\uBA74 \uCD5C\uB300 5\uBD84 \uC774\uB0B4\uC5D0 \uD45C\uC2DC\uD558\uBA70, \uC7AC\uBC1C\uD589\uD560 \uD544\uC694\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."),
      async execute(input2, { agent, signal }) {
        signal.throwIfAborted();
        const result = await open(agent.id, agent.workspaceId, input2, locale, signal);
        return { structuredContent: result, isError: result.status !== "opened" && result.status !== "deferred" };
      }
    })
  ];
  const removers = [
    server.before("agent.create", ({ request }) => {
      const existing = request.config.systemPrompt ?? "";
      const lines = existing.split(/\r?\n/);
      const marker = lines.indexOf(ARTIFACT_GUIDE_MARKER);
      if (marker >= 0) {
        const locale2 = ["en", "ko"].find((tag) => lines[marker + 1] === getArtifactGuide(tag).split("\n")[1]);
        if (locale2 && request.metadata?.[guideLocaleKey] !== locale2) {
          return { ...request, metadata: { ...request.metadata, [guideLocaleKey]: locale2 } };
        }
        return;
      }
      const locale = service.repository.hostLocale ?? "en";
      return {
        ...request,
        metadata: { ...request.metadata, [guideLocaleKey]: locale },
        config: { ...request.config, systemPrompt: [existing, getArtifactGuide(locale)].filter(Boolean).join("\n\n") }
      };
    }),
    server.before("agent.session_open", ({ request }, { paseo }) => {
      service.placements.invalidate(request.agentId);
      if (request.purpose === "history") return;
      bind(request.agentId, paseo);
      service.repository.requeueFailed(request.agentId);
      if (!["codex", "claude", "claude-code"].includes(request.provider.split("/")[0])) return;
      const saved = request.metadata?.[guideLocaleKey];
      const locale = service.repository.hostLocale ?? (saved === "ko" ? "ko" : "en");
      return { ...request, tools: [...request.tools, ...toolsFor(locale)] };
    }),
    server.on("agent.turn_started", (event2, { paseo }) => {
      bind(event2.agent.id, paseo);
      service.beginTurn(event2.agent.id, event2.turnId ?? null);
    }),
    server.on("agent.turn_ended", async (event2, { paseo }) => {
      bind(event2.agent.id, paseo);
      const token = service.endingToken(event2.agent.id, event2.turnId ?? null);
      try {
        await service.backfill(event2.agent.id, paseo, token, true, event2.turnId ?? null);
      } finally {
        if (token) await service.endTurn(event2.agent.id, token);
        service.placements.invalidate(event2.agent.id);
      }
    })
  ];
  const timer = setInterval(() => {
    void service.flush(fallback);
  }, 1e3);
  timer.unref?.();
  return async () => {
    clearInterval(timer);
    sidebar.close();
    refresh.close();
    removers.forEach((remove) => remove());
    await web.close();
    await service.stop();
  };
}

// index.server.ts
function contribute(server) {
  const home = process.env.PASEO_HOME ? resolve4(process.env.PASEO_HOME) : join(homedir(), ".paseo");
  const configured = process.env.PASEO_ARTIFACT_DATA_DIR;
  if (configured && !isAbsolute(configured)) throw new Error("PASEO_ARTIFACT_DATA_DIR must be an absolute path.");
  const data = configured ?? join(home, "plugin-data", "paseo-artifact-viewer");
  const repository = openRepositorySync(join(data, "artifacts.sqlite"));
  console.info(`Artifact server ready: SQLite, Node ${process.versions.node}, Electron ${process.versions.electron ?? "none"}`);
  try {
    return registerServer(server, new ArtifactService(repository));
  } catch (error) {
    repository.close();
    throw error;
  }
}
export {
  contribute as default
};
/*! Bundled license information:

xmlchars/xml/1.0/ed5.js:
  (**
   * Character classes and associated utilities for the 5th edition of XML 1.0.
   *
   * @author Louis-Dominique Dubeau
   * @license MIT
   * @copyright Louis-Dominique Dubeau
   *)

xmlchars/xml/1.1/ed2.js:
  (**
   * Character classes and associated utilities for the 2nd edition of XML 1.1.
   *
   * @author Louis-Dominique Dubeau
   * @license MIT
   * @copyright Louis-Dominique Dubeau
   *)

xmlchars/xmlns/1.0/ed3.js:
  (**
   * Character class utilities for XML NS 1.0 edition 3.
   *
   * @author Louis-Dominique Dubeau
   * @license MIT
   * @copyright Louis-Dominique Dubeau
   *)
*/
