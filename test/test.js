
describe('fuzzy-object', function(){

  var assert = require('assert');
  var fuzzy = require('fuzzy-object');
  var object;
  var obj;

  beforeEach(function(){
    object = {
      a: { b: { c: 'c' } },
      d: { e: { f: 'f' } },
      g: 'g'
    };
  })

  beforeEach(function(){
    obj = fuzzy(object);
  })

  describe('#lookup', function(){
    it('should lookup key and return cache item', function(){
      var item = obj.lookup('a.b.c');
      assert(obj.cache['a.b.c'] == item);
      assert("['a']['b']['c']" == item.path);
      assert('function' == typeof item.get);
      assert('function' == typeof item.remove);
    })

    it('should cache the item', function(){
      var item = obj.lookup('a.b.c');
      assert(item == obj.cache['a.b.c']);
      assert(item == obj.lookup('a.b.c'));
    })

    it('should get the inner value', function(){
      var item = obj.lookup('a.b.c');
      assert('c' == item.get());
    })

    it('should remove the inner value', function(){
      var item = obj.lookup('a.b.c');
      assert(true == item.remove());
    })

    it('should return null if lookup failed', function(){
      assert(null == obj.lookup('baz.foo'));
    })

    it('should not lookup again if the key was not found the first time', function(){
      obj.cache['baz.foo'] = 0;
      obj.lookup('baz.foo');
      assert(0 == obj.cache['baz.foo']);
    })

    it('should not throw on #get, #remove', function(){
      var item = obj.lookup('a.b.c');
      assert(item.remove());
      item.remove();
      item.get();
    })

    it('should use .fns', function(){
      obj.fns = [lower];
      var item = obj.lookup('A.B.C');
      assert('c' == item.get());
    })
  })

  describe('#remove', function(){
    it('should remove a path', function(){
      assert('c' == object.a.b.c);
      obj.remove('a.b.c');
      assert(null == object.a.b.c);
    })

    it('should remove cached item for that path', function(){
      assert(obj.remove('a.b.c'));
      assert(null == obj.cache['a.b.c']);
    })
  })

  describe('#get', function(){
    it('should get path\'s value', function(){
      assert('c' == obj.get('a.b.c'));
    })

    it('should return null if path was not found', function(){
      assert(null == obj.get('baz.foo'));
    })

    it('should return null if path was removed', function(){
      assert('c' == obj.get('a.b.c'));
      assert(obj.remove('a.b.c'));
      assert(null == obj.get('a.b.c'));
    })
  })

  describe('#rename', function(){
    it('should rename keys', function(){
      obj.rename({ a: 'a.b.c', d: 'd.e.f' });
      assert(null == obj.cache['a.b.c']);
      assert(null == obj.cache['d.e.f']);
      assert('c' == obj.obj.a);
      assert('f' == obj.obj.d);
      assert('g' == obj.obj.g);
    })
  })

  function lower(str){
    return str.toLowerCase();
  }
})
