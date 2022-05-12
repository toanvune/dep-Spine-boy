window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  Bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1820rYgapMxJNvimoEpHqc", "Bullet");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.oneShoot = this.onCollisionEnter.bind(this);
        emitter.instance.registerEvent("ONE_SHOOT", this.oneShoot);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
      },
      onCollisionEnter: function onCollisionEnter(selfCollider, otherCollider) {
        emitter.instance.emit("CREEP_DEATH");
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  DoAction: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71083IT/8BIp7faS13Sm3QP", "DoAction");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        spineBoy: sp.Skeleton,
        bulletPrefab: cc.Prefab,
        parent: cc.Canvas,
        _listBullet: [],
        isPlaying: true
      },
      onLoad: function onLoad() {
        this.right = this.moveRight.bind(this);
        this.left = this.moveLeft.bind(this);
        this.up = this.jumpOn.bind(this);
        this.keyup_leftAndRight = this.onKeyUpLeftAndRight.bind(this);
        this.keyup_UP = this.onKeyUpUP.bind(this);
        this.shoot = this.createBullet.bind(this);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
        emitter.instance.registerEvent("KEYDOWN_LEFT", this.left, this);
        emitter.instance.registerEvent("KEYDOWN_RIGHT", this.right, this);
        emitter.instance.registerEvent("KEYDOWN_UP", this.up, this);
        emitter.instance.registerEvent("KEYUP", this.keyup_leftAndRight, this);
        emitter.instance.registerEvent("KEYUP", this.keyup_leftAndRight, this);
        emitter.instance.registerEvent("KEYUP_UP", this.keyup_UP, this);
        emitter.instance.registerEvent("SPACE", this.shoot, this);
      },
      doDeath: function doDeath(character) {
        character.setCompleteListener(function(event) {
          character.clearTracks();
          character.setAnimation(0, "death", false);
        });
      },
      onCollisionEnter: function onCollisionEnter(spineBoy, otherCollider) {
        this.doDeath(this.spineBoy);
        emitter.instance.removeEvent("KEYDOWN_LEFT", this.left);
        emitter.instance.removeEvent("KEYDOWN_RIGHT", this.right);
        emitter.instance.removeEvent("KEYDOWN_UP", this.up);
        emitter.instance.removeEvent("KEYUP", this.keyup_leftAndRight);
        emitter.instance.removeEvent("KEYUP", this.keyup_leftAndRight);
        emitter.instance.removeEvent("KEYUP_UP", this.keyup_UP);
        emitter.instance.removeEvent("SPACE", this.shoot);
      },
      createBullet: function createBullet(data) {
        this.spineBoy.setAnimation(0, "shoot", false);
        var bullet = this.bulletPrefab;
        var item = cc.instantiate(bullet);
        item.active = true;
        item.parent = this.node.parent;
        if (this.spineBoy.node.scaleX > 0) {
          item.x = this.spineBoy.node.x + 50;
          item.y = this.spineBoy.node.y + 100;
          var moveBullet = cc.sequence(cc.moveBy(1, cc.v2(500, 0)), cc.delayTime(.1));
          this.bulletAction = item.runAction(cc.sequence(moveBullet, cc.callFunc(function() {
            emitter.instance.emit("ONE_SHOOT");
            item.destroy();
          })));
        } else {
          item.x = this.spineBoy.node.x - 50;
          item.y = this.spineBoy.node.y + 100;
          var _moveBullet = cc.sequence(cc.moveBy(1, cc.v2(-500, 0)), cc.delayTime(.1));
          this.bulletAction = item.runAction(cc.sequence(_moveBullet, cc.callFunc(function() {
            emitter.instance.emit("ONE_SHOOT");
            item.destroy();
          })));
        }
      },
      onKeyUpLeftAndRight: function onKeyUpLeftAndRight(data) {
        this.defaulAnim();
      },
      onKeyUpUP: function onKeyUpUP() {
        var _this = this;
        this.spineBoy.setCompleteListener(function() {
          _this.defaulAnim();
        });
      },
      defaulAnim: function defaulAnim() {
        this.spineBoy.setAnimation(0, "idle", true);
        this.node.stopAction();
        this.isPlaying = true;
      },
      moveRight: function moveRight(data) {
        this.spineBoy.node.scaleX < 0 && this.spineBoy.node.runAction(cc.flipX(false));
        if (this.isPlaying) {
          this.isPlaying = false;
          this.spineBoy.setAnimation(0, "run", true);
        }
        this.spineBoy.node.runAction(cc.moveBy(.1, cc.v2(20, 0)));
      },
      moveLeft: function moveLeft(data) {
        this.spineBoy.node.scaleX > 0 && this.spineBoy.node.runAction(cc.flipX(true));
        if (this.isPlaying) {
          this.isPlaying = false;
          this.spineBoy.setAnimation(0, "run", true);
        }
        this.spineBoy.node.runAction(cc.moveBy(.1, cc.v2(-20, 0)));
      },
      jumpOn: function jumpOn(data) {
        var action = void 0;
        action = this.spineBoy.node.scaleX > 0 ? cc.jumpBy(.5, cc.v2(40, 0), 200) : cc.jumpBy(.5, cc.v2(-40, 0), 200);
        if (this.isPlaying) {
          this.isPlaying = false;
          this.spineBoy.setAnimation(0, "jump", true);
        }
        this.spineBoy.node.runAction(action);
      },
      start: function start() {
        var _this2 = this;
        this.spineBoy.setCompleteListener(function() {
          _this2.defaulAnim();
        });
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  DoAnim: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4690Gjlv1ACaDGp/FNqyli", "DoAnim");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      onKeyDown: function onKeyDown(data) {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  GamePlay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36daduPsk9OhZW26P+mP425", "GamePlay");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        spineBoy: sp.Skeleton,
        creep1: sp.Skeleton,
        creep2: sp.Skeleton,
        door: cc.Sprite,
        btnPlay: cc.Button,
        flag: false
      },
      onLoad: function onLoad() {
        emitter.instance = new emitter();
        this.btnPlay.node.on("click", this.onPlay, this);
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        this.death = this.creepDeath.bind(this);
        emitter.instance.registerEvent("CREEP_DEATH", this.death);
        this.spineBoy.node.active = false;
        this.creep1.node.active = false;
        this.creep2.node.active = false;
        this.door.node.active = false;
      },
      creepDeath: function creepDeath() {
        var _this = this;
        this.creep2.setAnimation(0, "death", false);
        this.creep2.node.runAction(cc.fadeOut(1));
        setTimeout(function() {
          _this.creep2.node.active = false;
        }, 1e3);
      },
      onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.space:
          emitter.instance.emit("KEYUP", this.flag);
          break;

         case cc.macro.KEY.left:
          this.flag = true;
          emitter.instance.emit("KEYUP", this.flag);
          break;

         case cc.macro.KEY.up:
          this.flag = true;
          emitter.instance.emit("KEYUP_UP", this.flag);
          break;

         case cc.macro.KEY.right:
          this.flag = true;
          emitter.instance.emit("KEYUP", this.flag);
        }
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.left:
          if (this.spineBoy.node.x < 0) break;
          this.flag = false;
          emitter.instance.emit("KEYDOWN_LEFT", this.flag);
          break;

         case cc.macro.KEY.up:
          if (this.spineBoy.node.y > 0) break;
          this.flag = false;
          emitter.instance.emit("KEYDOWN_UP", this.flag);
          break;

         case cc.macro.KEY.right:
          if (this.spineBoy.node.x > 740) break;
          this.flag = false;
          emitter.instance.emit("KEYDOWN_RIGHT", this.flag);
          break;

         case cc.macro.KEY.space:
          emitter.instance.emit("SPACE", this);
        }
      },
      onPlay: function onPlay() {
        var _this2 = this;
        this.spineBoy.node.active = true;
        this.creep2.node.active = true;
        this.door.node.active = true;
        this.btnPlay.node.active = false;
        this.spineBoy.setAnimation(0, "portal", false);
        this.spineBoy.setCompleteListener(function() {
          _this2.flag = true;
          _this2.spineBoy.setAnimation(0, "idle", true);
        });
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  btnPlay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a339P7TlxLWLPbOsCImZ88", "btnPlay");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "49a18Xm78BP1YoFcFjADCFe", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener, target) {
          this._emiter.on(event, listener, target);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ]
}, {}, [ "Bullet", "DoAction", "DoAnim", "GamePlay", "btnPlay", "mEmitter" ]);