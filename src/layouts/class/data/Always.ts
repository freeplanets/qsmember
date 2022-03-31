import StrFunc from '../../../components/Functions/MyStr';

const data = '';
const jsd = StrFunc.toJSON(data);
const pdata = jsd ? jsd.arrO || {} : {};
export default pdata;
