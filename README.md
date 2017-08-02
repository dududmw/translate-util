# Translate Util

## Deploy

* install docker

```
curl -sSL http://acs-public-mirror.oss-cn-hangzhou.aliyuncs.com/docker-engine/internet | sh -
```

* install docker-compose

```
sudo pip install -U docker-compose
```

* build and run

```
docker-compose up -d
```

## Note

Because of git file limit, some files are ignored: ./jar/stanford-parser.jar, ./jar/stanford-parser-3.7.0-models.jar, ./jar/stanford-postagger.jar, ./jdk/jdk-8u131-linux-x64.tar.gz  