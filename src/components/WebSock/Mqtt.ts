import AWS from 'aws-sdk';
import config from './config';
import { ReceiveData, MqttData } from '../if/dbif';
import { LoginInfo } from '../../layouts/data/if';
import Items from './Items';

// import AWSMqttClient from 'aws-mqtt';

const AWSMqttClient = require('aws-mqtt');

AWS.config.region = config.aws.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.aws.cognito.identityPoolId,
});
export default class Mqtt {
    protected client:typeof AWSMqttClient;
    private items:Items[]=[];
    constructor(private user:LoginInfo) {
        const clientId = `${user.Account}${user.id}@admin`;
        console.log('clientId', clientId);
        const options = {
            region: AWS.config.region,
            credentials: AWS.config.credentials,
            endpoint: config.aws.iot.endpoint,
            clientId,
            will: {
                topic: config.topics.room + clientId, // 離線時 發佈 leave 至私人頻道
                payload: 'leave',
                qos: 0,
                retain: false,
            },
        };
        // console.log('mqtt options:', options);
        this.client = new AWSMqttClient(options);
        console.log('do connect');
        this.client.on('connect', () => {
            this.addLogEntry('Successfully connected to AWS MQTT Broker!:-)');
            this.subscribe(config.topics.announcement); // 訂閱 公告頻道
            this.subscribe(config.topics.tick); // 訂閱 報價頻道
            this.subscribe(config.topics.room + clientId); // 訂閱 私人頻道 可發佈訊息
            this.client.publish(config.topics.room + clientId, 'enter'); // 連線成功時 發佈 enter 訊息至私人頻道
        });
        this.client.on('message', (topic:string, message:string) => {
            // this.addLogEntry(`${topic} => ${message}`);
            this.sendToItems(message);
        });
    
        this.client.on('close', () => {
            this.addLogEntry('Closed:-(');
        });
    
        this.client.on('offline', () => {
            this.addLogEntry('Went offline:-(');
        });
    }
    get Items() {
        return this.items;
    }
    getItem(itemid:number) {
        return this.items.find((itm) => itm.id === itemid);
    }
    sendToItems(msg:string, key?:number) {
        try {
            const md:MqttData = JSON.parse(msg);
            const rd:ReceiveData = {
                eventTime: md.eventTime,
                symbol: md.symbol,
                currentClose: md.currentClose,
                priceChangePercent: md.priceChangePercent,
                closeQuantity: md.closeQuantity,
                open: md.open,
            };
            // this.addLogEntry(JSON.stringify(rd));
            this.items.forEach((itm:Items) => {
                itm.setPrice(rd);
            });
        } catch (e) {
            // console.log('sendToItems Error:', e, msg);
            if (!key) {
                const tmp:any = msg;
                const str = String.fromCharCode.apply(null, tmp);
                if (str !== 'leave') console.log('sendToItems key=1:', msg, str);
                // this.sendToItems(str, 1);
            }
        }
    }
    addItem(itm:Items) {
        this.items.push(itm);
    }
    setItems(itms:Items[]) {
        this.items = itms;
    }
    subscribe(topic:string) {
        this.client.subscribe(topic);
        this.addLogEntry(`subscribe to ${topic}`);
    }
  
    addLogEntry(info:string) {
        console.log(info);
    }
}
