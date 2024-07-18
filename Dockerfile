FROM python:3.10

ENV PYTHONUNBUFFERED=1

RUN mkdir /proteomes_web
WORKDIR /proteomes_web
COPY . /proteomes_web/
RUN pip install -r requirements.txt
CMD ["python3","manage.py","runserver","0.0.0.0:5151"]