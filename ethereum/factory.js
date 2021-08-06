import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x54642A6020953789D3CD6dCd2B3C132f6A0f5d7D');

export default instance;
