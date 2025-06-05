// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Forneça o caminho para o seu aplicativo Next.js para carregar next.config.js e .env no ambiente de teste
    dir: './',
});

// Adicione quaisquer configurações personalizadas do Jest a serem passadas para o createJestConfig
const customJestConfig = {
    // Adiciona mais setup options antes de cada teste é executado
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Descomente se você criar este arquivo
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest', // Informa ao Jest para usar ts-jest para arquivos .ts e .tsx
    moduleNameMapper: {
        // Lida com mapeamentos de módulo (como aliases configurados em tsconfig.json)
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // Se você estiver usando TypeScript com um baseUrl definido em tsconfig.json, você precisará do seguinte para que o Jest resolva seus módulos corretamente.
    moduleDirectories: ['node_modules', '<rootDir>/'],
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js corretamente
module.exports = createJestConfig(customJestConfig);