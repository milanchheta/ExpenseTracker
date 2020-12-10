FROM python:3.9
COPY . /app
WORKDIR /app

RUN pip3 install --upgrade setuptools
RUN pip3 install -r requirements.txt 
RUN pip3 install google-cloud-firestore

EXPOSE 8080 
ENTRYPOINT [ "python3" ] 
CMD [ "main.py" ] 