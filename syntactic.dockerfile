FROM daocloud.io/library/python:2.7

# 安装python依赖
RUN pip install bottle nltk -i https://pypi.douban.com/simple

# 安装java
ADD jdk/jdk-8u131-linux-x64.tar.gz  /usr/local/

# 资源拷贝
ADD jar /jar/
ADD syntactic /syntactic/
# 设置环境变量
ENV JAVA_HOME=/usr/local/jdk1.8.0_131 CLASSPATH=$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:/jar/stanford-parser.jar:/jar/stanford-parser-3.7.0-models.jar:/jar/stanford-postagger.jar PATH=$PATH:$JAVA_HOME/bin

EXPOSE 9001
CMD ["python", "/syntactic/api.py"]
