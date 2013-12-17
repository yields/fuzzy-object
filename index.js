
/**
 * Dependencies
 */

var lookup = require('path-lookup');
var bind = require('bind');

/**
 * Export `FuzzyObject`
 */

module.exports = FuzzyObject;

/**
 * Initialize FuzzyObject with `obj`.
 *
 * @param {Object} obj
 * @api public
 */

function FuzzyObject(obj){
  if (!(this instanceof FuzzyObject)) return new FuzzyObject(obj);
  if (!obj) throw new TypeError('expected an object');
  this.cache = {};
  this.obj = obj;
  this.fns = [];
}

/**
 * Get `key`.
 *
 * @param {String} key
 * @return {FuzzyObject}
 * @api public
 */

FuzzyObject.prototype.get = function(key){
  var item = this.lookup(key);
  if (item) return item.get();
};

/**
 * Remove `key`.
 *
 * @param {String} key
 * @return {FuzzyObject}
 * @api public
 */

FuzzyObject.prototype.remove = function(key){
  var item = this.lookup(key);
  if (!item) return;
  this.cache[key] = null;
  return item.remove();
};

/**
 * Rename.
 *
 * @param {Object} names
 * @return {Object}
 * @api public
 */

FuzzyObject.prototype.rename = function(names){
  for (var name in names) {
    var value = this.get(names[name]);
    if (null == value) continue;
    this.obj[name] = value;
    this.remove(names[name]);
  }
  return this;
};

/**
 * Lookup `key`.
 *
 * @param {String} key
 * @return {Object}
 * @api private
 */

FuzzyObject.prototype.lookup = function(key){
  var item = this.cache[key];
  if (item) return item;
  if (this.cache.hasOwnProperty(key)) return;
  var path = lookup(this.obj, key, this.fns);
  return this.cache[key] = cacheItem(path, this.obj);
};

/**
 * Create cache item with `path` and `obj`.
 *
 * @param {String} path
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function cacheItem(path, obj){
  if (!path) return;
  var ret = {};
  ret.remove = bind(obj, Function('try { return delete this' + path + '; } catch (e){}'));
  ret.get = bind(obj, Function('try { return this' + path + '; } catch (e){}'));
  ret.path = path;
  return ret;
}
