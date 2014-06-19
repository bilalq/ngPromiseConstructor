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
  })

})
