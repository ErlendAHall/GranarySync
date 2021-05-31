/**
 * @typedef Options
 * @type {object}
 * @property {SyncPath[]} syncPath
 * @property {number} backupsPerDay
 */

/**
 * @typedef SyncPath
 * @type {object}
 * @property {string} name
 * @property {string} origin
 * @property {string} destination
 * @property {boolean|undefined} enabled
 */

/**
 * @typedef BackupInstructions
 * @type {object}
 * @property {number|undefined} backupInterval
 * @property {SyncPath[]} backupTargets
 */

/**
 * @typedef SyncHandler
 * @type {object}
 * @property {BackupProcedure[]} backupProcedures
 * @property {SyncPath[]} syncPaths
 * @property {Function()} setup
 * @property {RunAllBackups} runAllBackups
 *
 */

/**
 * @typedef BackupProcedure
 * @type {Function}
 * @param {SyncPath} syncPath
 * @returns {Function[]} backup procedures
 */

/**
 * @typedef RunAllBackups
 * @type {Function}
 * @returns {void}
 */
