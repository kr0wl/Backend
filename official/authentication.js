stategy => {
      return server.auth.strategy('session', 'cookie', {
                  password: 'areallygoodasspassword',
                  redirectTo: '/'
            });
} ;


module.exports = stategy