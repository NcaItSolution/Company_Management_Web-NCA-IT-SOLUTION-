const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGOURL);
    console.log('✅ Connected to MongoDB successfully');
    
    const db = mongoose.connection.db;
    const lecturesCollection = db.collection('lectures');
    
    // Check current indexes
    console.log('🔍 Checking current indexes...');
    const indexes = await lecturesCollection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the problematic lectureId_1 index if it exists
    try {
      await lecturesCollection.dropIndex('lectureId_1');
      console.log('✅ Successfully dropped problematic lectureId_1 index');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('ℹ️  lectureId_1 index not found (already removed or never existed)');
      } else {
        console.log('⚠️  Error dropping index:', err.message);
      }
    }
    
    // Also check for any documents with null lectureId and clean them up
    console.log('🧹 Cleaning up any problematic documents...');
    const problematicDocs = await lecturesCollection.find({ lectureId: null }).toArray();
    if (problematicDocs.length > 0) {
      console.log(`Found ${problematicDocs.length} documents with null lectureId`);
      await lecturesCollection.deleteMany({ lectureId: null });
      console.log('✅ Cleaned up problematic documents');
    } else {
      console.log('ℹ️  No problematic documents found');
    }
    
    // List final indexes
    const finalIndexes = await lecturesCollection.indexes();
    console.log('Final indexes:', finalIndexes.map(idx => idx.name));
    
    console.log('✅ Database cleanup completed successfully!');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting database cleanup...');
fixDatabase();
