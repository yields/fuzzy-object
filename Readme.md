
# fuzzy-object

  fuzzy object

## Installation

  Install with [component(1)](http://component.io):

    $ component install yields/fuzzy-object

## API

### FuzzyObject(obj)

  Initialize new `FuzzyObject` with `obj`.

#### get(path)

  Get `path`'s value within object.

    obj = fuzzy({ a: { b: { C: 'c' } }, b: 'b' });
    obj.fns = [lowercase];
    obj.get('a.b.c'); // => 0

#### remove(path)

  Delete `path`'s value within the object.

    obj.remove('a.b.c'); // => true
    obj.get('a.b.c'); // => null

#### rename(names)

  Rename object's keys.

    obj.rename({
      a: 'a.b.c'
    });

    // => { a: 'c', b: 'b' }

## License

  MIT
