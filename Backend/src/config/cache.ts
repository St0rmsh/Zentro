import { Redis } from 'ioredis'
import config from "./config.js";


const redisClient = new Redis({
    host: config.REDIS_HOST,
    password: config.REDIS_PASSWORD,
    port: Number(config.REDIS_PORT)
})

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.log("Error connecting to redis",err);
});

export default redisClient