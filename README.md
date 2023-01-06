# One Among Us - Web Frontend

是 [one-among.us](https://one-among.us/) 的前端源码。欢迎贡献！

## GitHub Repo 结构

* [data](https://github.com/one-among-us/data) - 条目内容存储
* [web](https://github.com/one-among-us/web) - 网页前端源码
* [backend](https://github.com/one-among-us/backend) - 献花和编辑后端源码

## 设置开发环境

```sh
# 克隆项目
git clone https://github.com/one-among-us/web
cd web

# 安装依赖（如果没有安装 Yarn 的话请先安装 Yarn）
yarn install

# 运行
yarn dev
```

## Infrastructure Overview

### Static Content & GitHub Actions

#### 1. "Vite Build"

The "Vite Build" ([build.yml](.github/workflows/build.yml)) action in this repo builds the web frontend as an artifact, and will not deploy to GitHub pages. It was previously set to automatically run on push, but we changed it to run on manual dispatch instead. When build finishes, it will trigger the "Package" workflow.

#### 2. "Package and Deploy"

The "Package and Deploy" ([package.yml](.github/workflows/package.yml)) action injects meta info into the built artifact from above. It will generate different entry html for different paths, enabling search engine optimization and social media link previews. This workflow needs both the web artifact and the data repo's built content, and is triggered when either of them updates.

#### 3. "Data Generator" (in data repo)

The "Generator" ([generator.yml](https://github.com/one-among-us/data/blob/main/.github/workflows/generator.yml)) action compiles the article contents in the data repo and generates machine-readable formats such as json and jsx for. This action will send a workflow dispatch signal to "Package and Deploy" when essential content are updated.

### Independent Servers

#### 4. Channel Backup CDN

Since channel backup data (e.g. [TelegramBackup](https://github.com/one-among-us/TelegramBackup)) are very large and often exceeds GitHub's file size limit, we do not serve them on GitHub Pages. We stored them on my [HyDEV CDN server](https://hydev.org/tgbackup). It's a standard nginx file server.

#### 5. Backend Server

We also have a Kotlin backend to keep track of flowers, comments, and edit requests. This is hosted on a docker container, read more here: [backend](https://github.com/one-among-us/backend).
