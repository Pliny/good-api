var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/good';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('create table samples(id SERIAL PRIMARY KEY,device_id macaddr not null, sample int not null, created_at timestamp, udpated_at timestamp);')
query.on('end', function() { client.end(); });
