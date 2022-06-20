import parserAgent.parserAgent as parserAgent
import utils
from msmq.msmq import MSMQ

def main():
    
    msqm = MSMQ()
    #agent = parserAgent.MobileAgent(utils.parseResource.GoogleSearch, "палинология")
    agent = parserAgent.MobileAgent(utils.parseResource.GoogleSearch, "пыльцевые зерна")

    result = agent.start()
    #print(result)

    for item in result:
        print(item)
        print()
        msqm.sendData(item)

if __name__ == "__main__":
    main()
