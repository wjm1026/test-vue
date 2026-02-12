# ai-testgent

AI 测试生成 MVP CLI（本地/CI 通用）。

## 功能

- 根据 PR diff 或本地 git diff 收集上下文
- 先生成 Test Plan，再生成测试代码
- 仅允许写入 `tests/` 和 `__tests__/`
- 运行覆盖率命令并在失败时尝试自动修复（最多 2 次）
- 输出报告到 `output/ai-testgent-report.json` 和 `output/ai-testgent-report.md`

## 使用

```bash
yarn ai-testgent --pr 123
```

本地开发可用：

```bash
yarn ai-testgent --base origin/main --dry-run
yarn ai-testgent --base origin/main --skip-tests
```

## 环境变量

- `GITHUB_TOKEN`：可选；用于读取 PR 文件与回写评论
- `GITHUB_REPOSITORY`：可选；格式 `owner/repo`
- `LLM_API_KEY`：可选；缺失时自动使用启发式生成
- `LLM_BASE_URL`：可选；默认 `https://api.openai.com/v1`
- `LLM_MODEL`：可选；默认 `gpt-4o-mini`
- `LLM_TIMEOUT_MS`：可选；默认 `60000`
