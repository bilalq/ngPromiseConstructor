describe('NgPromise', function() {

  var NgPromise, $rootScope
  var happyPath, sadPath, fail

  beforeEach(module('PromiseConstructor'))

  beforeEach(inject(function(_NgPromise_, _$rootScope_) {
    NgPromise = _NgPromise_
    $rootScope = _$rootScope_
  }))

  describe('interface', function() {
    it('requires a function as an argument', function() {
      var badArgs = [
        ['an', 'array'],
        { an: 'object' },
        'some string',
        42,
        null,
        undefined
      ]

      var goodArgs = [
        (function(){}),
        (function(x){ return x })
      ]

      badArgs.forEach(function(arg) {
        var invocation = function() { new NgPromise(arg) }
        expect(invocation).toThrow()
      })

      goodArgs.forEach(function(arg) {
        var invocation = function() { new NgPromise(arg) }
        expect(invocation).not.toThrow()
      })
    })

    it('has static functions for resolving/rejecting', function() {
      expect(typeof NgPromise.resolve).toBe('function')
      expect(typeof NgPromise.reject).toBe('function')
    })
  })

  describe('functionality', function() {
    beforeEach(function() {
      happyPath = jasmine.createSpy('happy path')
      sadPath = jasmine.createSpy('sad path')
      fail = function() { throw new Error() }
    })

    afterEach(function() {
      $rootScope.$digest()
      expect(happyPath).toHaveBeenCalled()
      expect(sadPath).not.toHaveBeenCalled()
    })

    it('works as a factory function', function() {
      var promise = NgPromise(function(resolve, reject) {
        resolve('foo')
      })
      promise.then(function(res) {
        happyPath()
        expect(res).toBe('foo')
      }, sadPath)
    })

    it('works as a constructor function', function() {
      var promise = new NgPromise(function(resolve, reject) {
        resolve('bar')
      })
      promise.then(function(res) {
        happyPath()
        expect(res).toBe('bar')
      }, sadPath)
    })
  })

  describe('when already settled', function() {
    afterEach(function() {
      $rootScope.$digest()
    })

    it('throws when resolving', function() {
      expect(NgPromise.bind(this, function(resolve, reject) {
        resolve('bar')
        resolve('bar')
      })).toThrow()

      expect(NgPromise.bind(this, function(resolve, reject) {
        reject('bar')
        resolve('bar')
      })).toThrow()
    })

    it('throws when rejecting', function() {
      expect(NgPromise.bind(this, function(resolve, reject) {
        resolve('bar')
        reject('bar')
      })).toThrow()

      expect(NgPromise.bind(this, function(resolve, reject) {
        reject('bar')
        reject('bar')
      })).toThrow()
    })

    describe('static resolve method', function() {
      it('returns a resolved promise', function() {
        var promise = NgPromise.resolve('foo')
        promise.then(happyPath, sadPath)
        promise.then(function(res) {
          expect(res).toBe('foo')
        })
        $rootScope.$digest();
      })
    })

    describe('static reject method', function() {
      it('returns a rejected promise', function() {
        var promise = NgPromise.reject('foo')
        promise.then(sadPath, happyPath)
        promise.catch(function(err) {
          expect(err).toBe('foo')
        })
        $rootScope.$digest();
      })
    })

  })

})
