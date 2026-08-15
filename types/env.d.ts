declare namespace NodeJS {
    interface ProcessEnv {
        ADMIN_USERNAME: string;
        ADMIN_PASSWORD: string;
        NODE_ENV: 'development' | 'production' | 'test';
    }
}