import ontology.ontology as ontology
from config import config
from msmq.msmq import MSMQ
import os, sys

def receive_data():
    path = config['path']
    ont = ontology.Ontology(path)
    msqm = MSMQ()
    
    data = msqm.receiveData()
    ont.recordingNewItemInOntology([data])


if __name__ == '__main__':
    while True:
        try:
            data = receive_data()
        except KeyboardInterrupt:
            print('Interrupted')
            try:
                sys.exit(0)
            except SystemExit:
                os._exit(0)
