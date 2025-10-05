# Vercel 部署故障排除指南

## 🚨 如果仍然遇到 404 错误，请按以下步骤操作：

### 1. 检查 Vercel 项目设置

1. **访问 Vercel 控制台**: https://vercel.com/dashboard
2. **找到您的 sayola 项目**
3. **检查项目设置**:
   - Framework Preset: 应该是 "Next.js"
   - Build Command: `npm run build`
   - Output Directory: 留空（Next.js 自动处理）
   - Install Command: `npm install`

### 2. 强制重新部署

1. **在 Vercel 项目页面**，点击 "Deployments" 标签
2. **找到最新的部署**，点击右侧的三个点菜单
3. **选择 "Redeploy"**
4. **等待部署完成**

### 3. 检查部署日志

1. **点击最新的部署**
2. **查看 "Build Logs"**
3. **确认没有错误信息**
4. **检查 "Function Logs"**（如果有的话）

### 4. 验证域名配置

1. **在项目设置中检查 "Domains" 标签**
2. **确认域名配置正确**
3. **如果使用自定义域名，检查 DNS 设置**

### 5. 清除缓存

1. **在浏览器中按 Ctrl+Shift+R (或 Cmd+Shift+R) 强制刷新**
2. **或者使用无痕模式访问**

### 6. 检查环境变量（如果需要）

虽然应用可以在没有环境变量的情况下运行，但如果您配置了 Google Cloud TTS API：

1. **在 Vercel 项目设置中点击 "Environment Variables"**
2. **添加以下变量**（如果需要）:
   ```
   NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY=your_api_key_here
   ```
3. **重新部署项目**

### 7. 联系支持

如果以上步骤都无法解决问题：

1. **检查 Vercel 状态页面**: https://www.vercel-status.com/
2. **查看 Vercel 文档**: https://vercel.com/docs
3. **联系 Vercel 支持**: https://vercel.com/help

## 🔧 最近的修复

我们已经进行了以下优化：

- ✅ 移除了平台特定的依赖 `@next/swc-darwin-arm64`
- ✅ 修复了所有 ESLint 警告
- ✅ 优化了 Next.js 配置文件
- ✅ 确保了正确的项目结构

## 📊 预期结果

部署成功后，您应该能够访问：

- **首页**: `/` - Sayola 主页
- **搜索页**: `/search` - 葡萄牙语词典搜索
- **对比页**: `/compare` - 单词对比工具
- **每日学习**: `/daily` - 每日葡萄牙语内容
- **个人资料**: `/profile` - 用户设置和统计

## 🚀 部署状态检查

您可以通过以下方式检查部署状态：

1. **Vercel 控制台**: 查看部署历史和日志
2. **GitHub Actions**（如果配置了）: 检查 CI/CD 状态
3. **浏览器开发者工具**: 检查网络请求和控制台错误

如果问题持续存在，请提供具体的错误信息或截图以便进一步诊断。