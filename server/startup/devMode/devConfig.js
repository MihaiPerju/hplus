// * Please fill out this file and save it as config.js to run the app
// *
// * If you do not create a config.js file and run dev script it will default to the dev settings.
// * =============================================================================================

/**
 * Express / NodeJS app settings
 */
exports.appSettings = {
    port: 3050
};

/**
 * Active Directory server settings for authentication
 */
exports.adServer = {
    url: 'ldap://192.168.1.1',
    base: 'dc=domain,dc=local',
    searchOptions: { // Optional
        scope: 'sub'
    },
    idleTimeout: 3000, // Optional
    tlsOptions: { // Optional
        rejectUnauthorized: false 
    }
};

/**
 * MongoDB connection settings
 */
exports.databaseSettings = {
    mongoURI: 'mongodb+srv://arcc-testing-bxsso.mongodb.net/arcc',
    databaseName: 'arcc',
    options: { // Optional
        useNewUrlParser: true,
        ssl: true,
        checkServerIdentity: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 360000,
        authSource: 'admin',
        auth: {
            user: 'arccTester',
            password: 'sZ5zViNL1jJBBD7v'
        }
    }
};

/**
 * This account is used to search for lsit of suers / groups on interval.
 * If this account isn't provided app will only be able to auth users and
 * will not show users who have not logged in before.
 * 
 * ! If you do not want to provide a service account DELETE the entire export below.
 */
exports.adServiceAccount = {
    username: 'user@local', // UPN
    password: 'password',
    searchBas: 'OU=Users,DC=domain,DC=local', // Where to look for accounts when pulling all users from AD
    freqMs: 43200000 // How frequently to sync all accounts with AD
};

/**
 * Settings for the mail server to send emails to.
 */
exports.transporterSettings = { // SMTP (email) settings
    host: 'server.domain.com',
    port: 25,
    secure: false, // true for 465, false for other ports
    ignoreTLS: true,
    auth: {
        user: 'user',
        pass: 'pass'
    }
}