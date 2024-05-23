<p align="center">
  <a href="http://fangzicheng.cn" target="_blank">
    <img width="100"src="https://fangsblog.oss-cn-shanghai.aliyuncs.com/logo/icon-128.png
">
  </a>
</p>
<h1 align="center">iWork</h1>
<div align="center">
  <strong>
    网页场景提高AI 使用能效
  </strong>
</div>
<br>

## 背景

基于网页的弹出式AI助手

## 项目说明
### Server
Python版本: `3.7.9`


#### Server 运行

```bash

createdb iwork_db

virtualenv -p python3 iwork # 创建虚拟环境

pip install -r ./server/requierments.txt

# 每次有数据库更新时都要执行一遍，然后再migrate 为了方便部署这边的 makemigrations 是根据我自己的更新来定的，第一次运行的时候可能需要删除其中的数据库迁移
python ./server/manage.py makemigrations
 
python ./server/manage.py migrate

python ./server/manage.py createsuperuser # 创建超级用户

python ./server/manage.py runserver # 启动服务，http://localhost:8000 访问服务

iWork/server/server/settings.py 中设置对应模型KEY

```


#### Client 运行
```bash
cd ./extension 

yarn install
yarn start

将插件以开发者模式安装至浏览器中 [参考文档] https://support.google.com/chrome/a/answer/2714278?hl=zh-Hans
```



## 使用截图
<img src="https://fangsblog.oss-cn-shanghai.aliyuncs.com/logo/example.png">


