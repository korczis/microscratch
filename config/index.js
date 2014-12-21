var config = { };

// should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:3000/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '778608158855551',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '03fa4c0d237ceb18908a6e6226d7a1dd',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'lethe_it',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;