import { describe, it, expect, vi } from 'vitest';
import { validateGithubConfig } from '../src/environment';
describe('GitHub Environment Configuration', () => {
    const mockRuntime = {
        getSetting: vi.fn(),
    };
    it('validates correct GitHub configuration', async () => {
        const validConfig = {
            GITHUB_OWNER: 'testowner',
            GITHUB_REPO: 'testrepo',
            GITHUB_BRANCH: 'main',
            GITHUB_PATH: 'src',
            GITHUB_API_TOKEN: 'ghp_test123',
        };
        vi.mocked(mockRuntime.getSetting).mockImplementation((key) => validConfig[key]);
        const config = await validateGithubConfig(mockRuntime);
        expect(config).toEqual(validConfig);
    });
    it('throws error for missing configuration', async () => {
        const invalidConfig = {
            GITHUB_OWNER: '',
            GITHUB_REPO: '',
            GITHUB_BRANCH: '',
            GITHUB_PATH: '',
            GITHUB_API_TOKEN: '',
        };
        vi.mocked(mockRuntime.getSetting).mockImplementation((key) => invalidConfig[key]);
        await expect(validateGithubConfig(mockRuntime)).rejects.toThrow();
    });
    it('throws error for partial configuration', async () => {
        const partialConfig = {
            GITHUB_OWNER: 'testowner',
            GITHUB_REPO: 'testrepo',
            // Missing other required fields
        };
        vi.mocked(mockRuntime.getSetting).mockImplementation((key) => partialConfig[key]);
        await expect(validateGithubConfig(mockRuntime)).rejects.toThrow();
    });
});
