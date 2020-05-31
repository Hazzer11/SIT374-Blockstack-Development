const { getDB } = require('radiks-server');

const mongo = await getDB(MONGODB_URL);
const express = require('express');

const { setup } = require('radiks-server');

const app = express();

setup().then(RadiksController => {
  app.use('/radiks', RadiksController);
});
setup({
  mongoDBUrl: 'mongodb://localhost:27017/my-custom-database',
}).then(RadiksController => {
  app.use('/radiks', RadiksController);
});
// Script for transfering users from Firebase to Radiks-server

const { getDB } = require('radiks-server');
const { mongoURI } = require('......'); // How you import/require your mongoURI is up to you

const migrate = async () => {
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
      blockstackId: '1N1DzKgizU4rCEaxAU21EgMaHGB5hprcBM',
      username: 'kkomaz.id',
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
};

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
const value = { email: 'myemail@example.com' };
await Central.save(key, value);

const result = await Central.get(key);
console.log(result); // { email: 'myemail@example.com' }
