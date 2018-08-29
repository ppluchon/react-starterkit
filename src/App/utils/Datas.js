import ObjectPath from 'object-path'

const Datas = {}
Datas.grab = (path) => ObjectPath.get(Datas, path)
export default Datas