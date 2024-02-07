FROM python:3.7.9

ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt /code/

RUN pip install -r requirements.txt

COPY . /code/

# 开放端口
EXPOSE 8000

# 启动应用程序
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
