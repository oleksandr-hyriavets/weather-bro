module.exports = {
    apps: [
        {
            name: 'weather-bro',
            script: './dist/main.js',
            env: {
                PORT: process.env.PORT,
                TG_BOT_TOKEN: process.env.TG_BOT_TOKEN,
                CHAT_ID: process.env.CHAT_ID,
                WEATHER_API_KEY: process.env.WEATHER_API_KEY,
            },
        },
    ],
};
