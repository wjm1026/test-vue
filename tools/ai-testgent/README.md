# ai-testgent

AI 测试生成 MVP CLI（本地/CI 通用）。

## 功能

- 根据 PR diff 或本地 git diff 收集上下文
- 优先运行测试（覆盖率命令），若失败先记录失败用例，不立即修复
- 检测“新增源码文件”（新页面/新路由/新功能等新增文件）并为其生成对应单测文件
- 若测试失败，再对失败的测试文件进行自动修复（默认最多 3 次；超过则 workflow 失败）
- 仅允许写入 `src/__tests__/`
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
