class ConfigService {
    get(key: string): string {
        const result = process.env[key];

        if (!result) {
            throw new Error(`Can not find ${key} in config`)
        }

        return result;
    }
}

const configService = new ConfigService();
export { configService as ConfigService };