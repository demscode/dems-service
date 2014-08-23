/**
 * Authentication routes for client apps.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared authentication routes.
   */
  exports.init = function(app, passport) {

    /**
     * Google login
     */
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), function(req, res) {
    });

    /**
     * Google login callback.
     */
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error'}), function(req, res) {
      res.redirect('/');
    });

    /**
     * Google login.
     */
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

  }; // end init

})(exports);
