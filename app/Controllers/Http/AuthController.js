'use strict'
const {save_or_update_tweep} = use('App/Common/helpers')
const User = use('App/Models/User')

class AuthController {
  async redirect({ally, response}) {
    try {
      await ally.driver('twitter').redirect()
    } catch (e) {
      response.status(500).send({'error': 'Failed to initialize login'});
    }
  }

  async callback({ally, auth, response}) {

    try {
      const fbUser = await ally.driver('twitter').getUser()

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        password: fbUser.getAccessToken(),
        name: fbUser.getNickname(),
        username: fbUser.getName(),
      };

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      };

      const user = await User.findOrCreate(whereClause, userDetails);
      let token = await auth.withRefreshToken().generate(user);

      response.send(token)
    } catch (e) {
      //we want to return user to the frontend app no matter the failure
      console.error("callback error", e);

      response.status(400).send({'error':'Unable to login'});
    }
  }

  async logout({auth, response}) {
    const apiToken = auth.getAuthHeader();
    await auth
      .revokeTokens([apiToken])
    return response.status(204).send({});
  }
}

module.exports = AuthController
