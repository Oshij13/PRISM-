const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\n8n\\database.sqlite');

db.all('SELECT * FROM workflow_entity', [], (err, rows) => {
  if (err) {
    console.error('Query error:', err);
    return;
  }
  console.log(`Successfully fetched ${rows.length} rows.`);
  rows.forEach((row, idx) => {
    console.log(`\nRow ${idx + 1}: ID=${row.id}, Name=${row.name}`);
    for (const key in row) {
      const val = row[key];
      if (val && typeof val === 'string' && val.length > 100) {
        console.log(`  ${key}: length=${val.length}, startsWith=${val.substring(0, 50)}...`);
      } else {
        console.log(`  ${key}: ${val}`);
      }
    }
  });
  db.close();
});
