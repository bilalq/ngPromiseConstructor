/**
 * @preserve
 * @license MIT
 */
angular.module('PromiseConstructor', [])
.factory('NgPromise', ['$q', function($q) {

  /**
   * Object with references to all error messages
   *
   * @constant
   */
  var ERROR = {
    badResolver: 'Argument to NgPromise constructor must be a function',
    resolvingSettled: 'Attempting to resolve a promise that is already settled',
    rejectingSettled: 'Attempting to reject a promise that is already settled'
  }

  /**
   * Constructor that takes in a resolver
   *
   * @param {resolverCallback} resolver - Resolver callback
   * @returns {$q Promise}
   */
  function NgPromise(resolver) {
    if (!angular.isFunction(resolver)) {
      throw new Error(ERROR.notFunction)
    }

    var settled = false
      , deferred = $q.defer()

    var resolve = function(val) {
      if (settled) { throw new Error(ERROR.resolvingSettled) }
      deferred.resolve(val)
      settled = true
    }

    var reject = function(val) {
      if (settled) { throw new Error(ERROR.rejectingSettled) }
      deferred.reject(val)
      settled = true
    }

    /**
     * The resolver callback
     *
     * @callback resolverCallback
     * @param {Function} resolve - Function that resolves the promise
     * @param {Function} reject - Function that rejects the promise
     */
    resolver(resolve, reject)

    return deferred.promise
  }

  return NgPromise
}])
