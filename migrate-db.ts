import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, initializeFirestore } from 'firebase/firestore';
import * as fs from 'fs';

const sourceConfig = {
  projectId: "gen-lang-client-0881361544",
  appId: "1:1088577734475:web:3ff363c989a4f592280ace",
  apiKey: "AIzaSyA_pq3tPY-jX1ajoPCUDpeTTBy-OO9tVvM",
  authDomain: "gen-lang-client-0881361544.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-7c7ba50b-9fc5-4db9-932f-09c0d4bd9ea3",
  storageBucket: "gen-lang-client-0881361544.firebasestorage.app",
  messagingSenderId: "1088577734475",
  measurementId: ""
};

const destConfig = {
  apiKey: "AIzaSyAqomDMv6xfawkj5FEWkqMZP_7YTYvYOBE",
  authDomain: "portofolio-2813.firebaseapp.com",
  projectId: "portofolio-2813",
  storageBucket: "portofolio-2813.firebasestorage.app",
  messagingSenderId: "626730744237",
  appId: "1:626730744237:web:b31466cc8258a2c8254924",
  measurementId: "G-WHC6KDCWN3"
};

const sourceApp = initializeApp(sourceConfig, "sourceApp");
const sourceDb = initializeFirestore(sourceApp, { experimentalForceLongPolling: true }, sourceConfig.firestoreDatabaseId);

const destApp = initializeApp(destConfig, "destApp");
const destDb = initializeFirestore(destApp, { experimentalForceLongPolling: true });

function log(msg: string) {
  console.log(msg);
  fs.appendFileSync('migration.log', msg + '\n');
}

async function migrateCollection(collectionName: string) {
  log(`Migrating collection: ${collectionName}`);
  try {
    const querySnapshot = await getDocs(collection(sourceDb, collectionName));
    log(`Found ${querySnapshot.size} documents in ${collectionName}`);
    
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      log(`Attempting to migrate doc: ${docSnap.id}...`);
      await setDoc(doc(destDb, collectionName, docSnap.id), data);
      log(`Migrated doc: ${docSnap.id} in ${collectionName}`);
    }
  } catch (error: any) {
    log(`Error migrating ${collectionName}: ${error.message}`);
  }
}

async function runMigration() {
  fs.writeFileSync('migration.log', 'Starting migration...\n');
  await migrateCollection("products");
  await migrateCollection("users");
  await migrateCollection("admin_users");
  log("Migration complete!");
  process.exit(0);
}

runMigration().catch(err => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});

