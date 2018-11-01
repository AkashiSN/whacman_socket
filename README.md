# whacman_socket

# Requirement

- [node](https://nodejs.org/ja/)
- [mongodb](https://www.mongodb.com/)
- yarn

## nodeのインストール

### Windows

[Node.js / npmをインストールする（for Windows）](https://qiita.com/taiponrock/items/9001ae194571feb63a5e)

上を参考にインストールしてください

### Mac

[ここ](https://nodejs.org/ja/download/)から`macOS Installer (.pkg)`をダウンロードしてインストールしてください

### Ubuntu系

```bash
$ sudo apt install nodejs
```

## mongodbのインストール

### Windows

[Windows版MongoDBのインストール・MongoShellを通してCRUDコマンドを打ってみる](http://kageura.hatenadiary.jp/entry/2018/01/09/Windows%E7%89%88MongoDB%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%83%BBMongoShell%E3%82%92%E9%80%9A%E3%81%97%E3%81%A6CRUD%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E6%89%93)

上を参考にインストールしてください

### Mac

```bash
$ brew install mongodb
```

### Ubuntu系

```bash
$ sudo apt install mongodb
```
## yarnのインストール

```bash
$ npm -g i yarn
```

# Usage

```bash
$ git clone git@github.com:AkashiSN/whacman_socket.git
$ cd whacman_socket
$ yarn
$ node app.js
```