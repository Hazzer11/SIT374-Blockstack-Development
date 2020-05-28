const express = require('express');

const { setup } = require('radiks-server');
  
const app = express();
  
setup().then(RadiksController => {
app.use('/radiks', RadiksController);
});

const { getDB } = require('radiks-server');
const { mongoURI } = require('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]'); // How you import/require your mongoURI is up to you

//mongodb:// is a required prefix to identify that this is a string in the standard connection format.
//username:password@ are optional. If given, the driver will attempt to login to a database after connecting to a database server.
//host1 is the only required part of the URI. It identifies a server address to connect to.
//:portX is optional and defaults to :27017 if not provided.
// /database is the name of the database to login to and thus is only relevant if the username:password@ syntax is used. If not specified the "admin" database will be used by default.
//?options are connection options. Note that if database is absent there is still a / required between the last host and the ? introducing the options. 
//Options are name=value pairs and the pairs are separated by "&". For backwards compatibility, ";" is accepted as a separator in addition to "&", 
//but should be considered as deprecated.

//const migrate = async () => {
  // `mongo` is a reference to the MongoDB collection that radiks-server uses.
  // You can add or edit or update data as necessary.
  const mongo = await getDB(mongoURI);

  /**
   * Call code to get your users from firebase
   * const users = await getUsersFromFirebase();
   * OR grab the Firebase JSON file and set users to that value
   * How you saved your user data will probably be different than the example below
   */

  const users = {
    '-LV1HAQToANRvhysSClr': {
      blockstackId: '133TFrsd4JcJMytuBBirnuEUEpPUpanE45',
      username: 'nahbee118.id.blockstack',
    },
  };

  const usersToInsert = Object.values(users).map(user => {
    const { username } = user;
    const doc = {
      username,
      _id: username,
      radiksType: 'BlockstackUser',
    };
    const op = {
      updateOne: {
        filter: {
          _id: username,
        },
        update: {
          $setOnInsert: doc,
        },
        upsert: true,
      },
    };
    return op;
  });

  await mongo.bulkWrite(usersToInsert);

migrate()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch(error => {
    console.error(error);
    process.exit();
  });

const app = express()
expressWS(app)
import Task from './models/task';

const streamCallback = (task) => {
  // this callback will be called whenever a task is created or updated.
  // `task` is an instance of `Task`, and all methods are defined on it.
  // If the user has the necessary keys to decrypt encrypted fields on the model,
  // the model will be decrypted before the callback is invoked.

  if (task.projectId === myAppsCurrentProjectPageId) {
    // update your view here with this task
  }
}

Task.addStreamListener(streamCallback)

// later on, you might want to remove the stream listener (if the
// user changes pages, for example). When calling `removeStreamListener`,
// you MUST provide the exact same callback that you used with `addStreamListener`.

Task.removeStreamListener(streamCallback)

import { Central } from 'radiks';

const key = 'UserSettings';
const value = { email: 'nahbee118@gmail.com' };
await Central.save(key, value);

const result = await Central.get(key);
console.log(result); // { email: 'myemail@example.com' }