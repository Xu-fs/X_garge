# CloudBase 用户图片功能部署与测试

## 功能落点

添加车辆页和编辑车辆页使用同一个云端图片组件；“我的主页”增加了“我的云端照片”列表。车辆页按车辆 ID 展示图片，个人主页展示当前微信用户的全部云端图片。账号总上限为 4 张。

前端不会上传或信任 openid。userImages 云函数从 cloud.getWXContext() 获取可信 OPENID，生成 user-images/{openid}/{timestamp}-{random}.{ext} 路径，并负责数据库写入、数量复核、路径核验和所有权校验。

## 云数据库

集合名称：user_images

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | String | 云数据库记录 ID |
| _openid | String | 云函数写入的记录所有者 OpenID |
| openid | String | 可信微信上下文中的 OpenID |
| fileID | String | 云存储上传成功后返回的 fileID |
| cloudPath | String | 用户分类后的云存储路径 |
| uploadedAt | Date | 完成上传时的服务端时间 |
| createdAt | Date | 创建上传占位记录时的服务端时间 |
| scopeId | String | 车辆 ID；空字符串表示未绑定车辆 |
| slot | Number | 账号内 0-3 的原子占位槽，用于防止多设备并发超过 4 张 |
| status | String | uploading 或 ready |
| safetyStatus | String | private、checking 或 passed |

数据库规则使用 cloudbase/database.rules.json：客户端完全禁止直接读写，所有操作均经过云函数。云函数服务端访问不受客户端规则限制。

本实现只对 openid + status 做等值查询，并在云函数内对最多 4 条记录排序，通常不需要额外联合索引。

## 云存储权限

将 cloudbase/storage.rules.json 的内容粘贴到云开发控制台“云存储 → 权限设置 → 自定义安全规则”。规则只允许文件创建者读取和写入自己的文件；云函数以管理端身份执行最终校验与删除。

不要设置成“所有用户可读”。当前车库照片是私有数据。

## 微信开发者工具部署

1. 打开项目，确认右上角 CloudBase 环境为 cloud1-7gqhwo2q6f73408d；如使用其他环境，同步修改 miniprogram/app.js 和 miniprogram/envList.js。
2. 点击工具栏“云开发”，在数据库中创建集合 user_images。
3. 为集合设置“仅管理端可读写”，或粘贴本项目数据库规则。
4. 在云存储权限设置中粘贴本项目存储规则。
5. 在左侧 cloudfunctions/userImages 上右键，选择“上传并部署：云端安装依赖”。不要只上传代码，否则 wx-server-sdk 依赖可能缺失。
6. 等待部署成功，在云函数详情确认已获得 security.imgSecCheck 云调用权限。
7. 重新编译小程序，并使用真机预览测试相机、相册和跨设备持久化。

quickstartFunctions 不需要改动或重新部署；新增图片能力由独立的 userImages 云函数承担。

## 图片内容安全

当前图片只在本人车库和本人主页显示，所以 cloudfunctions/userImages/index.js 中 PUBLIC_DISPLAY_ENABLED 默认为 false，记录写入 safetyStatus: private。

如果未来把照片公开展示：

1. 把 PUBLIC_DISPLAY_ENABLED 改为 true。
2. 保留 config.json 中的 security.imgSecCheck 权限并重新部署云函数。
3. 公开查询只能返回 status == ready 且 safetyStatus == passed 的记录。
4. 不要在审核完成前返回公开 URL；本实现审核不通过或审核接口异常都会删除云文件及占位记录，按失败关闭。

## 完整测试方法

### 正常流程

1. 清空测试账号在 user_images 的旧记录和对应测试文件。
2. 在“添加车辆”选择 2 张相册图片，确认选择后立刻出现预览。
3. 再用相机拍 1 张，确认可同时支持相册和相机。
4. 观察“正在压缩”“上传中 xx%”和“已上传 3/4 张”。
5. 在数据库核对三条记录的 openid、fileID、cloudPath、uploadedAt；在云存储核对路径归入当前 OpenID 目录。
6. 保存车辆，进入详情页，点击图片确认可全屏预览。
7. 清理微信缓存或换另一台手机，用同一微信账号打开“我的主页”，确认三张图片能由数据库重新读取并显示。

### 上限与防重复

1. 上传第 4 张后继续点添加，必须提示“每位用户最多上传4张照片”。
2. 上传过程中连续快速点击添加按钮，确认不会重复弹出选择器或重复上传。
3. 同时打开两个客户端尝试越过限制；即使前端数量过期，云函数也必须拒绝超过 4 张的请求。

### 压缩、进度与部分失败

1. 选择一张大于 2MB 的 JPG，上传后在调试器或云存储查看文件大小；组件会按 80/60/40 质量逐级压缩，尽量压到 2MB 内。
2. 同时选择多张，上传中临时断网；已成功图片应保留，失败图片应显示红色失败层和具体错误。
3. 恢复网络后点击失败图片，确认可单张重试，不会重复上传已成功图片。

### 删除与越权

1. 删除一张图片，确认云存储文件与 user_images 记录都消失，数量同步减少。
2. 用账号 A 记下记录 ID，再用账号 B 篡改请求调用 delete；必须返回“只能删除自己上传的图片”，且 A 的文件和记录仍存在。
3. 用账号 B 尝试读取账号 A 的 fileID；在私有云存储规则下应被拒绝。

### 内容安全（仅公开展示时）

1. 启用 PUBLIC_DISPLAY_ENABLED 并部署。
2. 上传正常测试图，确认 safetyStatus 为 passed。
3. 使用微信官方提供的违规测试素材验证审核失败分支；图片不得进入 ready 列表，云文件和占位记录应被清理。
