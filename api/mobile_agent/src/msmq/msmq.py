import win32com.client
import os, sys
from datetime import datetime
import json

path_dir = (os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(path_dir)

from msmq.config import config

class MSMQ(object):
    def __init__(self):
        self.qinfo = win32com.client.Dispatch("MSMQ.MSMQQueueInfo")

     # получение даты добавления в онтологию в виде объекта
    def getNowDate(self):
        now = datetime.now()
        strDate = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
        objDate = datetime.strptime(strDate,"%Y-%m-%dT%H:%M:%S")
        return objDate

    def sendData(self, data):
        computer_ip = config['host']
        self.qinfo.FormatName="direct=tcp:"+computer_ip+"\\PRIVATE$\\" + config['nameQueue']
        queue = self.qinfo.Open(2,0) # Open a ref to queue

        msg = win32com.client.Dispatch("MSMQ.MSMQMessage")
        msg.Label = "Data"
        msg.Body = json.dumps(data)
        print("Body: ", msg.Body)
        msg.Send(queue)
        queue.Close()

    def receiveData(self):
        computer_name = os.getenv('COMPUTERNAME')
        #print("comp_name: ", computer_name)
        self.qinfo.FormatName = "direct=os:"+ computer_name+"\\PRIVATE$\\" + config['nameQueue']
        queue = self.qinfo.Open(1, 0)   # Open a ref to queue to read(1)
        msg = queue.Receive()
        #print("Label: ", msg.Label)
        data = json.loads(msg.Body)
        data['date'] = self.getNowDate()
        #print("Data : ", crypto_data)
        #data = json.loads(data).decode('utf-8')
        print("data: ", data)
        print()
        queue.Close()
        return data    