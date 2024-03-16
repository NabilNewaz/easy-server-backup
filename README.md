# Easy Server Backup (esb-backup)

If you need a system easy to use that provides you a periodic (or at specific time) backup and upload it into google drive. This is your package.

## Requirements

Right now this package is tested on Ubuntu 20.04 and 22.04 LTS and you need to have the following packages in order to work:

- Node: >= 16 ( [Install Process On Server](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04) )
- Zip: `sudo apt install zip`
- [Mongo Database Tools](https://docs.mongodb.com/database-tools/installation/installation/) (only in case that your backup is from MongoDB)
  - Tested version: `100.9.4`

## How to install

Just `npm i -g easy-server-backup` or use it with `npx easy-server-backup`

## How to use

- First you need to create the config file that `easy-server-backup` will read its instructions (see section below for this).
- You can validate your config file with: `esb-backup validate -f <yourconfigfilepath>`

### One single time

If you want to backup only one time (or to verify that your process works well) just: `esb-backup backup -f <yourconfigfilepath>`

Also, you can use `--dry` to do not notify and upload your backup zip, but you can check that backup file is created where you specify in the config:

### Cron

To create the process you must specify an ID, some examples:

- `esb-backup cron --id example-id -f <yourconfigfilepath>`: create a cron process
- `esb-backup cron --stop --id example-id`: try to stop a cron process with id _example-id_
- `esb-backup cron --list`: list all current cron precesses

## Config

Configuration file is split in 3 main parts:

- **Backup engine**: what kind of data source we will backup
  - `mongo`: backup your database from MongoDB
  - `file`: choose files from your system to backup
- **Notificator**: how do you want to be notified
  - `telegram`: uses a channel and a bot to notify all your backups
  - `console`: just print to console
- **Uploader**: where we put your fresh backup
  - `gcp`: Google Drive Storage
  - `none`: drop it where you specified in _outputDir_ field

### Skeleton

Use following examples (backup engines, notificator, uploader) to make your own config file, here is the skeleton:

```json5
{
   "cron": "* * * * * *", // Cron schedule expression (https://crontab.guru)
   "outputDir": "/tmp", // Temporary folder to store your backup until upload
   "engine": { ... } // Backup engine config,
   "notificator": { ... } // Notificator config,
   "uploader": { ... } // Uploader config
}
```

### Backup engines

#### mongo

```json
{
  "type": "mongo",
  "backupName": "", //Backup file identifier name [Anything you want] 
  "databaseUrl": "mongodb://localhost:27017" // Your MongoDB connection string
}
```

#### file

```json
{
  "type": "file",
  "backupName": "", //Backup file identifier name [Anything you want] 
  "path": "" // Path to drop out the zipped backup
}
```

### Notificator

#### Telegram

```json
{
  "type": "telegram",
  "chatId": "", // ID of the chat where you want to be notified
  "botToken": "" // Token ID (without "bot" prefix in case that have) (https://core.telegram.org/bots)
}
```

Note: You can obtain the chatId from this URL: [https://api.telegram.org/bot<putYourToken>/getUpdates](https://api.telegram.org/bot<putYourToken>/getUpdates). Substitute `<putYourToken>` with your bot token

#### Console

```json
{
  "type": "console"
}
```

### Uploader

#### Google Drive Storage [ Getting Storage Key JSON Process : [Click Here](https://protocoderspoint.com/nodejs-script-to-upload-file-to-google-drive-using-googleapis/) Step 1 - 4 ]

```json
{
  "type": "gcp",
  "storageKeyPath": "", // JSON Key file that authenticate your program on GCP
  "backupsFoldersId": [
    "example-folder-id-1",
    "example-folder-id-2"
  ] // Id of the folder to put the backup. [Noted That - Those folder must have editor permission with your Service Account Email]
}
```
