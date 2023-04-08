### 專案啟動
- 終端機輸入 node -v 確認 node 版本為 v16.15.1。
- 終端機輸入 npm ci 安裝。 
- .env 檔案中替換為自己 mongodb 連線資訊。
```
DATABASE=替換自己的機器
PORT=3000
DATABASE_PASSWORD=替換自己的密碼
NODE_ENV=development
```
- npm run start 啟動，終端機出現以下訊息表示成功。
```
Listening on 3000
資料庫連接成功
```
### 專案架構
```
- .github(ci設定，pr模板)
- .husky(git hook commit前跑測試，lint檢查，自動產生新 swagger 文檔)
- .vscode(推薦vscode extensione，共用專案設定)
- bin(node server 進入點)
- controllers(api 主要邏輯)
- middlewares(中間層放驗證等等邏輯)
- models(schema定義)
- public(預設靜態頁面)
- routes(子路由定義，swagger，response)
- services(共用服務，db連線，response封裝)
- utilities(env config 變量集中)
- .env(環境變量設定)
- .eslintrc.js(eslint設定)
- .gitignore(忽略上git檔案)
- app.js(主路由與中間層套引入等等)
- package.json(終端機指令)
- swagger.js(自動產生swagger設定)
- swagger_output.json(swagger檔案)
```
### api 架構
![backendFlow](https://user-images.githubusercontent.com/97425372/230048798-7af8b0f5-c89f-4f16-8c38-c8f790f6c99b.png)

### 注意事項
- 一律使用 npm ci 安裝保持版本一致，新套件再使用 npm i xxx
- app.js 中 routes 引入請使用相對路徑不要使用 @ 別名不然 swagger 套件會吃不到
```
// Load routes 請使用 ./ 引入不然 swagger 會找不到
const routeExample = require('./routes/routeExample') // 引入自訂的 routeExample
```
- routes 中的 callback 請統一使用 serviceError.asyncError 包起來會統一處理錯誤 controller 裡不需再自己包 try catch
- 回傳 response 統一使用 serviceResponse.success 回傳
```
router.get(
  '/',
  // 這裡
  serviceError.asyncError(async (req, res, next) => {
    const result = await controllerExample.get()
    // 這裡
    serviceResponse.success(res, result)
  })
)
```


### GIT FLOW
- sprint 中沒有完成的 feature 順延到下個 sprint
![gitflow](https://user-images.githubusercontent.com/97425372/230048743-f5e504f1-7cf1-4946-8a87-02a32017a42c.png)

### 補充說明
- 存檔會自動統一格式化程式碼，不需要使用自己的格式化工具。
- 有設定 alias @ 代表根目錄

### 補充教學
- 自由切換 node 版本 nvm 教學 https://www.casper.tw/development/2022/01/10/install-nvm/
- swagger 自動產生教學
https://courses.hexschool.com/courses/2017785/lectures/45500767
- 錯誤處理教學(去年第五週)
https://courses.hexschool.com/courses/2017785/lectures/45500856
- 測試教學
https://www.casper.tw/development/2020/02/02/jest-intro/
- 下載 vscode blueprint 可以使用設定好的模板快速產生(model/controller/route) 
https://www.youtube.com/watch?v=AB68yqy8Sj0
- github action 
https://ithelp.ithome.com.tw/articles/10262377
- husky git hook
https://ithelp.ithome.com.tw/articles/10278411

